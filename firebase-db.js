// =============================================
// FIREBASE — DATOS COMPARTIDOS EN TIEMPO REAL
// =============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBH4vk_Qtl8x_xlHNV8mvjuXHy0M6eNeCI",
  authDomain: "dubeji.firebaseapp.com",
  projectId: "dubeji",
  storageBucket: "dubeji.firebasestorage.app",
  messagingSenderId: "101031013723",
  appId: "1:101031013723:web:0c8d24940809ae5774be7e",
  measurementId: "G-JXX72KMQ0F"
};

firebase.initializeApp(FIREBASE_CONFIG);
const FIRESTORE = firebase.firestore();
// Fuerza long-polling en vez de streaming: evita que adblockers/extensiones
// bloqueen las conexiones de Firestore (error net::ERR_BLOCKED_BY_CLIENT)
FIRESTORE.settings({
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false
});
const DB_REF = FIRESTORE.collection('appData').doc('main');

// =============================================
// DATA STORE — memoria local + Firestore
// =============================================

window.__DATA = {};
let __ready = false;
let __initResolve = null;
window.__READY = new Promise(r => __initResolve = r);
let __pendingWrites = {};
let __syncTimer = null;

function __sync() {
  clearTimeout(__syncTimer);
  __syncTimer = setTimeout(() => {
    window.__onFbSync?.();
  }, 300);
}

// SEGURIDAD: si Firestore no responde en 5s (red bloqueada, señal mala, etc.)
// no dejamos la pantalla colgada esperando para siempre — arrancamos con lo
// que haya en localStorage y avisamos que estamos en modo offline.
setTimeout(() => {
  if (!__ready) {
    console.warn('⚠️ Firestore no respondió a tiempo, arrancando en modo offline (localStorage).');
    window.__FB_BLOCKED = true;
    __ready = true;
    if (__initResolve) __initResolve();
  }
}, 5000);

// Verificación única inicial — solo crea datos si el doc NO existe
DB_REF.get().then(doc => {
  if (!doc.exists) {
    const obj = {
      productos: JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)),
      guiasTalles: JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT)),
      packTiers: JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT)),
      efemerides: [],
      cupones: JSON.parse(JSON.stringify(CUPONES_DEFAULT)),
      adminPass: "dubenji2026"
    };
    window.__DATA = obj;
    __ready = true;
    if (__initResolve) __initResolve();
    return DB_REF.set(obj);
  }
}).catch(() => {});

// Escucha en tiempo real — NUNCA ejecuta seedData
DB_REF.onSnapshot(doc => {
  if (doc.exists) {
    const remote = doc.data();
    Object.keys(remote).forEach(k => {
      if (!__pendingWrites[k]) {
        window.__DATA[k] = remote[k];
      }
    });
  }
  if (!__ready) {
    __ready = true;
    if (__initResolve) __initResolve();
  }
  __sync();
}, err => {
  console.warn('⚠️ No se pudo conectar a Firestore (posible bloqueo de adblocker/extensión). Los datos se guardan solo en este navegador (localStorage) hasta que se restablezca la conexión.', err);
  window.__FB_BLOCKED = true;
  __ready = true;
  if (__initResolve) __initResolve();
});

// =============================================
// HELPERS
// =============================================

function __get(key, fallback) {
  if (window.__DATA && window.__DATA[key] !== undefined) return window.__DATA[key];
  try {
    const ls = localStorage.getItem(key);
    return ls ? JSON.parse(ls) : fallback;
  } catch { return fallback; }
}

async function __set(key, val) {
  __pendingWrites[key] = true;
  window.__DATA[key] = val;
  try { await DB_REF.set({ [key]: val }, { merge: true }); } catch {}
  delete __pendingWrites[key];
}

// =============================================
// FUNCIONES DE STORAGE GLOBALES
// =============================================

window.getProductos = function() {
  return JSON.parse(JSON.stringify(__get('productos', JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)))));
};
window.saveProductos = function(lista) {
  __set('productos', JSON.parse(JSON.stringify(lista)));
};

// =============================================
// ESCRITURA ATÓMICA DE PRODUCTOS (evita que dos
// guardados simultáneos se pisen entre sí)
// =============================================
// mutatorFn recibe la lista MÁS RECIENTE del servidor y debe
// devolver la lista nueva. Ej:
//   window.updateProductos(lista => { lista.push(nuevo); return lista; });
window.updateProductos = async function(mutatorFn) {
  const conTimeout = (promesa, ms) => Promise.race([
    promesa,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ]);
  try {
    const nuevaLista = await conTimeout(FIRESTORE.runTransaction(async (tx) => {
      const doc = await tx.get(DB_REF);
      const actual = (doc.exists && doc.data().productos)
        ? doc.data().productos
        : JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT));
      const resultado = mutatorFn(JSON.parse(JSON.stringify(actual)));
      tx.set(DB_REF, { productos: resultado }, { merge: true });
      return resultado;
    }), 6000);
    window.__DATA.productos = nuevaLista;
    return nuevaLista;
  } catch (e) {
    console.error('⚠️ Falló o tardó demasiado la transacción de productos, guardo local como respaldo:', e);
    const lista = mutatorFn(getProductos());
    saveProductos(lista);
    return lista;
  }
};

window.getGuiasTalles = function() {
  return JSON.parse(JSON.stringify(__get('guiasTalles', JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT)))));
};
window.saveGuiasTalles = function(guias) {
  __set('guiasTalles', JSON.parse(JSON.stringify(guias)));
};

window.getPackTiers = function() {
  return JSON.parse(JSON.stringify(__get('packTiers', JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT)))));
};
window.savePackTiers = function(tiers) {
  __set('packTiers', JSON.parse(JSON.stringify(tiers)));
};

window.getCupones = function() {
  return JSON.parse(JSON.stringify(__get('cupones', JSON.parse(JSON.stringify(CUPONES_DEFAULT)))));
};
window.saveCupones = function(lista) {
  __set('cupones', JSON.parse(JSON.stringify(lista)));
};

window.getEfemerides = function() {
  return JSON.parse(JSON.stringify(__get('efemerides', [])));
};
window.saveEfemerides = function(lista) {
  __set('efemerides', JSON.parse(JSON.stringify(lista)));
};

window.getAdminPass = function() {
  if (window.__DATA && window.__DATA.adminPass) return window.__DATA.adminPass;
  return localStorage.getItem('dubenji_admin_pass') || 'dubenji2026';
};
window.saveAdminPass = async function(pass) {
  window.__DATA.adminPass = pass;
  localStorage.setItem('dubenji_admin_pass', pass);
  __pendingWrites.adminPass = true;
  try { await DB_REF.set({ adminPass: pass }, { merge: true }); } catch {}
  delete __pendingWrites.adminPass;
};

window.getPresupuesto = function(id) {
  if (window.__DATA && window.__DATA.presupuestos && window.__DATA.presupuestos[id]) return window.__DATA.presupuestos[id];
  try {
    const ls = localStorage.getItem('dubenji_pres_' + id);
    return ls ? JSON.parse(ls) : null;
  } catch { return null; }
};
window.savePresupuesto = async function(id, data) {
  if (!window.__DATA.presupuestos) window.__DATA.presupuestos = {};
  window.__DATA.presupuestos[id] = data;
  localStorage.setItem('dubenji_pres_' + id, JSON.stringify(data));
  try { await DB_REF.set({ [`presupuestos.${id}`]: data }, { merge: true }); } catch {}
};
