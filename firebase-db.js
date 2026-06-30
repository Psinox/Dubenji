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

// Inicializar Firebase (compat SDK)
firebase.initializeApp(FIREBASE_CONFIG);
const FIRESTORE = firebase.firestore();
const DB_REF = FIRESTORE.collection('appData').doc('main');

// =============================================
// DATA STORE
// =============================================

window.__DATA = {};
let __ready = false;
let __initResolve = null;
window.__READY = new Promise(r => __initResolve = r);

// Cargar datos iniciales + escuchar cambios en tiempo real
DB_REF.onSnapshot(doc => {
  if (doc.exists) {
    window.__DATA = doc.data();
  } else {
    seedData();
  }
  if (!__ready) {
    __ready = true;
    if (__initResolve) __initResolve();
  }
  document.querySelectorAll('[data-fb-toast]').forEach(el => el.remove());
  if (__ready && doc.exists) {
    const t = document.createElement('div');
    t.setAttribute('data-fb-toast', '1');
    t.className = 'toast show';
    t.textContent = '🔄 Datos sincronizados';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }
  window.__onFbSync?.();
}, err => {
  console.warn('Firebase error, usando localStorage', err);
  __ready = true;
  if (__initResolve) __initResolve();
});

// Sembrar datos por defecto en Firestore
async function seedData() {
  const obj = {
    productos: JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)),
    guiasTalles: JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT)),
    packTiers: JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT)),
    efemerides: [],
    cupones: JSON.parse(JSON.stringify(CUPONES_DEFAULT)),
    adminPass: "dubenji2026"
  };
  window.__DATA = obj;
  await DB_REF.set(obj);
}

// =============================================
// FUNCIONES DE STORAGE (reemplazan localStorage)
// =============================================

function __get(key, fallback) {
  if (window.__DATA && window.__DATA[key] !== undefined) return window.__DATA[key];
  try {
    const ls = localStorage.getItem(key);
    return ls ? JSON.parse(ls) : fallback;
  } catch { return fallback; }
}

async function __set(key, val) {
  window.__DATA[key] = val;
  try { await DB_REF.set({ [key]: val }, { merge: true }); } catch {}
}

// — Productos
window.getProductos = function() {
  return JSON.parse(JSON.stringify(__get('productos', JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)))));
};
window.saveProductos = function(lista) {
  __set('productos', JSON.parse(JSON.stringify(lista)));
};

// — Guías de talles
window.getGuiasTalles = function() {
  return JSON.parse(JSON.stringify(__get('guiasTalles', JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT)))));
};
window.saveGuiasTalles = function(guias) {
  __set('guiasTalles', JSON.parse(JSON.stringify(guias)));
};

// — Pack tiers
window.getPackTiers = function() {
  return JSON.parse(JSON.stringify(__get('packTiers', JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT)))));
};
window.savePackTiers = function(tiers) {
  __set('packTiers', JSON.parse(JSON.stringify(tiers)));
};

// — Cupones
window.getCupones = function() {
  return JSON.parse(JSON.stringify(__get('cupones', JSON.parse(JSON.stringify(CUPONES_DEFAULT)))));
};
window.saveCupones = function(lista) {
  __set('cupones', JSON.parse(JSON.stringify(lista)));
};

// — Efemérides
window.getEfemerides = function() {
  return JSON.parse(JSON.stringify(__get('efemerides', [])));
};
window.saveEfemerides = function(lista) {
  __set('efemerides', JSON.parse(JSON.stringify(lista)));
};

// — Admin pass
window.getAdminPass = function() {
  if (window.__DATA && window.__DATA.adminPass) return window.__DATA.adminPass;
  return localStorage.getItem('dubenji_admin_pass') || 'dubenji2026';
};
window.saveAdminPass = async function(pass) {
  window.__DATA.adminPass = pass;
  localStorage.setItem('dubenji_admin_pass', pass);
  try { await DB_REF.set({ adminPass: pass }, { merge: true }); } catch {}
};

// — Presupuestos
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
