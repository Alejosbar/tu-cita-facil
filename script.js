// ============================================
// TU CITA FÁCIL - Application JavaScript
// ============================================

// ─── DATA ─────────────────────────────────────────────────────────────

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const AVAILABLE_DAYS = [3, 5, 8, 9, 10, 12, 14, 15, 16, 17, 19, 22, 23, 24];

const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
];

const SERVICIOS = [
    { title: 'Medicina General' },
    { title: 'Psicología' },
    { title: 'Odontología' },
    { title: 'Cardiología' },
    { title: 'Pediatría' },
    { title: 'Ortopedia' },
    { title: 'Enfermeria-planificacion' },
];

const TIPOS_CITA_DATA = {
    presencial: {
        id: 'presencial',
        label: 'Presencial',
        color: '#367ad3',
        desc: 'Visita directamente nuestras instalaciones. Atención personalizada con tu médico en un entorno cómodo y equipado.',
        features: ['Examen físico completo', 'Equipos de diagnóstico', 'Exámenes de laboratorio', 'Atención inmediata'],
        image: './img/cancha.jpg'

    },
    virtual: {
        id: 'virtual',
        label: 'Virtual / Telemedicina',
        color: '#743cd6',
        desc: 'Consulta desde la comodidad de tu hogar mediante videollamada. Ideal para seguimientos y consultas de revisión.',
        features: ['Videollamada HD', 'Receta digital', 'Historial en línea', 'Sin desplazamiento'],
        image: 'https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?w=700&h=500&fit=crop&auto=format'
    },
    urgente: {
        id: 'urgente',
        label: 'Urgente',
        color: '#DC2626',
        desc: 'Para situaciones que requieren atención prioritaria. Asignamos disponibilidad inmediata con el especialista más cercano.',
        features: ['Atención en < 2h', 'Triaje médico', 'Disponible 24/7', 'Seguimiento post-cita'],
        image: 'https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?w=700&h=500&fit=crop&auto=format'
    },
    seguimiento: {
        id: 'seguimiento',
        label: 'Seguimiento',
        color: '#D97706',
        desc: 'Citas de control para monitorear tu evolución con el mismo médico tratante. Continuidad en tu proceso de salud.',
        features: ['Mismo especialista', 'Acceso a historial', 'Ajuste de tratamiento', 'Informes automáticos'],
        image: 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?w=700&h=500&fit=crop&auto=format'
    }
};

// ─── STATE ─────────────────────────────────────────────────────────────

let state = {
    // Calendar
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selectedDay: null,
    selectedTime: null,
    // Form
    tipo: 'Medicina General',
    modalidad: 'Presencial',
    nombre: '',
    email: '',
    telefono: '',
    notas: '',
    submitted: false,
    // UI
    activeTab: 'presencial',
    activeSection: 'inicio',
    mobileOpen: false,
};

// ─── DOM REFS ───────────────────────────────────────────────────────────

const calendarApp = document.getElementById('calendarApp');
const tabsContainer = document.getElementById('tabsContainer');
const tabContent = document.getElementById('tabContent');
const faqList = document.getElementById('faqList');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
const navbar = document.getElementById('navbar');

// ─── NAVIGATION ────────────────────────────────────────────────────────

function applyNavTheme() {
    const scrolled = window.scrollY > 40;
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        const active = link.classList.contains('active');
        link.style.color = scrolled ? (active ? '#0A8B7C' : '#475569') : '#ffffff';
        link.style.background = scrolled ? (active ? '#f0fdfa' : 'transparent') : (active ? 'rgba(255,255,255,0.12)' : 'transparent');
    });

    const phone = document.querySelector('.nav-phone');
    if (phone) {
        phone.style.color = scrolled ? '#475569' : '#ffffff';
        const phoneIcon = phone.querySelector('svg');
        if (phoneIcon) {
            phoneIcon.style.color = scrolled ? '#475569' : '#dffdf7';
        }
    }
}

function initNavigation() {
    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            const target = document.getElementById(section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            state.activeSection = section;
            applyNavTheme();
            // Close mobile menu
            closeMobileMenu();
        });
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        state.mobileOpen = !state.mobileOpen;
        navMobile.classList.toggle('open', state.mobileOpen);
        navToggle.innerHTML = state.mobileOpen
            ? '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
            : '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Scroll detection for navbar
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 40;
        navbar.classList.toggle('scrolled', scrolled);
        applyNavTheme();
    });

    applyNavTheme();

    // Intersection Observer for section detection
    const sections = ['inicio', 'servicios', 'citas', 'calendario', 'ubicacion'];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                state.activeSection = id;
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.toggle('active', l.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

function closeMobileMenu() {
    state.mobileOpen = false;
    navMobile.classList.remove('open');
    navToggle.innerHTML = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
}

// ─── TABS (Tipos de Cita) ─────────────────────────────────────────────

function initTabs() {
    tabsContainer.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tipo = tab.dataset.tipo;
            state.activeTab = tipo;
            // Update active class
            tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Update content
            renderTabContent(tipo);
        });
    });
    // Initial render
    renderTabContent('presencial');
}

function renderTabContent(tipoId) {
    const data = TIPOS_CITA_DATA[tipoId];
    if (!data) return;

    const color = data.color;
    tabContent.innerHTML = `
        <div class="tab-content-inner">
            <div class="tab-content-text">
                <div class="tab-icon" style="background-color: ${color}15;">
                    <svg style="color: ${color};" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${getIconPath(tipoId)}
                    </svg>
                </div>
                <h3>${data.label}</h3>
                <p>${data.desc}</p>
                <ul class="tab-features">
                    ${data.features.map(f => `
                        <li>
                            <span class="check" style="background-color: ${color}20;">
                                <svg style="color: ${color};" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            ${f}
                        </li>
                    `).join('')}
                </ul>
                <a href="#calendario" class="btn-primary" style="background-color: ${color}; align-self: flex-start;">
                    Agendar este tipo
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
            </div>
            <div class="tab-content-image">
                <img src="${data.image}" alt="${data.label}" />
                <div class="overlay" style="background: linear-gradient(135deg, ${color}, transparent);"></div>
            </div>
        </div>
    `;
}

function getIconPath(tipo) {
    const icons = {
        presencial: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        virtual: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
        urgente: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        seguimiento: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'
    };
    return icons[tipo] || icons.presencial;
}

// ─── FAQ ──────────────────────────────────────────────────────────────

function initFaq() {
    faqList.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqList.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ─── CALENDAR ─────────────────────────────────────────────────────────

function renderCalendar() {
    const today = new Date();
    const { year, month, selectedDay, selectedTime, submitted } = state;

    if (submitted) {
        renderConfirmation();
        return;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let daysHtml = '';
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        daysHtml += `<div></div>`;
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isPast = date < todayStart;
        const isAvail = AVAILABLE_DAYS.includes(d) && !isPast;
        const isSel = selectedDay === d;

        let classes = '';
        if (isSel) classes += 'selected';
        if (isPast) classes += 'past';
        if (!isAvail && !isPast) classes += 'unavailable';
        if (!isAvail) classes += ' disabled';

        const dot = isAvail && !isSel ? '<div class="dot"></div>' : '';

        daysHtml += `
            <button class="${classes}" data-day="${d}" ${!isAvail ? 'disabled' : ''}>
                ${d}
                ${dot}
            </button>
        `;
    }

    // Time slots
    let timesHtml = '';
    if (selectedDay) {
        timesHtml = `
            <div class="calendar-times">
                <h4>Horarios — ${selectedDay} de ${MONTHS_ES[month]}</h4>
                <div class="calendar-times-grid">
                    ${TIME_SLOTS.map(t => `
                        <button class="${selectedTime === t ? 'selected-time' : ''}" data-time="${t}">
                            ${t}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calendarApp.innerHTML = `
        <div class="calendar-app">
            <div class="calendar-box">
                <div class="calendar-header">
                    <button id="prevMonth">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <h3>${MONTHS_ES[month]} ${year}</h3>
                    <button id="nextMonth">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>

                <div class="calendar-weekdays">
                    ${DAYS_ES.map(d => `<span>${d}</span>`).join('')}
                </div>
                <div class="calendar-days">
                    ${daysHtml}
                </div>

                <div class="calendar-legend">
                    <div class="calendar-legend-item">
                        <span class="calendar-legend-dot available"></span>
                        Disponible
                    </div>
                    <div class="calendar-legend-item">
                        <span class="calendar-legend-dot unavailable"></span>
                        No disponible
                    </div>
                </div>

                ${timesHtml}
            </div>

            <form class="calendar-form" id="calendarForm">
                <div class="form-row">
                    <div>
                        <label>Especialidad</label>
                        <select id="formTipo">
                            ${SERVICIOS.map(s => `
                                <option value="${s.title}" ${state.tipo === s.title ? 'selected' : ''}>${s.title}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label>Modalidad</label>
                        <select id="formModalidad">
                            <option value="Presencial" ${state.modalidad === 'Presencial' ? 'selected' : ''}>Presencial</option>
                            <option value="Virtual / Telemedicina" ${state.modalidad === 'Virtual / Telemedicina' ? 'selected' : ''}>Virtual / Telemedicina</option>
                            <option value="Urgente" ${state.modalidad === 'Urgente' ? 'selected' : ''}>Urgente</option>
                            <option value="Seguimiento" ${state.modalidad === 'Seguimiento' ? 'selected' : ''}>Seguimiento</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Nombre completo *</label>
                    <input type="text" id="formNombre" placeholder="Ej: María García López" value="${state.nombre}" required />
                </div>

                <div class="form-row">
                    <div>
                        <label>Correo electrónico *</label>
                        <input type="email" id="formEmail" placeholder="correo@ejemplo.com" value="${state.email}" required />
                    </div>
                    <div>
                        <label>Teléfono / WhatsApp *</label>
                        <input type="tel" id="formTelefono" placeholder="300 000 0000" value="${state.telefono}" required />
                    </div>
                </div>

                <div>
                    <label>Motivo / Notas adicionales</label>
                    <textarea id="formNotas" placeholder="Describe brevemente el motivo de tu consulta...">${state.notas}</textarea>
                </div>

                ${(selectedDay || selectedTime) ? `
                    <div class="form-summary">
                        <p>Resumen de tu cita</p>
                        <div class="summary-item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>${state.tipo} — ${state.modalidad}</span>
                        </div>
                        ${selectedDay ? `
                            <div class="summary-item">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span>${selectedDay} de ${MONTHS_ES[month]} de ${year}</span>
                            </div>
                        ` : ''}
                        ${selectedTime ? `
                            <div class="summary-item">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>${selectedTime}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <button type="submit" class="btn-submit" ${!selectedDay || !selectedTime ? 'disabled' : ''}>
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Confirmar Cita
                </button>

                <p class="form-footnote">
                    Al agendar aceptas nuestra <span>política de privacidad</span>. Tus datos están protegidos y seguros.
                </p>
            </form>
        </div>
    `;

    // ─── Event Listeners ──────────────────────────────────────────

    // Month navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        if (state.month === 0) {
            state.month = 11;
            state.year--;
        } else {
            state.month--;
        }
        state.selectedDay = null;
        state.selectedTime = null;
        renderCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        if (state.month === 11) {
            state.month = 0;
            state.year++;
        } else {
            state.month++;
        }
        state.selectedDay = null;
        state.selectedTime = null;
        renderCalendar();
    });

    // Day selection
    document.querySelectorAll('.calendar-days button:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            state.selectedDay = parseInt(btn.dataset.day);
            state.selectedTime = null;
            renderCalendar();
        });
    });

    // Time selection
    document.querySelectorAll('.calendar-times-grid button').forEach(btn => {
        btn.addEventListener('click', () => {
            state.selectedTime = btn.dataset.time;
            renderCalendar();
        });
    });

    // Form inputs
    const formTipo = document.getElementById('formTipo');
    const formModalidad = document.getElementById('formModalidad');
    const formNombre = document.getElementById('formNombre');
    const formEmail = document.getElementById('formEmail');
    const formTelefono = document.getElementById('formTelefono');
    const formNotas = document.getElementById('formNotas');

    if (formTipo) formTipo.addEventListener('change', (e) => { state.tipo = e.target.value; renderCalendar(); });
    if (formModalidad) formModalidad.addEventListener('change', (e) => { state.modalidad = e.target.value; renderCalendar(); });
    if (formNombre) formNombre.addEventListener('input', (e) => { state.nombre = e.target.value; });
    if (formEmail) formEmail.addEventListener('input', (e) => { state.email = e.target.value; });
    if (formTelefono) formTelefono.addEventListener('input', (e) => { state.telefono = e.target.value; });
    if (formNotas) formNotas.addEventListener('input', (e) => { state.notas = e.target.value; });

    // Form submit
    const form = document.getElementById('calendarForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!state.selectedDay || !state.selectedTime) return;
            state.submitted = true;
            renderCalendar();
        });
    }
}

function renderConfirmation() {
    const { selectedDay, month, year, selectedTime, tipo, email } = state;
    calendarApp.innerHTML = `
        <div class="confirmation">
            <div class="check-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3>¡Cita confirmada!</h3>
            <p>
                Tu cita de <strong>${tipo}</strong> ha sido agendada para el 
                <strong>${selectedDay} de ${MONTHS_ES[month]} de ${year}</strong> 
                a las <strong>${selectedTime}</strong>.
            </p>
            <p class="sub-text">
                Recibirás confirmación en <strong>${email}</strong> y recordatorios antes de tu cita.
            </p>
            <button class="btn-primary" id="newAppointment">
                Agendar otra cita
            </button>
        </div>
    `;

    document.getElementById('newAppointment')?.addEventListener('click', () => {
        state.submitted = false;
        state.selectedDay = null;
        state.selectedTime = null;
        state.nombre = '';
        state.email = '';
        state.telefono = '';
        state.notas = '';
        renderCalendar();
    });
}

// ─── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────────────────

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ─── INIT ──────────────────────────────────────────────────────────────

function init() {
    initNavigation();
    initTabs();
    initFaq();
    initSmoothScroll();
    renderCalendar();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}