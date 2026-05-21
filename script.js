document.addEventListener('DOMContentLoaded', () => {
    
    // ========== MENÚ HAMBURGUESA RESPONSIVO ==========
    const burgerToggle = document.getElementById('burgerToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerToggle && navMenu) {
        burgerToggle.addEventListener('click', () => {
            burgerToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Bloquear scroll del cuerpo cuando el menú esté abierto
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
    
    // ========== CURSOR MAGNÉTICO (Desktop) ==========
    if (window.innerWidth > 992) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
            
            const interactiveElements = document.querySelectorAll('.product-btn, .cta-primary, .nav-link, .burger-menu');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    cursor.style.backgroundColor = 'transparent';
                    cursor.style.border = '1px solid var(--primary)';
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
    
    // ========== CONTROLADORES DEL SIMULADOR DEL MODAL ==========
    const modal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('closeTimerModalBtn');
    
    let timerInterval = null;
    let timerSeconds = 10; 
    let timerState = 'PREPARACIÓN'; // Estados: PREPARACIÓN -> LUCHA -> PAUSA
    let isTimerRunning = false;

    // Sonido acústico nativo (campana tatami)
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
        } catch (e) { console.log("Audio contexts blocked."); }
    }

    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateUI() {
        const display = document.getElementById('modalTimerDisplay');
        const label = document.getElementById('timerStatusLabel');
        if (display && label) {
            display.textContent = formatTime(timerSeconds);
            label.textContent = timerState;
            // Control cromático por estados
            if (timerState === 'PREPARACIÓN') { label.style.color = '#FFB300'; display.style.color = '#FFF'; }
            else if (timerState === 'LUCHA') { label.style.color = '#00E5FF'; display.style.color = '#00E5FF'; }
        }
    }

    function startTimer() {
        if (isTimerRunning) return;
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateUI();
            } else {
                if (timerState === 'PREPARACIÓN') {
                    playBuzzer(600, 0.8);
                    timerState = 'LUCHA';
                    timerSeconds = 300; // Round 5min
                    updateUI();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                }
            }
        }, 1000);
    }

    function pauseTimer() { clearInterval(timerInterval); isTimerRunning = false; }
    function resetTimer() { clearInterval(timerInterval); isTimerRunning = false; timerState = 'PREPARACIÓN'; timerSeconds = 10; updateUI(); }

    function attachListeners() {
        document.getElementById('timerPlayBtn')?.addEventListener('click', startTimer);
        document.getElementById('timerPauseBtn')?.addEventListener('click', pauseTimer);
        document.getElementById('timerResetBtn')?.addEventListener('click', resetTimer);
        resetTimer(); // Set inicial
    }

    function loadContent(productId) {
        const modalBody = modal.querySelector('.modal-body');
        const modalTitle = modal.querySelector('.modal-header h2');

        if (productId === 'bjj') {
            modalTitle.innerHTML = 'Simulador Web: <span>BJJ Timer Pro</span>';
            modalBody.innerHTML = `
                <div class="demo-mockup-modal">
                    <div class="mockup-header-modal"><span>JLDYNAMICS</span><span>TATAMI DIGITAL</span></div>
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
                    <p>💡 <strong>Esencia:</strong> Esta es una versión web simplificada del núcleo. En producción con Flutter, el administrador cambia logos Hex y activa el emparejamiento <strong>Modo Gladiadores</strong> vía QR.</p>
                </div>
            `;
            attachListeners();
        } else {
            modalTitle.textContent = productId === 'fintech' ? 'Paga tus Deudas' : 'Tutor al Mando';
            modalBody.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center;">Infraestructura lógica integrada en base de datos segura y Flutter. Dirección de consulta activa.</p>`;
        }
    }

    document.querySelectorAll('.product-card').forEach(card => {
        card.querySelector('.product-btn')?.addEventListener('click', () => {
            loadContent(card.getAttribute('data-product'));
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalCloseBtn?.addEventListener('click', () => { modal.classList.remove('active'); document.body.style.overflow = ''; pauseTimer(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; pauseTimer(); } });
});
