document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================
    // 1. GESTIÓN DEL PRELOADER
    // ===================================================

    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.querySelector('.loading-text');

    let loadProgress = 0;
    const totalSteps = 100;
    const intervalTime = 20; // ms

    const updateProgressBar = () => {
        if (loadProgress < 95) {
            loadProgress += 1;
            progressBar.style.width = loadProgress + '%';
            loadingText.textContent = `Cargando... ${loadProgress}%`;
        } else if (loadProgress < 100) {
            // Ralentizar la carga final para simular el final de la carga de recursos
            loadProgress += 0.2;
            progressBar.style.width = loadProgress + '%';
            loadingText.textContent = `Cargando... ${Math.floor(loadProgress)}%`;
        }
        
        if (loadProgress < 100) {
            requestAnimationFrame(updateProgressBar);
        }
    };
    
    // Iniciar la animación de la barra de progreso
    requestAnimationFrame(updateProgressBar);

    window.addEventListener('load', () => {
        // Asegurar que la barra llega al 100% justo antes de ocultar
        loadProgress = 100;
        progressBar.style.width = '100%';
        loadingText.textContent = `Carga completa.`;

        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Ocultar preloader y mostrar contenido principal
            preloader.addEventListener('transitionend', () => {
                preloader.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }, { once: true });
            
        }, 500); // Pequeña pausa de 0.5s en el 100%
    });

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
            blogContent.classList.remove('hidden-content'); // Asegurar que la grilla del blog esté visible si volvemos a ella.
        }
    };

    // Manejar la apertura/cierre del Sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden-sidebar');
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('show');
        setTimeout(() => {
            sidebar.classList.add('hidden-sidebar');
        }, 400); // Esperar a que termine la transición
    });

    // Manejar la navegación por enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href').substring(1) + '-content';
            showSection(targetId);
            
            // Cerrar sidebar tras navegar
            sidebar.classList.remove('show');
            setTimeout(() => {
                sidebar.classList.add('hidden-sidebar');
            }, 400); 
        });
    });

    // Cargar la sección inicial
    showSection('home-content'); 

    // ===================================================
    // 3. LÓGICA DEL BLOG Y VISTA DE ARTÍCULO
    // ===================================================

    const blogGridContainer = document.getElementById('blogGridContainer');
    const blogCardTemplate = document.getElementById('blogCardTemplate');

    if (typeof articles !== 'undefined' && blogGridContainer && blogCardTemplate) {
        articles.forEach(article => {
            const clone = blogCardTemplate.content.cloneNode(true);
            const card = clone.querySelector('.blog-card');
            
            card.dataset.articleId = article.id;
            clone.querySelector('.card-title').textContent = article.title;
            clone.querySelector('.card-subtitle').textContent = article.subtitle;
            clone.querySelector('.card-description').textContent = article.description;

            card.addEventListener('click', () => {
                displayArticle(article);
            });

            blogGridContainer.appendChild(clone);
        });
    }

    // Función para mostrar el contenido de un artículo
    const displayArticle = (article) => {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-subtitle').textContent = article.subtitle;
        document.getElementById('article-body').innerHTML = article.content;
        
        // Ocultar la grilla del blog y mostrar la vista de artículo
        blogContent.classList.add('hidden-content');
        articleView.classList.remove('hidden-content');
        articleView.classList.add('show-content');
        
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Botón de regresar del artículo
    backToBlogButton.addEventListener('click', () => {
        articleView.classList.add('hidden-content');
        blogContent.classList.remove('hidden-content');
        blogContent.classList.add('show-content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
        
        // Lógica de validación
        if (!suggestionInput.value.trim() || suggestionInput.value.length < 10) {
            suggestionMessage.textContent = "Error: La sugerencia debe tener al menos 10 caracteres.";
            suggestionMessage.style.color = '#e74c3c';
            return;
        }

        // Aquí iría el código para enviar la sugerencia al backend (AJAX/Fetch)
        // Usaremos un mensaje de éxito simulado por ahora
        const userEmail = localStorage.getItem('userEmail');
        
        suggestionMessage.textContent = `¡Sugerencia enviada! Gracias, ${userEmail || 'Usuario'}. La revisaremos pronto.`;
        suggestionMessage.style.color = '#2ecc71';
        suggestionInput.value = ''; // Limpiar el campo
        
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
        e.stopPropagation(); // Evita que el evento se propague al documento
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
        // Cierre de sesión de Google (si se usa la librería)
        if (typeof google !== 'undefined' && google.accounts.id) {
            google.accounts.id.disableAutoSelect(); // Deshabilita el inicio de sesión automático
            // Nota: El SDK de Google no tiene un método directo para "cerrar sesión" del token JWT,
            // sino que se elimina la credencial guardada. Para cerrar sesión del lado del cliente,
            // simplemente eliminamos la información de la sesión guardada localmente.
        }

        // Limpiar el estado de la sesión local
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPicture');

        // Actualizar la UI
        updateAuthUI(false);
    });


    // Función global llamada por el SDK de Google (debe estar en el scope global)
    window.handleCredentialResponse = (response) => {
        if (response.credential) {
            // Decodificar el token JWT
            const token = response.credential;
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Guardar información relevante en Local Storage
            localStorage.setItem('userName', payload.name);
            localStorage.setItem('userEmail', payload.email);
            localStorage.setItem('userPicture', payload.picture);
            
            // Actualizar la interfaz de usuario
            updateAuthUI(true, payload.name, payload.picture);
        }
    };

    // Función para actualizar la Interfaz de Usuario de Autenticación
    const updateAuthUI = (isLoggedIn, name = '', picture = '') => {
        if (isLoggedIn) {
            // Mostrar perfil, ocultar botón de Google
            googleSignInButton.style.display = 'none';
            userProfileContainer.classList.remove('hidden-profile');
            
            // Usar los datos guardados en Local Storage si no se pasan como argumento
            name = name || localStorage.getItem('userName');
            picture = picture || localStorage.getItem('userPicture');
            
            profileImage.src = picture;
            dropdownName.textContent = name;
        } else {
            // Ocultar perfil, mostrar botón de Google
            googleSignInButton.style.display = 'block';
            userProfileContainer.classList.add('hidden-profile');
            
            // Ocultar el dropdown si estaba abierto
            dropdownMenu.classList.add('hidden');
        }
        
        // Actualizar el estado de la sugerencia
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
            // Cookies aceptadas, no mostrar nada
            cookieBanner.classList.add('hidden-cookie');
        } else {
            // Mostrar banner si no ha sido aceptado
            cookieBanner.classList.remove('hidden-cookie');
        }
    };

    // 6.2. Funciones del Modal
    const openModal = () => {
        termsModal.classList.remove('hidden-modal');
        // Resetear el scroll y deshabilitar el botón al abrir
        termsScrollArea.scrollTop = 0;
        acceptTermsFinalButton.disabled = true;
    };

    const closeModal = () => {
        termsModal.classList.add('hidden-modal');
    };

    const checkScroll = () => {
        // Habilitar el botón si el usuario ha scrollado casi hasta el final
        const isScrolledToBottom = termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 20; // 20px de margen
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

    // Cierre del modal haciendo clic fuera
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
