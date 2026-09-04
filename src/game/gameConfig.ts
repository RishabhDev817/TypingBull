/**
 * Phaser Game Configuration for Stellar Dash
 */
import Phaser from 'phaser';
import { StellarDashScene } from './gameScene';

export function createGameConfig(parentId: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.CANVAS,
    parent: parentId,
    width: 800,
    height: 450,
    transparent: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 600 },
        debug: false,
      },
    },
    scene: [StellarDashScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
  };
}
