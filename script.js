document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSmoothScrolling();
    initAnimations();
    initContactForm();
    initNewsletterForm();
    initCharacterCounter();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Handle active nav links
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.getElementById('navbarNav');
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe fade-up elements
    const fadeElements = document.querySelectorAll('.fade-up, .fade-up-delay');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateContactForm()) {
            return;
        }
        
        // Show loading state
        showLoadingState(submitBtn);
        
        // Simulate API call
        try {
            await simulateFormSubmission();
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            form.classList.remove('was-validated');
            updateCharacterCount();
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            hideLoadingState(submitBtn);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

// Form validation
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Validate full name
    if (!fullName.value.trim()) {
        setFieldError(fullName, 'Full name is required');
        isValid = false;
    } else {
        setFieldSuccess(fullName);
    }
    
    // Validate email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email.value.trim()) {
        setFieldError(email, 'Email address is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        setFieldError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        setFieldSuccess(email);
    }
    
    // Validate message
    if (!message.value.trim()) {
        setFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 20) {
        setFieldError(message, 'Message must be at least 20 characters long');
        isValid = false;
    } else {
        setFieldSuccess(message);
    }
    
    form.classList.add('was-validated');
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!value) {
                setFieldError(field, 'Email address is required');
            } else if (!emailRegex.test(value)) {
                setFieldError(field, 'Please enter a valid email address');
            } else {
                setFieldSuccess(field);
            }
            break;
            
        case 'text':
            if (!value) {
                setFieldError(field, 'This field is required');
            } else {
                setFieldSuccess(field);
            }
            break;
            
        default:
            if (field.tagName === 'TEXTAREA') {
                if (!value) {
                    setFieldError(field, 'Message is required');
                } else if (value.length < 20) {
                    setFieldError(field, 'Message must be at least 20 characters long');
                } else {
                    setFieldSuccess(field);
                }
            }
            break;
    }
}

// Set field error state
function setFieldError(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
}

// Set field success state
function setFieldSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Character counter for message field
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!messageField || !charCount) return;
    
    messageField.addEventListener('input', updateCharacterCount);
    updateCharacterCount(); // Initial count
}

function updateCharacterCount() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageField && charCount) {
        const count = messageField.value.length;
        charCount.textContent = count;
        
        // Update color based on minimum requirement
        if (count >= 20) {
            charCount.style.color = '#198754'; // Success color
        } else {
            charCount.style.color = '#6b7280'; // Muted color
        }
    }
}

// Newsletter form functionality
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        
        // Validate email
        if (!email) {
            setFieldError(emailInput, 'Email address is required');
            return;
        }
        
        if (!emailRegex.test(email)) {
            setFieldError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        setFieldSuccess(emailInput);
        
        // Show success state
        submitBtn.classList.add('subscribed');
        emailInput.value = '';
        emailInput.classList.remove('is-valid');
        
        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.classList.remove('subscribed');
        }, 3000);
    });
    
    // Real-time validation
    emailInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateField(this);
        }
    });
}

// Loading state helpers
function showLoadingState(button) {
    button.disabled = true;
    button.querySelector('.btn-text').style.display = 'none';
    button.querySelector('.btn-loading').classList.remove('d-none');
}

function hideLoadingState(button) {
    button.disabled = false;
    button.querySelector('.btn-text').style.display = 'inline';
    button.querySelector('.btn-loading').classList.add('d-none');
}

// Success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('d-none');
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('d-none');
    }, 5000);
}

// Simulate form submission
function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate any layout-dependent features if needed
}, 250));

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
    } else {
        // Page is visible
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Handle escape key to close mobile menu
    if (e.key === 'Escape') {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    }
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
// initLazyLoading();
