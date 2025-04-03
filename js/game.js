/**
 * Main game class that manages the game state and components
 */
class Game {
  /**
   * Initialize the game
   */
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Set initial dimensions
    this.baseWidth = 800;  // Base design width
    this.baseHeight = 600; // Base design height
    this.aspectRatio = this.baseWidth / this.baseHeight;

    // Set canvas to fullscreen
    this.resizeCanvas();

    // Game state
    this.isRunning = false;
    this.gameOver = false;
    this.gameWon = false;
    this.level = 1;
    this.scale = 1; // Scale factor for game objects

    // Camera/scrolling
    this.cameraX = 0;
    this.levelLength = this.baseWidth * 5; // 5 screens wide

    // Initialize game objects
    this.player = new Player(50, this.baseHeight / 2);
    this.platforms = [];
    this.enemies = [];
    this.coins = [];
    this.boss = null;

    // Initialize input handler
    Input.init();

    // Setup resize event listener
    window.addEventListener('resize', () => this.resizeCanvas());

    // Setup fullscreen button
    const fullscreenButton = document.getElementById('fullscreenButton');
    fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
  }

  /**
   * Resize the canvas to fill the window
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Calculate scale factor to maintain game proportions
    this.scale = Math.min(
      this.width / this.baseWidth,
      this.height / this.baseHeight
    );

    // If game is running, adjust game objects for new size
    if (this.isRunning) {
      this.adjustGameObjects();
    }
  }

  /**
   * Adjust game objects when canvas is resized
   */
  adjustGameObjects() {
    // Adjust platforms and enemies based on new canvas size
    // This is a simplified approach - a more complex game might need more sophisticated scaling
    this.loadLevel();
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    console.log('Toggling fullscreen mode');

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    try {
      // Implementace pro mobilní zařízení - používáme jednodušší přístup
      if (isMobile) {
        console.log('Mobile device detected');

        // Speciální implementace pro iOS
        if (isIOS) {
          console.log('iOS device detected');

          // Nastavíme canvas na celou obrazovku pomocí CSS
          const gameContainer = document.body;

          // Přepínáme třídu pro fullscreen
          if (!gameContainer.classList.contains('ios-fullscreen')) {
            console.log('Entering iOS fullscreen mode');
            gameContainer.classList.add('ios-fullscreen');

            // Skryjeme adresní řádek posunutím stránky dolů
            setTimeout(() => {
              window.scrollTo(0, 1);
            }, 100);

            // Nastavíme orientaci na landscape, pokud je to možné
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape').catch(e => {
                console.log('Orientation lock failed: ', e);
              });
            }
          } else {
            console.log('Exiting iOS fullscreen mode');
            gameContainer.classList.remove('ios-fullscreen');
          }
        }
        // Pro Android a ostatní mobilní zařízení
        else {
          console.log('Android or other mobile device detected');

          // Zkontrolujeme, zda jsme již v režimu celé obrazovky
          const fullscreenElement =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

          if (!fullscreenElement) {
            console.log('Entering fullscreen mode on Android');

            // Zkusíme nejprve canvas
            const enterFullscreen = async () => {
              try {
                if (this.canvas.requestFullscreen) {
                  await this.canvas.requestFullscreen();
                } else if (this.canvas.webkitRequestFullscreen) {
                  await this.canvas.webkitRequestFullscreen();
                } else if (this.canvas.mozRequestFullScreen) {
                  await this.canvas.mozRequestFullScreen();
                } else if (this.canvas.msRequestFullscreen) {
                  await this.canvas.msRequestFullscreen();
                } else {
                  // Fallback na document element
                  if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                  } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                  } else if (document.documentElement.mozRequestFullScreen) {
                    await document.documentElement.mozRequestFullScreen();
                  } else if (document.documentElement.msRequestFullscreen) {
                    await document.documentElement.msRequestFullscreen();
                  }
                }

                // Pro Android, nastavíme orientaci na landscape, pokud je to možné
                if (screen.orientation && screen.orientation.lock) {
                  await screen.orientation.lock('landscape').catch(e => {
                    console.log('Orientation lock failed: ', e);
                  });
                }
              } catch (err) {
                console.error('Error attempting to enter fullscreen:', err);

                // Fallback - použijeme CSS přístup jako u iOS
                document.body.classList.add('mobile-fullscreen');
                setTimeout(() => {
                  window.scrollTo(0, 1);
                }, 100);
              }
            };

            enterFullscreen();
          } else {
            console.log('Exiting fullscreen mode on Android');

            // Ukončíme režim celé obrazovky
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }

            // Odstraníme fallback třídu, pokud byla použita
            document.body.classList.remove('mobile-fullscreen');
          }
        }
      }
      // Desktop browsers
      else {
        console.log('Desktop browser detected');

        // Zkontrolujeme, zda jsme již v režimu celé obrazovky
        const fullscreenElement =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement;

        if (!fullscreenElement) {
          console.log('Entering fullscreen mode on desktop');

          // Vstoupíme do režimu celé obrazovky
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        } else {
          console.log('Exiting fullscreen mode on desktop');

          // Ukončíme režim celé obrazovky
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle error:', error);
    }

    // Force resize after a short delay to ensure proper dimensions
    setTimeout(() => {
      this.resizeCanvas();
      // If we're in the game, adjust game objects
      if (this.isRunning) {
        this.adjustGameObjects();
      }
    }, isMobile ? 500 : 200); // Delší timeout pro mobilní zařízení
  }

  /**
   * Start the game
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.gameOver = false;
      this.gameWon = false;
      this.level = 1;
      this.cameraX = 0;
      this.player = new Player(50, this.baseHeight / 2);
      this.loadLevel();
      this.gameLoop();
    }
  }

  /**
   * Load a new level
   */
  loadLevel() {
    // Reset camera
    this.cameraX = 0;

    // Generate platforms
    this.platforms = LevelGenerator.generateLevel(this.width, this.height);

    // Generate enemies - don't place them near the boss
    this.enemies = EnemyGenerator.generateEnemies(this.platforms, this.level + 2);

    // Create boss at the end of the level
    const bossX = this.levelLength - 250;
    const bossY = this.baseHeight - 150 - 100; // Position on the final platform
    this.boss = new Boss(bossX, bossY);
  }

  /**
   * Main game loop
   */
  gameLoop() {
    if (!this.isRunning) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update game objects
    this.update();

    // Draw game objects
    this.draw();

    // Check game over condition
    if (this.player.lives <= 0) {
      this.gameOver = true;
      this.isRunning = false;
      this.drawGameOver();
    }

    // Check win condition
    if (this.gameWon) {
      this.isRunning = false;
      this.drawWinScreen();
    }

    // Continue game loop
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Update all game objects
   */
  update() {
    // Update player
    this.player.update(Input, this.platforms);

    // Limit player to level bounds
    const maxPlayerX = this.levelLength - this.player.width;
    if (this.player.x > maxPlayerX) {
      this.player.x = maxPlayerX;
    }

    // Update camera position - follow player with some margin
    const cameraMargin = this.baseWidth * 0.3;
    if (this.player.x > this.cameraX + this.baseWidth - cameraMargin) {
      this.cameraX = this.player.x - (this.baseWidth - cameraMargin);
    }

    // Don't let camera go beyond level bounds
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.levelLength - this.baseWidth));

    // Update enemies that are visible or close to the screen
    for (let enemy of this.enemies) {
      // Only update enemies near the camera view
      if (Math.abs(enemy.x - this.cameraX) < this.baseWidth * 1.5) {
        enemy.update(this.platforms);

        // Check for collision with player
        if (enemy.checkCollision(this.player)) {
          // If player is above enemy (jumping on it)
          if (this.player.velocityY > 0 &&
            this.player.y + this.player.height < enemy.y + enemy.height / 2) {
            // Remove enemy
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
            this.player.velocityY = -this.player.jumpForce / 2;
            this.player.score += 100;
          } else {
            // Player loses a life
            this.player.lives--;
            if (this.player.lives > 0) {
              // Reset player position but keep camera position
              this.player.x = this.cameraX + 100;
              this.player.y = this.baseHeight / 2;
              this.player.velocityY = 0;
            }
          }
        }
      }
    }

    // Update boss
    if (this.boss) {
      this.boss.update(this.player);

      // Check if boss throws banana at player
      if (this.boss.checkBananaCollisions(this.player)) {
        this.player.lives--;
        if (this.player.lives <= 0) {
          this.gameOver = true;
          this.isRunning = false;
        }
      }

      // Check if player attacks boss
      if (this.boss.checkPlayerAttack(this.player)) {
        this.player.velocityY = -this.player.jumpForce;
        this.player.score += 200;

        // Check if boss is defeated
        if (this.boss.health <= 0) {
          this.gameWon = true;
          this.player.score += 1000;
        }
      }
    }

    // Check if player fell off the bottom
    if (this.player.y > this.baseHeight + 100) {
      this.player.lives--;
      if (this.player.lives > 0) {
        // Reset player position but keep camera position
        this.player.x = this.cameraX + 100;
        this.player.y = this.baseHeight / 2;
        this.player.velocityY = 0;
      } else {
        this.gameOver = true;
        this.isRunning = false;
      }
    }
  }

  /**
   * Draw all game objects
   */
  draw() {
    // Draw background
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Save context state
    this.ctx.save();

    // Scale everything based on the calculated scale factor
    this.ctx.scale(this.scale, this.scale);

    // Center the game in the canvas
    const offsetX = (this.width / this.scale - this.baseWidth) / 2;
    const offsetY = (this.height / this.scale - this.baseHeight) / 2;
    this.ctx.translate(offsetX, offsetY);

    // Apply camera offset
    const cameraOffsetX = this.cameraX;

    // Draw background elements (clouds, mountains, etc.)
    this.drawBackground(cameraOffsetX);

    // Draw platforms that are visible
    for (let platform of this.platforms) {
      // Only draw platforms that are visible or close to the screen
      if (platform.x + platform.width > cameraOffsetX - 100 &&
        platform.x < cameraOffsetX + this.baseWidth + 100) {
        platform.draw(this.ctx, cameraOffsetX);
      }
    }

    // Draw enemies that are visible
    for (let enemy of this.enemies) {
      // Only draw enemies that are visible or close to the screen
      if (enemy.x + enemy.width > cameraOffsetX - 50 &&
        enemy.x < cameraOffsetX + this.baseWidth + 50) {
        enemy.draw(this.ctx, cameraOffsetX);
      }
    }

    // Draw boss if it exists
    if (this.boss) {
      this.boss.draw(this.ctx, cameraOffsetX);
    }

    // Draw player
    this.player.draw(this.ctx, cameraOffsetX);

    // Restore context to draw UI without scaling
    this.ctx.restore();

    // Draw UI
    this.drawUI();

    // Draw win screen if game is won
    if (this.gameWon) {
      this.drawWinScreen();
    }
  }

  /**
   * Draw background elements
   * @param {number} offsetX - Camera offset X
   */
  drawBackground(offsetX) {
    // Draw some clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    // Create some clouds at fixed positions
    const clouds = [
      { x: 100, y: 100, width: 120, height: 60 },
      { x: 500, y: 150, width: 150, height: 70 },
      { x: 900, y: 80, width: 100, height: 50 },
      { x: 1300, y: 120, width: 130, height: 65 },
      { x: 1700, y: 90, width: 110, height: 55 },
      { x: 2100, y: 130, width: 140, height: 70 },
      { x: 2500, y: 100, width: 120, height: 60 },
      { x: 2900, y: 140, width: 130, height: 65 },
      { x: 3300, y: 110, width: 110, height: 55 },
      { x: 3700, y: 80, width: 140, height: 70 }
    ];

    // Draw clouds with parallax effect (clouds move slower than the camera)
    for (let cloud of clouds) {
      const parallaxOffset = offsetX * 0.7; // Clouds move at 70% of camera speed
      const cloudX = cloud.x - parallaxOffset;

      // Only draw clouds that are visible
      if (cloudX + cloud.width > 0 && cloudX < this.baseWidth) {
        // Draw a fluffy cloud shape
        this.ctx.beginPath();
        this.ctx.arc(cloudX + cloud.width * 0.3, cloud.y + cloud.height * 0.5, cloud.height * 0.5, 0, Math.PI * 2);
        this.ctx.arc(cloudX + cloud.width * 0.7, cloud.y + cloud.height * 0.5, cloud.height * 0.6, 0, Math.PI * 2);
        this.ctx.arc(cloudX + cloud.width * 0.5, cloud.y + cloud.height * 0.4, cloud.height * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Draw distant mountains with parallax effect
    this.ctx.fillStyle = 'rgba(100, 100, 150, 0.5)';
    const mountains = [
      { x: 0, width: 500, height: 200 },
      { x: 400, width: 600, height: 250 },
      { x: 1000, width: 450, height: 180 },
      { x: 1500, width: 550, height: 220 },
      { x: 2100, width: 500, height: 200 },
      { x: 2700, width: 600, height: 250 },
      { x: 3300, width: 450, height: 180 },
      { x: 3800, width: 550, height: 220 }
    ];

    // Draw mountains with parallax effect (mountains move slower than the camera)
    for (let mountain of mountains) {
      const parallaxOffset = offsetX * 0.4; // Mountains move at 40% of camera speed
      const mountainX = mountain.x - parallaxOffset;

      // Only draw mountains that are visible
      if (mountainX + mountain.width > 0 && mountainX < this.baseWidth) {
        this.ctx.beginPath();
        this.ctx.moveTo(mountainX, this.baseHeight);
        this.ctx.lineTo(mountainX + mountain.width / 2, this.baseHeight - mountain.height);
        this.ctx.lineTo(mountainX + mountain.width, this.baseHeight);
        this.ctx.fill();
      }
    }
  }

  /**
   * Draw game UI (score, lives, level)
   */
  drawUI() {
    this.ctx.fillStyle = '#000000';
    const fontSize = Math.max(16, Math.floor(20 * this.scale));
    this.ctx.font = `${fontSize}px Arial`;

    // Position UI elements relative to screen size with more padding to ensure visibility
    const padding = Math.max(30, Math.floor(40 * this.scale));
    this.ctx.fillText(`Score: ${this.player.score}`, padding, padding + fontSize);
    this.ctx.fillText(`Lives: ${this.player.lives}`, padding, padding * 2 + fontSize * 2);

    // Show progress to boss
    const progressWidth = Math.max(100, Math.floor(200 * this.scale));
    const progressHeight = Math.max(10, Math.floor(15 * this.scale));
    const progressX = this.width - padding - progressWidth;
    const progressY = padding;

    // Draw progress bar background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(progressX, progressY, progressWidth, progressHeight);

    // Calculate progress as percentage of level completed
    const progress = Math.min(1, this.cameraX / (this.levelLength - this.baseWidth));

    // Draw progress bar fill
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fillRect(progressX, progressY, progressWidth * progress, progressHeight);

    // Draw boss icon at the end
    if (this.boss) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillRect(progressX + progressWidth - progressHeight, progressY, progressHeight, progressHeight);
    }

    // Show boss health if boss is active and visible
    if (this.boss && this.boss.active) {
      const bossHealthWidth = Math.max(150, Math.floor(250 * this.scale));
      const bossHealthHeight = Math.max(15, Math.floor(20 * this.scale));
      const bossHealthX = (this.width - bossHealthWidth) / 2;
      const bossHealthY = padding;

      // Draw boss health bar background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(bossHealthX, bossHealthY, bossHealthWidth, bossHealthHeight);

      // Draw boss health bar fill
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillRect(bossHealthX, bossHealthY, bossHealthWidth * (this.boss.health / 5), bossHealthHeight);

      // Draw boss health text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('BOSS', this.width / 2, bossHealthY + bossHealthHeight + fontSize);
      this.ctx.textAlign = 'left'; // Reset text align
    }
  }

  /**
   * Draw game over screen
   */
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';

    // Scale font sizes based on screen size
    const titleFontSize = Math.max(32, Math.floor(48 * this.scale));
    const textFontSize = Math.max(18, Math.floor(24 * this.scale));

    this.ctx.font = `${titleFontSize}px Arial`;
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - titleFontSize);

    this.ctx.font = `${textFontSize}px Arial`;
    this.ctx.fillText(`Final Score: ${this.player.score}`, this.width / 2, this.height / 2 + textFontSize);

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Draw restart button/text
    const restartY = this.height / 2 + textFontSize * 3;

    if (isMobile) {
      // Draw a button-like background for mobile
      const restartText = 'TAP HERE TO PLAY AGAIN';
      const textWidth = this.ctx.measureText(restartText).width;
      const padding = textFontSize * 1.2;

      // Button background
      this.ctx.fillStyle = 'rgba(255, 87, 34, 0.8)'; // Orange background
      this.ctx.fillRect(
        this.width / 2 - textWidth / 2 - padding,
        restartY - textFontSize - padding / 2,
        textWidth + padding * 2,
        textFontSize + padding
      );

      // Button text
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(restartText, this.width / 2, restartY);

      // Store the button coordinates for touch detection
      this.restartButtonArea = {
        x: this.width / 2 - textWidth / 2 - padding,
        y: restartY - textFontSize - padding / 2,
        width: textWidth + padding * 2,
        height: textFontSize + padding
      };
    } else {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('Press SPACE to play again', this.width / 2, restartY);
    }

    // Listen for space key to restart
    const restartHandler = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        window.removeEventListener('keydown', restartHandler);
        this.canvas.removeEventListener('touchstart', touchRestartHandler);
        this.start();
      }
    };

    // Touch handler for mobile restart
    const touchRestartHandler = (e) => {
      e.preventDefault();

      // Get touch coordinates
      const touch = e.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      // Check if touch is within the restart button area
      if (this.restartButtonArea) {
        const btn = this.restartButtonArea;
        if (
          touchX >= btn.x &&
          touchX <= btn.x + btn.width &&
          touchY >= btn.y &&
          touchY <= btn.y + btn.height
        ) {
          window.removeEventListener('keydown', restartHandler);
          this.canvas.removeEventListener('touchstart', touchRestartHandler);
          this.start();
        }
      }
    };

    window.addEventListener('keydown', restartHandler);
    this.canvas.addEventListener('touchstart', touchRestartHandler, { passive: false });
  }

  /**
   * Draw win screen
   */
  drawWinScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#FFD700'; // Gold color
    this.ctx.textAlign = 'center';

    // Scale font sizes based on screen size
    const titleFontSize = Math.max(32, Math.floor(48 * this.scale));
    const textFontSize = Math.max(18, Math.floor(24 * this.scale));

    this.ctx.font = `${titleFontSize}px Arial`;
    this.ctx.fillText('YOU WIN!', this.width / 2, this.height / 2 - titleFontSize);

    this.ctx.font = `${textFontSize}px Arial`;
    this.ctx.fillText(`Final Score: ${this.player.score}`, this.width / 2, this.height / 2 + textFontSize);
    this.ctx.fillText('You defeated the Banana Boss!', this.width / 2, this.height / 2 + textFontSize * 2);

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Draw restart button/text
    const restartY = this.height / 2 + textFontSize * 4;

    if (isMobile) {
      // Draw a button-like background for mobile
      const restartText = 'TAP HERE TO PLAY AGAIN';
      const textWidth = this.ctx.measureText(restartText).width;
      const padding = textFontSize * 1.2;

      // Button background
      this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Gold background
      this.ctx.fillRect(
        this.width / 2 - textWidth / 2 - padding,
        restartY - textFontSize - padding / 2,
        textWidth + padding * 2,
        textFontSize + padding
      );

      // Button text
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(restartText, this.width / 2, restartY);

      // Store the button coordinates for touch detection
      this.winRestartButtonArea = {
        x: this.width / 2 - textWidth / 2 - padding,
        y: restartY - textFontSize - padding / 2,
        width: textWidth + padding * 2,
        height: textFontSize + padding
      };
    } else {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillText('Press SPACE to play again', this.width / 2, restartY);
    }

    // Draw a crown
    const crownSize = Math.max(50, Math.floor(80 * this.scale));
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2 - crownSize, this.height / 2 - titleFontSize * 2);
    this.ctx.lineTo(this.width / 2 - crownSize / 2, this.height / 2 - titleFontSize * 3);
    this.ctx.lineTo(this.width / 2, this.height / 2 - titleFontSize * 2);
    this.ctx.lineTo(this.width / 2 + crownSize / 2, this.height / 2 - titleFontSize * 3);
    this.ctx.lineTo(this.width / 2 + crownSize, this.height / 2 - titleFontSize * 2);
    this.ctx.fill();

    // Listen for space key to restart
    const restartHandler = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        window.removeEventListener('keydown', restartHandler);
        this.canvas.removeEventListener('touchstart', touchRestartHandler);
        this.start();
      }
    };

    // Touch handler for mobile restart
    const touchRestartHandler = (e) => {
      e.preventDefault();

      // Get touch coordinates
      const touch = e.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      // Check if touch is within the restart button area
      if (this.winRestartButtonArea) {
        const btn = this.winRestartButtonArea;
        if (
          touchX >= btn.x &&
          touchX <= btn.x + btn.width &&
          touchY >= btn.y &&
          touchY <= btn.y + btn.height
        ) {
          window.removeEventListener('keydown', restartHandler);
          this.canvas.removeEventListener('touchstart', touchRestartHandler);
          this.start();
        }
      }
    };

    window.addEventListener('keydown', restartHandler);
    this.canvas.addEventListener('touchstart', touchRestartHandler, { passive: false });
  }
}
