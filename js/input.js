/**
 * Input handler for keyboard and touch controls
 */
const Input = {
  // Key states
  keys: {
    left: false,
    right: false,
    up: false,
    upPressed: false // Track if up key was just pressed this frame
  },

  // Touch controls
  touchControls: {
    enabled: false,
    leftBtn: null,
    rightBtn: null,
    jumpBtn: null
  },

  // Device detection
  isMobile: false,

  /**
   * Initialize input event listeners
   */
  init: function () {
    // Detect if device is mobile/tablet
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Initialize keyboard controls
    this.initKeyboardControls();

    // Initialize touch controls if on mobile
    if (this.isMobile) {
      this.initTouchControls();
    }
  },

  /**
   * Initialize keyboard controls
   */
  initKeyboardControls: function () {
    // Key down event
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          this.keys.left = true;
          break;
        case 'ArrowRight':
        case 'd':
          this.keys.right = true;
          break;
        case 'ArrowUp':
        case 'w':
        case ' ':
          if (!this.keys.up) {
            this.keys.upPressed = true; // Set to true only on initial press
          }
          this.keys.up = true;
          break;
      }
    });

    // Key up event
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'd':
          this.keys.right = false;
          break;
        case 'ArrowUp':
        case 'w':
        case ' ':
          this.keys.up = false;
          break;
      }
    });
  },

  /**
   * Initialize touch controls
   */
  initTouchControls: function () {
    this.touchControls.enabled = true;

    // Create touch control buttons
    this.createTouchButtons();

    // Handle touch events for the entire screen (for swipe jumps)
    const gameCanvas = document.getElementById('gameCanvas');

    // Prevent default touch actions to avoid scrolling
    gameCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });

    gameCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    gameCanvas.addEventListener('touchend', (e) => {
      e.preventDefault();
    }, { passive: false });
  },

  /**
   * Create touch control buttons
   */
  createTouchButtons: function () {
    // Create container for touch controls
    const touchControlsContainer = document.createElement('div');
    touchControlsContainer.id = 'touchControls';
    touchControlsContainer.style.position = 'absolute';
    touchControlsContainer.style.bottom = '20px';
    touchControlsContainer.style.left = '0';
    touchControlsContainer.style.width = '100%';
    touchControlsContainer.style.display = 'flex';
    touchControlsContainer.style.justifyContent = 'space-between';
    touchControlsContainer.style.zIndex = '1000';
    touchControlsContainer.style.pointerEvents = 'none'; // Let touch events pass through container

    // Create left button
    this.touchControls.leftBtn = document.createElement('div');
    this.touchControls.leftBtn.className = 'touch-button';
    this.touchControls.leftBtn.id = 'leftButton';
    this.touchControls.leftBtn.innerHTML = '←';
    this.touchControls.leftBtn.style.width = '80px';
    this.touchControls.leftBtn.style.height = '80px';
    this.touchControls.leftBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.touchControls.leftBtn.style.color = 'white';
    this.touchControls.leftBtn.style.borderRadius = '50%';
    this.touchControls.leftBtn.style.display = 'flex';
    this.touchControls.leftBtn.style.alignItems = 'center';
    this.touchControls.leftBtn.style.justifyContent = 'center';
    this.touchControls.leftBtn.style.fontSize = '40px';
    this.touchControls.leftBtn.style.userSelect = 'none';
    this.touchControls.leftBtn.style.margin = '0 0 0 20px';
    this.touchControls.leftBtn.style.pointerEvents = 'auto'; // Enable touch events

    // Create right button
    this.touchControls.rightBtn = document.createElement('div');
    this.touchControls.rightBtn.className = 'touch-button';
    this.touchControls.rightBtn.id = 'rightButton';
    this.touchControls.rightBtn.innerHTML = '→';
    this.touchControls.rightBtn.style.width = '80px';
    this.touchControls.rightBtn.style.height = '80px';
    this.touchControls.rightBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.touchControls.rightBtn.style.color = 'white';
    this.touchControls.rightBtn.style.borderRadius = '50%';
    this.touchControls.rightBtn.style.display = 'flex';
    this.touchControls.rightBtn.style.alignItems = 'center';
    this.touchControls.rightBtn.style.justifyContent = 'center';
    this.touchControls.rightBtn.style.fontSize = '40px';
    this.touchControls.rightBtn.style.userSelect = 'none';
    this.touchControls.rightBtn.style.margin = '0 0 0 20px';
    this.touchControls.rightBtn.style.pointerEvents = 'auto'; // Enable touch events

    // Create jump button
    this.touchControls.jumpBtn = document.createElement('div');
    this.touchControls.jumpBtn.className = 'touch-button';
    this.touchControls.jumpBtn.id = 'jumpButton';
    this.touchControls.jumpBtn.innerHTML = '↑';
    this.touchControls.jumpBtn.style.width = '80px';
    this.touchControls.jumpBtn.style.height = '80px';
    this.touchControls.jumpBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.touchControls.jumpBtn.style.color = 'white';
    this.touchControls.jumpBtn.style.borderRadius = '50%';
    this.touchControls.jumpBtn.style.display = 'flex';
    this.touchControls.jumpBtn.style.alignItems = 'center';
    this.touchControls.jumpBtn.style.justifyContent = 'center';
    this.touchControls.jumpBtn.style.fontSize = '40px';
    this.touchControls.jumpBtn.style.userSelect = 'none';
    this.touchControls.jumpBtn.style.margin = '0 20px 0 0';
    this.touchControls.jumpBtn.style.pointerEvents = 'auto'; // Enable touch events

    // Create movement controls container (left side)
    const movementControls = document.createElement('div');
    movementControls.style.display = 'flex';
    movementControls.style.gap = '20px';
    movementControls.appendChild(this.touchControls.leftBtn);
    movementControls.appendChild(this.touchControls.rightBtn);

    // Add buttons to container
    touchControlsContainer.appendChild(movementControls);
    touchControlsContainer.appendChild(this.touchControls.jumpBtn);

    // Add container to document
    document.body.appendChild(touchControlsContainer);

    // Add touch event listeners
    this.addTouchEventListeners();
  },

  /**
   * Add touch event listeners to buttons
   */
  addTouchEventListeners: function () {
    // Left button
    this.touchControls.leftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.keys.left = true;
    }, { passive: false });

    this.touchControls.leftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.left = false;
    }, { passive: false });

    // Right button
    this.touchControls.rightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.keys.right = true;
    }, { passive: false });

    this.touchControls.rightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.right = false;
    }, { passive: false });

    // Jump button
    this.touchControls.jumpBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.keys.up) {
        this.keys.upPressed = true; // Set to true only on initial press
      }
      this.keys.up = true;
    }, { passive: false });

    this.touchControls.jumpBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.up = false;
    }, { passive: false });

    // Handle touch leaving the button
    this.touchControls.leftBtn.addEventListener('touchleave', (e) => {
      e.preventDefault();
      this.keys.left = false;
    }, { passive: false });

    this.touchControls.rightBtn.addEventListener('touchleave', (e) => {
      e.preventDefault();
      this.keys.right = false;
    }, { passive: false });

    this.touchControls.jumpBtn.addEventListener('touchleave', (e) => {
      e.preventDefault();
      this.keys.up = false;
    }, { passive: false });
  }
};
