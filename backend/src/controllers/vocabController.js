import db from "../config/db.js";

export const getUnitsByLevel = async (req, res) => {
    try {
        const { levelId } = req.params;
        const query = `SELECT DISTINCT unit FROM vocabulary_list WHERE level_id = ? ORDER BY unit`;
        const [rows] = await db.query(query, [levelId]);
        res.json(rows.map(r => r.unit));
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getVocabQuiz = async (req, res) => {
    try {
        const { levelId, units } = req.query;
        const unitArray = units.split(',');

        const [rows] = await db.query(
            'SELECT * FROM vocabulary_list WHERE level_id = ? AND unit IN (?)',
            [levelId, unitArray]
        )
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}