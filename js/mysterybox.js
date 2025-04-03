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
    this.width = 40; // Larger box
    this.height = 40; // Larger box
    this.color = '#FFD700'; // Gold color
    this.isCollected = false;
    this.pulseDirection = 1;
    this.pulseAmount = 0;
    this.pulseSpeed = 0.05;
    this.questionMarkOpacity = 1;
    this.glowSize = 10; // Larger glow
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
    const glowSize = this.glowSize + this.pulseAmount * 5;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
    ctx.shadowBlur = glowSize;

    // Box with rounded corners
    ctx.fillStyle = this.color;
    const radius = 8;

    ctx.beginPath();
    ctx.moveTo(this.x - offsetX + radius, this.y);
    ctx.lineTo(this.x - offsetX + this.width - radius, this.y);
    ctx.arcTo(this.x - offsetX + this.width, this.y, this.x - offsetX + this.width, this.y + radius, radius);
    ctx.lineTo(this.x - offsetX + this.width, this.y + this.height - radius);
    ctx.arcTo(this.x - offsetX + this.width, this.y + this.height, this.x - offsetX + this.width - radius, this.y + this.height, radius);
    ctx.lineTo(this.x - offsetX + radius, this.y + this.height);
    ctx.arcTo(this.x - offsetX, this.y + this.height, this.x - offsetX, this.y + this.height - radius, radius);
    ctx.lineTo(this.x - offsetX, this.y + radius);
    ctx.arcTo(this.x - offsetX, this.y, this.x - offsetX + radius, this.y, radius);
    ctx.closePath();

    ctx.fill();

    // Add a border
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)'; // Brown border
    ctx.lineWidth = 2;
    ctx.stroke();

    // Question mark
    ctx.fillStyle = `rgba(0, 0, 0, ${this.questionMarkOpacity})`;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', this.x - offsetX + this.width / 2, this.y + this.height / 2);

    // Add a small sparkle effect
    if (Math.random() < 0.1) {
      ctx.fillStyle = 'white';
      const sparkleSize = 3 + Math.random() * 2;
      const sparkleX = this.x - offsetX + Math.random() * this.width;
      const sparkleY = this.y + Math.random() * this.height;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
    }

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
      p.width >= 50 && // Wide enough for a box
      p.x > 100 && // Not too close to start
      p.x < 4000 // Not too close to end
      // Allow ground platforms too
    );

    console.log("Suitable platforms for mystery boxes:", suitablePlatforms.length);

    // Shuffle platforms to get random distribution
    const shuffledPlatforms = [...suitablePlatforms].sort(() => 0.5 - Math.random());

    // Create mystery boxes on random platforms
    for (let i = 0; i < Math.min(count, shuffledPlatforms.length); i++) {
      const platform = shuffledPlatforms[i];

      // Position mystery box above the platform
      const x = platform.x + Math.min(50, platform.width / 4) + Utils.randomInt(0, Math.max(0, platform.width - 100));
      const y = platform.y - 80; // Position higher above platform

      // Create the mystery box
      const mysteryBox = new MysteryBox(x, y);

      // Add to mystery boxes array
      mysteryBoxes.push(mysteryBox);
    }

    // Add a few guaranteed boxes near the start for visibility
    // Find ground platform at start
    const startPlatform = platforms.find(p => p.y >= 550 && p.x < 100);
    if (startPlatform) {
      // Add 2-3 boxes in a row above the starting platform
      const boxCount = Utils.randomInt(2, 3);
      for (let i = 0; i < boxCount; i++) {
        const x = 200 + i * 80; // Space them out
        const y = startPlatform.y - 150; // High enough to be visible
        const mysteryBox = new MysteryBox(x, y);
        mysteryBoxes.push(mysteryBox);
      }
    }

    return mysteryBoxes;
  }
};
