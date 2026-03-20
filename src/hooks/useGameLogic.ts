import { useState, useEffect, useCallback } from 'react';
import { QuestionGenerator } from '../core/QuestionGenerator';
import type { Question } from '../core/QuestionGenerator';
import { DIFFICULTY_SETTINGS } from '../assets/constants';
import type { GameMode } from '../assets/constants';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, RESULT, SHOP, SETTINGS
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState('EASY');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [stats, setStats] = useState({
    correct: 0,
    wrong: 0,
    bestCombo: 0,
    startTime: 0,
    endTime: 0
  });

  // Load coins from localStorage
  useEffect(() => {
    const savedCoins = localStorage.getItem('math_game_coins');
    if (savedCoins) setCoins(parseInt(savedCoins));
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameState('PLAYING');
    setScore(0);
    setCombo(0);
    setLives(mode.maxLives || 3);
    setStats({
      correct: 0,
      wrong: 0,
      bestCombo: 0,
      startTime: Date.now(),
      endTime: 0
    });
    
    if (mode.hasTimer) {
      setTimeLeft(mode.sessionTime || mode.timerPerQuestion || 15);
    }
    
    const question = QuestionGenerator.generate(difficulty);
    setCurrentQuestion(question);
    
    if (mode.timerPerQuestion) {
      setTimeLeft(mode.timerPerQuestion);
    }
  }, [difficulty]);

  const generateNextQuestion = useCallback(() => {
    // Increase difficulty based on correct answers in Classic mode
    let currentDifficulty = difficulty;
    if (gameMode?.id === 'classic') {
      if (stats.correct > 20) currentDifficulty = 'EXPERT';
      else if (stats.correct > 10) currentDifficulty = 'HARD';
      else if (stats.correct > 5) currentDifficulty = 'MEDIUM';
    }
    
    const question = QuestionGenerator.generate(currentDifficulty);
    setCurrentQuestion(question);
    
    if (gameMode?.timerPerQuestion) {
      setTimeLeft(gameMode.timerPerQuestion);
    }
  }, [difficulty, gameMode, stats.correct]);

  const endGame = useCallback(() => {
    setGameState('RESULT');
    setStats(prev => {
      const finalStats = { ...prev, endTime: Date.now() };
      
      // Save best score
      const currentBest = parseInt(localStorage.getItem('math_game_best_score') || '0');
      if (score > currentBest) {
        localStorage.setItem('math_game_best_score', score.toString());
      }
      
      return finalStats;
    });
  }, [score]);

  const handleAnswer = useCallback((selectedAnswer: number | null) => {
    if (!currentQuestion) return false;

    if (selectedAnswer === currentQuestion.answer) {
      // Correct Answer
      const newCombo = combo + 1;
      const points = 10 * newCombo * (DIFFICULTY_SETTINGS[currentQuestion.difficulty].rewardMultiplier);
      const coinsEarned = Math.floor(points / 10);
      
      setScore(prev => prev + points);
      setCombo(newCombo);
      setCoins(prev => {
        const newTotal = prev + coinsEarned;
        localStorage.setItem('math_game_coins', newTotal.toString());
        return newTotal;
      });
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        bestCombo: Math.max(prev.bestCombo, newCombo)
      }));
      
      generateNextQuestion();
      return true;
    } else {
      // Wrong Answer
      setCombo(0);
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      
      if (gameMode?.hasLives) {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          endGame();
        } else {
          generateNextQuestion();
        }
      } else {
        generateNextQuestion();
      }
      return false;
    }
  }, [currentQuestion, combo, lives, gameMode, generateNextQuestion, endGame]);

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAYING' && (gameMode?.hasTimer || gameMode?.id === 'survival')) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (gameMode?.id === 'time_attack') {
              endGame();
            } else {
              handleAnswer(null); // Time out counts as wrong
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameMode, endGame, handleAnswer]);

  return {
    gameState,
    setGameState,
    gameMode,
    startGame,
    currentQuestion,
    handleAnswer,
    score,
    lives,
    coins,
    combo,
    timeLeft,
    stats,
    difficulty,
    setDifficulty
  };
};
