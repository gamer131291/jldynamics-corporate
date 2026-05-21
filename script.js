document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración inicial del tema por defecto
    document.documentElement.setAttribute('data-theme', 'default');
    
    // ========== MENÚ HAMBURGUESA RESPONSIVO ==========
    const burgerToggle = document.getElementById('burgerToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerToggle && navMenu) {
        burgerToggle.addEventListener('click', () => {
            burgerToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Bloquear scroll del cuerpo cuando el menú esté abierto en móvil
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========== CURSOR MAGNÉTICO (Solo Desktop) ==========
    if (window.innerWidth > 768) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
            
            const interactiveElements = document.querySelectorAll('.product-btn, .theme-btn, .pillar-card, .modal-close, .demo-cta, .nav-link, .burger-menu');
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
    
    // ========== THEME SWITCHER ==========
    const swatches = document.querySelectorAll('.theme-btn');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const selectedTheme = e.currentTarget.getAttribute('data-swatch');
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('jldynamics-theme', selectedTheme);
        });
    });
    
    const savedTheme = localStorage.getItem('jldynamics-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // ========== TILT 3D EN TARJETAS POR COORDENADAS ==========
    const cards = document.querySelectorAll('.pillar-card, .service-item-card');
    cards.forEach(card => {
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
    
    // ========== CONTROLADORES DE MODALES Y DINÁMICAS DE PRODUCTO ==========
    const modal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('closeTimerModalBtn');
    
    // Variables globales para la instancia del simulador interactivo
    let timerInterval = null;
    let timerSeconds = 10; 
    let timerState = 'PREPARACIÓN'; // Estados: PREPARACIÓN -> LUCHA -> PAUSA
    let isTimerRunning = false;

    // Generador acústico nativo mediante Web Audio API para simular la campana del tatami
    function playBuzzerSound(frequency, duration) {
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
        } catch (e) {
            console.log("AudioContext bloqueado por políticas del navegador hasta interacción.");
        }
    }

    function formatTimeDisplay(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateSimulatorUI() {
        const display = document.getElementById('modalTimerDisplay');
        const label = document.getElementById('timerStatusLabel');
        
        if (display && label) {
            display.textContent = formatTimeDisplay(timerSeconds);
            label.textContent = timerState;
            
            // Control visual cromático por estados del combate
            if (timerState === 'PREPARACIÓN') {
                label.style.color = '#FFB300'; // Ámbar técnico
                display.style.color = '#FFF';
            } else if (timerState === 'LUCHA') {
                label.style.color = '#00E5FF'; // Cyan dinámico
                display.style.color = '#00E5FF';
            } else if (timerState === 'FINALIZADO') {
                label.style.color = '#FF3D00'; // Rojo de detención
                display.style.color = '#FF3D00';
            }
        }
    }

    function startTimerLogic() {
        if (isTimerRunning) return;
        isTimerRunning = true;
        
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateSimulatorUI();
            } else {
                // Transición lógica entre ciclos de entrenamiento
                if (timerState === 'PREPARACIÓN') {
                    playBuzzerSound(600, 0.8); // Pitido de inicio de lucha
                    timerState = 'LUCHA';
                    timerSeconds = 300; // Round estándar de 5 minutos
                    updateSimulatorUI();
                } else if (timerState === 'LUCHA') {
                    playBuzzerSound(400, 1.5); // Pitido largo de finalización
                    timerState = 'FINALIZADO';
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    updateSimulatorUI();
                }
            }
        }, 1000);
    }

    function pauseTimerLogic() {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }

    function resetTimerLogic() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerState = 'PREPARACIÓN';
        timerSeconds = 10;
        updateSimulatorUI();
    }

    // Inicializar listeners del simulador dentro de la ventana modal
    function attachSimulatorListeners() {
        const playBtn = document.getElementById('timerPlayBtn');
        const pauseBtn = document.getElementById('timerPauseBtn');
        const resetBtn = document.getElementById('timerResetBtn');

        if (playBtn) playBtn.addEventListener('click', startTimerLogic);
        if (pauseBtn) pauseBtn.addEventListener('click', pauseTimerLogic);
        if (resetBtn) resetBtn.addEventListener('click', resetTimerLogic);
        
        resetTimerLogic(); // Setear valores iniciales limpios
    }

    // Inyección de plantillas dinámicas según el producto seleccionado
    function loadProductContent(productId) {
        const modalBody = modal.querySelector('.modal-body');
        const modalTitle = modal.querySelector('.modal-header h2');

        if (productId === 'bjj') {
            modalTitle.innerHTML = 'Simulador Web: <span class="highlight">BJJ Timer Pro</span>';
            modalBody.innerHTML = `
                <div class="demo-mockup-modal">
                    <div class="mockup-header-modal">
                        <img src="assets/logo.png" alt="JLDynamics" class="mockup-logo-modal" width="30">
                        <span class="mockup-academy-name-modal">ACADEMIA DE PRUEBA</span>
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
                    <div class="mockup-footer-modal">
                        <span class="mockup-brand-modal">DISEÑO EXCLUSIVO DE JLDYNAMICS</span>
                    </div>
                </div>
                <div class="modal-info-text">
                    <p>💡 <strong>Esencia del Producto:</strong> Esta es una versión web simplificada del núcleo de nuestra app. En la versión de producción para Android/iOS con Flutter, el administrador de la academia puede cambiar los logotipos internos, esquemas de color Hex y activar el emparejamiento directo del <strong>Modo Gladiadores</strong> mediante lectura instantánea de códigos QR.</p>
                </div>
            `;
            attachSimulatorListeners();
        } else if (productId === 'fintech') {
            modalTitle.innerHTML = 'Consola Analítica: <span class="highlight">Paga tus Deudas</span>';
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem;">📊</div>
                    <p style="color: #B0B0B8; margin-bottom: 1.5rem; font-size: 0.95rem;">Motor de optimización financiera basado en la metodología <strong>Snowball (Bola de Nieve)</strong>.</p>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 20px; padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
                        <h4 style="color: var(--primary); margin-bottom: 0.8rem; font-size: 1rem;">Características del Núcleo Lógico:</h4>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Clasificación automática de pasivos por saldo remanente.</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Algoritmo de inyección de aceleración sobre la deuda menor.</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Proyección analítica estricta de curvas de libertad financiera.</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Criptografía de extremo a extremo para protección de registros.</p>
                    </div>
                    <a href="https://wa.me/593958652500?text=Hola%20JLDynamics,%20deseo%20una%20consultoría%20sobre%20la%20app%20Paga%20tus%20Deudas" target="_blank" class="product-btn demo-btn" style="display: inline-block; text-decoration: none; max-width: 280px;">🎯 Agendar Consultoría de Implementación</a>
                </div>
            `;
        } else if (productId === 'edtech') {
            modalTitle.innerHTML = 'Infraestructura Corporativa: <span class="highlight">Tutor al Mando</span>';
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛡️</div>
                    <p style="color: #B0B0B8; margin-bottom: 1.5rem; font-size: 0.95rem;">Ecosistema multiplataforma de control parental robusto, monitoreo activo y telemetría de red.</p>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 20px; padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
                        <h4 style="color: var(--primary); margin-bottom: 0.8rem; font-size: 1rem;">Componentes de Seguridad Integrados:</h4>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Mapeo dinámico y bloqueo de peticiones maliciosas mediante DNS.</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Cuotas estrictas de tiempo operativo por hardware (Windows/Android).</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Alertas en tiempo real integradas a consolas centrales de mensajería.</p>
                        <p style="font-size: 0.85rem; color: #D0D0D8; margin: 0.4rem 0;">✓ Telemetría silenciosa optimizada para bajo consumo de batería.</p>
                    </div>
                    <a href="https://wa.me/593958652500?text=Hola%20JLDynamics,%20deseo%20detalles%20de%20la%20arquitectura%20Tutor%20al%20Mando" target="_blank" class="product-btn demo-btn" style="display: inline-block; text-decoration: none; max-width: 280px;">🎯 Solicitar Análisis de Entorno</a>
                </div>
            `;
        }
    }

    // Delegación y asignación de eventos para las tarjetas del catálogo de productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const actionBtn = card.querySelector('.product-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetProduct = card.getAttribute('data-product') || 'bjj';
                loadProductContent(targetProduct);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });
    
    // Gestión de cierre de ventanas modales
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            pauseTimerLogic(); // Interrumpir hilos en ejecución al salir
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                pauseTimerLogic();
            }
        });
    }
    
    // ========== INTERSECTION OBSERVER PARA ANIMACIONES DE SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedSections = document.querySelectorAll('.pillars-section, .corporate-info-section, .services-section, .customization-demo, .ecosystem-section, .sponsorship-section, .careers-section');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(25px)';
        section.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
        scrollObserver.observe(section);
    });
    
    // Forzar renderizado estático inmediato si el dispositivo es móvil para optimizar hardware
    if (window.innerWidth <= 768) {
        animatedSections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }
    
    console.log('🚀 JLDynamics Corporate v2.0 - Despliegue de producción completado.');
});
