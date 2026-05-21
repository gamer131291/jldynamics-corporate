document.addEventListener('DOMContentLoaded', () => {
    
    document.documentElement.setAttribute('data-theme', 'default');
    
    // ========== CURSOR MAGNÉTICO (solo desktop) ==========
    if (window.innerWidth > 768) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
            
            const interactiveElements = document.querySelectorAll('.product-btn, .theme-btn, .pillar-card, .modal-close, .demo-cta');
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
    
    // ========== TILT 3D EN TARJETAS ==========
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
    
    // ========== MODAL Y CONTENIDO ==========
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    function renderBJTTimer() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">⚔️ BJJ Timer Pro ⚔️</h3>
                <p style="margin-bottom: 1.5rem;">La plataforma todo-en-uno para academias de Jiu Jitsu</p>
                
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem; margin-bottom: 1.5rem;">
                    <div style="font-size: 4rem; font-weight: 800; margin-bottom: 1rem;">06:00</div>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button class="product-btn" style="width: auto; padding: 10px 24px;">▶ Iniciar</button>
                        <button class="product-btn" style="width: auto; padding: 10px 24px;">⏸ Pausa</button>
                        <button class="product-btn" style="width: auto; padding: 10px 24px;">⟳ Reiniciar</button>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                        <span style="background: rgba(0,229,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">⚔️ Combate (5min)</span>
                        <span style="background: rgba(112,0,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">🥋 Entrenamiento (3min)</span>
                        <span style="background: rgba(0,229,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">🎯 Personalizado</span>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: var(--primary);">🎨 Personalización para Academias</h4>
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">✓ Logo de academia en splash screen y timer</p>
                    <p style="font-size: 0.85rem;">✓ Colores institucionales personalizados</p>
                    <p style="font-size: 0.85rem;">✓ Ranking interno con puntuación ELO</p>
                    <p style="font-size: 0.85rem;">✓ Sistema de retos P2P con código QR</p>
                </div>
                
                <a href="https://wa.me/593958652500" target="_blank" class="product-btn" style="display: inline-block; text-decoration: none; background: linear-gradient(135deg, #25D366, #128C7E); border: none; color: white; margin-top: 0.5rem;">📱 Solicitar Demo para mi Academia</a>
            </div>
        `;
    }
    
    function renderFintechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">💰 Paga tus Deudas</h3>
                <p>Sistema inteligente de liquidación de pasivos</p>
                
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem; margin: 1.5rem 0;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <h4 style="color: var(--primary);">Método Bola de Nieve</h4>
                    <p style="margin-top: 1rem;">Paga las deudas más pequeñas primero para generar momentum</p>
                    
                    <div style="margin-top: 1.5rem; text-align: left; max-width: 300px; margin-left: auto; margin-right: auto;">
                        <p>✓ Análisis de flujo de caja</p>
                        <p>✓ Optimización automática de pagos</p>
                        <p>✓ Proyección de libertad financiera</p>
                        <p>✓ Datos encriptados</p>
                    </div>
                </div>
                
                <a href="https://wa.me/593958652500" target="_blank" class="product-btn" style="display: inline-block; text-decoration: none; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; color: var(--bg-dark); font-weight: 800;">📱 Consultar Disponibilidad</a>
            </div>
        `;
    }
    
    function renderEdTechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">🛡️ Tutor al Mando</h3>
                <p>Control parental integral y protección activa</p>
                
                <div style="background: rgba(255,255,255,0.03); border-radius: 24px; padding: 2rem; margin: 1.5rem 0;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍👩‍👧‍👦</div>
                    <h4 style="color: var(--primary);">Protección Digital para tu Familia</h4>
                    
                    <div style="margin-top: 1.5rem; text-align: left; max-width: 300px; margin-left: auto; margin-right: auto;">
                        <p>✓ Filtrado de contenido inapropiado</p>
                        <p>✓ Gestión de tiempo de pantalla</p>
                        <p>✓ Monitoreo remoto</p>
                        <p>✓ Reportes de actividad</p>
                        <p>✓ Multiplataforma: Windows, Android, iOS</p>
                    </div>
                </div>
                
                <a href="https://wa.me/593958652500" target="_blank" class="product-btn" style="display: inline-block; text-decoration: none; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; color: var(--bg-dark); font-weight: 800;">📱 Solicitar Información</a>
            </div>
        `;
    }
    
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = btn.closest('.product-card');
            let product = 'bjj';
            
            if (productCard) {
                const productAttr = productCard.getAttribute('data-product');
                if (productAttr) product = productAttr;
            }
            
            if (product === 'bjj') {
                modalTitle.textContent = 'BJJ Timer Pro';
                renderBJTTimer();
            } else if (product === 'fintech') {
                modalTitle.textContent = 'Paga tus Deudas';
                renderFintechDemo();
            } else if (product === 'edtech') {
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
    
    // ========== ANIMACIONES SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('.pillars-section, .customization-demo, .ecosystem-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    if (window.innerWidth <= 768) {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }
    
    console.log('🚀 JLDynamics Corporate - Plataforma cargada correctamente');
});