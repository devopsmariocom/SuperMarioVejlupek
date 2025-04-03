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
    this.speed = speed;
    this.direction = 1; // 1 for right, -1 for left
    this.color = '#00FF00';
  }

  /**
   * Update enemy position and state
   * @param {Array} platforms - Array of platform objects
   */
  update(platforms) {
    // Move horizontally
    this.x += this.speed * this.direction;

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

    // Change direction if at platform edge or wall
    if (onPlatform) {
      if (this.x <= platformEdgeLeft || this.x + this.width >= platformEdgeRight) {
        this.direction *= -1;
      }
    }

    // Screen boundaries - use base dimensions for consistent gameplay
    const baseWidth = 800;  // Base design width
    if (this.x < 0 || this.x + this.width > baseWidth) {
      this.direction *= -1;
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

    // Skip the first platform (usually the ground)
    for (let i = 1; i < platforms.length && enemies.length < count; i++) {
      const platform = platforms[i];

      // Only add enemy if platform is wide enough
      if (platform.width >= 100) {
        const x = platform.x + 20;
        const y = platform.y - 30; // Position enemy on top of platform
        enemies.push(new Enemy(x, y));
      }
    }

    return enemies;
  }
};
