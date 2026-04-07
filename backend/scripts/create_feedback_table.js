import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const createFeedbackTable = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST?.trim(),
    port: parseInt(process.env.DB_PORT?.trim(), 10),
    user: process.env.DB_USER?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim(),
    ssl: { rejectUnauthorized: false },
  });

  console.log('✅ Connected to Railway MySQL database.');

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS feedback (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id     INT UNSIGNED NULL,
      rating      ENUM('angry','sad','neutral','happy','love') NOT NULL DEFAULT 'happy',
      category    ENUM(
                    'Bug Report',
                    'Feature Request',
                    'Translation Error',
                    'UI / UX',
                    'Performance',
                    'Content Request',
                    'Other'
                  ) NOT NULL DEFAULT 'Other',
      description TEXT NOT NULL,
      image_data  LONGTEXT NULL,
      upvotes     INT UNSIGNED NOT NULL DEFAULT 0,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(UserID) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.execute(createTableSQL);
  console.log('✅ Table "feedback" created (or already exists).');

  await connection.end();
  console.log('🔒 Connection closed.');
};

createFeedbackTable().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
