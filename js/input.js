/**
 * Input handler for keyboard controls
 */
const Input = {
    // Key states
    keys: {
        left: false,
        right: false,
        up: false
    },

    /**
     * Initialize input event listeners
     */
    init: function() {
        // Key down event
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.keys.right = true;
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ':
                    this.keys.up = true;
                    break;
            }
        });

        // Key up event
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ':
                    this.keys.up = false;
                    break;
            }
        });
    }
};
