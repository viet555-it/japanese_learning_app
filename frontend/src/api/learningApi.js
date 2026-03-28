import axiosInstance from './axiosInstance';

/**
 * GET /api/kana
 * @param {string|number} lessonId - Optional lesson identifier
 */
export const getKana = async (lessonId) => {
  const response = await axiosInstance.get('/kana', {
    params: { lessonId }
  });
  return response.data;
};

/**
 * GET /api/lessons
 * @param {object} params - { level, type }
 */
export const getLessons = async (params = {}) => {
  const response = await axiosInstance.get('/lessons', { params });
  return response.data;
};

/**
 * GET /api/kanji
 * @param {string|number} lessonId - Optional lesson identifier
 */
export const getKanji = async (lessonId) => {
  const response = await axiosInstance.get('/kanji', {
    params: { lessonId }
  });
  return response.data;
};

/**
 * GET /api/vocab
 * @param {string|number} lessonId - Optional lesson identifier
 */
export const getVocab = async (lessonId) => {
  const response = await axiosInstance.get('/vocab', {
    params: { lessonId }
  });
  return response.data;
};

/**
 * GET /api/questions/:quizId
 * Fetch randomized questions for a quiz
 */
export const getQuestions = async (quizId) => {
  const response = await axiosInstance.get(`/questions/${quizId}`);
  return response.data;
};

/**
 * GET /api/questions?lessonId=X
 * List available quizzes for a specific lesson
 */
export const getQuizzesByLesson = async (lessonId) => {
  const response = await axiosInstance.get('/questions', {
    params: { lessonId }
  });
  return response.data;
};

/**
 * POST /api/sessions/create
 */
export const createTrainingSession = async (userId, lessonId) => {
  const response = await axiosInstance.post('/sessions/create', {
    userId,
    lessonId
  });
  return response.data;
};

/**
 * POST /api/sessions/save-statistic
 */
export const saveTrainingStats = async (statsData) => {
  const response = await axiosInstance.post('/sessions/save-statistic', statsData);
  return response.data;
};

/**
 * GET /api/progress/user/:userId
 */
export const getUserProgress = async (userId) => {
  const response = await axiosInstance.get(`/progress/user/${userId}`);
  return response.data;
};
