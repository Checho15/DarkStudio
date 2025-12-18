document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. VARIABLES GLOBALES
    // ==========================================================
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');

    // Variables de la Cookie/Modal
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptButtonBanner = document.getElementById('acceptCookies');
    const openModalButton = document.getElementById('openTermsModal');
    const termsModal = document.getElementById('termsModal');
    const closeModalButton = document.getElementById('closeModal');
    const termsScrollArea = document.querySelector('.terms-scroll-area');
    const acceptButtonFinal = document.getElementById('acceptTermsFinal');
    const COOKIE_KEY = 'cookiesAccepted';

    // Variables del Sidebar
    const menuToggleButton = document.getElementById('menuToggle');
    const closeSidebarButton = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    // Variables de Navegación y Blog (CORREGIDO)
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const homeContent = document.getElementById('home-content');
    const blogContent = document.getElementById('blog-content');  
    const articleView = document.getElementById('article-view');  
    const backToBlogButton = document.getElementById('backToBlog');  
    const blogGridContainer = document.getElementById('blogGridContainer');

    // Template de la tarjeta del blog
    const blogCardTemplate = document.getElementById('blogCardTemplate');

    // >>> VARIABLES DEL FORMULARIO DE SUGERENCIAS <<<
    const suggestionForm = document.getElementById('suggestionForm');
    const suggestionInput = document.getElementById('suggestionInput');
    const suggestionMessage = document.getElementById('suggestionMessage');  

    // URL del servidor donde se ejecutará el Node.js/Bot (CORREGIDO)
    // *** USAMOS LOCALHOST:3000 PARA PRUEBAS EN PC ***
    const BOT_SERVER_URL = 'https://darkbots-production.up.railway.app/sugerencia';  

    // 💡 NOTA: La variable 'blogArticles' se carga desde 'blog-data.js'


    // ==========================================================
    // 2. FUNCIONES DE RENDERING Y PARSEO
    // ==========================================================

    /**
     * Función para manejar el formato simple: (CORREGIDO)
     * - Reemplaza **Texto** con <b>Texto</b>
     */
    function parseContent(content) {
        if (!content) return '';
        // 1. Reemplaza **Texto** con <b>Texto</b>
        let parsed = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        return parsed;
    }

    // Función para generar las tarjetas del blog a partir de los datos (blogArticles) (CORREGIDO)
    function renderBlogCards() {
        if (!blogGridContainer || typeof blogArticles === 'undefined' || !blogCardTemplate) {
            console.error("Error: Elementos de blog esenciales no están disponibles."); // CORREGIDO
            return;
        }
        
        blogGridContainer.innerHTML = '';
        
        blogArticles.forEach(article => {
            const cardClone = document.importNode(blogCardTemplate.content, true);
            const card = cardClone.querySelector('.blog-card');
            
            card.setAttribute('data-article-id', article.id);
            card.querySelector('.card-title').innerHTML = `${article.icon} ${article.title}`;
            card.querySelector('.card-subtitle').textContent = article.subtitle;
            card.querySelector('.card-description').textContent = article.description_short;
            
            blogGridContainer.appendChild(cardClone);
        });
        
        attachBlogCardListeners();
    }

    // Adjuntar los listeners de clic a las tarjetas recién creadas (CORREGIDO)
    function attachBlogCardListeners() {
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const articleId = card.getAttribute('data-article-id');
                openArticle(articleId);
            });
        });
    }
    
    // ==========================================================
    // 3. LÓGICA DEL PRELOADER (CORREGIDO)
    // ==========================================================
    
    let progress = 0;
    const totalDuration = 3000;
    const intervalTime = 100;
    const totalSteps = totalDuration / intervalTime;
    const increment = 100 / totalSteps;  

    const loadingInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
        }
        
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                preloader.classList.add('fade-out');
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    renderBlogCards(); // <--- RENDERIZAR BLOG AL CARGAR
                    showCookieBannerIfNecessary();
                    
                }, 1000);  
            }, 100);  
        }
    }, intervalTime);


    // ==========================================================
    // 4. FUNCIONES DE COOKIES/MODAL
    // ==========================================================

    function saveAndHideCookieBanner() {
        localStorage.setItem(COOKIE_KEY, 'true');
        
        cookieBanner.style.opacity = '0';
        setTimeout(() => {
            cookieBanner.classList.add('hidden-cookie');
        }, 500);

        termsModal.classList.add('hidden-modal');
    }

    function showCookieBannerIfNecessary() {
        const hasAccepted = localStorage.getItem(COOKIE_KEY);
        
        if (!hasAccepted) {
            setTimeout(() => {
                cookieBanner.classList.remove('hidden-cookie');
            }, 500);  
        }
    }


    // ==========================================================
    // 5. LÓGICA DE NAVEGACIÓN Y BLOG (CORREGIDO)
    // ==========================================================

    function showSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('show-content');
            section.classList.add('hidden-content');
        });
        
        articleView.classList.add('hidden-content');

        let targetSection = document.getElementById(targetId + '-content');
        if (targetSection) {
            targetSection.classList.remove('hidden-content');
            targetSection.classList.add('show-content');
        } else {
            homeContent.classList.remove('hidden-content');
            homeContent.classList.add('show-content');
        }
        
        window.scrollTo(0, 0);  
    }

    // ABRIR ARTÍCULO (CORREGIDO)
    function openArticle(articleId) {
        const articleData = blogArticles.find(a => a.id === articleId);
        if (!articleData) return;

        blogContent.classList.add('hidden-content');
        blogContent.classList.remove('show-content');
        
        articleView.classList.remove('hidden-content');
        articleView.classList.add('show-content');

        document.getElementById('article-title').textContent = articleData.title;  
        document.getElementById('article-subtitle').textContent = articleData.subtitle;
        document.getElementById('article-body').innerHTML = parseContent(articleData.content);
        
        window.scrollTo(0, 0);  
    }

    // REGRESAR AL GRID DE BLOGS
    function backToBlogGrid() {
        articleView.classList.add('hidden-content');
        articleView.classList.remove('show-content');
        blogContent.classList.remove('hidden-content');
        blogContent.classList.add('show-content');
        
        document.getElementById('blog-content').scrollIntoView();
    }


    // ==========================================================
    // 6. FUNCIÓN REAL: MANEJAR ENVÍO DE SUGERENCIAS AL SERVIDOR BOT (CORREGIDO)
    // ==========================================================
    
    async function sendSuggestionToDiscord(suggestionText) {
        
        try {
            const response = await fetch(BOT_SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  
                    text: suggestionText
                })
            });

            // Si el servidor Node.js no está corriendo, la función fetch fallará antes de este punto (CORREGIDO)
            const data = await response.json();
            
            return data.status === 'success';  

        } catch (error) {
            // Este catch es crítico si el servidor Node.js está apagado o hay un error de red (CORREGIDO)
            console.error('Error de red/conexión con el servidor bot (¿Node.js está corriendo?):', error);
            return false;
        }
    }
    
    // Handler principal del formulario
    async function handleSuggestionSubmit(e) {
        e.preventDefault();
        
        const suggestionText = suggestionInput.value.trim();
        suggestionMessage.textContent = '';  
        
        if (suggestionText.length < 10) {
            // CORREGIDO: Tildes y símbolos
            suggestionMessage.textContent = '❌ Por favor, escribe una sugerencia más detallada (mínimo 10 caracteres).';
            suggestionMessage.style.color = '#e74c3c';
            return;
        }
        
        // Comprobación rápida del servidor (no exhaustiva, pero útil para local) (CORREGIDO)
        if (BOT_SERVER_URL.startsWith('http://localhost') && !suggestionInput.disabled) {
            suggestionMessage.textContent = 'Verificando servidor local...';
            suggestionMessage.style.color = '#f39c12';
        }


        suggestionInput.disabled = true;
        suggestionForm.querySelector('button').disabled = true;
        // CORREGIDO: Tildes
        suggestionMessage.textContent = '... Enviando sugerencia. Por favor, espera...';
        suggestionMessage.style.color = '#f39c12';
        
        const success = await sendSuggestionToDiscord(suggestionText);
        
        if (success) {
            // CORREGIDO: Tildes y símbolos
            suggestionMessage.textContent = '✅ ¡Sugerencia enviada con éxito! Gracias por tu contribución.';
            suggestionMessage.style.color = '#2ecc71';
            suggestionInput.value = '';  
        } else {
            // CORREGIDO: Tildes y símbolos
            suggestionMessage.textContent = '❌ Error al enviar la sugerencia. Asegúrate de que el bot esté encendido en la terminal.';
            suggestionMessage.style.color = '#e74c3c';
        }
        
        suggestionInput.disabled = false;
        suggestionForm.querySelector('button').disabled = false;
    }


    // ==========================================================
    // 7. LISTENERS DE EVENTOS (Activación) (CORREGIDO)
    // ==========================================================

    // Listeners de Cookies/Modal, Sidebar, Navegación... (iguales) (CORREGIDO)
    acceptButtonBanner.addEventListener('click', saveAndHideCookieBanner);
    openModalButton.addEventListener('click', () => {
        termsModal.classList.remove('hidden-modal');
        acceptButtonFinal.disabled = true;  
        termsScrollArea.scrollTop = 0;
    });
    closeModalButton.addEventListener('click', () => {
        termsModal.classList.add('hidden-modal');
    });
    termsScrollArea.addEventListener('scroll', () => {
        if (termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 5) {  
            acceptButtonFinal.disabled = false;
        }  
    });
    acceptButtonFinal.addEventListener('click', saveAndHideCookieBanner);

    menuToggleButton.addEventListener('click', () => {
        sidebar.classList.remove('hidden-sidebar');
        setTimeout(() => {
            sidebar.classList.add('show');
        }, 10);
    });
    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('show');
        setTimeout(() => {
            sidebar.classList.add('hidden-sidebar');
        }, 400);  
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            sidebar.classList.remove('show');
            setTimeout(() => {
                sidebar.classList.add('hidden-sidebar');
            }, 400);  

            const targetId = link.getAttribute('href').substring(1);  
            showSection(targetId);
        });
    });

    // Listener para el formulario de sugerencias
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionSubmit);
    }

    // Listener para REGRESAR (Botón de flecha) (CORREGIDO)
    backToBlogButton.addEventListener('click', backToBlogGrid);
});



