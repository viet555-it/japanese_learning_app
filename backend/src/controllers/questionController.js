import db from '../config/db.js';

/**
 * Get questions for a specific Quiz
 * Quiz -> Quiz_Items -> (Vocabulary OR Kanji OR Kana)
 */
export const getQuestions = async (req, res) => {
    try {
        const { quizId } = req.params; 

        if (!quizId) {
            return res.status(400).json({ message: "Quiz ID is required" });
        }

        // Get sample item to determine type
        const [items] = await db.query(
            `SELECT qi.* FROM Quiz_Items qi WHERE qi.QuizID = ? LIMIT 1`,
            [quizId]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: "No items found for this quiz" });
        }

        let query = '';
        let type = '';

        if (items[0].VocabID) {
            type = 'Vocabulary';
            query = `
                SELECT qi.ItemID, v.VocabID, v.Word, v.Furigana, v.Meaning
                FROM Quiz_Items qi
                JOIN Vocabulary v ON qi.VocabID = v.VocabID
                WHERE qi.QuizID = ?`;
        } else if (items[0].KanjiID) {
            type = 'Kanji';
            query = `
                SELECT qi.ItemID, k.KanjiID, k.Character, k.Onyomi, k.Kunyomi, k.Meaning
                FROM Quiz_Items qi
                JOIN Kanji k ON qi.KanjiID = k.KanjiID
                WHERE qi.QuizID = ?`;
        } else if (items[0].KanaID) {
            type = 'Kana';
            query = `
                SELECT qi.ItemID, kn.KanaID, kn.Character, kn.Romaji
                FROM Quiz_Items qi
                JOIN Kana kn ON qi.KanaID = kn.KanaID
                WHERE qi.QuizID = ?`;
        }

        const [questions] = await db.query(query, [quizId]);
        const [quizHeader] = await db.query(`SELECT * FROM Quiz WHERE QuizID = ?`, [quizId]);

        res.json({
            quizTitle: quizHeader[0]?.QuizTitle,
            difficulty: quizHeader[0]?.Difficulty,
            type: type,
            questions: questions
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get available quizzes - filtered by LessonId
 */
export const getQuizzes = async (req, res) => {
    try {
        const { lessonId } = req.query;

        let query = `SELECT DISTINCT q.* FROM Quiz q`;
        let params = [];

        if (lessonId) {
            // Join Quiz items back to the Lesson table
            query = `
                SELECT DISTINCT q.* 
                FROM Quiz q 
                JOIN Quiz_Items qi ON q.QuizID = qi.QuizID
                LEFT JOIN Vocabulary v ON qi.VocabID = v.VocabID
                LEFT JOIN Kanji k ON qi.KanjiID = k.KanjiID
                LEFT JOIN Kana kn ON qi.KanaID = kn.KanaID
                WHERE v.LessonID = ? OR k.LessonID = ? OR kn.LessonID = ?`;
            params = [lessonId, lessonId, lessonId];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error in getQuizzes:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create a new Quiz wrapper
 */
export const createQuiz = async (req, res) => {
    try {
        const { quizTitle, difficulty } = req.body;
        if (!quizTitle || !difficulty) {
            return res.status(400).json({ message: "quizTitle and difficulty are required" });
        }
        const [result] = await db.query(
            "INSERT INTO Quiz (QuizTitle, Difficulty) VALUES (?, ?)",
            [quizTitle, difficulty]
        );
        res.status(201).json({ message: "Quiz created", quizId: result.insertId });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update a Quiz
 */
export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { quizTitle, difficulty } = req.body;
        
        let updateFields = [];
        let params = [];
        if (quizTitle) {
            updateFields.push("QuizTitle = ?");
            params.push(quizTitle);
        }
        if (difficulty) {
            updateFields.push("Difficulty = ?");
            params.push(difficulty);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        
        params.push(id);
        const [result] = await db.query(
            `UPDATE Quiz SET ${updateFields.join(", ")} WHERE QuizID = ?`,
            params
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        
        res.json({ message: "Quiz updated" });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete a Quiz
 */
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Explicitly clear quiz items first to avoid relation issues if fk is not cascading
        await db.query("DELETE FROM Quiz_Items WHERE QuizID = ?", [id]);
        
        const [result] = await db.query("DELETE FROM Quiz WHERE QuizID = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        
        res.json({ message: "Quiz deleted" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Bulk add items (Vocab, Kanji, Kana) to a Quiz
 */
export const addQuizItems = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { vocabIds, kanjiIds, kanaIds } = req.body;
        
        if (!vocabIds && !kanjiIds && !kanaIds) {
            return res.status(400).json({ message: "No items provided to add" });
        }
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            if (vocabIds && Array.isArray(vocabIds)) {
                for (const id of vocabIds) {
                    await connection.query("INSERT INTO Quiz_Items (QuizID, VocabID) VALUES (?, ?)", [quizId, id]);
                }
            }
            if (kanjiIds && Array.isArray(kanjiIds)) {
                for (const id of kanjiIds) {
                    await connection.query("INSERT INTO Quiz_Items (QuizID, KanjiID) VALUES (?, ?)", [quizId, id]);
                }
            }
            if (kanaIds && Array.isArray(kanaIds)) {
                for (const id of kanaIds) {
                    await connection.query("INSERT INTO Quiz_Items (QuizID, KanaID) VALUES (?, ?)", [quizId, id]);
                }
            }
            
            await connection.commit();
            res.status(201).json({ message: "Quiz items added successfully" });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error("Error adding quiz items:", error);
        res.status(500).json({ message: error.message });
    }
};