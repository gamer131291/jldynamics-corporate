document.addEventListener('DOMContentLoaded', () => {
    
    // ========== THEME SWITCHER ==========
    const themeBtns = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('jldynamics-theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-swatch');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('jldynamics-theme', theme);
        });
    });
    
    // ========== MENÚ HAMBURGUESA ==========
    const burgerToggle = document.getElementById('burgerToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .submenu a');

    if (burgerToggle && navMenu) {
        burgerToggle.addEventListener('click', () => {
            burgerToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========== CURSOR MAGNÉTICO ==========
    if (window.innerWidth > 992) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
            
            const interactiveElements = document.querySelectorAll('.product-btn, .cta-primary, .cta-secondary, .nav-link, .burger-menu, .theme-btn, .pillar-card, .mockup-btn');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.width = '24px';
                    cursor.style.height = '24px';
                    cursor.style.backgroundColor = 'transparent';
                    cursor.style.border = '2px solid var(--primary)';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.width = '8px';
                    cursor.style.height = '8px';
                    cursor.style.backgroundColor = 'var(--primary)';
                    cursor.style.border = 'none';
                });
            });
        }
    }
    
    // ========== TILT 3D EN PILARES ==========
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 20;
            const angleY = (x - xc) / 20;
            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // ========== DEMO MOCKUP INTERACTIVO ==========
    let demoSeconds = 360;
    let demoInterval = null;
    let demoRunning = false;
    
    const demoTimer = document.getElementById('demo-timer');
    const demoPlay = document.querySelector('.demo-play');
    const demoPause = document.querySelector('.demo-pause');
    const demoReset = document.querySelector('.demo-reset');
    
    function updateDemoDisplay() {
        if (demoTimer) {
            const mins = Math.floor(demoSeconds / 60);
            const secs = demoSeconds % 60;
            demoTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    function startDemoTimer() {
        if (demoInterval) clearInterval(demoInterval);
        demoRunning = true;
        demoInterval = setInterval(() => {
            if (demoSeconds > 0) {
                demoSeconds--;
                updateDemoDisplay();
            } else {
                clearInterval(demoInterval);
                demoRunning = false;
                if (demoReset) demoReset.click();
            }
        }, 1000);
    }
    
    if (demoPlay) {
        demoPlay.addEventListener('click', () => {
            if (!demoRunning) startDemoTimer();
        });
    }
    
    if (demoPause) {
        demoPause.addEventListener('click', () => {
            if (demoInterval) clearInterval(demoInterval);
            demoRunning = false;
        });
    }
    
    if (demoReset) {
        demoReset.addEventListener('click', () => {
            if (demoInterval) clearInterval(demoInterval);
            demoRunning = false;
            demoSeconds = 360;
            updateDemoDisplay();
        });
    }
    
    updateDemoDisplay();
    
    // ========== MODAL TIMER ==========
    const modal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('closeTimerModalBtn');
    
    let timerInterval = null;
    let timerSeconds = 10;
    let timerState = 'PREPARACIÓN';
    let isTimerRunning = false;
    
    function playBuzzer(frequency, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) { console.log("Audio context blocked"); }
    }
    
    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateModalUI() {
        const display = document.getElementById('modalTimerDisplay');
        const label = document.getElementById('timerStatusLabel');
        if (display && label) {
            display.textContent = formatTime(timerSeconds);
            label.textContent = timerState;
            label.style.color = timerState === 'PREPARACIÓN' ? '#FFB300' : '#00E5FF';
        }
    }
    
    function startModalTimer() {
        if (isTimerRunning) return;
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateModalUI();
            } else {
                if (timerState === 'PREPARACIÓN') {
                    playBuzzer(600, 0.8);
                    timerState = 'LUCHA';
                    timerSeconds = 300;
                    updateModalUI();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    playBuzzer(800, 1);
                }
            }
        }, 1000);
    }
    
    function pauseModalTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
    
    function resetModalTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerState = 'PREPARACIÓN';
        timerSeconds = 10;
        updateModalUI();
    }
    
    function attachModalListeners() {
        document.getElementById('timerPlayBtn')?.addEventListener('click', startModalTimer);
        document.getElementById('timerPauseBtn')?.addEventListener('click', pauseModalTimer);
        document.getElementById('timerResetBtn')?.addEventListener('click', resetModalTimer);
        resetModalTimer();
    }
    
    function loadContent(productId) {
        const modalBody = modal.querySelector('.modal-body');
        const modalTitle = modal.querySelector('.modal-header h2');
        
        if (productId === 'bjj') {
            modalTitle.innerHTML = 'Simulador Web: <span>BJJ Timer Pro</span>';
            modalBody.innerHTML = `
                <div class="demo-mockup-modal">
                    <div class="mockup-header-modal">
                        <span>JLDYNAMICS</span>
                        <span>TATAMI DIGITAL</span>
                    </div>
                    <div class="mockup-timer-modal">
                        <div id="timerStatusLabel" class="timer-status-text">PREPARACIÓN</div>
                        <div id="modalTimerDisplay" class="timer-number-modal">00:10</div>
                        <div class="timer-controls-modal">
                            <button id="timerPlayBtn" class="modal-timer-btn">▶</button>
                            <button id="timerPauseBtn" class="modal-timer-btn">⏸</button>
                            <button id="timerResetBtn" class="modal-timer-btn">⟳</button>
                        </div>
                    </div>
                </div>
                <div class="modal-info-text">
                    <p>💡 <strong>BJJ Timer Pro - Modo Gladiadores</strong><br>
                    Timer profesional con sistema de retos P2P. Personalización completa: logo de academia, colores institucionales y ranking ELO interno.</p>
                    <p style="margin-top: 1rem;">📱 Versión completa disponible en Flutter con integración QR y Firebase.</p>
                </div>
            `;
            attachModalListeners();
        } else if (productId === 'fintech') {
            modalTitle.innerHTML = 'Paga tus Deudas';
            modalBody.innerHTML = `
                <div class="modal-info-text">
                    <p>💰 <strong>Método Bola de Nieve</strong><br>
                    Algoritmo inteligente de liquidación de pasivos. Optimiza tus pagos y proyecta tu libertad financiera.</p>
                    <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 16px; padding: 1rem;">
                        <p>📊 Análisis de flujo de caja</p>
                        <p>⚡ Optimización automática de pagos</p>
                        <p>🔒 Datos encriptados</p>
                    </div>
                    <p style="margin-top: 1rem;">📱 Consulta disponibilidad para tu negocio.</p>
                </div>
            `;
        } else {
            modalTitle.innerHTML = 'Tutor al Mando';
            modalBody.innerHTML = `
                <div class="modal-info-text">
                    <p>🛡️ <strong>Control Parental Integral</strong><br>
                    Protección activa para entornos digitales. Gestiona tiempo de pantalla y filtra contenido inapropiado.</p>
                    <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 16px; padding: 1rem;">
                        <p>⏱️ Gestión de tiempo de pantalla</p>
                        <p>🔞 Filtrado de contenido</p>
                        <p>📱 Monitoreo remoto</p>
                    </div>
                    <p style="margin-top: 1rem;">🪟 Disponible: Windows · Android · iOS</p>
                </div>
            `;
        }
    }
    
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.product-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const productId = card.getAttribute('data-product') || 'bjj';
                loadContent(productId);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            pauseModalTimer();
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            pauseModalTimer();
        }
    });
    
    // ========== ANIMACIONES SCROLL ==========
    const animatedElements = document.querySelectorAll('.pillar-card, .product-card, .mv-card');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    if (window.innerWidth <= 768) {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
    
    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('.smooth-link, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    console.log('🚀 JLDynamics - Plataforma Corporativa Cargada ✅');
});