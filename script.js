document.addEventListener('DOMContentLoaded', () => {
    
    // ========== MENÚ HAMBURGUESA RESPONSIVO ==========
    const burgerToggle = document.getElementById('burgerToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerToggle && navMenu) {
        burgerToggle.addEventListener('click', () => {
            burgerToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========== CURSOR MAGNÉTICO (Desktop) ==========
    if (window.innerWidth > 768) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
        }
    }
    
    // ========== CONTROLADORES DEL SIMULADOR DEL MODAL ==========
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
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) { console.log("Audio block."); }
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
                    timerSeconds = 300;
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
        resetTimer();
    }

    function loadContent(id) {
        const body = modal.querySelector('.modal-body');
        const title = modal.querySelector('.modal-header h2');
        if (id === 'bjj') {
            title.innerHTML = 'Simulador: <span>BJJ Timer Pro</span>';
            body.innerHTML = `
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
                </div>`;
            attachListeners();
        } else {
            title.innerHTML = id === 'fintech' ? 'Paga tus Deudas' : 'Tutor al Mando';
            body.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center;">Infraestructura lógica integrada en base de datos segura y Flutter. Dirección de consulta activa.</p>`;
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
});
