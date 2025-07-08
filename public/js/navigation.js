// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', toggleMobileMenu);
    }

    // Admin dropdown toggle
    const adminDropdownToggle = document.getElementById('admin-dropdown-toggle');
    if (adminDropdownToggle) {
        adminDropdownToggle.addEventListener('click', toggleDropdown);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-item.dropdown')) {
            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
});

// Mobile menu functionality
function toggleMobileMenu() {
    const nav = document.querySelector('.elegant-nav');
    const toggle = document.querySelector('.mobile-toggle');
    nav.classList.toggle('mobile-open');
    toggle.classList.toggle('open');
}

// Dropdown functionality
function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();

    const clickedLink = event.currentTarget;
    const dropdown = clickedLink.parentElement;

    console.log('Clicked link:', clickedLink);
    console.log('Dropdown element:', dropdown);
    console.log('Current classes before:', dropdown.className);

    if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        console.log('Removed open class');
    } else {
        document.querySelectorAll('.nav-item.dropdown').forEach(item => {
            item.classList.remove('open');
        });

        dropdown.classList.add('open');
        console.log('Added open class');
    }

    console.log('Current classes after:', dropdown.className);
}
