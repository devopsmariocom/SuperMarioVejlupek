/**
 * Main entry point for the game
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create and start the game
  const game = new Game();

  // Add start screen
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Handle window resize for start screen
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawStartScreen();
  }

  // Initial resize
  handleResize();

  // Listen for resize events
  window.addEventListener('resize', handleResize);

  // Draw start screen
  function drawStartScreen() {
    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale based on screen size
    const baseWidth = 800;
    const baseHeight = 600;
    const scale = Math.min(
      canvas.width / baseWidth,
      canvas.height / baseHeight
    );

    // Scale font sizes based on screen size
    const titleFontSize = Math.max(32, Math.floor(48 * scale));
    const textFontSize = Math.max(18, Math.floor(24 * scale));
    const characterSize = Math.max(30, Math.floor(40 * scale));

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = `${titleFontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('PLATFORM GAME', canvas.width / 2, canvas.height / 3);

    // Instructions
    ctx.font = `${textFontSize}px Arial`;
    const lineSpacing = textFontSize * 1.5;
    ctx.fillText('Use arrow keys or WASD to move', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Jump on enemies to defeat them', canvas.width / 2, canvas.height / 2 + lineSpacing);
    ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + lineSpacing * 2.5);

    // Draw a simple character
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(canvas.width / 2 - characterSize / 2, canvas.height * 0.7, characterSize, characterSize * 1.5);

    // Draw eyes
    const eyeSize = Math.max(3, Math.floor(5 * scale));
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 - characterSize / 4, canvas.height * 0.7 + characterSize / 4, eyeSize, eyeSize);
    ctx.fillRect(canvas.width / 2 + characterSize / 8, canvas.height * 0.7 + characterSize / 4, eyeSize, eyeSize);

    // Fullscreen instructions
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText('Click the Fullscreen button for best experience', canvas.width / 2, canvas.height - textFontSize * 2);
  }

  // Draw the start screen
  drawStartScreen();

  // Setup fullscreen button event
  const fullscreenButton = document.getElementById('fullscreenButton');
  fullscreenButton.addEventListener('click', () => {
    game.toggleFullscreen();
    // Redraw start screen after fullscreen change
    setTimeout(drawStartScreen, 100);
  });

  // Start game on space key
  function startGameHandler(e) {
    if (e.key === ' ' || e.code === 'Space') {
      window.removeEventListener('keydown', startGameHandler);
      window.removeEventListener('resize', handleResize);
      game.start();
    }
  }

  window.addEventListener('keydown', startGameHandler);
});
