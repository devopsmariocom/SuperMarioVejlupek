/**
 * Player class for the platform game
 */
class Player {
  /**
   * Create a new player
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.jumpForce = 15;
    this.gravity = 0.8;
    this.isJumping = false;
    this.color = '#FF0000';
    this.lives = 3;
    this.score = 0;

    // Mobile-specific properties
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Adjust properties for mobile if needed
    if (this.isMobile) {
      this.speed = 6; // Slightly faster movement on mobile for better responsiveness
      this.jumpForce = 16; // Slightly higher jump on mobile
    }
  }

  /**
   * Update player position and state
   * @param {Object} input - Input state
   * @param {Array} platforms - Array of platform objects
   */
  update(input, platforms) {
    // Horizontal movement
    this.velocityX = 0;
    if (input.keys.left) {
      this.velocityX = -this.speed;
    }
    if (input.keys.right) {
      this.velocityX = this.speed;
    }

    // Apply gravity
    this.velocityY += this.gravity;

    // Jump if on ground and jump key pressed
    if (input.keys.up && !this.isJumping) {
      this.velocityY = -this.jumpForce;
      this.isJumping = true;

      // Add a small horizontal boost when jumping on mobile for better control
      if (this.isMobile && (input.keys.left || input.keys.right)) {
        this.velocityX *= 1.2; // Boost horizontal movement during jump
      }
    }

    // Allow small jump control in the air on mobile
    if (this.isMobile && this.isJumping && this.velocityY < 0) {
      // Slightly adjust jump height based on how long jump button is held
      if (!input.keys.up && this.velocityY < -5) {
        this.velocityY = -5; // Cut jump short if button released
      }
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check for platform collisions
    this.isJumping = true; // Assume in air unless proven otherwise
    for (let platform of platforms) {
      if (this.velocityY > 0 && // Moving downward
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + this.velocityY + 10) {

        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isJumping = false;
      }
    }

    // Screen boundaries - only limit left edge, allow movement to the right
    const baseHeight = 600; // Base design height

    // Only prevent going left of the screen
    if (this.x < 0) this.x = 0;

    // No right boundary to allow level progression
    // We'll handle camera movement in the Game class

    // Check if player fell off the bottom
    if (this.y > baseHeight) {
      this.lives--;
      if (this.lives > 0) {
        // Reset position relative to current camera position (handled in Game class)
        // This will be overridden in the Game class
        this.velocityY = 0;
      }
    }
  }

  /**
   * Draw the player on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX = 0) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

    // Draw eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x - offsetX + 10, this.y + 15, 5, 5);
    ctx.fillRect(this.x - offsetX + 25, this.y + 15, 5, 5);

    // Draw mouth - happy when moving right, sad when moving left
    ctx.fillStyle = '#000000';
    if (this.velocityX > 0) {
      // Happy mouth
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2, this.y + 35, 8, 0, Math.PI);
      ctx.fill();
    } else if (this.velocityX < 0) {
      // Sad mouth
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2, this.y + 40, 8, Math.PI, Math.PI * 2);
      ctx.fill();
    } else {
      // Neutral mouth
      ctx.fillRect(this.x - offsetX + 15, this.y + 35, 10, 3);
    }
  }
}
