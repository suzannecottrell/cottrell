// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formStatus = form.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        const successMessage = form.nextElementSibling;

        // Show sending state
        if (formStatus) {
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status sending';
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Get form data
        const formData = new FormData(form);
        const action = form.getAttribute('action');

        // Submit to Formspree
        fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            // Success
            form.reset();
            if (formStatus) {
                formStatus.textContent = '';
            }
            
            // Show success message
            if (successMessage && successMessage.classList.contains('success-message')) {
                form.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If no success message element, show alert
                alert('Thank you for your message. Your inquiry has been received, and SuZanne will get back to you as soon as possible.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        })
        .catch(error => {
            // Error
            console.error('Error:', error);
            if (formStatus) {
                formStatus.textContent = 'There was an error sending your message. Please try again or email directly at suzannecottrell2@gmail.com';
                formStatus.className = 'form-status error';
            }
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Active Navigation State based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLi.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// Global function to reset form (used in success message)
function resetForm(formId) {
    const form = document.getElementById(formId);
    const successMessage = form.nextElementSibling;
    
    if (form && successMessage) {
        form.style.display = 'block';
        successMessage.style.display = 'none';
        form.reset();
        
        // Reset submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
        
        // Clear form status
        const formStatus = form.querySelector('.form-status');
        if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }
    }
}