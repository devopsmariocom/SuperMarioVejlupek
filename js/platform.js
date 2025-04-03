/**
 * Platform class for the platform game
 */
class Platform {
  /**
   * Create a new platform
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of platform
   * @param {number} height - Height of platform
   * @param {string} color - Color of platform
   */
  constructor(x, y, width, height, color = '#8B4513') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  /**
   * Draw the platform on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX = 0) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

    // Add some texture to the platform
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < this.width; i += 30) {
      ctx.fillRect(this.x - offsetX + i, this.y, 15, 5);
    }
  }
}

/**
 * Level generator for creating platform layouts
 */
const LevelGenerator = {
  /**
   * Generate a level with platforms
   * @param {number} canvasWidth - Width of the game canvas
   * @param {number} canvasHeight - Height of the game canvas
   * @returns {Array} - Array of Platform objects
   */
  generateLevel: function (canvasWidth, canvasHeight) {
    // Use base dimensions for consistent gameplay regardless of screen size
    const baseWidth = 800;
    const baseHeight = 600;

    // Create a longer level for scrolling
    const levelLength = baseWidth * 5; // 5 screens wide

    const platforms = [];

    // Ground platforms - multiple segments for a long level
    const groundSegments = Math.ceil(levelLength / baseWidth);
    for (let i = 0; i < groundSegments; i++) {
      // Create gaps in the ground for challenge
      if (i > 0 && i < groundSegments - 1 && Math.random() < 0.3) {
        const gapWidth = Utils.randomInt(100, 200);
        const platformWidth = baseWidth - gapWidth;
        platforms.push(new Platform(i * baseWidth, baseHeight - 40, platformWidth, 40, '#8B4513'));
      } else {
        platforms.push(new Platform(i * baseWidth, baseHeight - 40, baseWidth, 40, '#8B4513'));
      }
    }

    // Add platforms with better spacing
    // Divide the level into sections
    const sections = 15;
    const sectionWidth = levelLength / sections;

    for (let i = 0; i < sections; i++) {
      // Each section gets 1-3 platforms
      const platformsInSection = Utils.randomInt(1, 3);

      for (let j = 0; j < platformsInSection; j++) {
        const width = Utils.randomInt(100, 200);

        // Position within section, but not too close to edges
        const sectionStart = i * sectionWidth;
        const sectionEnd = (i + 1) * sectionWidth;
        const availableSpace = sectionEnd - sectionStart - width;
        const x = sectionStart + Utils.randomInt(width/2, availableSpace - width/2);

        // Vary heights but ensure they're reachable
        const minHeight = baseHeight * 0.3;
        const maxHeight = baseHeight * 0.8;
        const y = Utils.randomInt(minHeight, maxHeight);

        // Ensure vertical spacing between platforms in the same section
        let validPosition = true;
        for (let p of platforms) {
          // Check if this platform is too close vertically to another in similar x range
          if (Math.abs(p.y - y) < 100 &&
              Math.abs((p.x + p.width/2) - (x + width/2)) < sectionWidth) {
            validPosition = false;
            break;
          }
        }

        if (validPosition) {
          platforms.push(new Platform(x, y, width, 20));
        }
      }
    }

    // Add a final platform for the boss
    platforms.push(new Platform(levelLength - 300, baseHeight - 150, 250, 30, '#FF0000'));

    return platforms;
  }
};
