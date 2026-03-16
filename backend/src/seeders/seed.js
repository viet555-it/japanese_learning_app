import fs from 'fs';
import path from 'path';
import db from '../config/db.js';

const DATA_PATH = path.join(process.cwd(), 'data');

// Configure the number of words per Unit
const ITEMS_PER_UNIT = 20;

async function seed() {
    try {
        console.log('--- Start the data loading process. ---');

        // 1. Initialize Level and Category
        const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
        const levelMap = {};
        for (const name of levels) {
            const [res] = await db.query('INSERT IGNORE INTO jlpt_level (LevelName) VALUES (?)', [name]);
            const [rows] = await db.query('SELECT LevelID FROM jlpt_level WHERE LevelName = ?', [name]);
            levelMap[name] = rows[0].LevelID;
        }

        const categories = ['Characters', 'Vocabulary', 'Kanji'];
        const catMap = {};
        for (const name of categories) {
            await db.query('INSERT IGNORE INTO category (CategoryName) VALUES (?)', [name]);
            const [rows] = await db.query('SELECT CategoryID FROM category WHERE CategoryName = ?', [name]);
            catMap[name] = rows[0].CategoryID;
        }

        // 2. Load Alphabet
        console.log('Loading Alphabet...');
        const alphabetFiles = ['hiragana.json', 'katakana.json'];
        for (const file of alphabetFiles) {
            const data = JSON.parse(fs.readFileSync(path.join(DATA_PATH, 'alphabet', file), 'utf-8'));
            for (const item of data) {
                // Process Unit (A-row, Ka-row...)
                let [uRows] = await db.query('SELECT UnitID FROM unit WHERE UnitName = ?', [item.unit]);
                let unitId;
                if (uRows.length === 0) {
                    const [res] = await db.query('INSERT INTO unit (UnitName, LevelID) VALUES (?, NULL)', [item.unit]);
                    unitId = res.insertId;
                } else {
                    unitId = uRows[0].UnitID;
                }
                await db.query('INSERT INTO question (Content, CorrectAnswer, UnitID, CategoryID) VALUES (?, ?, ?, ?)', 
                    [item.content, item.meaning, unitId, catMap['Characters']]);
            }
        }

        // 3. Load Kanji & Vocabulary (N5 -> N1)
        for (const lv of levels) {
            // Load Kanji
            const kanjiFile = path.join(DATA_PATH, 'kanji', `${lv}.json`);
            if (fs.existsSync(kanjiFile)) {
                console.log(`Loading Kanji ${lv}...`);
                const data = JSON.parse(fs.readFileSync(kanjiFile, 'utf-8'));
                await processItems(data, levelMap[lv], catMap['Kanji'], 'Kanji');
            }

            // Load Vocabulary
            const vocabFile = path.join(DATA_PATH, 'vocabulary', `${lv.toLowerCase()}.json`);
            if (fs.existsSync(vocabFile)) {
                console.log(`Loading Vocabulary ${lv}...`);
                const data = JSON.parse(fs.readFileSync(vocabFile, 'utf-8'));
                await processItems(data, levelMap[lv], catMap['Vocabulary'], 'Vocab');
            }
        }

        console.log('--- Data loading completed successfully! ---');
        process.exit();
    } catch (error) {
        console.error('Error loading data:', error);
        process.exit(1);
    }
}

async function processItems(items, levelId, catId, type) {
    let currentUnitIdx = 1;
    let countInUnit = 0;
    let currentUnitId;

    for (const item of items) {
        // Create new Unit after every ITEMS_PER_UNIT words
        if (countInUnit === 0) {
            const unitName = `${type} Unit ${currentUnitIdx}`;
            const [res] = await db.query('INSERT INTO unit (UnitName, LevelID) VALUES (?, ?)', [unitName, levelId]);
            currentUnitId = res.insertId;
            currentUnitIdx++;
        }

        let content, answer;
        if (type === 'Kanji') {
            content = item.kanjiChar;
            answer = item.meanings.join(', ');
        } else {
            content = item.kanji || item.kana;
            answer = item.waller_definition;
        }

        await db.query('INSERT INTO question (Content, CorrectAnswer, UnitID, CategoryID) VALUES (?, ?, ?, ?)', 
            [content, answer, currentUnitId, catId]);
        
        countInUnit++;
        if (countInUnit >= ITEMS_PER_UNIT) countInUnit = 0;
    }
}

seed();