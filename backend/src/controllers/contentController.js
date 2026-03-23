import db from '../config/db.js';

// Get a list of lessons
export const getLessons = async (req, res) => {
    try {
        // Support multiple parameter naming variations
        const level = req.query.level || req.query.JLPT_level || req.query.jlpt_level || req.query.JLPT_Level;
        const type = req.query.type || req.query.LessonType || req.query.lessonType;
        
        console.log(`GET /lessons - Filters: level=${level}, type=${type}`);

        let query = 'SELECT * FROM Lesson';
        const params = [];
        const conditions = [];

        if (level) {
            conditions.push('JLPT_Level = ?');
            params.push(level.toUpperCase()); // 'n5' -> 'N5'
        }
        if (type) {
            conditions.push('Type = ?');
            params.push(type);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [lessons] = await db.query(query, params);
        console.log(`GET /lessons - Found ${lessons.length} rows`);
        res.json(lessons);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a specific lesson by ID
export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const [lesson] = await db.query('SELECT * FROM Lesson WHERE LessonID = ?', [id]);
        if (lesson.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(lesson[0]);
    } catch (error) {
        console.error("Error fetching lesson by ID:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Vocabulary list
export const getVocab = async (req, res) => {
    try {
        const lessonId = req.query.lessonId || req.query.lessonID || req.query.lesson_id || req.query.LessonID;
        console.log(`GET /vocab - Filter: lessonId=${lessonId}`);

        let query = 'SELECT * FROM Vocabulary';
        const params = [];
        
        if (lessonId) {
            query += ' WHERE LessonID = ?';
            params.push(lessonId);
        }
        
        const [vocab] = await db.query(query, params);
        console.log(`GET /vocab - Found ${vocab.length} rows`);

        // Extra help: if empty but lessonId was provided, check if lesson exists/type mismatch
        if (lessonId && vocab.length === 0) {
            const [lesson] = await db.query('SELECT Type FROM Lesson WHERE LessonID = ?', [lessonId]);
            if (lesson.length > 0 && lesson[0].Type !== 'Vocabulary') {
                return res.json({
                    message: `Lesson ${lessonId} exists but its type is '${lesson[0].Type}', not 'Vocabulary'.`,
                    data: []
                });
            }
        }

        res.json(vocab);
    } catch (error) {
        console.error("Error fetching vocabulary:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Kanji list
export const getKanji = async (req, res) => {
    try {
        const lessonId = req.query.lessonId || req.query.lessonID || req.query.lesson_id || req.query.LessonID;
        console.log(`GET /kanji - Filter: lessonId=${lessonId}`);

        let query = 'SELECT * FROM Kanji';
        const params = [];
        
        if (lessonId) {
            query += ' WHERE LessonID = ?';
            params.push(lessonId);
        }
        
        const [kanji] = await db.query(query, params);
        console.log(`GET /kanji - Found ${kanji.length} rows`);

        // Extra help: if empty but lessonId was provided
        if (lessonId && kanji.length === 0) {
            const [lesson] = await db.query('SELECT Type FROM Lesson WHERE LessonID = ?', [lessonId]);
            if (lesson.length > 0 && lesson[0].Type !== 'Kanji') {
                return res.json({
                    message: `Lesson ${lessonId} exists but its type is '${lesson[0].Type}', not 'Kanji'.`,
                    data: []
                });
            }
        }

        res.json(kanji);
    } catch (error) {
        console.error("Error fetching kanji:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Kana list
export const getKana = async (req, res) => {
    try {
        const lessonId = req.query.lessonId || req.query.lessonID || req.query.lesson_id || req.query.LessonID;
        console.log(`GET /kana - Filter: lessonId=${lessonId}`);

        let query = 'SELECT * FROM Kana';
        const params = [];
        
        if (lessonId) {
            query += ' WHERE LessonID = ?';
            params.push(lessonId);
        }
        
        const [kana] = await db.query(query, params);
        console.log(`GET /kana - Found ${kana.length} rows`);

        // Extra help: if empty but lessonId was provided
        if (lessonId && kana.length === 0) {
            const [lesson] = await db.query('SELECT Type FROM Lesson WHERE LessonID = ?', [lessonId]);
            if (lesson.length > 0 && lesson[0].Type !== 'Kana') {
                return res.json({
                    message: `Lesson ${lessonId} exists but its type is '${lesson[0].Type}', not 'Kana'.`,
                    data: []
                });
            }
        }

        res.json(kana);
    } catch (error) {
        console.error("Error fetching kana:", error);
        res.status(500).json({ message: error.message });
    }
};
