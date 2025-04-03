/**
 * Mystery Box class for the platform game
 * Provides random power-ups or penalties when collected
 */
class MysteryBox {
  /**
   * Create a new mystery box
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.color = '#FFD700'; // Gold color
    this.isCollected = false;
    this.pulseDirection = 1;
    this.pulseAmount = 0;
    this.pulseSpeed = 0.05;
    this.questionMarkOpacity = 1;
  }

  /**
   * Update mystery box animation
   */
  update() {
    if (this.isCollected) return;

    // Pulse animation
    this.pulseAmount += this.pulseSpeed * this.pulseDirection;
    if (this.pulseAmount > 1) {
      this.pulseAmount = 1;
      this.pulseDirection = -1;
    } else if (this.pulseAmount < 0) {
      this.pulseAmount = 0;
      this.pulseDirection = 1;
    }

    // Question mark fade animation
    this.questionMarkOpacity = 0.5 + this.pulseAmount * 0.5;
  }

  /**
   * Draw the mystery box on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Camera offset X
   */
  draw(ctx, offsetX = 0) {
    if (this.isCollected) return;

    // Draw box with glow effect
    ctx.save();

    // Outer glow
    const glowSize = 5 + this.pulseAmount * 3;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
    ctx.shadowBlur = glowSize;

    // Box
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

    // Question mark
    ctx.fillStyle = `rgba(0, 0, 0, ${this.questionMarkOpacity})`;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', this.x - offsetX + this.width / 2, this.y + this.height / 2);

    ctx.restore();
  }

  /**
   * Check if mystery box collides with player
   * @param {Player} player - Player object
   * @returns {boolean} - True if collision detected
   */
  checkCollision(player) {
    if (this.isCollected) return false;
    return Utils.checkCollision(this, player);
  }

  /**
   * Activate a random effect on the player
   * @param {Player} player - Player object
   * @returns {Object} - Effect information
   */
  activate(player) {
    this.isCollected = true;

    // Define possible effects
    const effects = [
      // Positive effects
      {
        type: 'hat',
        name: 'Klobouk',
        description: 'Stylový klobouk!',
        duration: 15000,
        apply: (player) => {
          player.hat = true;
          player.hatColor = '#333333';
        },
        remove: (player) => {
          player.hat = false;
        }
      },
      {
        type: 'suit',
        name: 'Smoking',
        description: 'Elegantní smoking!',
        duration: 15000,
        apply: (player) => {
          player.suit = true;
          player.color = '#000080'; // Navy blue
        },
        remove: (player) => {
          player.suit = false;
          player.color = '#FF0000'; // Reset to default red
        }
      },
      {
        type: 'invincibility',
        name: 'Nesmrtelnost',
        description: 'Dočasná nesmrtelnost!',
        duration: 10000,
        apply: (player) => {
          player.isInvincible = true;
        },
        remove: (player) => {
          player.isInvincible = false;
        }
      },
      {
        type: 'cloud',
        name: 'Létající obláček',
        description: 'Létající obláček!',
        duration: 8000,
        apply: (player) => {
          player.hasCloud = true;
          player.gravity = 0.2; // Reduced gravity
          player.jumpForce = 10; // Reduced jump force (floaty)
        },
        remove: (player) => {
          player.hasCloud = false;
          player.gravity = 0.8; // Reset gravity
          player.jumpForce = 15; // Reset jump force
        }
      },
      {
        type: 'speed',
        name: 'Rychlost',
        description: 'Super rychlost!',
        duration: 12000,
        apply: (player) => {
          player.speedBoost = true;
          player.speed *= 1.7;
        },
        remove: (player) => {
          player.speedBoost = false;
          player.speed /= 1.7;
        }
      },

      // Negative effects
      {
        type: 'poop',
        name: 'Hovínko',
        description: 'Fuj, hovínko!',
        duration: 8000,
        apply: (player) => {
          player.pooped = true;
          player.color = '#8B4513'; // Brown
          player.speed *= 0.7; // Slower
        },
        remove: (player) => {
          player.pooped = false;
          player.color = '#FF0000'; // Reset to default red
          player.speed /= 0.7; // Reset speed
        }
      },
      {
        type: 'glitch',
        name: 'Glitch',
        description: 'Glitch v matrixu!',
        duration: 7000,
        apply: (player) => {
          player.glitching = true;
        },
        remove: (player) => {
          player.glitching = false;
        }
      },
      {
        type: 'reverse',
        name: 'Obrácené ovládání',
        description: 'Obrácené ovládání!',
        duration: 10000,
        apply: (player) => {
          player.reversedControls = true;
        },
        remove: (player) => {
          player.reversedControls = false;
        }
      },
      {
        type: 'shrink',
        name: 'Zmenšení',
        description: 'Zmenšení!',
        duration: 9000,
        apply: (player) => {
          player.shrunk = true;
          player.width /= 2;
          player.height /= 2;
          player.jumpForce *= 0.8;
        },
        remove: (player) => {
          player.shrunk = false;
          player.width *= 2;
          player.height *= 2;
          player.jumpForce /= 0.8;
        }
      }
    ];

    // Select a random effect
    const effect = effects[Math.floor(Math.random() * effects.length)];

    // Apply the effect
    effect.apply(player);

    // Set a timeout to remove the effect
    setTimeout(() => {
      effect.remove(player);
    }, effect.duration);

    return effect;
  }
}

/**
 * Mystery Box generator for creating mystery boxes
 */
const MysteryBoxGenerator = {
  /**
   * Generate mystery boxes for a level
   * @param {Array} platforms - Array of Platform objects
   * @param {number} count - Number of mystery boxes to generate
   * @returns {Array} - Array of MysteryBox objects
   */
  generateMysteryBoxes: function (platforms, count = 5) {
    const mysteryBoxes = [];

    // Filter out suitable platforms (not at the very beginning or end)
    const suitablePlatforms = platforms.filter(p =>
      p.width >= 100 && // Wide enough
      p.x > 200 && // Not too close to start
      p.x < 3800 && // Not too close to end
      p.y < 550 // Not at the very bottom (ground)
    );

    // Shuffle platforms to get random distribution
    const shuffledPlatforms = [...suitablePlatforms].sort(() => 0.5 - Math.random());

    // Create mystery boxes on random platforms
    for (let i = 0; i < Math.min(count, shuffledPlatforms.length); i++) {
      const platform = shuffledPlatforms[i];

      // Position mystery box above the platform
      const x = platform.x + Utils.randomInt(50, platform.width - 50);
      const y = platform.y - 60; // Position above platform

      // Create the mystery box
      const mysteryBox = new MysteryBox(x, y);

      // Add to mystery boxes array
      mysteryBoxes.push(mysteryBox);
    }

    return mysteryBoxes;
  }
};
