import db from '../config/db.js';

export const getKanjiQuiz = async (req, res) => {
    try {
        const { levelId, units } = req.query;
        const unitArray = units.split(',');

        const [rows] = await db.query(
            'SELECT * FROM kanji_list WHERE level_id = ? AND unit IN (?)',
            [levelId, unitArray]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};