import mysql from "mysql2";
import Promise from 'bluebird';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'group9',
    Promise,
  })
  const db = connection.promise();

  // const [rows] = await db.execute('SELECT * FROM animals limit 10')

  const name  = 'Rex';
  const limit  = 99;

  const [rows1] = await db.execute('SELECT * FROM animals WHERE name = ? or owner = ?', [name, name])

  console.log(rows1)
}


main()
