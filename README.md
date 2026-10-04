# 🏰 Castle Defense - Tower Defense Game

A browser-based tower defense game built using HTML5 Canvas, CSS and vanilla JavaScript.

## Game

The player protects a base from enemies travelling along a fixed path.

The player can:

- Place towers
- Upgrade towers
- Sell towers
- Start waves
- Pause the game
- Change game speed
- Earn gold
- Defeat enemies
- Reach 50 waves
- Win or lose the game

## Technologies

- HTML5
- CSS3
- JavaScript
- HTML5 Canvas
- requestAnimationFrame

No backend or external services are required.

## Tower Types

### Basic Tower

Balanced damage and attack speed.

### Rapid Tower

Low damage but attacks very quickly.

### Ice Tower

Deals damage and slows enemies.

## Enemy Types

### Basic

Normal speed and health.

### Fast

Moves quickly but has lower health.

### Tank

High health but moves slowly.

### Boss

Appears during milestone waves and has very high health.

## Architecture

The game uses a single main game loop.

```text
requestAnimationFrame
        |
        v
Calculate Delta Time
        |
        v
Spawn Enemies
        |
        v
Update Enemies
        |
        v
Update Towers
        |
        v
Update Projectiles
        |
        v
Check Wave
        |
        v
Render Canvas