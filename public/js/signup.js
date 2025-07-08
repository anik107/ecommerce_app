// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const signupForm = document.querySelector('.signup-form');
    const signupBtn = document.querySelector('.signup-btn');

    // Password strength checking
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }

    // Form submission handling
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }

            // Show loading state
            if (signupBtn) {
                signupBtn.classList.add('loading');
                signupBtn.disabled = true;
                signupBtn.innerHTML = '<span>Creating Account...</span>';
            }
        });
    }

    // Real-time validation for all inputs
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error state when user starts typing
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // Animate form elements on load
    animateFormElements();
});

// Password toggle functionality
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = passwordField.parentElement.querySelector('.password-toggle');
    const eyeIcon = toggleButton.querySelector('.eye-icon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.9 9L22 22" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 3L15 15" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    } else {
        passwordField.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="#6b7280" stroke-width="2"/>
        `;
    }
}

// Enhanced password strength calculation
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
        return { score: 0, feedback: 'Enter a password' };
    }

    // Length check
    if (password.length >= 8) score += 25;
    else feedback = 'At least 8 characters';

    // Lowercase letters
    if (/[a-z]/.test(password)) score += 25;
    else if (!feedback) feedback = 'Add lowercase letters';

    // Uppercase letters
    if (/[A-Z]/.test(password)) score += 25;
    else if (!feedback) feedback = 'Add uppercase letters';

    // Numbers or special characters
    if (/[\d\W]/.test(password)) score += 25;
    else if (!feedback) feedback = 'Add numbers or symbols';

    // Determine strength level
    let level = 'weak';
    if (score >= 75) {
        level = 'strong';
        feedback = 'Strong password';
    } else if (score >= 50) {
        level = 'medium';
        feedback = 'Good password';
    } else if (score >= 25) {
        level = 'fair';
        feedback = 'Fair password';
    }

    return { score, level, feedback };
}

// Update password strength indicator
function updatePasswordStrength(strength) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (!strengthBar || !strengthText) return;

    // Update progress bar
    strengthBar.style.width = strength.score + '%';

    // Update colors based on strength
    let color = '#ef4444'; // red
    if (strength.level === 'fair') color = '#f59e0b'; // yellow
    else if (strength.level === 'medium') color = '#3b82f6'; // blue
    else if (strength.level === 'strong') color = '#10b981'; // green

    strengthBar.style.background = color;

    // Update text
    strengthText.textContent = strength.feedback;
    strengthText.style.color = color;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (!password || !confirmPassword) return;

    if (confirmPassword.value && password.value !== confirmPassword.value) {
        confirmPassword.classList.add('error');
        showFieldError(confirmPassword, 'Passwords do not match');
        return false;
    } else {
        confirmPassword.classList.remove('error');
        hideFieldError(confirmPassword);
        return true;
    }
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }

    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }

    // Password validation
    else if (field.id === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters');
            isValid = false;
        }
    }

    // Confirm password validation
    else if (field.id === 'confirmPassword' && value) {
        const password = document.getElementById('password');
        if (password && value !== password.value) {
            showFieldError(field, 'Passwords do not match');
            isValid = false;
        }
    }

    // Terms validation
    else if (field.name === 'terms' && !field.checked) {
        showFieldError(field, 'You must agree to the terms');
        isValid = false;
    }

    if (isValid) {
        hideFieldError(field);
        field.classList.remove('error');
    } else {
        field.classList.add('error');
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error first

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        font-weight: 500;
    `;

    field.parentElement.appendChild(errorDiv);
}

// Hide field error
function hideFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validate entire form
function validateForm() {
    const inputs = document.querySelectorAll('input[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    // Special validation for password match
    if (!validatePasswordMatch()) {
        isFormValid = false;
    }

    return isFormValid;
}

// Animate form elements on load
function animateFormElements() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';

        setTimeout(() => {
            group.style.transition = 'all 0.6s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Social login handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.google-btn')) {
        // Handle Google signup
        console.log('Google signup clicked');
        // Implement Google OAuth flow here
    }
});

// Smooth scrolling for links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add some interactive polish
document.addEventListener('mousemove', function(e) {
    const welcomeSection = document.querySelector('.signup-welcome');
    if (welcomeSection && window.innerWidth > 1024) {
        const rect = welcomeSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        welcomeSection.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset welcome section transform when mouse leaves
document.addEventListener('mouseleave', function(e) {
    if (e.target.closest('.signup-welcome')) {
        const welcomeSection = document.querySelector('.signup-welcome');
        welcomeSection.style.transform = '';
    }
});

// Add input focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Add checkbox animation
document.querySelectorAll('.checkbox-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const checkmark = this.nextElementSibling;
        if (this.checked) {
            checkmark.style.transform = 'scale(1.1)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 150);
        }
    });
});
