document.addEventListener('DOMContentLoaded', () => {
    
    document.documentElement.setAttribute('data-theme', 'default');
    
    // Cursor magnético (solo desktop)
    if (window.innerWidth > 768) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        });
        
        const interactiveElements = document.querySelectorAll('.product-btn, .theme-btn, .pillar-card, .modal-close');
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
    
    // Theme Switcher con localStorage
    const swatches = document.querySelectorAll('.theme-btn');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const selectedTheme = e.currentTarget.getAttribute('data-swatch');
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('jldynamics-theme', selectedTheme);
        });
    });
    
    const savedTheme = localStorage.getItem('jldynamics-theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Tilt 3D en tarjetas
    const cards = document.querySelectorAll('.pillar-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 15;
            const angleY = (x - xc) / 15;
            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Modal y contenido de productos
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    function renderBJTTimer() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">BJJ Timer Pro</h3>
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem;">
                    <div style="font-size: 4rem; font-weight: 800; margin-bottom: 1rem;">06:00</div>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button class="product-btn" style="padding: 8px 20px;">▶ Iniciar</button>
                        <button class="product-btn" style="padding: 8px 20px;">⏸ Pausa</button>
                        <button class="product-btn" style="padding: 8px 20px;">⟳ Reiniciar</button>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
                        <span style="background: rgba(0,229,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">Combate (5min)</span>
                        <span style="background: rgba(112,0,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">Entrenamiento (3min)</span>
                    </div>
                </div>
                <p style="margin-top: 1rem; font-size: 0.8rem;">✨ Versión completa disponible en la app móvil</p>
            </div>
        `;
    }
    
    function renderFintechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Paga tus Deudas</h3>
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem;">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">💰</p>
                    <p><strong>Método Bola de Nieve</strong></p>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">Liquidación inteligente de pasivos</p>
                    <div style="margin-top: 1.5rem; text-align: left;">
                        <p>📊 Análisis de flujo de caja</p>
                        <p>⚡ Optimización de pagos</p>
                        <p>🔒 Datos encriptados</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderEdTechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Tutor al Mando</h3>
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem;">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">🛡️</p>
                    <p><strong>Control parental y protección activa</strong></p>
                    <div style="margin-top: 1.5rem; text-align: left;">
                        <p>⏱️ Gestión de tiempo de pantalla</p>
                        <p>🔞 Filtrado de contenido</p>
                        <p>📱 Monitoreo remoto</p>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.8rem;">Disponible: Windows · Android · iOS</p>
                </div>
            </div>
        `;
    }
    
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = btn.closest('.product-card');
            const product = productCard?.getAttribute('data-product') || 'bjj';
            
            if (product === 'bjj') {
                modalTitle.textContent = 'BJJ Timer Pro';
                renderBJTTimer();
            } else if (product === 'fintech') {
                modalTitle.textContent = 'Paga tus Deudas';
                renderFintechDemo();
            } else {
                modalTitle.textContent = 'Tutor al Mando';
                renderEdTechDemo();
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('🚀 JLDynamics Corporate - Plataforma cargada correctamente');
});
