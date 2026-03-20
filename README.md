# Math Dash - Mobile Math Game

A fast-paced, polished, and addictive mobile math game built with React, Tailwind CSS, and Framer Motion. Designed for high performance and easy porting to Unity.

## Features
- **Dynamic Question Generation**: Smart scaling difficulty with 4 operations.
- **Multiple Game Modes**: Classic, Time Attack, Practice, and Survival.
- **Reward System**: Earn coins, build combos, and track high scores.
- **Polished UI**: Modern, colorful, and responsive mobile-first design.
- **Retention**: Local storage saves, stats tracking, and smooth animations.

## Technical Stack
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Unity Porting Guide
The project architecture maps directly to Unity:
- `QuestionGenerator.ts` -> `MathEngine.cs`
- `useGameLogic.ts` -> `GameManager.cs`
- `App.tsx` -> `UIManager.cs` + Prefabs
- `constants.ts` -> `ScriptableObjects` (GameModeData, DifficultySettings)

## Monetization Strategy (Unity Ads)
- **Rewarded Ads**: 
  - Watch to Revive (Classic/Survival)
  - 2x Coin Multiplier at Result Screen
  - Daily Bonus Chest
- **Interstitial Ads**:
  - Between game sessions (every 3rd round)
  - After navigating back to Home from Result screen

## Game Titles (App Store Ready)
1. MathDash: Fast Quiz
2. Number Ninja: Speed Math
3. Brain Blitz: Math Challenge
4. QuickCalc Mobile
5. Math Mania: Turbo
6. ZenMath: Practice & Play
7. SumSum: The Math Game
8. Logic Leap: Math Edition
9. Math Mastery: Survival
10. Infinite Equations
11. Math Hero: Quest
12. Calculation Nation
13. Smart Sums: Speed Quiz
14. Math Flow: Neon
15. Equation Nation

## Publishing Checklist
1. Export logic to C# classes.
2. Create UI Prefabs using Unity UI (UGUI) or UI Toolkit.
3. Implement `PlayerPrefs` for the Save System.
4. Integrate Unity Ads SDK for Rewarded/Interstitial ads.
5. Set up Android/iOS builds in Unity Build Settings.
