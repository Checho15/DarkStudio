document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================
    // 1. GESTIÓN DEL PRELOADER (CON PORCENTAJE Y 3 SEGUNDOS)
    // ===================================================

    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.querySelector('.loading-text');

    const MIN_LOAD_TIME = 3000; 
    const INTERVAL_MS = 30;     
    let isLoaded = false;
    let progress = 0;

    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 1; 
            progressBar.style.width = progress + '%';
            loadingText.textContent = `Cargando... ${Math.floor(progress)}%`;
        }
    }, INTERVAL_MS);

    const finishLoading = () => {
        if (isLoaded) return; 

        isLoaded = true;
        clearInterval(progressInterval);
        
        progress = 100;
        progressBar.style.width = '100%';
        loadingText.textContent = `Cargando... 100%`;

        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            preloader.addEventListener('transitionend', () => {
                preloader.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                showSection('home-content');
                
            }, { once: true });
            
        }, 300); 
    };

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
    const serverLogo = document.getElementById('serverLogo'); 

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
        
        if (sectionId !== 'article-view') { 
            articleView.classList.add('hidden-content');
            articleView.classList.remove('show-content');
        }
    };

    const closeSidebarPanel = () => {
        sidebar.classList.remove('show');
        setTimeout(() => {
            sidebar.classList.add('hidden-sidebar');
        }, 400); 
    };
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden-sidebar');
    });

    closeSidebar.addEventListener('click', closeSidebarPanel);
    
    serverLogo.addEventListener('click', () => {
        showSection('home-content');
        closeSidebarPanel();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');
            const targetId = (href === '#home') ? 'home-content' : href.substring(1) + '-content';
            
            showSection(targetId);
            
            closeSidebarPanel();
        });
    });

    // ===================================================
    // 3. LÓGICA DEL BLOG Y VISTA DE ARTÍCULO 
    // ===================================================

    const blogGridContainer = document.getElementById('blogGridContainer');
    const blogCardTemplate = document.getElementById('blogCardTemplate');

    const formatArticleContent = (content) => {
        return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const loadBlogArticles = () => {
        if (typeof articles !== 'undefined' && blogGridContainer && blogCardTemplate) {
            blogGridContainer.innerHTML = ''; 
            
            let sortedArticles = [...articles];
            
            sortedArticles.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return 0; 
            });

            sortedArticles.forEach(article => {
                const clone = blogCardTemplate.content.cloneNode(true);
                const card = clone.querySelector('.blog-card');
                
                card.dataset.articleId = article.id;
                
                if (article.isPinned) {
                    clone.querySelector('.card-title').innerHTML = `📌 ${article.title}`;
                } else {
                    clone.querySelector('.card-title').textContent = article.title;
                }
                
                const icon = article.icon || '';
                clone.querySelector('.card-subtitle').textContent = `${icon} ${article.subtitle}`;
                
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

    const displayArticle = (article) => {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-subtitle').textContent = article.subtitle;
        
        const formattedContent = formatArticleContent(article.content);
        document.getElementById('article-body').innerHTML = formattedContent;
        
        blogContent.classList.remove('show-content');
        blogContent.classList.add('hidden-content'); 

        articleView.classList.remove('hidden-content');
        articleView.classList.add('show-content');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    backToBlogButton.addEventListener('click', () => {
        articleView.classList.remove('show-content');
        articleView.classList.add('hidden-content');

        blogContent.classList.remove('hidden-content');
        blogContent.classList.add('show-content');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    loadBlogArticles(); 

    // ===================================================
    // 4. LÓGICA DE SUGERENCIAS 
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
        
        // AQUÍ IRÍA EL FETCH AL SERVIDOR
        
        suggestionMessage.textContent = `¡Sugerencia enviada! Gracias, ${userEmail || 'Usuario'}. La revisaremos pronto.`;
        suggestionMessage.style.color = '#2ecc71';
        suggestionInput.value = ''; 
        
        setTimeout(() => {
            suggestionMessage.textContent = '';
        }, 5000);
    });
    
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

    userProfileContainer.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!userProfileContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    signOutButton.addEventListener('click', () => {
        if (typeof google !== 'undefined' && google.accounts.id) {
            google.accounts.id.disableAutoSelect(); 
        }

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPicture');

        updateAuthUI(false);
    });

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

    const openModal = () => {
        termsModal.classList.remove('hidden-modal');
        termsScrollArea.scrollTop = 0;
        acceptTermsFinalButton.disabled = true;
    };

    const closeModal = () => {
        termsModal.classList.add('hidden-modal');
    };

    const checkScroll = () => {
        const isScrolledToBottom = termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 20; 
        acceptTermsFinalButton.disabled = !isScrolledToBottom;
    };

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
