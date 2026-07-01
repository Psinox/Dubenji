// =============================================
// DUBENJI — CLIENTE DE DATOS (reemplaza a Firebase)
// Habla con tu Cloudflare Worker vía fetch() normal.
// =============================================

// ⚠️ COMPLETAR con la URL real de tu Worker (te la da Cloudflare al desplegar)
const API_URL = "https://dubenji-api.kivaro-dev.workers.dev";

// ⚠️ Tiene que ser EXACTAMENTE la misma clave que pusiste en worker.js
const API_SECRET = "dbj-K7xP9mQ2vL45zRw8";

const POLL_MS = 15000; // cada cuánto revisa si hay cambios nuevos (15s)

window.__DATA = {};
let __ready = false;
let __initResolve = null;
window.__READY = new Promise(r => __initResolve = r);
let __version = 0;
let __pollTimer = null;

async function __fetchData() {
  const res = await fetch(API_URL + "/data", { cache: "no-store" });
  const json = await res.json();
  if (!json.exists) {
    const seed = {
      productos: JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)),
      guiasTalles: JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT)),
      packTiers: JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT)),
      efemerides: [],
      cupones: JSON.parse(JSON.stringify(CUPONES_DEFAULT)),
      adminPass: "dubenji2026"
    };
    const seedRes = await fetch(API_URL + "/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seed)
    });
    const seedJson = await seedRes.json();
    window.__DATA = seedJson.data || seed;
  } else {
    window.__DATA = json.data;
  }
  __version = window.__DATA._v || 0;
}

async function __init() {
  try {
    await __fetchData();
  } catch (e) {
    console.warn('⚠️ No se pudo conectar al servidor, arranco con localStorage', e);
    window.__FB_BLOCKED = true;
  }
  if (!__ready) {
    __ready = true;
    if (__initResolve) __initResolve();
  }
  __startPolling();
}

function __startPolling() {
  clearInterval(__pollTimer);
  __pollTimer = setInterval(async () => {
    try {
      await __fetchData();
      window.__onFbSync?.();
    } catch (e) { /* se reintenta solo en el próximo ciclo */ }
  }, POLL_MS);
}

__init();

// Seguridad: si el servidor no respondió en 5s, arrancamos igual con lo local
setTimeout(() => {
  if (!__ready) {
    console.warn('⚠️ El servidor no respondió a tiempo, modo offline (localStorage)');
    window.__FB_BLOCKED = true;
    __ready = true;
    if (__initResolve) __initResolve();
  }
}, 5000);

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
  window.__DATA[key] = val;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  try {
    const res = await fetch(API_URL + "/data", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": API_SECRET },
      body: JSON.stringify({ key, value: val, expectedVersion: __version })
    });
    const json = await res.json();
    if (json.ok) {
      __version = json.version;
    } else if (res.status === 409) {
      await __fetchData();
      console.warn('⚠️ Hubo un cambio simultáneo, se actualizaron los datos. Reintentá guardar si hacía falta.');
    }
  } catch (e) {
    console.warn('⚠️ No se pudo guardar en el servidor, quedó guardado solo local:', e);
  }
}

// =============================================
// FUNCIONES GLOBALES (misma API que antes — nada más cambia por dentro)
// =============================================
window.getProductos = function() {
  return JSON.parse(JSON.stringify(__get('productos', JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)))));
};
window.saveProductos = function(lista) {
  __set('productos', JSON.parse(JSON.stringify(lista)));
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
  try { localStorage.setItem('dubenji_admin_pass', pass); } catch {}
  await __set('adminPass', pass);
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
  try { localStorage.setItem('dubenji_pres_' + id, JSON.stringify(data)); } catch {}
  const nuevos = { ...(window.__DATA.presupuestos || {}), [id]: data };
  await __set('presupuestos', nuevos);
};

// =============================================
// ESCRITURA ATÓMICA DE PRODUCTOS
// (evita que dos guardados casi simultáneos se pisen)
// =============================================
window.updateProductos = async function(mutatorFn, intentosRestantes = 3) {
  try {
    await __fetchData(); // traer la versión más fresca antes de mutar
  } catch (e) {
    // sin conexión: guardamos local directamente
    const lista = mutatorFn(getProductos());
    saveProductos(lista);
    return lista;
  }
  const nuevaLista = mutatorFn(getProductos());
  window.__DATA.productos = nuevaLista;
  try {
    const res = await fetch(API_URL + "/data", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": API_SECRET },
      body: JSON.stringify({ key: 'productos', value: nuevaLista, expectedVersion: __version })
    });
    const json = await res.json();
    if (json.ok) {
      __version = json.version;
      return nuevaLista;
    }
    if (res.status === 409 && intentosRestantes > 0) {
      return window.updateProductos(mutatorFn, intentosRestantes - 1);
    }
  } catch (e) {
    console.warn('⚠️ Sin conexión al guardar, quedó guardado solo local:', e);
    saveProductos(nuevaLista);
  }
  return nuevaLista;
};
