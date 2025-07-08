// Product detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const cartQuantityInput = document.getElementById('cart-quantity');
    const quantityButtons = document.querySelectorAll('.quantity-btn');

    // Handle quantity button clicks
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            let value = parseInt(quantityInput.value) || 1;

            if (action === 'increase' && value < 99) {
                value++;
            } else if (action === 'decrease' && value > 1) {
                value--;
            }

            quantityInput.value = value;
            cartQuantityInput.value = value;
        });
    });

    // Update cart quantity when input changes
    quantityInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 1;
        // Ensure value is within valid range
        if (value < 1) {
            this.value = 1;
            cartQuantityInput.value = 1;
        } else if (value > 99) {
            this.value = 99;
            cartQuantityInput.value = 99;
        } else {
            cartQuantityInput.value = value;
        }
    });
});