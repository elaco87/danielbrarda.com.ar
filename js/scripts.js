// === FUNCIONES RENDER ===
// === FUNCIONES RENDER ===
function getLatestPropertiesForSale(limit = 3) {
    return propertiesData.filter(p => p.estados && p.estados.some(e => e.toLowerCase().includes('venta'))).slice(0, limit);
}
function getLatestPropertiesForRent(limit = 3) {
    return propertiesData.filter(p => p.estados && p.estados.some(e => e.toLowerCase().includes('alquiler') || e.toLowerCase().includes('alquilado'))).slice(0, limit);
}

// Logic: Sort by ID descending (highest ID first) and take top 5
function getDestacadasProperties(limit = 5) {
    const sorted = [...propertiesData].sort((a, b) => Number(b.id) - Number(a.id));
    return sorted.filter(p => p.destacada == "1" || (p.estados && p.estados.some(e => e.toLowerCase().includes('venta')))).slice(0, limit);
}

function createCard(prop) {
    let mapBtn = '';
    let lat = null, lng = null;

    if (prop.coordenadas) {
        const parts = prop.coordenadas.split(',');
        lat = parts[0];
        lng = parts[1];
    } else if (prop.lat && prop.lng) {
        lat = prop.lat;
        lng = prop.lng;
    }

    if (lat && lng) {
        mapBtn = `<button class="btn-google-maps" onclick="openModal('${lat}', '${lng}', '${prop.titulo.replace(/'/g, "\\'")}')" title="Ver Mapa"><i class="fas fa-map-marked-alt"></i></button>`;
    }

    let imageSrc = prop.imagen || (prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0].url : 'https://via.placeholder.com/488x326');
    let type = prop.tipos ? prop.tipos[0] : (prop.tipo || 'Propiedad');
    let status = prop.estados ? prop.estados[0] : '';
    let badgeColor = (status && status.toLowerCase().includes('venta')) ? 'var(--primary)' : 'var(--secondary)';
    let badgeText = status || type;

    return `
        <div class="property-card">
            <div class="property-image">
                <a href="detalle.html?id=${prop.id}">
                    <img src="${imageSrc}" alt="${prop.titulo}">
                </a>
                <div class="property-badge" style="background: ${badgeColor}">${badgeText}</div>
            </div>
            <div class="property-content">
                <h3><a href="detalle.html?id=${prop.id}">${prop.titulo}</a></h3>
                <p style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
                    <i class="fas fa-map-marker-alt"></i> ${prop.direccion || prop.ciudades || ''}
                </p>
                <div class="property-features" style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.9em; color: #555;">
                    ${prop.dormitorios ? `<span><i class="fas fa-bed"></i> ${prop.dormitorios}</span>` : ''}
                    ${prop.banos ? `<span><i class="fas fa-bath"></i> ${prop.banos}</span>` : ''}
                    ${prop.superficie_m2 ? `<span><i class="fas fa-ruler-combined"></i> ${prop.superficie_m2}m²</span>` : ''}
                </div>
                <div class="property-footer">
                    <div class="property-price">${prop.precio || 'Consultar'}</div>
                    <div class="property-actions">
                        ${mapBtn}
                        <a href="detalle.html?id=${prop.id}" class="btn btn-primary" style="padding: 8px 15px; font-size: 0.8rem; border-radius: 6px;">
                            Ver Propiedad
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderVentas() {
    const list = getLatestPropertiesForSale(3);
    const container = document.getElementById('ventas-list');
    if (container) container.innerHTML = list.map(createCard).join('');
}

function renderAlquiler() {
    const list = getLatestPropertiesForRent(3);
    const container = document.getElementById('alquiler-list');
    if (container) container.innerHTML = list.map(createCard).join('');
}

// === DESTACADAS SLIDER ===
let currentDestacada = 0;
let destacadasData = [];

function renderDestacadas() {
    destacadasData = getDestacadasProperties(5);
    const container = document.getElementById('destacadas-slider');

    let slidesHtml = '';

    destacadasData.forEach((prop, index) => {
        let lat = null, lng = null;
        if (prop.coordenadas) {
            const parts = prop.coordenadas.split(',');
            lat = parts[0];
            lng = parts[1];
        }

        let mapBtn = (lat && lng) ? `<button class="btn-google-maps" onclick="openModal('${lat}', '${lng}', '${prop.titulo.replace(/'/g, "\\'")}')"><i class="fas fa-map-marked-alt"></i></button>` : '';

        let imageSrc = prop.imagen || (prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0].url : 'https://via.placeholder.com/800x600');
        let type = prop.tipos ? prop.tipos[0] : (prop.tipo || 'Propiedad');
        let description = prop.descripcion || "Descripción no disponible.";

        slidesHtml += `
            <div class="destacada-slide ${index === 0 ? 'active' : ''}">
                <div class="destacada-imagen" style="position: relative;">
                    <img src="${imageSrc}" alt="${prop.titulo}">
                    <div class="destacada-overlay" style="
                        position: absolute;
                        bottom: 20px;
                        left: 20px;
                        right: 20px;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 15px 20px;
                        border-radius: 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        backdrop-filter: blur(5px);
                    ">
                        <div class="property-price" style="font-size: 1.5rem; margin: 0; color: var(--primary); font-weight: 800;">
                            ${prop.precio || 'Consultar'}
                        </div>
                        <div style="display:flex; gap:10px;">
                            ${mapBtn}
                            <a href="detalle.html?id=${prop.id}" class="btn btn-primary" style="padding: 10px 20px;">Ver Propiedad</a>
                        </div>
                    </div>
                </div>
                <div class="destacada-contenido">
                    <div class="destacada-header">
                        <span class="destacada-tipo">${type}</span>
                        <h3 style="font-size: 1.8rem; margin-top: 10px;">${prop.titulo}</h3>
                    </div>
                    <div class="destacada-detalles">
                        <p style="margin-top: 10px; color: #666; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; max-height: 15rem;">${description}</p>
                        
                        <div class="property-features" style="display: flex; gap: 20px; margin-top: 20px; font-size: 1.1em; color: #444;">
                            ${prop.dormitorios ? `<span><i class="fas fa-bed"></i> ${prop.dormitorios} Dorm.</span>` : ''}
                            ${prop.banos ? `<span><i class="fas fa-bath"></i> ${prop.banos} Baños</span>` : ''}
                            ${prop.superficie_m2 ? `<span><i class="fas fa-ruler-combined"></i> ${prop.superficie_m2}m²</span>` : ''}
                        </div>
                        <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
                            <i class="fas fa-map-marker-alt"></i> ${prop.direccion || 'Chajarí, Entre Ríos'}
                        </div>
                    </div>
                </div>
            </div>`;
    });

    if (container) container.innerHTML = slidesHtml;
}

function showDestacada(index) {
    const slides = document.querySelectorAll('.destacada-slide');
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach(s => s.classList.remove('active'));

    currentDestacada = index;
    slides[currentDestacada].classList.add('active');
}

function nextDestacada() { showDestacada(currentDestacada + 1); }
function prevDestacada() { showDestacada(currentDestacada - 1); }

// === HERO SLIDER LOGIC ===
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slider .slide');
const dots = document.querySelectorAll('.slider-dots .dot');

function updateHero(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { updateHero(currentSlide + 1); }
function prevSlide() { updateHero(currentSlide - 1); }
function goToSlide(i) { updateHero(i); }

if (slides.length > 0) {
    setInterval(nextSlide, 6000);
}

// === MODAL LOGIC ===
function openModal(lat, lng, title) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('googleMapIframe').src = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=16&output=embed`;
    document.getElementById('streetViewIframe').src = `https://maps.google.com/maps?q=${lat},${lng}&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;
    document.getElementById('mapModal').style.display = 'flex';
    switchTab('map');
}
function closeModal() { document.getElementById('mapModal').style.display = 'none'; }
function switchTab(tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}
window.onclick = e => { if (e.target == document.getElementById('mapModal')) closeModal(); };

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    // Check if propertiesData is loaded
    if (typeof propertiesData !== 'undefined') {
        renderVentas();
        renderAlquiler();
        renderDestacadas();
    } else {
        console.error('propertiesData not loaded');
    }

    // Scroll Header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (header) {
            window.scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const nav = document.querySelector('.rh_menu .main-menu');
            if (nav) {
                // Toggle logic depending on CSS (in current CSS .main-nav is hidden on mobile unless active)
                nav.classList.toggle('active');
                if (nav.style.display === 'block') {
                    nav.style.display = '';
                } else {
                    nav.style.display = 'block';
                }
            }
        });
    }
});
