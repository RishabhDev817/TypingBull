/**
 * Stellar Dash — A space-themed typing runner game.
 *
 * Mechanic: Words appear floating in space. Type them correctly → astronaut
 * jumps to the next platform. Mistakes slow momentum. Missing words = lose a life.
 *
 * All visuals are procedurally drawn (no external sprites).
 */
import Phaser from 'phaser';

// Word pool for the game
const GAME_WORDS = [
  'dash', 'flash', 'star', 'jump', 'run', 'fast', 'fire', 'glow', 'beam',
  'bolt', 'rush', 'soar', 'fly', 'blaze', 'spark', 'nova', 'comet', 'lunar',
  'orbit', 'warp', 'drift', 'pulse', 'surge', 'blast', 'sail', 'glide',
  'swift', 'race', 'zoom', 'push', 'leap', 'spin', 'flip', 'burn',
  'light', 'dark', 'void', 'deep', 'wave', 'flow', 'rise', 'fall',
  'gust', 'wind', 'storm', 'calm', 'dust', 'rock', 'iron', 'gold',
  'home', 'goal', 'flag', 'hall', 'lash', 'glad', 'half', 'mask',
  'task', 'fold', 'hold', 'cold', 'bold', 'sold', 'told', 'hand',
];

interface GameState {
  score: number;
  lives: number;
  wordsTyped: number;
  wordsCorrect: number;
  currentWord: string;
  typedSoFar: string;
  speed: number;
  isGameOver: boolean;
  combo: number;
  maxCombo: number;
}

// Callback type for reporting results back to React
export interface GameCallbacks {
  onKeystroke?: (key: string, expected: string, isBackspace: boolean) => void;
  onWordComplete?: (word: string, correct: boolean) => void;
  onGameOver?: (state: GameState) => void;
  onScoreUpdate?: (score: number) => void;
}

// Store callbacks globally so the scene can access them
let _callbacks: GameCallbacks = {};

export function setGameCallbacks(cb: GameCallbacks) {
  _callbacks = cb;
}

export class StellarDashScene extends Phaser.Scene {
  private state!: GameState;
  private astronaut!: Phaser.GameObjects.Container;
  private astronautBody!: Phaser.Physics.Arcade.Body;
  private platforms: Phaser.GameObjects.Container[] = [];
  private wordText!: Phaser.GameObjects.Text;
  private typedText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private stars: Phaser.GameObjects.Arc[] = [];
  private particles: Phaser.GameObjects.Arc[] = [];
  private platformIndex: number = 0;
  private gameOverOverlay!: Phaser.GameObjects.Container;
  private wordTimeoutEvent!: Phaser.Time.TimerEvent | null;
  private trailTimer: number = 0;

  constructor() {
    super('StellarDash');
  }

  create() {
    this.state = {
      score: 0,
      lives: 3,
      wordsTyped: 0,
      wordsCorrect: 0,
      currentWord: '',
      typedSoFar: '',
      speed: 1,
      isGameOver: false,
      combo: 0,
      maxCombo: 0,
    };

    // Star field background
    this.createStarField();

    // Create initial platforms
    this.createInitialPlatforms();

    // Create astronaut
    this.createAstronaut();

    // UI elements
    this.createUI();

    // Start first word
    this.nextWord();

    // Keyboard input
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (this.state.isGameOver) {
        if (event.key === 'Enter' || event.key === ' ') {
          this.restartGame();
        }
        return;
      }
      this.handleKeyPress(event);
    });
  }

  private createStarField() {
    const g = this.add.graphics();
    // Deep space gradient background
    g.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3e, 0x1a1a3e, 1);
    g.fillRect(0, 0, 800, 450);

    // Stars
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 350);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.9);
      const star = this.add.circle(x, y, size, 0xffffff, alpha);
      this.stars.push(star);

      // Twinkle animation
      this.tweens.add({
        targets: star,
        alpha: { from: alpha, to: alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }

  private createPlatform(x: number, y: number, width: number = 100): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Platform glow
    const glow = this.add.rectangle(0, 0, width + 8, 12, 0x007cf0, 0.15);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    container.add(glow);

    // Main platform
    const platform = this.add.rectangle(0, 0, width, 8, 0x007cf0, 0.8);
    platform.setStrokeStyle(1, 0x00dfd8, 0.6);
    container.add(platform);

    // Physics body
    this.physics.add.existing(container, true); // static body
    const body = container.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(width, 8);
    body.setOffset(-width / 2, -4);

    this.platforms.push(container);
    return container;
  }

  private createInitialPlatforms() {
    // First (starting) platform
    this.createPlatform(150, 380, 140);

    // Generate ahead
    for (let i = 0; i < 5; i++) {
      this.generateNextPlatform();
    }
  }

  private generateNextPlatform() {
    const gap = Phaser.Math.Between(100, 160);
    const yVariation = Phaser.Math.Between(-40, 30);
    const prevPlatform = this.platforms[this.platforms.length - 1];
    const newX = prevPlatform.x + gap;
    const newY = Phaser.Math.Clamp(prevPlatform.y + yVariation, 250, 400);
    const width = Phaser.Math.Between(70, 120);

    this.createPlatform(newX, newY, width);
    this.platformIndex++;
  }

  private createAstronaut() {
    const container = this.add.container(150, 340);

    // Body (capsule)
    const body = this.add.rectangle(0, 0, 18, 24, 0xffffff, 0.9);
    body.setStrokeStyle(1.5, 0x50e3c2);
    container.add(body);

    // Helmet visor
    const visor = this.add.circle(0, -5, 6, 0x50e3c2, 0.7);
    container.add(visor);

    // Jet pack glow
    const jetGlow = this.add.circle(0, 16, 4, 0xff0080, 0.5);
    jetGlow.setBlendMode(Phaser.BlendModes.ADD);
    container.add(jetGlow);

    // Add physics
    this.physics.add.existing(container);
    this.astronaut = container;
    this.astronautBody = container.body as Phaser.Physics.Arcade.Body;
    this.astronautBody.setSize(18, 24);
    this.astronautBody.setOffset(-9, -12);
    this.astronautBody.setBounce(0.1);
    this.astronautBody.setCollideWorldBounds(true);

    // Collide with platforms
    this.physics.add.collider(container, this.platforms);
  }

  private createUI() {
    // Score
    this.scoreText = this.add.text(20, 15, 'SCORE 0', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#50e3c2',
    });

    // Lives
    this.livesText = this.add.text(20, 35, '♥♥♥', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
      color: '#ff0080',
    });

    // Combo
    this.comboText = this.add.text(700, 15, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: '#f9cb28',
      align: 'right',
    });
    this.comboText.setOrigin(1, 0);

    // Current word display (floating above astronaut)
    this.wordText = this.add.text(400, 200, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      stroke: '#0a0a1a',
      strokeThickness: 4,
    });
    this.wordText.setOrigin(0.5);

    // Typed portion
    this.typedText = this.add.text(400, 230, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
      color: '#50e3c2',
      align: 'center',
    });
    this.typedText.setOrigin(0.5);

    // Game over overlay (hidden)
    this.gameOverOverlay = this.add.container(400, 225);
    this.gameOverOverlay.setVisible(false);

    const overlayBg = this.add.rectangle(0, 0, 350, 220, 0x0a0a1a, 0.92);
    overlayBg.setStrokeStyle(2, 0x007cf0, 0.5);
    this.gameOverOverlay.add(overlayBg);

    const gameOverTitle = this.add.text(0, -70, 'MISSION COMPLETE', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '18px',
      color: '#50e3c2',
      align: 'center',
    });
    gameOverTitle.setOrigin(0.5);
    this.gameOverOverlay.add(gameOverTitle);

    const restartHint = this.add.text(0, 80, 'Press ENTER to retry', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: '#888888',
      align: 'center',
    });
    restartHint.setOrigin(0.5);
    this.gameOverOverlay.add(restartHint);
  }

  private nextWord() {
    const word = GAME_WORDS[Phaser.Math.Between(0, GAME_WORDS.length - 1)];
    this.state.currentWord = word;
    this.state.typedSoFar = '';
    this.wordText.setText(word);
    this.typedText.setText('_'.repeat(word.length));

    // Position word near the next platform
    const nextPlatform = this.platforms[Math.min(this.platformIndex + 1, this.platforms.length - 1)];
    if (nextPlatform) {
      this.wordText.setPosition(nextPlatform.x, nextPlatform.y - 60);
      this.typedText.setPosition(nextPlatform.x, nextPlatform.y - 35);
    }

    // Set a timeout — if not typed fast enough, lose a life
    const timeout = Math.max(3000, 8000 - this.state.speed * 500);
    if (this.wordTimeoutEvent) this.wordTimeoutEvent.destroy();
    this.wordTimeoutEvent = this.time.addEvent({
      delay: timeout,
      callback: () => {
        if (!this.state.isGameOver && this.state.currentWord === word) {
          this.wordMissed();
        }
      },
    });
  }

  private handleKeyPress(event: KeyboardEvent) {
    const { currentWord, typedSoFar } = this.state;
    if (!currentWord) return;

    if (event.key === 'Backspace') {
      if (typedSoFar.length > 0) {
        this.state.typedSoFar = typedSoFar.slice(0, -1);
        this.updateTypedDisplay();
        _callbacks.onKeystroke?.('Backspace', '', true);
      }
      return;
    }

    // Ignore non-character keys
    if (event.key.length !== 1) return;

    const expected = currentWord[typedSoFar.length];
    const correct = event.key === expected;

    _callbacks.onKeystroke?.(event.key, expected, false);

    if (correct) {
      this.state.typedSoFar += event.key;
      this.updateTypedDisplay();
      this.spawnParticle(
        this.wordText.x + (typedSoFar.length * 12) - (currentWord.length * 6),
        this.wordText.y,
        0x50e3c2
      );

      // Check if word is complete
      if (this.state.typedSoFar === currentWord) {
        this.wordCompleted(true);
      }
    } else {
      // Error — shake the word and slow down
      this.state.combo = 0;
      this.updateCombo();

      this.tweens.add({
        targets: this.wordText,
        x: { from: this.wordText.x - 5, to: this.wordText.x + 5 },
        duration: 50,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.wordText.setX(this.wordText.x);
        },
      });

      // Red flash
      this.spawnParticle(this.astronaut.x, this.astronaut.y - 15, 0xff0080);
    }
  }

  private updateTypedDisplay() {
    const { currentWord, typedSoFar } = this.state;
    let display = '';
    for (let i = 0; i < currentWord.length; i++) {
      display += i < typedSoFar.length ? typedSoFar[i] : '_';
    }
    this.typedText.setText(display);
  }

  private wordCompleted(correct: boolean) {
    this.state.wordsTyped++;

    if (correct) {
      this.state.wordsCorrect++;
      this.state.score += 10 * (1 + Math.floor(this.state.combo / 3));
      this.state.combo++;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      this.state.speed = Math.min(10, this.state.speed + 0.2);

      // Jump astronaut to next platform
      this.jumpToNextPlatform();

      // Spawn celebration particles
      for (let i = 0; i < 8; i++) {
        this.spawnParticle(
          this.astronaut.x + Phaser.Math.Between(-20, 20),
          this.astronaut.y + Phaser.Math.Between(-20, 10),
          [0x50e3c2, 0x007cf0, 0x7928ca, 0xff0080, 0xf9cb28][Phaser.Math.Between(0, 4)]
        );
      }

      _callbacks.onWordComplete?.(this.state.currentWord, true);
    }

    this.updateUI();
    this.nextWord();
  }

  private wordMissed() {
    this.state.lives--;
    this.state.combo = 0;
    this.state.speed = Math.max(1, this.state.speed - 0.5);

    // Flash red
    this.cameras.main.flash(200, 255, 0, 128, false);

    _callbacks.onWordComplete?.(this.state.currentWord, false);

    this.updateUI();

    if (this.state.lives <= 0) {
      this.endGame();
    } else {
      this.nextWord();
    }
  }

  private jumpToNextPlatform() {
    // Jump physics
    this.astronautBody.setVelocityY(-350);

    // Move camera/world — shift everything left
    const shiftAmount = Phaser.Math.Between(100, 160);
    this.tweens.add({
      targets: [...this.platforms, ...this.stars],
      x: `-=${shiftAmount}`,
      duration: 400,
      ease: 'Quad.easeOut',
    });

    // Generate new platforms ahead
    this.generateNextPlatform();

    // Clean up old platforms far off-screen
    this.platforms = this.platforms.filter(p => {
      if (p.x < -200) {
        p.destroy();
        return false;
      }
      return true;
    });
  }

  private spawnParticle(x: number, y: number, color: number) {
    const particle = this.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.8);
    particle.setBlendMode(Phaser.BlendModes.ADD);
    this.particles.push(particle);

    this.tweens.add({
      targets: particle,
      x: x + Phaser.Math.Between(-40, 40),
      y: y + Phaser.Math.Between(-40, 40),
      alpha: 0,
      scale: 0,
      duration: Phaser.Math.Between(400, 800),
      ease: 'Quad.easeOut',
      onComplete: () => {
        particle.destroy();
        const idx = this.particles.indexOf(particle);
        if (idx >= 0) this.particles.splice(idx, 1);
      },
    });
  }

  private updateUI() {
    this.scoreText.setText(`SCORE ${this.state.score}`);
    this.livesText.setText('♥'.repeat(this.state.lives) + '♡'.repeat(3 - this.state.lives));
    this.updateCombo();
    _callbacks.onScoreUpdate?.(this.state.score);
  }

  private updateCombo() {
    if (this.state.combo >= 3) {
      this.comboText.setText(`x${this.state.combo} COMBO`);
      this.comboText.setColor('#f9cb28');
    } else {
      this.comboText.setText('');
    }
  }

  private endGame() {
    this.state.isGameOver = true;
    if (this.wordTimeoutEvent) this.wordTimeoutEvent.destroy();

    this.wordText.setVisible(false);
    this.typedText.setVisible(false);

    // Show game over overlay
    this.gameOverOverlay.setVisible(true);

    // Add score details to overlay
    const details = this.add.text(0, -20, [
      `Score: ${this.state.score}`,
      `Words: ${this.state.wordsCorrect}/${this.state.wordsTyped}`,
      `Max Combo: x${this.state.maxCombo}`,
    ].join('\n'), {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '13px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
    });
    details.setOrigin(0.5);
    this.gameOverOverlay.add(details);

    _callbacks.onGameOver?.(this.state);
  }

  private restartGame() {
    // Clean up
    this.platforms.forEach(p => p.destroy());
    this.platforms = [];
    this.particles.forEach(p => p.destroy());
    this.particles = [];
    this.stars.forEach(s => s.destroy());
    this.stars = [];
    if (this.astronaut) this.astronaut.destroy();
    if (this.wordTimeoutEvent) this.wordTimeoutEvent.destroy();

    this.gameOverOverlay.setVisible(false);

    this.scene.restart();
  }

  update(_time: number, delta: number) {
    if (this.state.isGameOver) return;

    // Astronaut trail effect
    this.trailTimer += delta;
    if (this.trailTimer > 80 && this.astronaut) {
      this.trailTimer = 0;
      const trail = this.add.circle(
        this.astronaut.x,
        this.astronaut.y + 14,
        Phaser.Math.Between(2, 4),
        0xff0080,
        0.4
      );
      trail.setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: trail,
        alpha: 0,
        scale: 0,
        x: trail.x - Phaser.Math.Between(5, 15),
        duration: 300,
        onComplete: () => trail.destroy(),
      });
    }

    // Move word text to follow camera position
    if (this.wordText.visible && this.state.currentWord) {
      // Gentle float animation
      this.wordText.y += Math.sin(_time * 0.003) * 0.15;
    }
  }
}
