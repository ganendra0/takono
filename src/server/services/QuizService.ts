import { db } from '../database.js';
import { PointService } from './PointService.js';

export class QuizService {
  /**
   * Submit quiz answer.
   * CRITICAL SECURITY REQUIREMENT:
   * The server strictly verifies the correct option ID.
   * Client-side answers are never trusted.
   * Anti-duplicate reward check is enforced.
   */
  static submitQuiz(
    userId: string,
    explorePointId: string,
    answers: { questionId: string; selectedOptionId: string }[]
  ): {
    success: boolean;
    isCorrect: boolean;
    score: number;
    pointsAwarded: number;
    explanation: string;
    alreadyCompleted: boolean;
    message: string;
  } {
    const point = db.explorePoints.find(p => p.id === explorePointId);
    if (!point || !point.quiz) {
      return {
        success: false,
        isCorrect: false,
        score: 0,
        pointsAwarded: 0,
        explanation: '',
        alreadyCompleted: false,
        message: 'Kuis tidak ditemukan untuk Explore Point ini.'
      };
    }

    const quiz = point.quiz;
    let correctCount = 0;
    let firstExplanation = '';

    for (const q of quiz.questions) {
      const userAnswer = answers.find(a => a.questionId === q.id);
      if (userAnswer && userAnswer.selectedOptionId === q.correctOptionId) {
        correctCount++;
      }
      if (!firstExplanation) {
        firstExplanation = q.explanation;
      }
    }

    const isCorrect = correctCount === quiz.questions.length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Check if user already completed this quiz
    const alreadyCompleted = db.hasUserCompletedActivity(userId, 'quiz_completed', quiz.id);

    let pointsAwarded = 0;
    let message = '';

    if (isCorrect) {
      if (alreadyCompleted) {
        message = 'Jawaban kamu benar! Namun poin kuis untuk titik ini sudah pernah diklaim sebelumnya.';
      } else {
        const quizPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 15), 0);
        const rewardResult = PointService.awardPoints(
          userId,
          point.destinationId,
          'quiz_completed',
          quiz.id,
          quizPoints,
          `Menjawab kuis ${point.name} dengan benar`,
          `Kuis Selesai: ${point.name}`
        );
        pointsAwarded = rewardResult.pointsAwarded;
        message = rewardResult.message;
      }
    } else {
      message = 'Jawaban belum tepat. Baca penjelasannya dan coba lagi!';
    }

    return {
      success: true,
      isCorrect,
      score,
      pointsAwarded,
      explanation: firstExplanation,
      alreadyCompleted,
      message
    };
  }
}
