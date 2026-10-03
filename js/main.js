/**
 * Ireneo Kunda Complex Website - Unified Application Script
 * Single consolidated script managing navigation, scroll effects, gallery & lightbox,
 * admissions tabs & validation, and contact form handling.
 */

(function () {
    'use strict';

    // ==========================================
    // 1. EMBEDDED CANONICAL DATASET (Offline / file:// fallback)
    // ==========================================
    const EMBEDDED_GALLERY = [
        {
            id: 1,
            src: "images/gallery/campus-building.jpg",
            title: "School Main Building",
            category: "campus",
            description: "Our main school building housing classrooms and administrative offices"
        },
        {
            id: 2,
            src: "images/gallery/campus-assembly.jpg",
            title: "School Assembly",
            category: "campus",
            description: "Students gathering for school assembly"
        },
        {
            id: 3,
            src: "images/gallery/life-classroom.jpg",
            title: "Classroom Learning",
            category: "classroom",
            description: "Students engaged in interactive learning"
        },
        {
            id: 4,
            src: "images/gallery/students-group-1.jpg",
            title: "Student Group Activity",
            category: "activities",
            description: "Students expressing creativity through group activities"
        },
        {
            id: 5,
            src: "images/gallery/students-group-2.jpg",
            title: "Group Learning",
            category: "activities",
            description: "Students collaborating and learning together"
        },
        {
            id: 6,
            src: "images/gallery/hero-students.jpeg",
            title: "Student Portraits",
            category: "events",
            description: "Celebrating student achievements"
        },
        {
            id: 7,
            src: "images/gallery/leader-portrait.jpg",
            title: "School Leadership",
            category: "events",
            description: "School leadership and vision"
        },
        {
            id: 8,
            src: "images/gallery/life-sports.jpg",
            title: "Sports Activities",
            category: "sports",
            description: "Students competing in sports and athletics"
        }
    ];

    // Hoisted RegEx instances for validation (js-hoist-regexp optimization)
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/;
    const ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    const ESCAPE_REGEX = /[&<>"']/g;

    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(ESCAPE_REGEX, char => ESCAPE_MAP[char] || char);
    }

    // ==========================================
    // 2. NAVIGATION & MOBILE DRAWER
    // ==========================================
    function initNavigation() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.querySelector('.navbar');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                const isActive = mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });

            // Close menu on click outside
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.navbar')) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu on link click
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function () {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Navbar elevation shadow on scroll
        if (navbar) {
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    }

    // ==========================================
    // 3. SMOOTH SCROLL & SCROLL REVEAL ANIMATIONS
    // ==========================================
    function initScrollEffects() {
        // Smooth scrolling for hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // IntersectionObserver for entrance animations
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const animatableElements = document.querySelectorAll(
                '.info-card, .program-card, .value-card, .principle-card, .executive-card, .headteacher-card, .step, .fee-card, .mv-card, .date-card, .feature-item'
            );

            animatableElements.forEach(el => {
                el.classList.add('reveal-item');
                revealObserver.observe(el);
            });
        }
    }

    // ==========================================
    // 4. GALLERY & MODAL LIGHTBOX MODULE
    // ==========================================
    function initGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        const modal = document.getElementById('galleryModal');
        if (!galleryGrid) return;

        const allImages = EMBEDDED_GALLERY;
        let filteredImages = [...allImages];
        let currentModalIndex = 0;
        let lastFocusedElement = null;

        const modalImg = document.getElementById('modalImage');
        const caption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');
        const prevBtn = document.querySelector('.modal-prev');
        const nextBtn = document.querySelector('.modal-next');

        function renderGrid(images) {
            filteredImages = images;
            galleryGrid.innerHTML = '';

            if (images.length === 0) {
                galleryGrid.innerHTML = '<p class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No images found in this category.</p>';
                return;
            }

            const fragment = document.createDocumentFragment();

            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.category = image.category;
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', `View ${image.title || 'photo'}`);

                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.title || 'Gallery photo';
                img.loading = 'lazy';
                img.width = 400;
                img.height = 300;

                // Fallback to stylized placeholder if image fails to load
                img.onerror = function () {
                    item.innerHTML = `
                        <div class="gallery-placeholder">
                            <i class="fas fa-image" aria-hidden="true"></i>
                            <p>${escapeHTML(image.title || 'School Photo')}</p>
                        </div>
                    `;
                };

                item.appendChild(img);

                // Click and Enter/Space key handler to open modal
                item.addEventListener('click', () => openLightbox(index));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });

                fragment.appendChild(item);
            });

            galleryGrid.appendChild(fragment);
        }

        function openLightbox(index) {
            if (!modal || !modalImg || !caption) return;
            if (!filteredImages || filteredImages.length === 0 || index < 0 || index >= filteredImages.length) return;

            lastFocusedElement = document.activeElement;
            currentModalIndex = index;
            const current = filteredImages[currentModalIndex];

            modalImg.src = current.src;
            modalImg.alt = current.title || 'Gallery image';
            caption.textContent = current.title || 'Gallery image';

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (closeBtn) {
                closeBtn.focus();
            }
        }

        function closeLightbox() {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }

        function navigateLightbox(direction) {
            if (!filteredImages || filteredImages.length === 0 || !modalImg || !caption) return;

            currentModalIndex += direction;
            if (currentModalIndex < 0) {
                currentModalIndex = filteredImages.length - 1;
            } else if (currentModalIndex >= filteredImages.length) {
                currentModalIndex = 0;
            }

            const current = filteredImages[currentModalIndex];
            if (current) {
                modalImg.style.opacity = '0';
                caption.style.opacity = '0';

                setTimeout(() => {
                    modalImg.src = current.src;
                    modalImg.alt = current.title || 'Gallery image';
                    caption.textContent = current.title || 'Gallery image';
                    modalImg.style.opacity = '1';
                    caption.style.opacity = '1';
                }, 150);
            }
        }

        // Render initial images
        renderGrid(allImages);

        // Filter button clicks
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                const filter = this.dataset.filter;
                if (filter === 'all' || !filter) {
                    renderGrid(allImages);
                } else {
                    const filtered = allImages.filter(img => img.category === filter);
                    renderGrid(filtered);
                }
            });
        });

        // Modal Controls
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            }
        });
    }

    // ==========================================
    // 5. ADMISSIONS MODULE (Tabs & Form Validation)
    // ==========================================
    function initAdmissions() {
        // 5.1 Requirements Tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const targetTab = this.dataset.tab;

                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.hidden = true;
                });

                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                    targetPane.hidden = false;
                }
            });
        });

        // 5.2 Application Form
        const applicationForm = document.getElementById('applicationForm');
        const formMessage = document.getElementById('formMessage');

        if (applicationForm) {
            const formInputs = applicationForm.querySelectorAll('input, select, textarea');

            formInputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group');
                    if (group && group.classList.contains('error')) {
                        validateField(input);
                    }
                });
                input.addEventListener('change', () => validateField(input));
            });

            applicationForm.addEventListener('submit', function (e) {
                e.preventDefault();

                let isValid = true;
                let firstInvalidField = null;

                formInputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                        if (!firstInvalidField) firstInvalidField = input;
                    }
                });

                if (!isValid) {
                    showFormMessage(formMessage, 'Please fill in all required fields correctly before submitting.', 'error');
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                    }
                    return;
                }

                const formData = new FormData(applicationForm);
                const data = Object.fromEntries(formData.entries());
                console.log('Admissions Application Submitted:', data);

                showFormMessage(
                    formMessage,
                    '✓ Thank you for your application! We will contact you within 5-7 working days to confirm receipt and provide next steps.',
                    'success'
                );

                setTimeout(() => {
                    applicationForm.reset();
                    formInputs.forEach(input => {
                        const group = input.closest('.form-group');
                        if (group) group.classList.remove('error', 'success');
                    });
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            });
        }
    }

    // ==========================================
    // 6. CONTACT MODULE (Form Validation)
    // ==========================================
    function initContact() {
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('contactFormMessage');

        if (contactForm) {
            const formInputs = contactForm.querySelectorAll('input, select, textarea');

            formInputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group');
                    if (group && group.classList.contains('error')) {
                        validateField(input);
                    }
                });
                input.addEventListener('change', () => validateField(input));
            });

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                let isValid = true;
                let firstInvalidField = null;

                formInputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                        if (!firstInvalidField) firstInvalidField = input;
                    }
                });

                if (!isValid) {
                    showFormMessage(formMessage, 'Please fill in all required fields correctly.', 'error');
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                    }
                    return;
                }

                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                console.log('Contact Message Submitted:', data);

                showFormMessage(
                    formMessage,
                    '✓ Thank you for reaching out! We have received your message and will respond within 24-48 hours.',
                    'success'
                );

                setTimeout(() => {
                    contactForm.reset();
                    formInputs.forEach(input => {
                        const group = input.closest('.form-group');
                        if (group) group.classList.remove('error', 'success');
                    });
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            });
        }
    }

    // ==========================================
    // 7. FORM VALIDATION HELPERS
    // ==========================================
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;

        const value = field.value.trim();
        let isValid = true;

        formGroup.classList.remove('error', 'success');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if ((field.type === 'email' || field.name === 'email') && value) {
            isValid = EMAIL_REGEX.test(value);
        } else if ((field.type === 'tel' || field.name === 'phone') && value) {
            isValid = PHONE_REGEX.test(value);
        } else if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (!isValid) {
            formGroup.classList.add('error');
        } else if (isValid && value) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    function showFormMessage(messageEl, text, type) {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'flex';
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ==========================================
    // 8. INITIALIZATION ON DOM READY
    // ==========================================
    function bootstrap() {
        initNavigation();
        initScrollEffects();
        initGallery();
        initAdmissions();
        initContact();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
