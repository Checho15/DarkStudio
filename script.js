document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================
    // 1. GESTIÓN DEL PRELOADER (Ajustado para forzar los 3 segundos)
    // ===================================================

    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.querySelector('.loading-text');

    const MIN_LOAD_TIME = 3000; // Mínimo 3 segundos
    const INTERVAL_MS = 50;     // Intervalo de actualización de la barra
    const startLoadTime = Date.now();
    let isLoaded = false;
    let progress = 0;

    // Simulación de progreso de carga (hasta el 90%)
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 1; 
            progressBar.style.width = progress + '%';
            loadingText.textContent = `Cargando... ${Math.floor(progress)}%`;
        }
    }, INTERVAL_MS);

    // Función que se llama cuando el tiempo mínimo ha pasado
    const finishLoading = () => {
        if (isLoaded) return; // Evitar llamadas dobles

        isLoaded = true;
        clearInterval(progressInterval);
        
        // Completar la barra de progreso
        progressBar.style.width = '100%';
        loadingText.textContent = `Carga completa.`;

        // Ocultar preloader con fade-out
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            preloader.addEventListener('transitionend', () => {
                preloader.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Muestra la sección HOME después de la carga
                showSection('home-content');
                
            }, { once: true });
            
        }, 500); // 0.5s de pausa final
    };

    // Forzar el tiempo mínimo de 3 segundos
    setTimeout(() => {
        finishLoading();
    }, MIN_LOAD_TIME);


    // ===================================================
    // 2. NAVEGACIÓN Y SIDEBAR
    // ===================================================
    
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const blogContent = document.getElementById('blog-content');
    const articleView = document.getElementById('article-view');
    const backToBlogButton = document.getElementById('backToBlog');
    const serverLogo = document.getElementById('serverLogo'); // El logo pequeño del header

    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.classList.add('hidden-content');
            section.classList.remove('show-content');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden-content');
            targetSection.classList.add('show-content');
        }
        
        // Si no estamos en el blog, ocultar vista de artículo
        if (sectionId !== 'blog-content') {
            articleView.classList.add('hidden-content');
        }
    };

    const closeSidebarPanel = () => {
        sidebar.classList.remove('show');
        setTimeout(() => {
            sidebar.classList.add('hidden-sidebar');
        }, 400); 
    };
    
    // Manejar la apertura/cierre del Sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden-sidebar');
    });

    closeSidebar.addEventListener('click', closeSidebarPanel);
    
    // CORRECCIÓN: Clic en el logo para ir al Home
    serverLogo.addEventListener('click', () => {
        showSection('home-content');
        closeSidebarPanel();
    });

    // Manejar la navegación por enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href').substring(1) + '-content';
            showSection(targetId);
            
            // Cerrar sidebar tras navegar
            closeSidebarPanel();
        });
    });

    // La sección inicial se establece en finishLoading, pero la inicializamos por si acaso
    // NOTA: 'home-content' ya tiene la clase .show-content inicial en el HTML
    // showSection('home-content'); 

    // ===================================================
    // 3. LÓGICA DEL BLOG Y VISTA DE ARTÍCULO
    // ===================================================

    const blogGridContainer = document.getElementById('blogGridContainer');
    const blogCardTemplate = document.getElementById('blogCardTemplate');

    const loadBlogArticles = () => {
        // Asegúrate de que 'articles' esté definido en blog-data.js
        if (typeof articles !== 'undefined' && blogGridContainer && blogCardTemplate) {
            blogGridContainer.innerHTML = ''; 
            
            articles.forEach(article => {
                const clone = blogCardTemplate.content.cloneNode(true);
                const card = clone.querySelector('.blog-card');
                
                card.dataset.articleId = article.id;
                clone.querySelector('.card-title').textContent = article.title;
                clone.querySelector('.card-subtitle').textContent = article.subtitle;
                
                const description = article.description.length > 100 
                                  ? article.description.substring(0, 100) + '...'
                                  : article.description;
                clone.querySelector('.card-description').textContent = description;

                card.addEventListener('click', () => {
                    displayArticle(article);
                });

                blogGridContainer.appendChild(clone);
            });
        }
    };

    // Función para mostrar el contenido de un artículo
    const displayArticle = (article) => {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-subtitle').textContent = article.subtitle;
        document.getElementById('article-body').innerHTML = article.content;
        
        blogContent.classList.add('hidden-content');
        articleView.classList.remove('hidden-content');
        articleView.classList.add('show-content');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Botón de regresar del artículo
    backToBlogButton.addEventListener('click', () => {
        articleView.classList.add('hidden-content');
        blogContent.classList.remove('hidden-content');
        blogContent.classList.add('show-content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    loadBlogArticles(); 

    // ===================================================
    // 4. LÓGICA DE SUGERENCIAS (Requiere Login)
    // ===================================================

    const suggestionForm = document.getElementById('suggestionForm');
    const suggestionInput = document.getElementById('suggestionInput');
    const suggestionButton = suggestionForm.querySelector('.suggestion-button');
    const suggestionMessage = document.getElementById('suggestionMessage');
    const loginRequiredMessage = document.getElementById('loginRequiredMessage');

    suggestionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!suggestionInput.value.trim() || suggestionInput.value.length < 10) {
            suggestionMessage.textContent = "Error: La sugerencia debe tener al menos 10 caracteres.";
            suggestionMessage.style.color = '#e74c3c';
            return;
        }

        const userEmail = localStorage.getItem('userEmail');
        
        // --- AQUÍ IRÍA EL FETCH AL SERVIDOR ---
        
        suggestionMessage.textContent = `¡Sugerencia enviada! Gracias, ${userEmail || 'Usuario'}. La revisaremos pronto.`;
        suggestionMessage.style.color = '#2ecc71';
        suggestionInput.value = ''; 
        
        setTimeout(() => {
            suggestionMessage.textContent = '';
        }, 5000);
    });
    
    // Función para actualizar el estado del formulario de sugerencias
    const updateSuggestionFormState = (isLoggedIn) => {
        if (isLoggedIn) {
            suggestionInput.disabled = false;
            suggestionButton.disabled = false;
            loginRequiredMessage.style.display = 'none';
        } else {
            suggestionInput.disabled = true;
            suggestionButton.disabled = true;
            loginRequiredMessage.style.display = 'block';
        }
    };


    // ===================================================
    // 5. GESTIÓN DE SESIÓN DE GOOGLE
    // ===================================================

    const googleSignInButton = document.getElementById('googleSignInButton');
    const userProfileContainer = document.getElementById('userProfile');
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownName = document.getElementById('dropdownName');
    const signOutButton = document.getElementById('signOutButton');

    // Muestra/Oculta el menú desplegable del perfil
    userProfileContainer.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('hidden');
    });

    // Cierra el menú cuando se hace clic fuera
    document.addEventListener('click', (e) => {
        if (!userProfileContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Lógica para cerrar sesión (Google y Local Storage)
    signOutButton.addEventListener('click', () => {
        if (typeof google !== 'undefined' && google.accounts.id) {
            google.accounts.id.disableAutoSelect(); 
        }

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPicture');

        updateAuthUI(false);
    });


    // Función global llamada por el SDK de Google
    window.handleCredentialResponse = (response) => {
        if (response.credential) {
            const token = response.credential;
            const payload = JSON.parse(atob(token.split('.')[1]));

            localStorage.setItem('userName', payload.name);
            localStorage.setItem('userEmail', payload.email);
            localStorage.setItem('userPicture', payload.picture);
            
            updateAuthUI(true, payload.name, payload.picture);
        }
    };

    // Función para actualizar la Interfaz de Usuario de Autenticación
    const updateAuthUI = (isLoggedIn, name = '', picture = '') => {
        if (isLoggedIn) {
            googleSignInButton.style.display = 'none';
            userProfileContainer.classList.remove('hidden-profile');
            
            name = name || localStorage.getItem('userName');
            picture = picture || localStorage.getItem('userPicture');
            
            profileImage.src = picture;
            dropdownName.textContent = name;
        } else {
            googleSignInButton.style.display = 'block';
            userProfileContainer.classList.add('hidden-profile');
            
            dropdownMenu.classList.add('hidden');
        }
        
        updateSuggestionFormState(isLoggedIn);
    };

    // Verificar el estado de la sesión al cargar la página
    const checkUserSession = () => {
        const userName = localStorage.getItem('userName');
        const userPicture = localStorage.getItem('userPicture');

        if (userName && userPicture) {
            updateAuthUI(true, userName, userPicture);
        } else {
            updateAuthUI(false);
        }
    };
    
    // ===================================================
    // 6. LÓGICA DE COOKIES Y MODAL DE TÉRMINOS
    // ===================================================

    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const openTermsModalButton = document.getElementById('openTermsModal');
    const termsModal = document.getElementById('termsModal');
    const closeModalButton = document.getElementById('closeModal');
    const acceptTermsFinalButton = document.getElementById('acceptTermsFinal');
    const termsScrollArea = document.querySelector('.terms-scroll-area');

    // 6.1. Funciones de Cookies
    const setCookiePreference = (status) => {
        localStorage.setItem('cookiesAccepted', status);
        cookieBanner.classList.add('hidden-cookie');
    };

    const checkCookiePreference = () => {
        const accepted = localStorage.getItem('cookiesAccepted');
        if (accepted === 'true') {
            cookieBanner.classList.add('hidden-cookie');
        } else {
            cookieBanner.classList.remove('hidden-cookie');
        }
    };

    // 6.2. Funciones del Modal
    const openModal = () => {
        termsModal.classList.remove('hidden-modal');
        termsScrollArea.scrollTop = 0;
        acceptTermsFinalButton.disabled = true;
    };

    const closeModal = () => {
        termsModal.classList.add('hidden-modal');
    };

    const checkScroll = () => {
        // Habilita el botón solo cuando se ha llegado al final del scroll
        const isScrolledToBottom = termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 20; 
        acceptTermsFinalButton.disabled = !isScrolledToBottom;
    };

    // 6.3. Eventos de Cookies y Modal
    acceptCookiesButton.addEventListener('click', () => {
        setCookiePreference('true');
    });

    openTermsModalButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    termsScrollArea.addEventListener('scroll', checkScroll);

    acceptTermsFinalButton.addEventListener('click', () => {
        if (!acceptTermsFinalButton.disabled) {
            setCookiePreference('true');
            closeModal();
        }
    });

    termsModal.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            closeModal();
        }
    });
    
    // ===================================================
    // 7. INICIALIZACIÓN
    // ===================================================
    
    checkCookiePreference();
    checkUserSession(); 
});
