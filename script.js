document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. VARIABLES GLOBALES (Y ASUMIR QUE blogArticles EXISTE)
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

    // Variables de Navegación y Blog
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const homeContent = document.getElementById('home-content');
    const blogContent = document.getElementById('blog-content'); 
    const articleView = document.getElementById('article-view'); 
    const backToBlogButton = document.getElementById('backToBlog'); 
    const blogGridContainer = document.getElementById('blogGridContainer');

    // NUEVA VARIABLE: Template de la tarjeta del blog cargada desde index.html
    const blogCardTemplate = document.getElementById('blogCardTemplate');

    // ?? NOTA: La variable 'blogArticles' se carga desde 'blog-data.js'


    // ==========================================================
    // 2. FUNCIONES DE RENDERING Y PARSEO
    // ==========================================================

    /**
     * Función para manejar el formato simple:
     * - Reemplaza **Texto** con <b>Texto</b>
     */
    function parseContent(content) {
        if (!content) return '';
        // 1. Reemplaza **Texto** con <b>Texto</b>
        let parsed = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        return parsed;
    }

    // Función para generar las tarjetas del blog a partir de los datos (blogArticles)
    function renderBlogCards() {
        // Validación para asegurar que los datos y el template están disponibles
        if (!blogGridContainer || typeof blogArticles === 'undefined' || !blogCardTemplate) {
            console.error("Error: Elementos de blog esenciales no están disponibles.");
            return;
        }
        
        // Limpiar el contenedor antes de empezar
        blogGridContainer.innerHTML = '';
        
        blogArticles.forEach(article => {
            // Clonar el contenido del template (true = clonar todo el contenido interno)
            const cardClone = document.importNode(blogCardTemplate.content, true);
            const card = cardClone.querySelector('.blog-card');
            
            // Inyectar datos variables en el clon
            card.setAttribute('data-article-id', article.id);
            card.querySelector('.card-title').innerHTML = `${article.icon} ${article.title}`;
            card.querySelector('.card-subtitle').textContent = article.subtitle;
            card.querySelector('.card-description').textContent = article.description_short;
            
            // El mensaje "Ver artículo completo ?" ya está dentro del template HTML.
            
            // Añadir la tarjeta completa al contenedor
            blogGridContainer.appendChild(cardClone);
        });
        
        // Después de renderizar, adjuntar los listeners
        attachBlogCardListeners();
    }

    // Adjuntar los listeners de clic a las tarjetas recién creadas
    function attachBlogCardListeners() {
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const articleId = card.getAttribute('data-article-id');
                openArticle(articleId);
            });
        });
    }
    
    // ==========================================================
    // 3. LÓGICA DEL PRELOADER
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
    // 5. LÓGICA DE NAVEGACIÓN Y BLOG
    // ==========================================================

    function showSection(targetId) {
        // 1. Ocultar todas las secciones
        contentSections.forEach(section => {
            section.classList.remove('show-content');
            section.classList.add('hidden-content');
        });
        
        // 2. Ocultamos la vista de artículo por si acaso
        articleView.classList.add('hidden-content');

        // 3. Mostrar la sección objetivo
        let targetSection = document.getElementById(targetId + '-content');
        if (targetSection) {
            targetSection.classList.remove('hidden-content');
            targetSection.classList.add('show-content');
        } else {
            homeContent.classList.remove('hidden-content');
            homeContent.classList.add('show-content');
        }
        
        // 4. Volver al inicio de la página para la nueva sección
        window.scrollTo(0, 0); 
    }

    // ABRIR ARTÍCULO
    function openArticle(articleId) {
        // Encontrar el objeto de artículo por su ID
        const articleData = blogArticles.find(a => a.id === articleId);
        if (!articleData) return;

        // Ocultar el grid de blogs y mostrar la vista de artículo
        blogContent.classList.add('hidden-content');
        blogContent.classList.remove('show-content');
        
        articleView.classList.remove('hidden-content');
        articleView.classList.add('show-content');

        // Inyectar el contenido, aplicando el parseo
        document.getElementById('article-title').textContent = articleData.title; 
        document.getElementById('article-subtitle').textContent = articleData.subtitle;
        
        // Usamos parseContent para reemplazar **negrita** antes de inyectar el HTML
        document.getElementById('article-body').innerHTML = parseContent(articleData.content);
        
        window.scrollTo(0, 0); 
    }

    // REGRESAR AL GRID DE BLOGS
    function backToBlogGrid() {
        articleView.classList.add('hidden-content');
        articleView.classList.remove('show-content');
        blogContent.classList.remove('hidden-content');
        blogContent.classList.add('show-content');
        
        // Subir al inicio de la sección del blog
        document.getElementById('blog-content').scrollIntoView();
    }

    // ==========================================================
    // 6. LISTENERS DE EVENTOS (Activación)
    // ==========================================================

    // Listeners de Cookies/Modal
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
        // Habilitar el botón si el usuario ha hecho scroll hasta el final (o muy cerca)
        if (termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 5) { 
            acceptButtonFinal.disabled = false;
        } 
    });
    acceptButtonFinal.addEventListener('click', saveAndHideCookieBanner);

    // Listeners del Sidebar (Menú Hamburguesa)
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

    // Listeners de Navegación (Enlaces del Menú)
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

    // Listener para REGRESAR (Botón de flecha)
    backToBlogButton.addEventListener('click', backToBlogGrid);
});