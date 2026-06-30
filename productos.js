// =============================================
// BASE DE DATOS DE PRODUCTOS - DUBENJI INDUMENTARIA
// =============================================

const WHATSAPP_NUMBER = "5493777538753";

const TALLES = ["S", "M", "L", "XL", "XXL"];

const BANNERS = [
  { id: 1, imagen: "icono-talles/c1.webp", titulo: "Calidad Premium", texto: "Trabajamos con materiales de primera para un resultado impecable." },
  { id: 2, imagen: "icono-talles/c2.webp", titulo: "Personalizá tu estilo", texto: "Estampamos tu diseño en remeras, gorras, buzos y más." },
  { id: 3, imagen: "icono-talles/c3.webp", titulo: "Sin mínimo", texto: "Pedí desde 1 unidad. Precios especiales por mayor." },
  { id: 4, imagen: "icono-talles/c4.webp", titulo: "Estampado DTF", texto: "La mejor calidad en estampado textil Directo a la Película (DTF)." },
  { id: 5, imagen: "icono-talles/c5.webp", titulo: "Atención personalizada", texto: "Consultanos por WhatsApp y te asesoramos sin cargo." }
];

const CATEGORIAS = [
  { id: "remeras",    nombre: "Remeras",    icono: "👕" },
  { id: "gorras",     nombre: "Gorras",     icono: "🧢" },
  { id: "chombas",    nombre: "Chombas",    icono: "👔" },
  { id: "buzos",      nombre: "Buzos",      icono: "🧥" },
  { id: "camperas",   nombre: "Camperas",   icono: "🧥" },
  { id: "llaveros",   nombre: "Llaveros",   icono: "🔑" },
  { id: "packs",      nombre: "Packs",      icono: "📦" }
];

const COLORES_POPULARES = [
  { nombre: "Negro",     hex: "#0a0a0a" },
  { nombre: "Blanco",    hex: "#f5f5f5" },
  { nombre: "Gris",      hex: "#6b7280" },
  { nombre: "Rojo",      hex: "#dc2626" },
  { nombre: "Azul",      hex: "#2563eb" },
  { nombre: "Verde",     hex: "#16a34a" },
  { nombre: "Beige",     hex: "#f5e6cc" },
  { nombre: "Borgoña",   hex: "#800020" }
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=450&fit=crop";

// tipo: "individual" | "paquete"
// paquete: sin colores ni talles, botón de WhatsApp directo
const PRODUCTOS_DEFAULT = [
  // ========== GORRAS ==========
  {
    id: 1, tipo: "individual",
    nombre: "Gorra de Jean Premium",
    categoria: "gorras", precio: 0,
    descripcion: "Gorra de jean premium con diseño personalizado. Talle único ajustable. Ideal para estampar logos y diseños.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Azul", hex: "#1d4ed8", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } }
    ]
  },
  {
    id: 2, tipo: "individual",
    nombre: "Gorra Trucker",
    categoria: "gorras", precio: 0,
    descripcion: "Gorra trucker clásica con malla transpirable. Personalizá con tu diseño frontal y laterales. Talle único ajustable.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Rojo", hex: "#dc2626", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Azul", hex: "#2563eb", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } }
    ]
  },
  {
    id: 3, tipo: "individual",
    nombre: "Gorra Trucker Full",
    categoria: "gorras", precio: 0,
    descripcion: "Gorra trucker full personalizada. Diseño completo en toda la superficie. Malla transpirable y cierre ajustable.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "S":{stock:0,activo:false}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } }
    ]
  },
  // ========== REMERAS ==========
  {
    id: 4, tipo: "individual",
    nombre: "Remera Algodón Adulto",
    categoria: "remeras", precio: 0,
    descripcion: "Remera de algodón 180gsm para adultos. Corte recto, cuello redondo. Personalizá con estampado, bordado o vinilo.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Gris", hex: "#6b7280", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Azul", hex: "#2563eb", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  {
    id: 5, tipo: "individual",
    nombre: "Remera Talles Especiales",
    categoria: "remeras", precio: 0,
    guiaTalle: "remeras_talles_especiales",
    descripcion: "Remera de algodón para talles especiales. Corte cómodo y amplio. Personalizá con tu diseño favorito.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true}, "3XL":{stock:50,activo:true}, "4XL":{stock:50,activo:true}, "5XL":{stock:50,activo:true} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true}, "3XL":{stock:50,activo:true}, "4XL":{stock:50,activo:true}, "5XL":{stock:50,activo:true} } },
      { nombre: "Gris", hex: "#6b7280", imagenes: [], talles: { "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true}, "3XL":{stock:50,activo:true}, "4XL":{stock:50,activo:true}, "5XL":{stock:50,activo:true} } }
    ]
  },
  {
    id: 6, tipo: "individual",
    nombre: "Remera Algodón Niños",
    categoria: "remeras", precio: 0,
    descripcion: "Remera de algodón para niños. Suave, cómoda y resistente. Personalizá con personajes, nombres o diseños.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } },
      { nombre: "Rojo", hex: "#dc2626", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:0,activo:false} } }
    ]
  },
  // ========== CHOMBAS ==========
  {
    id: 7, tipo: "individual",
    nombre: "Chomba de Pique 100% Algodón",
    categoria: "chombas", precio: 0,
    descripcion: "Chomba de pique 100% algodón premium. Cuello tipo polo con botones. Ideal para empresas y uniformes personalizados.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Blanco", hex: "#f5f5f5", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Azul", hex: "#2563eb", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  // ========== BUZOS ==========
  {
    id: 8, tipo: "individual",
    nombre: "Buzo Canguro Frisa Clásica",
    categoria: "buzos", precio: 0,
    descripcion: "Buzo canguro de frisa clásica 280gsm. Capucha forrada, bolsillo delantero, puños elastizados. Personalizá con tu diseño.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Gris", hex: "#6b7280", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  {
    id: 9, tipo: "individual",
    nombre: "Buzo Canguro Frisa Invisible",
    categoria: "buzos", precio: 0,
    descripcion: "Buzo canguro de frisa invisible (French Terry). Más liviano que la frisa clásica, ideal para estampado. Capucha y bolsillo.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Beige", hex: "#f5e6cc", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  // ========== CAMPERAS ==========
  {
    id: 10, tipo: "individual",
    nombre: "Campera Frisa Clásica",
    categoria: "camperas", precio: 0,
    descripcion: "Campera de frisa clásica con cierre frontal. Capucha, bolsillos laterales y puños elastizados. Abrigada y personalizable.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Gris", hex: "#6b7280", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  {
    id: 11, tipo: "individual",
    nombre: "Campera Frisa Invisible",
    categoria: "camperas", precio: 0,
    descripcion: "Campera de frisa invisible (French Terry). Más liviana, ideal para media estación. Cierre, capucha y bolsillos.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true,
    colores: [
      { nombre: "Negro", hex: "#0a0a0a", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } },
      { nombre: "Azul", hex: "#2563eb", imagenes: [], talles: { "S":{stock:50,activo:true}, "M":{stock:50,activo:true}, "L":{stock:50,activo:true}, "XL":{stock:50,activo:true}, "XXL":{stock:50,activo:true} } }
    ]
  },
  // ========== LLAVEROS ==========
  {
    id: 12, tipo: "individual", nombre: "Llavero Metálico Grabado",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero metálico personalizado con grabado láser. Elegante y duradero. Ideal para empresas y regalos corporativos.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  {
    id: 13, tipo: "individual", nombre: "Llavero de Cuero",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero de cuero genuino personalizado con estampado o grabado. Estilo clásico y sofisticado.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  {
    id: 14, tipo: "individual", nombre: "Llavero Acrílico",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero acrílico transparente o de color. Personalizá con impresión full color. Ideal para fotos y diseños coloridos.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  {
    id: 15, tipo: "individual", nombre: "Llavero Bordado",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero bordado con tu diseño en hilo de colores. Textura suave y aspecto artesanal.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  {
    id: 16, tipo: "individual", nombre: "Llavero con Portal",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero con portal personalizable. Incluye argolla para llaves y portal con espacio para diseño.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  {
    id: 17, tipo: "individual", nombre: "Llavero Personalizado",
    categoria: "llaveros", precio: 0,
    descripcion: "Llavero totalmente personalizable. Elegí material, forma y diseño. Consultanos por opciones.\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "", activo: true
  },
  // ========== PACKS DE REMERAS ==========
  {
    id: 101, tipo: "paquete",
    nombre: "Pack de Remeras Base",
    categoria: "packs", precio: 270750,
    descripcion: "📦 15 remeras de algodón — color y diseño a elección\n✅ Incluye 1 vaso chopp de regalo\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "BASE", activo: true
  },
  {
    id: 102, tipo: "paquete",
    nombre: "Pack de Remeras Estándar",
    categoria: "packs", precio: 799000,
    descripcion: "📦 50 remeras de algodón — color y diseño a elección\n✅ Incluye: 1 taza mágica, 1 gorra de jean, 3 llaveros\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "ESTÁNDAR", activo: true
  },
  {
    id: 103, tipo: "paquete",
    nombre: "Pack de Remeras Premium",
    categoria: "packs", precio: 1530000,
    descripcion: "📦 100 remeras de algodón — color y diseño a elección\n✅ Incluye: 1 bolso, 1 chopp, 2 tazas de cerámica\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "PREMIUM", activo: true
  },
  // ========== PACKS DE REGALO ==========
  {
    id: 104, tipo: "paquete",
    nombre: "Pack de Regalo Base",
    categoria: "packs", precio: 26500,
    descripcion: "🎁 1 remera de algodón + 1 gorra trucker — color y diseño a elección\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "BASE", activo: true
  },
  {
    id: 105, tipo: "paquete",
    nombre: "Pack de Regalo Estándar",
    categoria: "packs", precio: 54000,
    descripcion: "🎁 2 remeras de algodón + 1 gorra trucker + 1 taza — color y diseño a elección\n🎁 Incluye regalo sorpresa\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "ESTÁNDAR", activo: true
  },
  {
    id: 106, tipo: "paquete",
    nombre: "Pack de Regalo Premium",
    categoria: "packs", precio: 80000,
    descripcion: "🎁 1 chomba + 1 remera + 1 gorra de jean + 1 chopp cervecero — color y diseño a elección\n🎁 Incluye regalo sorpresa\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "PREMIUM", activo: true
  },
  // ========== PACKS MIXTOS ==========
  {
    id: 107, tipo: "paquete",
    nombre: "Pack Mixto Base",
    categoria: "packs", precio: 247000,
    descripcion: "📦 10 remeras + 10 gorras trucker — color y diseño a elección\n✅ Incluye: 1 remera modal, 1 gorra de jean\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "BASE", activo: true
  },
  {
    id: 108, tipo: "paquete",
    nombre: "Pack Mixto Estándar",
    categoria: "packs", precio: 2598000,
    descripcion: "📦 25 remeras + 25 gorras trucker — color y diseño a elección\n✅ Incluye: 1 destapador de pared, 1 chopp\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "ESTÁNDAR", activo: true
  },
  {
    id: 109, tipo: "paquete",
    nombre: "Pack Mixto Premium",
    categoria: "packs", precio: 1222848,
    descripcion: "📦 60 remeras + 60 gorras trucker — color y diseño a elección\n✅ Incluye: 1 bolso, 1 chopp, 1 gorra de jean, 5 llaveros\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "PREMIUM", activo: true
  },
  // ========== PACKS DE GORRAS ==========
  {
    id: 110, tipo: "paquete",
    nombre: "Pack de Gorras Base",
    categoria: "packs", precio: 96600,
    descripcion: "🧢 15 gorras trucker — color y diseño a elección\n✅ Incluye: 1 gorra de jean\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "BASE", activo: true
  },
  {
    id: 111, tipo: "paquete",
    nombre: "Pack de Gorras Estándar",
    categoria: "packs", precio: 277200,
    descripcion: "🧢 50 gorras trucker — color y diseño a elección\n✅ Incluye: 1 gorra de jean, 1 llavero, 1 taza\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "ESTÁNDAR", activo: true
  },
  {
    id: 112, tipo: "paquete",
    nombre: "Pack de Gorras Premium",
    categoria: "packs", precio: 523600,
    descripcion: "🧢 100 gorras trucker — color y diseño a elección\n✅ Incluye: 3 gorras de jean, 1 remera, 3 llaveros\n🎁 Si querés con packaging, sumá $5.000 extra.",
    badge: "PREMIUM", activo: true
  }
];

// Obtiene las imágenes del primer color disponible de un producto
function getImagenesProducto(p) {
  if (p.colores && p.colores.length > 0 && p.colores[0].imagenes && p.colores[0].imagenes.length > 0) {
    return p.colores[0].imagenes;
  }
  if (p.imagenes && p.imagenes.length > 0) return p.imagenes;
  const arr = [];
  if (p.imagen) arr.push(p.imagen);
  if (p.imagen2) arr.push(p.imagen2);
  if (!arr.length) arr.push(`icono-talles/productos/${p.id}.webp`);
  while (arr.length < 2) arr.push(FALLBACK_IMG);
  return arr;
}

function getImagenesHover(p) {
  const todas = [];
  if (p.colores) p.colores.forEach(c => {
    if (c.imagenes) c.imagenes.forEach(img => { if (!todas.includes(img)) todas.push(img); });
  });
  if (todas.length >= 2) return [todas[0], todas[1]];
  const pred = getImagenesProducto(p);
  const base = pred[0] || `icono-talles/productos/${p.id}.webp`;
  if (todas.length === 1 && todas[0] !== base) return [base, todas[0]];
  if (pred.length >= 2 && pred[1] !== FALLBACK_IMG) return [pred[0], pred[1]];
  return [base, base];
}

function getImagenesPorColor(p, colorNombre) {
  if (!p.colores) return getImagenesProducto(p);
  const color = p.colores.find(c => c.nombre === colorNombre);
  if (color && color.imagenes && color.imagenes.length > 0) return color.imagenes;
  return getImagenesProducto(p);
}

function getPrimeraImagen(p, colorNombre) {
  const imgs = colorNombre ? getImagenesPorColor(p, colorNombre) : getImagenesProducto(p);
  return imgs[0] || FALLBACK_IMG;
}

function getTallesDisponibles(p, colorNombre) {
  if (!p.colores) return [];
  const color = p.colores.find(c => c.nombre === colorNombre);
  if (!color || !color.talles) return [];
  return Object.entries(color.talles)
    .filter(([t, d]) => d.activo && d.stock > 0)
    .map(([t]) => t);
}

function getStockTalle(p, colorNombre, talle) {
  if (!p.colores) return 0;
  const color = p.colores.find(c => c.nombre === colorNombre);
  if (!color || !color.talles || !color.talles[talle]) return 0;
  return color.talles[talle].stock;
}

function isTalleActivo(p, colorNombre, talle) {
  if (!p.colores) return true;
  const color = p.colores.find(c => c.nombre === colorNombre);
  if (!color || !color.talles || !color.talles[talle]) return false;
  return color.talles[talle].activo && color.talles[talle].stock > 0;
}

// =============================================
// CLASIFICACIÓN DE PAQUETES (tiers)
// =============================================

const PACK_TIERS_DEFAULT = {
  base:     { nombre: "BASE",     color: "#6b7280" },
  estandar: { nombre: "ESTÁNDAR", color: "#2563eb" },
  premium:  { nombre: "PREMIUM",  color: "#d97706" }
};

function getPackTiers() {
  const s = localStorage.getItem('dubenji_pack_tiers');
  return s ? JSON.parse(s) : JSON.parse(JSON.stringify(PACK_TIERS_DEFAULT));
}

function savePackTiers(tiers) {
  localStorage.setItem('dubenji_pack_tiers', JSON.stringify(tiers));
}

// =============================================
// GUÍA DE TALLES
// =============================================

const GUIAS_TALLES_DEFAULT = {
  remeras_ninos: {
    nombre: "Remera Niños",
    imagen: "icono-talles/a3.webp",
    tabla: [
      { talle: "4",  ancho: 31, largo: 41 },
      { talle: "6",  ancho: 34, largo: 49 },
      { talle: "8",  ancho: 35, largo: 50 },
      { talle: "10", ancho: 36, largo: 51 },
      { talle: "12", ancho: 38, largo: 54 },
      { talle: "14", ancho: 43, largo: 59 }
    ]
  },
  remeras_adulto: {
    nombre: "Remera Adulto",
    imagen: "icono-talles/a3.webp",
    tabla: [
      { talle: "S",   ancho: 48, largo: 68 },
      { talle: "M",   ancho: 52, largo: 72 },
      { talle: "L",   ancho: 56, largo: 76 },
      { talle: "XL",  ancho: 60, largo: 80 },
      { talle: "XXL", ancho: 64, largo: 84 }
    ]
  },
  buzos_adulto: {
    nombre: "Buzo Adulto",
    imagen: "icono-talles/a1.webp",
    tabla: [
      { talle: "S",   ancho: 54, largo: 66 },
      { talle: "M",   ancho: 58, largo: 70 },
      { talle: "L",   ancho: 62, largo: 74 },
      { talle: "XL",  ancho: 66, largo: 78 },
      { talle: "XXL", ancho: 70, largo: 82 }
    ]
  },
  chombas_adulto: {
    nombre: "Chomba Adulto",
    imagen: "icono-talles/a4.webp",
    tabla: [
      { talle: "S",   ancho: 48, largo: 68 },
      { talle: "M",   ancho: 52, largo: 72 },
      { talle: "L",   ancho: 56, largo: 76 },
      { talle: "XL",  ancho: 60, largo: 80 },
      { talle: "XXL", ancho: 64, largo: 84 }
    ]
  },
  camperas_adulto: {
    nombre: "Campera Adulto",
    imagen: "icono-talles/a2.webp",
    tabla: [
      { talle: "S",   ancho: 54, largo: 66 },
      { talle: "M",   ancho: 58, largo: 70 },
      { talle: "L",   ancho: 62, largo: 74 },
      { talle: "XL",  ancho: 66, largo: 78 },
      { talle: "XXL", ancho: 70, largo: 82 }
    ]
  },
  remeras_talles_especiales: {
    nombre: "Remera Talles Especiales",
    imagen: "icono-talles/a3.webp",
    tabla: [
      { talle: "L",   ancho: 58, largo: 76 },
      { talle: "XL",  ancho: 62, largo: 80 },
      { talle: "XXL", ancho: 66, largo: 84 },
      { talle: "3XL", ancho: 72, largo: 88 },
      { talle: "4XL", ancho: 78, largo: 92 },
      { talle: "5XL", ancho: 84, largo: 96 }
    ]
  }
};

function getGuiasTalles() {
  const s = localStorage.getItem('dubenji_guias_talles');
  return s ? JSON.parse(s) : JSON.parse(JSON.stringify(GUIAS_TALLES_DEFAULT));
}

function saveGuiasTalles(guias) {
  localStorage.setItem('dubenji_guias_talles', JSON.stringify(guias));
}

// Obtiene la lista de talles según la clave de guía
function getTallesFromGuideKey(guiaKey) {
  if (!guiaKey) return TALLES;
  const guias = getGuiasTalles();
  let guia = guias[guiaKey];
  if (!guia) guia = GUIAS_TALLES_DEFAULT[guiaKey];
  if (!guia || !guia.tabla || !guia.tabla.length) return TALLES;
  return guia.tabla.map(r => r.talle);
}

// Asignar guía de talles a cada producto (por ID o categoría)
function getGuiaTalle(producto) {
  if (producto.tipo === "paquete") return null;
  const guias = getGuiasTalles();
  if (producto.guiaTalle) return guias[producto.guiaTalle] || GUIAS_TALLES_DEFAULT[producto.guiaTalle];
  const def = (cat) => guias[cat] || GUIAS_TALLES_DEFAULT[cat];
  if (producto.categoria === "remeras") return def("remeras_adulto");
  if (producto.categoria === "buzos") return def("buzos_adulto");
  if (producto.categoria === "camperas") return def("camperas_adulto");
  if (producto.categoria === "chombas") return def("chombas_adulto");
  return null;
}

// =============================================
// CUPONES DE DESCUENTO
// =============================================

const CUPONES_DEFAULT = [
  { id: 1, codigo: "DUBENJI10",  porcentaje: 10, activo: true,  usos: 0 },
  { id: 2, codigo: "BIENVENIDA", porcentaje: 15, activo: true,  usos: 0 },
  { id: 3, codigo: "OFERTA20",   porcentaje: 20, activo: true,  usos: 0 },
  { id: 4, codigo: "ANTIGUO5",   porcentaje: 5,  activo: false, usos: 12 }
];

function getCupones() {
  const s = localStorage.getItem('gag_cupones');
  return s ? JSON.parse(s) : JSON.parse(JSON.stringify(CUPONES_DEFAULT));
}

function saveCupones(lista) {
  localStorage.setItem('gag_cupones', JSON.stringify(lista));
}

function validarCupon(codigo) {
  const cupones = getCupones();
  const cupon = cupones.find(c => c.codigo === codigo.toUpperCase().trim());
  if (!cupon) return { valido: false, error: '❌ Cupón no encontrado' };
  if (!cupon.activo) return { valido: false, error: '❌ Cupón no vigente' };
  return { valido: true, cupon };
}

// =============================================
// EFEMÉRIDES
// =============================================

function getEfemerides() {
  const s = localStorage.getItem('dubenji_efemerides');
  return s ? JSON.parse(s) : [];
}

function saveEfemerides(lista) {
  localStorage.setItem('dubenji_efemerides', JSON.stringify(lista));
}

function efemeridesActivas() {
  return getEfemerides().filter(e => e.activo);
}
