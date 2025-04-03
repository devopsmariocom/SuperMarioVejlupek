/**
 * Utility functions for the game
 */
const Utils = {
    /**
     * Check for collision between two rectangles
     * @param {Object} rect1 - First rectangle with x, y, width, height
     * @param {Object} rect2 - Second rectangle with x, y, width, height
     * @returns {boolean} - True if collision detected
     */
    checkCollision: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
