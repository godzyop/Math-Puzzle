import { DIFFICULTY_SETTINGS } from '../assets/constants';
import type { DifficultySetting } from '../assets/constants';

export interface Question {
  question: string;
  answer: number;
  options: number[];
  difficulty: string;
  operation: string;
}

export class QuestionGenerator {
  static generate(difficulty: string = 'EASY'): Question {
    const settings = this.getSettings(difficulty);
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];
    
    let num1: number, num2: number, answer: number, questionText: string;

    switch (operation) {
      case 'add':
        num1 = this.getRandomInt(settings.min, settings.max);
        num2 = this.getRandomInt(settings.min, settings.max);
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case 'subtract':
        num1 = this.getRandomInt(settings.min, settings.max);
        num2 = this.getRandomInt(settings.min, num1); // Avoid negative results for kids
        answer = num1 - num2;
        questionText = `${num1} - ${num2}`;
        break;
      case 'multiply':
        num1 = this.getRandomInt(settings.min, Math.min(settings.max, 12));
        num2 = this.getRandomInt(settings.min, Math.min(settings.max, 10));
        answer = num1 * num2;
        questionText = `${num1} × ${num2}`;
        break;
      case 'divide':
        num2 = this.getRandomInt(settings.min, Math.min(settings.max, 10));
        answer = this.getRandomInt(settings.min, Math.min(settings.max, 10));
        num1 = num2 * answer; // Ensure clean division
        questionText = `${num1} ÷ ${num2}`;
        break;
      default:
        throw new Error('Invalid operation');
    }

    const options = this.generateOptions(answer);

    return {
      question: questionText,
      answer: answer,
      options: options,
      difficulty: difficulty,
      operation: operation
    };
  }

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateOptions(correctAnswer: number): number[] {
    const options = new Set<number>([correctAnswer]);
    
    while (options.size < 4) {
      const offset = this.getRandomInt(-5, 5);
      const wrongAnswer = correctAnswer + (offset === 0 ? 3 : offset);
      if (wrongAnswer >= 0) {
        options.add(wrongAnswer);
      }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  static getSettings(difficulty: string): DifficultySetting {
    return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.EASY;
  }
}
