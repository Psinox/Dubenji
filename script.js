// =============================================
// DUBENJI INDUMENTARIA — SCRIPT PRINCIPAL
// =============================================

const ADMIN_PASSWORD = "dubenji2026";
const ADMIN_URL_TOKEN = "dubenji-admin-2026";

let categoriaActiva = 'todos';
let busqueda = '';
let carouselIdx = 0;
let carouselTimer = null;
let adminLogueado = false;
let detalleCantidad = 1;
let detalleColorSel = null;
let detalleTalleSel = null;

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('gag_admin') === '1') activarModoAdmin();
  renderBanners();
  resetTimer();
  renderServicios();
  renderFiltros();
  window.__READY.then(() => {
    renderTodosLosProductos();
    actualizarBadgeCarrito();
  });

  document.getElementById('buscador')?.addEventListener('input', e => {
    busqueda = e.target.value;
    renderTodosLosProductos();
  });

  document.getElementById('hamburger')?.addEventListener('click', () =>
    document.getElementById('mobileNav')?.classList.add('open'));
  document.getElementById('closeMobileNav')?.addEventListener('click', () =>
    document.getElementById('mobileNav')?.classList.remove('open'));
  document.querySelectorAll('#mobileNav a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('mobileNav')?.classList.remove('open')));

  document.getElementById('inputPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') intentarLogin();
  });

  window.__onFbSync = () => {
    renderTodosLosProductos();
    actualizarBadgeCarrito();
  };

});

// =============================================
// AUTH
// =============================================

function abrirLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.add('open');
  document.getElementById('inputPassword').value = '';
  document.getElementById('loginError').textContent = '';
  setTimeout(() => document.getElementById('inputPassword')?.focus(), 120);
}

function cerrarLogin() { document.getElementById('loginModal')?.classList.remove('open'); }

function intentarLogin() {
  const pw = document.getElementById('inputPassword').value;
  if (pw === getAdminPass()) {
    sessionStorage.setItem('gag_admin', '1');
    cerrarLogin();
    activarModoAdmin();
    showToast('✅ Modo administrador activado');
  } else {
    document.getElementById('loginError').textContent = '❌ Contraseña incorrecta';
    document.getElementById('inputPassword').value = '';
    document.getElementById('inputPassword').focus();
  }
}

function cerrarSesion() {
  sessionStorage.removeItem('gag_admin');
  adminLogueado = false;
  document.body.classList.remove('admin-view');
  document.getElementById('adminBar')?.classList.remove('visible');
  renderTodosLosProductos();
  showToast('👋 Sesión cerrada');
}

function activarModoAdmin() {
  adminLogueado = true;
  document.body.classList.add('admin-view');
  document.getElementById('adminBar')?.classList.add('visible');
  renderTodosLosProductos();
}

// =============================================
// DATOS
// =============================================

function formatPrecio(precio) {
  if (!precio || precio === 0) return 'Consultar';
  return '$ ' + precio.toLocaleString('es-AR');
}

function badgeClass(badge) {
  const map = { 'OFERTA': '', 'NUEVO': 'badge-nuevo', 'COMBO': 'badge-combo', 'CONSULTAR': 'badge-consultar', 'MÁS VENDIDO': 'badge-mas-vendido' };
  return map[badge] || '';
}

function badgeStyle(badge) {
  if (!badge) return '';
  const tiers = getPackTiers();
  for (const k in tiers) {
    if (tiers[k].nombre === badge) return `background:${tiers[k].color};`;
  }
  return '';
}

function waLink(p, color, talle) {
  let msg = p.precio && p.precio > 0
    ? `Hola! Me interesa *${p.nombre}* — $${p.precio.toLocaleString('es-AR')}.`
    : `Hola! Me interesa *${p.nombre}*. ¿Me pueden dar más info?`;
  if (color) msg += `\nColor: ${color}`;
  if (talle) msg += `\nTalle: ${talle}`;
  msg += '\n\n¿Está disponible?';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// =============================================
// BANNERS
// =============================================

function renderBanners() {
  const track = document.getElementById('carouselTrack');
  const dots  = document.getElementById('carouselDots');
  if (!track) return;
  track.innerHTML = BANNERS.map(b => `
    <div class="carousel-slide">
      <img src="${b.imagen}" alt="Banner" class="carousel-img" loading="lazy">
      <div class="carousel-overlay">
        <div class="carousel-align">
          <div class="carousel-texto">
            <h2 class="carousel-titulo">${b.titulo}</h2>
            <p class="carousel-sub">${b.texto}</p>
          </div>
        </div>
      </div>
    </div>`).join('');
  dots.innerHTML = BANNERS.map((_, i) =>
    `<button class="dot ${i===0?'active':''}" onclick="gotoSlide(${i})"></button>`).join('');
}

window.gotoSlide = i => {
  carouselIdx = (i + BANNERS.length) % BANNERS.length;
  document.getElementById('carouselTrack').style.transform = `translateX(-${carouselIdx*100}%)`;
  document.querySelectorAll('.dot').forEach((d,j) => d.classList.toggle('active', j===carouselIdx));
  resetTimer();
};
window.prevSlide = () => gotoSlide(carouselIdx - 1);
window.nextSlide = () => gotoSlide(carouselIdx + 1);
function resetTimer() { clearInterval(carouselTimer); carouselTimer = setInterval(() => gotoSlide(carouselIdx+1), 5000); }

// =============================================
// CATEGORÍAS
// =============================================

function renderServicios() {
  const el = document.getElementById('serviciosGrid');
  if (!el) return;
  const efemActivas = efemeridesActivas();
  const efemBtns = efemActivas.map(e => `
    <div class="servicio-item" onclick="filtrarPor('efemeride_${e.id}')" style="border-color:var(--rojo)">
      <div class="servicio-icono">🎉</div>
      <span class="servicio-nombre">${e.nombre}</span>
    </div>`).join('');
  el.innerHTML = CATEGORIAS.filter(c => c.id !== 'packs').map(c => `
    <div class="servicio-item" onclick="filtrarPor('${c.id}')">
      <div class="servicio-icono">${c.icono}</div>
      <span class="servicio-nombre">${c.nombre}</span>
    </div>`).join('') + efemBtns;
}

// =============================================
// COLORES SHOWCASE
// =============================================

function renderColoresShowcase() {
  const el = document.getElementById('coloresShowcase');
  if (!el) return;
  const usados = new Map();
  const productos = getProductos();
  productos.forEach(p => {
    if (p.colores) p.colores.forEach(c => {
      if (!usados.has(c.hex)) usados.set(c.hex, c.nombre);
    });
  });
  el.innerHTML = Array.from(usados).map(([hex, nombre]) => `
    <div class="color-swatch-item" onclick="filtrarColor('${nombre}')">
      <span class="color-swatch-circle" style="background:${hex};${hex==='#f5f5f5'||hex==='#f5e6cc'?'border:2px solid rgba(255,255,255,.15)':''}"></span>
      <span class="color-swatch-label">${nombre}</span>
    </div>
  `).join('');
}

window.filtrarColor = nombre => {
  categoriaActiva = 'todos';
  busqueda = nombre;
  document.getElementById('buscador').value = nombre;
  renderFiltros();
  renderTodosLosProductos();
  document.getElementById('productos')?.scrollIntoView({ behavior:'smooth', block:'start' });
};

// =============================================
// FILTROS
// =============================================

function renderFiltros() {
  const el = document.getElementById('filtros');
  if (!el) return;
  const efemActivas = efemeridesActivas();
  const efemBtns = efemActivas.map(e => ({
    id: `efemeride_${e.id}`,
    nombre: e.nombre,
    icono: '🎉'
  }));
  const todos = [{ id:'todos', nombre:'Todos', icono:'🛒' }, ...CATEGORIAS, ...efemBtns];
  el.innerHTML = todos.map(c => `
    <button class="filtro-btn ${c.id===categoriaActiva?'active':''}" onclick="filtrarPor('${c.id}')">
      ${c.icono} ${c.nombre}
    </button>`).join('');
}

window.filtrarPor = cat => {
  categoriaActiva = cat;
  busqueda = '';
  document.getElementById('buscador').value = '';
  renderFiltros();
  renderTodosLosProductos();
  document.getElementById('productos')?.scrollIntoView({ behavior:'smooth', block:'start' });
};

// =============================================
// RENDER PRODUCTOS
// =============================================

function renderTodosLosProductos() {
  const esEfem = categoriaActiva && categoriaActiva.startsWith('efemeride_');
  const efemDest = document.getElementById('efemeridesDestacadas');
  const indivSection = document.getElementById('gridIndividuales')?.closest('.section-block');
  const paquetes = document.getElementById('paquetes');

  if (esEfem) {
    if (efemDest) efemDest.style.display = '';
    if (indivSection) indivSection.style.display = 'none';
    if (paquetes) paquetes.style.display = 'none';
    renderGridProductos('gridEfemerides', 'efemeride');
  } else {
    const efemActivas = efemeridesActivas();
    const productos = getProductos();
    const hayEfemerides = efemActivas.some(e =>
      productos.some(p => p.efemeride === e.id && (!adminLogueado ? p.activo : true))
    );
    if (efemDest) efemDest.style.display = hayEfemerides ? '' : 'none';
    if (hayEfemerides) {
      renderGridProductos('gridEfemerides', 'efemeride');
    } else {
      const g = document.getElementById('gridEfemerides');
      if (g) g.innerHTML = '';
    }
    if (indivSection) indivSection.style.display = '';
    if (paquetes) paquetes.style.display = '';
    renderGridProductos('gridIndividuales', 'individual');
    renderGridProductos('gridPaquetes', 'paquete');
  }
}

function renderGridProductos(gridId, tipo) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const esEfemeride = gridId === 'gridEfemerides';
  let efemId = null;
  if (esEfemeride) {
    if (categoriaActiva.startsWith('efemeride_')) {
      efemId = categoriaActiva.replace('efemeride_', '');
    } else {
      efemId = '__TODAS__';
    }
  }

  const todos = getProductos();
  const lista = todos.filter(p => {
    if (esEfemeride) {
      if (efemId === '__TODAS__') {
        const efemActivas = efemeridesActivas();
        const efemIds = efemActivas.map(e => e.id);
        if (!p.efemeride || !efemIds.includes(p.efemeride)) return false;
      } else if (p.efemeride !== efemId) return false;
    } else {
      if (p.tipo !== tipo) return false;
    }
    if (!adminLogueado && !p.activo) return false;
    const matchCat = categoriaActiva === 'todos' || p.categoria === categoriaActiva || (esEfemeride && (efemId === '__TODAS__' || p.efemeride === efemId));
    const q = busqueda.toLowerCase();
    const matchBusc = !q || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q) || colorMatch(p, q);
    return matchCat && matchBusc;
  });

  if (!lista.length) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><h3>Sin resultados</h3><p>Probá con otra búsqueda o categoría</p></div>`;
    return;
  }

  const catMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre]));
  const esPaquete = tipo === 'paquete';

  grid.innerHTML = lista.map((p, i) => {
    const pausadoClass = !p.activo ? 'pausado' : '';
    const imgsHover = getImagenesHover(p);
    const hasHover = imgsHover[0] !== imgsHover[1];
    const colores = p.colores || [];
    const sinColores = esPaquete || !p.colores || !p.colores.length;
    const incluyeMatch = p.descripcion.match(/✅ Incluye:?(.+)/);
    const incluyeText = incluyeMatch ? incluyeMatch[1] : '';

    return `
      <div class="producto-card ${pausadoClass}" style="animation-delay:${i*40}ms" ${sinColores ? '' : `onclick="abrirProducto(${p.id})"`}>
        <div class="producto-img-wrap${hasHover?'':' no-hover'}">
          ${sinColores
            ? `<img class="img-primary" src="${imgsHover[0]}" alt="${p.nombre}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'">`
            : `<img class="img-primary"   src="${imgsHover[0]}" alt="${p.nombre}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'">
               ${hasHover ? `<img class="img-secondary" src="${imgsHover[1]}" alt="${p.nombre}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'">` : ''}`
          }
          ${p.badge ? `<span class="producto-badge ${badgeClass(p.badge)}" style="${badgeStyle(p.badge)}">${p.badge}</span>` : ''}
          ${!p.activo ? `<span class="badge-pausado">⏸ PAUSADO</span>` : ''}
        </div>
        <div class="producto-info">
          <span class="producto-categoria">${catMap[p.categoria] || p.categoria}</span>
          <h3 class="producto-nombre">${p.nombre}</h3>
          <p class="producto-desc">${p.descripcion.split('\n')[0]}</p>
          ${incluyeText ? `<p class="producto-incluye">✅ Incluye: ${incluyeText}</p>` : ''}
          ${!sinColores ? `
          <div class="producto-colores-mini">
            ${colores.slice(0, 5).map(c => `
              <span class="mini-color" style="background:${c.hex};${c.hex==='#f5f5f5'||c.hex==='#f5e6cc'?'border:1px solid rgba(255,255,255,.15)':''}" title="${c.nombre}"></span>
            `).join('')}
            ${colores.length > 5 ? `<span class="mini-color-mas">+${colores.length-5}</span>` : ''}
          </div>` : ''}
          <div class="producto-precio ${!p.precio?'consultar':''}">${formatPrecio(p.precio)}</div>
          ${esPaquete || sinColores
            ? `<a href="${waLink(p)}" target="_blank" class="btn-comprar" style="margin-top:10px">💬 Consultar por WhatsApp</a>`
            : (!adminLogueado || p.activo
                ? `<a href="${waLink(p)}" target="_blank" class="btn-comprar" onclick="event.stopPropagation()">💬 Consultar por WhatsApp</a>`
                : `<button class="btn-comprar" style="background:#f59e0b;color:#1a1a1a" onclick="event.stopPropagation();toggleActivo(${p.id})">▶️ Activar producto</button>`)
          }
        </div>
      </div>`;
  }).join('');
}

function colorMatch(p, q) {
  if (!p.colores || !q) return false;
  return p.colores.some(c => c.nombre.toLowerCase().includes(q));
}

// =============================================
// TOGGLE ACTIVO (admin)
// =============================================

window.toggleActivo = id => {
  const lista = getProductos();
  const p = lista.find(x => x.id === id);
  if (!p) return;
  p.activo = !p.activo;
  localStorage.setItem('gag_productos', JSON.stringify(lista));
  renderTodosLosProductos();
  showToast(p.activo ? '✅ Producto activado' : '⏸ Producto pausado');
};

// =============================================
// TOAST
// =============================================

window.showToast = (msg, tipo='ok') => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = tipo === 'ok' ? '#10b981' : '#f43f5e';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
};

// =============================================
// DETALLE DE PRODUCTO (modal con color + talle)
// =============================================

window.abrirProducto = id => {
  const productos = getProductos();
  const p = productos.find(x => x.id === id);
  if (!p) return;
  detalleCantidad = 1;
  detalleColorSel = (p.colores && p.colores.length) ? p.colores[0].nombre : null;
  detalleTalleSel = null;

  const colores = p.colores || [];
  const colorActual = colores.find(c => c.nombre === detalleColorSel) || colores[0];
  const imgs = colorActual ? getImagenesPorColor(p, colorActual.nombre) : getImagenesProducto(p);
  const catMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre]));
  const tallesDisp = colorActual ? getTallesDisponibles(p, colorActual.nombre) : [];

  document.getElementById('productoDetalle').innerHTML = `
    <div class="prod-detalle-gallery">
      <div class="prod-detalle-main-img">
        <img src="${imgs[0]}" id="detalleMainImg" alt="${p.nombre}" onerror="this.src='${FALLBACK_IMG}'">
      </div>
      <div class="prod-detalle-thumbs">
        ${imgs.map((img, i) => `
          <div class="prod-thumb ${i===0?'active':''}" onclick="cambiarImgDetalle(${i})">
            <img src="${img}" alt="" onerror="this.src='${FALLBACK_IMG}'">
          </div>
        `).join('')}
      </div>
    </div>
    <div class="prod-detalle-info">
      <span class="prod-detalle-categoria">${catMap[p.categoria] || p.categoria}</span>
      <h2 class="prod-detalle-nombre">${p.nombre}</h2>
      ${p.badge ? `<span class="prod-detalle-badge ${badgeClass(p.badge)}" style="${badgeStyle(p.badge)}">${p.badge}</span>` : ''}
      <div class="prod-detalle-precio">${formatPrecio(p.precio)}</div>
      <div class="prod-detalle-desc">${p.descripcion.replace(/\n/g, '<br>')}</div>

      ${colores.length > 1 ? `
      <div class="prod-color-selector">
        <label class="prod-selector-label">Color: <span id="detalleColorLabel">${detalleColorSel || ''}</span></label>
        <div class="prod-color-opciones">
          ${colores.map(c => `
            <span class="color-swatch-select ${c.nombre === detalleColorSel ? 'active' : ''}"
                  style="background:${c.hex};${c.hex==='#f5f5f5'||c.hex==='#f5e6cc'?'border:2px solid rgba(255,255,255,.15)':''}"
                  onclick="seleccionarColor(${p.id}, '${c.nombre}')"
                  title="${c.nombre}"></span>
          `).join('')}
        </div>
      </div>` : ''}

      ${tallesDisp.length > 0 ? `
      <div class="prod-talle-selector">
        <label class="prod-selector-label">Talle: <span id="detalleTalleLabel">Elegí un talle</span></label>
        <div class="prod-talle-opciones">
          ${(p.guiaTalle ? getTallesFromGuideKey(p.guiaTalle) : TALLES).map(t => {
            const disp = tallesDisp.includes(t);
            return `<span class="talle-btn ${disp ? 'disponible' : 'agotado'}" data-talle="${t}" onclick="${disp ? `seleccionarTalle('${t}')` : ''}">${t}</span>`;
          }).join('')}
        </div>
      </div>` : ''}

      <button class="btn-guia-talles" onclick="abrirGuiaTalles(${p.id})">📏 Guía de talles</button>

      <div class="prod-detalle-qty">
        <label>Cantidad:</label>
        <div class="qty-control">
          <button onclick="cambiarCantidad(-1)">−</button>
          <span id="detalleCantidad">1</span>
          <button onclick="cambiarCantidad(1)">+</button>
        </div>
      </div>
      <button class="btn-agregar-carrito" onclick="agregarAlCarritoDesdeDetalle(${p.id})">🛒 Agregar al carrito</button>
    </div>
  `;

  document.getElementById('productoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.seleccionarColor = (prodId, nombre) => {
  detalleColorSel = nombre;
  const productos = getProductos();
  const p = productos.find(x => x.id === prodId);
  if (!p) return;
  detalleTalleSel = null;

  document.querySelectorAll('.color-swatch-select').forEach(el => {
    el.classList.toggle('active', el.title === nombre);
  });
  document.getElementById('detalleColorLabel').textContent = nombre;

  const colorActual = p.colores.find(c => c.nombre === nombre);
  if (colorActual && colorActual.imagenes && colorActual.imagenes[0]) {
    const main = document.getElementById('detalleMainImg');
    if (main) main.src = colorActual.imagenes[0];
    const thumbs = document.querySelectorAll('.prod-thumb img');
    colorActual.imagenes.forEach((img, i) => {
      if (thumbs[i]) thumbs[i].src = img;
    });
    document.querySelectorAll('.prod-thumb').forEach((t, i) => t.classList.toggle('active', i === 0));
  }

  const tallesDisp = getTallesDisponibles(p, nombre);
  const tallesList = p.guiaTalle ? getTallesFromGuideKey(p.guiaTalle) : TALLES;
  const talleContainer = document.querySelector('.prod-talle-opciones');
  if (talleContainer) {
    talleContainer.innerHTML = tallesList.map(t => {
      const disp = tallesDisp.includes(t);
      return `<span class="talle-btn ${disp ? 'disponible' : 'agotado'}" data-talle="${t}" onclick="${disp ? `seleccionarTalle('${t}')` : ''}">${t}</span>`;
    }).join('');
  }
  document.getElementById('detalleTalleLabel').textContent = 'Elegí un talle';
};

window.seleccionarTalle = talle => {
  detalleTalleSel = talle;
  document.querySelectorAll('.talle-btn').forEach(el => {
    el.classList.toggle('active', el.dataset.talle === talle);
  });
  document.getElementById('detalleTalleLabel').textContent = talle;
};

// =============================================
// GUÍA DE TALLES
// =============================================

window.abrirGuiaTalles = id => {
  const productos = getProductos();
  const p = productos.find(x => x.id === id);
  if (!p) return;
  const guia = getGuiaTalle(p);
  if (!guia) { showToast('No hay guía de talles disponible', 'error'); return; }

  document.getElementById('guiaTallesBody').innerHTML = `
    <div class="guia-talles-layout">
      <div class="guia-talles-img-wrap">
        <img src="${guia.imagen}" alt="Guía de talles" class="guia-talles-img" onerror="this.style.display='none'">
        <p class="guia-talles-nota">Medidas en centímetros</p>
      </div>
      <div class="guia-talles-tabla-wrap">
        <h3 class="guia-talles-titulo">${guia.nombre}</h3>
        <table class="guia-talles-tabla">
          <thead>
            <tr>
              <th>Talle</th>
              <th>Ancho (cm)</th>
              <th>Largo (cm)</th>
            </tr>
          </thead>
          <tbody>
            ${guia.tabla.map(f => `
              <tr>
                <td>${f.talle}</td>
                <td>${f.ancho}</td>
                <td>${f.largo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('guiaTallesModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.cerrarGuiaTalles = () => {
  document.getElementById('guiaTallesModal')?.classList.remove('open');
  document.body.style.overflow = '';
};

// =============================================

window.cerrarProducto = () => {
  document.getElementById('productoModal')?.classList.remove('open');
  document.body.style.overflow = '';
  detalleCantidad = 1;
  detalleColorSel = null;
  detalleTalleSel = null;
};

window.cambiarImgDetalle = idx => {
  const main = document.getElementById('detalleMainImg');
  const thumbs = document.querySelectorAll('.prod-thumb');
  if (!main || !thumbs.length) return;
  const imgs = document.querySelectorAll('.prod-thumb img');
  if (imgs[idx]) main.src = imgs[idx].src;
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
};

window.cambiarCantidad = delta => {
  detalleCantidad = Math.max(1, detalleCantidad + delta);
  const el = document.getElementById('detalleCantidad');
  if (el) el.textContent = detalleCantidad;
};

window.agregarAlCarritoDesdeDetalle = id => {
  const productos = getProductos();
  const p = productos.find(x => x.id === id);
  if (!p) return;
  addToCart(p, detalleCantidad, detalleColorSel, detalleTalleSel);
  detalleCantidad = 1;
  const el = document.getElementById('detalleCantidad');
  if (el) el.textContent = '1';
};

// =============================================
// CARRITO
// =============================================

function getCarrito() {
  const s = localStorage.getItem('gag_carrito');
  return s ? JSON.parse(s) : [];
}

function saveCarrito(c) {
  localStorage.setItem('gag_carrito', JSON.stringify(c));
  actualizarBadgeCarrito();
}

function actualizarBadgeCarrito() {
  const carrito = getCarrito();
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function itemKey(item) {
  return `${item.id}_${item.color || ''}_${item.talle || ''}`;
}

window.addToCart = (producto, cantidad = 1, color = null, talle = null) => {
  let carrito = getCarrito();
  const key = `${producto.id}_${color || ''}_${talle || ''}`;
  const idx = carrito.findIndex(item => item.key === key);
  const imgSrc = color ? getPrimeraImagen(producto, color) : getPrimeraImagen(producto);
  if (idx > -1) {
    carrito[idx].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      key: key,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: imgSrc,
      color: color,
      talle: talle,
      cantidad
    });
  }
  quitarCupon();
  saveCarrito(carrito);
  showToast('✅ Agregado al carrito');
};

window.removeFromCart = key => {
  let carrito = getCarrito();
  carrito = carrito.filter(item => item.key !== key);
  saveCarrito(carrito);
  if (!carrito.length) quitarCupon();
  renderCarrito();
};

window.updateCartQuantity = (key, delta) => {
  let carrito = getCarrito();
  const item = carrito.find(i => i.key === key);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(i => i.key !== key);
  saveCarrito(carrito);
  if (!carrito.length) quitarCupon();
  renderCarrito();
};

// =============================================
// CUPÓN
// =============================================

function getCuponAplicado() {
  const s = localStorage.getItem('gag_cupon_aplicado');
  return s ? JSON.parse(s) : null;
}

function saveCuponAplicado(cupon) {
  if (cupon) {
    localStorage.setItem('gag_cupon_aplicado', JSON.stringify(cupon));
  } else {
    localStorage.removeItem('gag_cupon_aplicado');
  }
}

function quitarCupon() {
  saveCuponAplicado(null);
  const el = document.getElementById('cuponInput');
  if (el) el.value = '';
}

window.aplicarCupon = () => {
  const input = document.getElementById('cuponInput');
  if (!input) return;
  const codigo = input.value.trim();
  if (!codigo) { showToast('Ingresá un código', 'error'); return; }

  const result = validarCupon(codigo);
  if (!result.valido) {
    showToast(result.error, 'error');
    quitarCupon();
    renderCarrito();
    return;
  }

  const cupones = getCupones();
  const cupon = cupones.find(c => c.codigo === result.cupon.codigo);
  if (cupon) cupon.usos = (cupon.usos || 0) + 1;
  saveCupones(cupones);

  saveCuponAplicado({ codigo: result.cupon.codigo, porcentaje: result.cupon.porcentaje });
  showToast(`✅ Cupón aplicado: ${result.cupon.porcentaje}% OFF`);
  renderCarrito();
};

function renderCarrito() {
  const carrito = getCarrito();
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;

  if (!carrito.length) {
    body.innerHTML = '<div class="cart-empty"><span class="cart-empty-icon">🛒</span><p>El carrito está vacío</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';
  body.innerHTML = carrito.map(item => {
    const variante = [item.color, item.talle].filter(Boolean).join(' · ');
    return `
    <div class="cart-item">
      <img src="${item.imagen || FALLBACK_IMG}" alt="${item.nombre}" onerror="this.src='${FALLBACK_IMG}'">
      <div class="cart-item-info">
        <div class="cart-item-nombre">${item.nombre}</div>
        <div class="cart-item-precio">${formatPrecio(item.precio)}</div>
        ${variante ? `<div style="font-size:.7rem;color:var(--gris);margin-top:2px;">${variante}</div>` : ''}
      </div>
      <div class="cart-item-qty">
        <button onclick="updateCartQuantity('${item.key}', -1)">−</button>
        <span>${item.cantidad}</span>
        <button onclick="updateCartQuantity('${item.key}', 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.key}')">✕</button>
    </div>`;
  }).join('');

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio || 0) * item.cantidad, 0);
  const cupon = getCuponAplicado();
  const descuento = cupon ? Math.round(subtotal * cupon.porcentaje / 100) : 0;
  const total = subtotal - descuento;

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) {
    if (cupon) {
      totalEl.innerHTML = `
        <div class="cart-total-detalle">
          <div class="cart-total-row"><span>Subtotal</span><span>${formatPrecio(subtotal)}</span></div>
          <div class="cart-total-row cart-total-dto"><span>Cupón ${cupon.codigo} (${cupon.porcentaje}% OFF)</span><span>-${formatPrecio(descuento)}</span></div>
          <div class="cart-total-row cart-total-final"><span>Total</span><span>${formatPrecio(total)}</span></div>
        </div>
      `;
    } else {
      totalEl.innerHTML = `
        <div class="cart-total-detalle">
          <div class="cart-total-row cart-total-final"><span>Total</span><span>${formatPrecio(total)}</span></div>
        </div>
      `;
    }
  }
}

window.abrirCarrito = () => {
  renderCarrito();
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.cerrarCarrito = () => {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

window.checkoutWhatsApp = () => {
  const carrito = getCarrito();
  if (!carrito.length) { showToast('❌ El carrito está vacío', 'error'); return; }

  const lines = carrito.map(item => {
    const subtotal = (item.precio || 0) * item.cantidad;
    const variante = [item.color, item.talle].filter(Boolean).join(' · ');
    const detalle = variante ? ` (${variante})` : '';
    return `• ${item.cantidad}x ${item.nombre}${detalle} — $${subtotal.toLocaleString('es-AR')}`;
  });
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio || 0) * item.cantidad, 0);
  const cupon = getCuponAplicado();
  const descuento = cupon ? Math.round(subtotal * cupon.porcentaje / 100) : 0;
  const total = subtotal - descuento;

  let msg = 'Hola! Quiero comprar:\n\n';
  msg += lines.join('\n');
  msg += `\n\nSubtotal: $${subtotal.toLocaleString('es-AR')}`;
  if (cupon) {
    msg += `\nDescuento (${cupon.codigo} — ${cupon.porcentaje}% OFF): -$${descuento.toLocaleString('es-AR')}`;
  }
  msg += `\n*Total: $${total.toLocaleString('es-AR')}*`;
  msg += '\n\nMis datos:';

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};
