const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
  db.run("ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP", (err) => {
    if (err && !err.message.includes("duplicate column")) {
      console.error(err);
    } else {
      console.log("User table updated.");
    }
  });
});

db.close();
