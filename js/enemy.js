/**
 * Enemy class for the platform game
 */
class Enemy {
  /**
   * Create a new enemy
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of enemy
   * @param {number} height - Height of enemy
   * @param {number} speed - Movement speed
   */
  constructor(x, y, width = 30, height = 30, speed = 2) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed; // Make sure this is a positive number
    this.direction = 1; // 1 for right, -1 for left
    this.color = '#00FF00';

    // Ensure speed is never too small
    if (this.speed < 1) {
      this.speed = 1;
    }
  }

  /**
   * Update enemy position and state
   * @param {Array} platforms - Array of platform objects
   */
  update(platforms) {
    // Check if enemy is on a platform
    let onPlatform = false;
    let platformEdgeLeft = 0;
    let platformEdgeRight = 0;

    for (let platform of platforms) {
      if (this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + 10) {

        onPlatform = true;
        platformEdgeLeft = platform.x;
        platformEdgeRight = platform.x + platform.width;
        break;
      }
    }

    // If not on a platform, fall down
    if (!onPlatform) {
      this.y += 5; // Fall speed

      // Check if we've fallen onto a platform
      for (let platform of platforms) {
        if (this.x + this.width > platform.x &&
          this.x < platform.x + platform.width &&
          this.y + this.height >= platform.y &&
          this.y + this.height <= platform.y + 15) { // Slightly larger detection area

          // Snap to platform
          this.y = platform.y - this.height;
          onPlatform = true;
          platformEdgeLeft = platform.x;
          platformEdgeRight = platform.x + platform.width;
          break;
        }
      }

      // If we've fallen too far, reset position to a platform
      if (this.y > 1000) {
        // Find a suitable platform
        for (let platform of platforms) {
          if (platform.width >= 100) {
            this.x = platform.x + platform.width / 2 - this.width / 2;
            this.y = platform.y - this.height;
            break;
          }
        }
      }
    } else {
      // Move horizontally only if on a platform
      this.x += this.speed * this.direction;

      // Check if we're at the edge of the platform
      if (this.x <= platformEdgeLeft || this.x + this.width >= platformEdgeRight) {
        // Change direction
        this.direction *= -1;

        // Move away from the edge to prevent getting stuck
        this.x = Math.max(platformEdgeLeft, Math.min(platformEdgeRight - this.width, this.x));
      }
    }

    // Screen boundary check
    if (this.x < 0) {
      this.direction = 1; // Force direction to right
      this.x = 0;
    }
  }

  /**
   * Draw the enemy on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX = 0) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

    // Draw eyes
    ctx.fillStyle = '#000000';
    if (this.direction === 1) {
      ctx.fillRect(this.x - offsetX + 20, this.y + 8, 5, 5);
    } else {
      ctx.fillRect(this.x - offsetX + 5, this.y + 8, 5, 5);
    }
  }

  /**
   * Check if enemy collides with player
   * @param {Player} player - Player object
   * @returns {boolean} - True if collision detected
   */
  checkCollision(player) {
    return Utils.checkCollision(this, player);
  }
}

/**
 * Enemy generator for creating enemies
 */
const EnemyGenerator = {
  /**
   * Generate enemies for a level
   * @param {Array} platforms - Array of Platform objects
   * @param {number} count - Number of enemies to generate
   * @returns {Array} - Array of Enemy objects
   */
  generateEnemies: function (platforms, count = 3) {
    const enemies = [];

    // Filter out suitable platforms (wide enough and not at the very beginning)
    const suitablePlatforms = platforms.filter(p =>
      p.width >= 150 && // Wide enough for enemy movement
      p.x > 300 && // Not too close to start
      p.y < 550 // Not at the very bottom (ground)
    );

    // Sort by width (descending) to prioritize wider platforms
    suitablePlatforms.sort((a, b) => b.width - a.width);

    // Create enemies on the best platforms
    for (let i = 0; i < Math.min(count, suitablePlatforms.length); i++) {
      const platform = suitablePlatforms[i];

      // Position enemy in the middle of the platform
      const x = platform.x + platform.width / 2 - 15; // Center the 30px wide enemy
      const y = platform.y - 30; // Position on top of platform

      // Use a fixed speed to ensure consistent movement
      const speed = 2;

      // Create the enemy
      const enemy = new Enemy(x, y, 30, 30, speed);

      // Add to enemies array
      enemies.push(enemy);
    }

    // If we need more enemies, add some on ground platforms
    if (enemies.length < count) {
      // Find ground platforms
      const groundPlatforms = platforms.filter(p =>
        p.y >= 550 && // Near the bottom
        p.width >= 200 && // Wide enough
        p.x > 300 // Not too close to start
      );

      for (let i = 0; i < Math.min(count - enemies.length, groundPlatforms.length); i++) {
        const platform = groundPlatforms[i];

        const x = platform.x + platform.width / 2 - 15;
        const y = platform.y - 30;

        // Create the enemy with fixed speed
        const enemy = new Enemy(x, y, 30, 30, 2);

        enemies.push(enemy);
      }
    }

    return enemies;
  }
};
