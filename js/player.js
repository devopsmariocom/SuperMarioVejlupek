/**
 * Debug information for device detection - will run immediately
 */
(function () {
  // Create a visible debug overlay
  const debugOverlay = document.createElement('div');
  debugOverlay.style.position = 'fixed';
  debugOverlay.style.top = '10px';
  debugOverlay.style.right = '10px';
  debugOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  debugOverlay.style.color = '#fff';
  debugOverlay.style.padding = '10px';
  debugOverlay.style.borderRadius = '5px';
  debugOverlay.style.zIndex = '9999';
  debugOverlay.style.maxWidth = '80%';
  debugOverlay.style.fontSize = '12px';
  debugOverlay.style.fontFamily = 'monospace';

  // Add debug information
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints;
  const hasTouch = 'ontouchend' in document;
  const screenSize = window.screen.width + 'x' + window.screen.height;

  // iPad detection tests
  const isStandardIpad = /iPad/i.test(userAgent) || /iPad/i.test(platform);
  const isIpadPro = (/MacIntel/i.test(platform) && maxTouchPoints > 1) ||
    (/Macintosh/i.test(userAgent) && hasTouch);
  const isIpadBySize = hasTouch &&
    Math.min(window.screen.width, window.screen.height) >= 768 &&
    Math.max(window.screen.width, window.screen.height) >= 1024;

  // Set debug text
  debugOverlay.innerHTML = `
    <strong>DEVICE DEBUG INFO</strong><br>
    User Agent: ${userAgent.substring(0, 50)}...<br>
    Platform: ${platform}<br>
    Touch Points: ${maxTouchPoints}<br>
    Has Touch: ${hasTouch}<br>
    Screen: ${screenSize}<br>
    iPad Standard: ${isStandardIpad}<br>
    iPad Pro: ${isIpadPro}<br>
    iPad by Size: ${isIpadBySize}<br>
    <strong>TOUCH MODE FORCED ON</strong>
  `;

  // Add to document when DOM is ready
  if (document.body) {
    document.body.appendChild(debugOverlay);
  } else {
    window.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(debugOverlay);
    });
  }

  // Also log to console
  console.log('==========================================');
  console.log('DEVICE DETECTION DEBUG - IMMEDIATE CHECK');
  console.log('==========================================');
  console.log('User Agent:', userAgent);
  console.log('Platform:', platform);
  console.log('Max Touch Points:', maxTouchPoints);
  console.log('Has ontouchend:', hasTouch);
  console.log('Screen size:', screenSize);
  console.log('isStandardIpad:', isStandardIpad);
  console.log('isIpadPro:', isIpadPro);
  console.log('isIpadBySize:', isIpadBySize);
  console.log('Combined iPad detection:', isStandardIpad || isIpadPro || isIpadBySize);
  console.log('TOUCH MODE FORCED ON');
  console.log('==========================================');
})();

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
    this.canDoubleJump = false; // Track if player can perform a double jump
    this.hasDoubleJumped = false; // Track if player has already used double jump
    this.color = '#FF0000';
    this.lives = 3;
    this.score = 0;

    // Detect iPad specifically - multiple approaches for different iPad models and iOS versions
    const isStandardIpad = /iPad/i.test(navigator.userAgent) || /iPad/i.test(navigator.platform);

    // Modern iPads with iPadOS report as MacIntel but have touch capabilities
    // Using multiple detection methods for better reliability
    const isIpadPro = (/MacIntel/i.test(navigator.platform) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1) ||
      (/Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document);

    // Additional iPad detection using screen size and touch capabilities
    const isIpadBySize = 'ontouchend' in document &&
      Math.min(window.screen.width, window.screen.height) >= 768 &&
      Math.max(window.screen.width, window.screen.height) >= 1024;

    // Combined iPad detection
    this.isIpad = isStandardIpad || isIpadPro || isIpadBySize;

    // Mobile detection (phones)
    this.isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // General tablet detection for non-iPad tablets
    this.isOtherTablet = /Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) ||
      (!this.isIpad && navigator.maxTouchPoints > 1 && window.innerWidth >= 600);

    // Combined tablet detection
    this.isTablet = this.isIpad || this.isOtherTablet;

    // Touch device (either mobile or tablet)
    this.isTouchDevice = this.isMobile || this.isTablet;

    // FORCE TOUCH DEVICE FOR TESTING - REMOVE IN PRODUCTION
    this.isTouchDevice = true;

    // Debug information - log to console for troubleshooting
    console.log('Device detection info:');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Platform:', navigator.platform);
    console.log('- Max Touch Points:', navigator.maxTouchPoints);
    console.log('- Has ontouchend:', 'ontouchend' in document);
    console.log('- Screen size:', window.screen.width, 'x', window.screen.height);
    console.log('- isStandardIpad:', isStandardIpad);
    console.log('- isIpadPro:', isIpadPro);
    console.log('- isIpadBySize:', isIpadBySize);
    console.log('- isIpad:', this.isIpad);
    console.log('- isMobile:', this.isMobile);
    console.log('- isTablet:', this.isTablet);
    console.log('- isTouchDevice:', this.isTouchDevice);

    // Adjust properties for touch devices
    if (this.isTouchDevice) {
      this.speed = 6; // Slightly faster movement on touch devices for better responsiveness
      this.jumpForce = 16; // Slightly higher jump on touch devices
    }

    // Mystery box effect properties
    this.activeEffect = null;
    this.effectEndTime = 0;

    // Appearance modifiers
    this.hat = false;
    this.hatColor = '#333333';
    this.suit = false;
    this.pooped = false;
    this.hasCloud = false;

    // Gameplay modifiers
    this.isInvincible = false;
    this.glitching = false;
    this.glitchFrame = 0;
    this.visible = true;
    this.reversedControls = false;
    this.speedBoost = false;
    this.shrunk = false;

    // Double jump effect
    this.doubleJumpEffect = false;
    this.doubleJumpEffectTimer = 0;
  }

  /**
   * Update player position and state
   * @param {Object} input - Input state
   * @param {Array} platforms - Array of platform objects
   */
  update(input, platforms) {
    // Update glitch effect if active
    if (this.glitching) {
      this.glitchFrame++;
      if (this.glitchFrame % 5 === 0) {
        this.visible = !this.visible;
      }
    } else {
      this.visible = true;
    }

    // Horizontal movement with reversed controls support
    this.velocityX = 0;
    if (this.reversedControls) {
      // Reversed controls
      if (input.keys.right) {
        this.velocityX = -this.speed;
      }
      if (input.keys.left) {
        this.velocityX = this.speed;
      }
    } else {
      // Normal controls
      if (input.keys.left) {
        this.velocityX = -this.speed;
      }
      if (input.keys.right) {
        this.velocityX = this.speed;
      }
    }

    // Apply gravity (reduced if on cloud)
    this.velocityY += this.gravity;

    // Jump if on ground and jump key pressed
    if (input.keys.up && !this.isJumping) {
      this.velocityY = -this.jumpForce;
      this.isJumping = true;
      this.canDoubleJump = true; // Enable double jump when first jump occurs
      this.hasDoubleJumped = false; // Reset double jump flag

      // Add a small horizontal boost when jumping on touch devices for better control
      if (this.isTouchDevice && (input.keys.left || input.keys.right)) {
        this.velocityX *= 1.2; // Boost horizontal movement during jump
      }
    }

    // Double jump when in the air
    else if (input.keys.up && input.keys.upPressed && this.isJumping && this.canDoubleJump && !this.hasDoubleJumped) {
      this.velocityY = -this.jumpForce * 0.8; // Slightly weaker than first jump
      this.hasDoubleJumped = true; // Mark double jump as used
      this.canDoubleJump = false; // Prevent further double jumps until landing

      // Visual feedback for double jump - temporarily change color
      this.doubleJumpEffect = true;
      this.doubleJumpEffectTimer = 15; // Show effect for 15 frames
    }

    // Handle double jump visual effect
    if (this.doubleJumpEffect) {
      this.doubleJumpEffectTimer--;
      if (this.doubleJumpEffectTimer <= 0) {
        this.doubleJumpEffect = false;
      }
    }

    // Allow small jump control in the air on touch devices
    if (this.isTouchDevice && this.isJumping && this.velocityY < 0) {
      // Slightly adjust jump height based on how long jump button is held
      if (!input.keys.up && this.velocityY < -5) {
        this.velocityY = -5; // Cut jump short if button released
      }
    }

    // Special cloud behavior
    if (this.hasCloud) {
      // Floating effect - slower fall
      if (this.velocityY > 2) {
        this.velocityY = 2;
      }

      // Allow multiple jumps in air
      if (input.keys.up && input.keys.upPressed) {
        this.velocityY = -this.jumpForce * 0.7;
        input.keys.upPressed = false;
      }
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // If glitching, randomly adjust position occasionally
    if (this.glitching && Math.random() < 0.1) {
      this.x += (Math.random() - 0.5) * 10;
      this.y += (Math.random() - 0.5) * 10;
    }

    // Check for platform collisions
    this.isJumping = true; // Assume in air unless proven otherwise
    for (let platform of platforms) {
      // Skip platform collision if glitching and randomly determined
      if (this.glitching && Math.random() < 0.2) continue;

      if (this.velocityY > 0 && // Moving downward
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + this.velocityY + 10) {

        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isJumping = false;
        this.hasDoubleJumped = false; // Reset double jump when landing
        this.canDoubleJump = false; // Reset double jump capability
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
      // Don't lose a life if invincible
      if (!this.isInvincible) {
        this.lives--;
      }

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
    // Skip drawing if player is invisible due to glitching
    if (!this.visible) return;

    ctx.save();

    // Apply invincibility effect (flashing)
    if (this.isInvincible) {
      ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 100) * 0.3;
    }

    // Draw cloud if player has cloud effect
    if (this.hasCloud) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      const cloudX = this.x - offsetX + this.width / 2;
      const cloudY = this.y + this.height - 10;
      const cloudRadius = this.width * 0.8;

      // Draw cloud puffs
      ctx.arc(cloudX - cloudRadius / 2, cloudY, cloudRadius / 2, 0, Math.PI * 2);
      ctx.arc(cloudX, cloudY - cloudRadius / 4, cloudRadius / 1.7, 0, Math.PI * 2);
      ctx.arc(cloudX + cloudRadius / 2, cloudY, cloudRadius / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw player body
    if (this.doubleJumpEffect) {
      // Flash white during double jump
      const flashIntensity = Math.sin(Date.now() / 30) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`;

      // Draw a glow effect
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 10;

      // Draw the player with glow
      ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);

      // Reset shadow for other elements
      ctx.shadowBlur = 0;

      // Draw the player's normal color with some transparency
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
      ctx.globalAlpha = 1.0;
    } else {
      // Normal drawing
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
    }

    // Draw suit if player has suit effect
    if (this.suit) {
      // Draw bow tie
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(this.x - offsetX + this.width / 2, this.y + 10);
      ctx.lineTo(this.x - offsetX + this.width / 2 - 8, this.y + 5);
      ctx.lineTo(this.x - offsetX + this.width / 2 - 8, this.y + 15);
      ctx.lineTo(this.x - offsetX + this.width / 2, this.y + 10);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.x - offsetX + this.width / 2, this.y + 10);
      ctx.lineTo(this.x - offsetX + this.width / 2 + 8, this.y + 5);
      ctx.lineTo(this.x - offsetX + this.width / 2 + 8, this.y + 15);
      ctx.lineTo(this.x - offsetX + this.width / 2, this.y + 10);
      ctx.fill();

      // Draw buttons
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x - offsetX + this.width / 2 - 2, this.y + 20, 4, 4);
      ctx.fillRect(this.x - offsetX + this.width / 2 - 2, this.y + 30, 4, 4);
      ctx.fillRect(this.x - offsetX + this.width / 2 - 2, this.y + 40, 4, 4);
    }

    // Draw eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x - offsetX + 10, this.y + 15, 5, 5);
    ctx.fillRect(this.x - offsetX + 25, this.y + 15, 5, 5);

    // Draw mouth - happy when moving right, sad when moving left, poop face when pooped
    if (this.pooped) {
      // Poop face
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2, this.y + 40, 8, Math.PI, Math.PI * 2);
      ctx.fill();

      // Draw poop on head
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2, this.y - 5, 10, 0, Math.PI * 2);
      ctx.fill();

      // Poop details
      ctx.fillStyle = '#5D3A1A';
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2 - 3, this.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x - offsetX + this.width / 2 + 4, this.y - 6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal face expressions
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

    // Draw hat if player has hat effect
    if (this.hat) {
      ctx.fillStyle = this.hatColor;
      // Hat brim
      ctx.fillRect(this.x - offsetX - 5, this.y - 5, this.width + 10, 5);
      // Hat top
      ctx.fillRect(this.x - offsetX + 5, this.y - 15, this.width - 10, 10);
    }

    // Draw speed effect
    if (this.speedBoost) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      // Speed lines
      for (let i = 0; i < 5; i++) {
        const lineX = this.x - offsetX - 10 - i * 5;
        const lineHeight = 10 + i * 3;
        const lineY = this.y + this.height / 2 - lineHeight / 2;
        ctx.fillRect(lineX, lineY, 2, lineHeight);
      }
    }

    // Restore context
    ctx.restore();
  }
}
