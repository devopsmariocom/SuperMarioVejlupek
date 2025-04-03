/**
 * Boss class for the platform game
 */
class Boss {
  /**
   * Create a new boss
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 100;
    this.health = 5;
    this.color = '#8B008B'; // Dark magenta
    this.bananas = [];
    this.throwTimer = 0;
    this.throwInterval = 120; // Frames between throws
    this.active = false; // Boss becomes active when player gets close
  }

  /**
   * Update boss state
   * @param {Player} player - Player object
   */
  update(player) {
    // Check if boss should be activated
    if (!this.active && Math.abs(player.x - this.x) < 800) {
      this.active = true;
    }

    if (!this.active) return;

    // Throw bananas at intervals
    this.throwTimer++;
    if (this.throwTimer >= this.throwInterval) {
      this.throwBanana(player);
      this.throwTimer = 0;

      // Throw more frequently as health decreases
      this.throwInterval = Math.max(60, 120 - (5 - this.health) * 10);
    }

    // Update bananas
    for (let i = this.bananas.length - 1; i >= 0; i--) {
      this.bananas[i].update();

      // Remove bananas that are off-screen
      if (this.bananas[i].y > 800 || this.bananas[i].x < -100 || this.bananas[i].x > 4000) {
        this.bananas.splice(i, 1);
      }
    }
  }

  /**
   * Throw a banana at the player
   * @param {Player} player - Player object
   */
  throwBanana(player) {
    // Calculate direction towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and set velocity
    const speed = 8;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed - 2; // Throw slightly upward

    // Create banana
    this.bananas.push(new Banana(this.x + this.width / 2, this.y + 20, vx, vy));
  }

  /**
   * Draw the boss
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX) {
    // Draw boss
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

    // Draw face
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x - offsetX + 20, this.y + 30, 10, 10); // Left eye
    ctx.fillRect(this.x - offsetX + 50, this.y + 30, 10, 10); // Right eye
    ctx.fillRect(this.x - offsetX + 30, this.y + 60, 20, 5);  // Mouth

    // Draw crown
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.beginPath();
    ctx.moveTo(this.x - offsetX + 10, this.y + 10);
    ctx.lineTo(this.x - offsetX + 30, this.y - 10);
    ctx.lineTo(this.x - offsetX + 50, this.y + 10);
    ctx.lineTo(this.x - offsetX + 70, this.y - 10);
    ctx.lineTo(this.x - offsetX + 80, this.y + 10);
    ctx.fill();

    // Draw health bar
    const healthBarWidth = this.width;
    const healthPercentage = this.health / 5;

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x - offsetX, this.y - 20, healthBarWidth, 10);

    ctx.fillStyle = '#00FF00';
    ctx.fillRect(this.x - offsetX, this.y - 20, healthBarWidth * healthPercentage, 10);

    // Draw bananas
    for (let banana of this.bananas) {
      banana.draw(ctx, offsetX);
    }
  }

  /**
   * Check if a banana hits the player
   * @param {Player} player - Player object
   * @returns {boolean} - True if player is hit
   */
  checkBananaCollisions(player) {
    for (let i = this.bananas.length - 1; i >= 0; i--) {
      if (Utils.checkCollision(this.bananas[i], player)) {
        this.bananas.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Handle player attack on boss
   * @param {Player} player - Player object
   * @returns {boolean} - True if boss was hit
   */
  checkPlayerAttack(player) {
    // Player must be falling (jumping on boss)
    if (player.velocityY > 0 &&
      player.x + player.width > this.x &&
      player.x < this.x + this.width &&
      player.y + player.height > this.y &&
      player.y < this.y + this.height / 2) {

      this.health--;
      return true;
    }
    return false;
  }
}

/**
 * Banana projectile class
 */
class Banana {
  /**
   * Create a new banana projectile
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} vx - X velocity
   * @param {number} vy - Y velocity
   */
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 0.2;
    this.rotation = 0;
    this.rotationSpeed = 0.1;
  }

  /**
   * Update banana position
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
  }

  /**
   * Draw the banana
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX) {
    ctx.save();

    // Translate to banana center for rotation
    ctx.translate(this.x - offsetX + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Draw banana
    ctx.fillStyle = '#FFD700'; // Gold/yellow
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
