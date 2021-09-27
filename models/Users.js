import path from "path";
import fs from "fs";
import db from '../services/db'
import md5 from "md5";

class Users {

  static createUser = async (email, fName, lName, password) => {
    password = md5(md5(password) + '_safe')
    const data = await db.execute('INSERT INTO users values(null, ?, ?, ?, ?)', [email, fName, lName, password])
    return data[0].insertId;
  }

  static getUser = async (id, includePass = false) => {
    let sql = 'SELECT id, fName, lName, email FROM users WHERE id = ?';
    if (includePass) {
      sql = 'SELECT * FROM users WHERE id = ?';
    }
    const [user] = await db.execute(sql, [id])
    return user[0] || {};
  }

  static getUserByEmail = async (email, includePass = false) => {
    let sql = 'SELECT id, fName, lName, email FROM users WHERE email = ?';
    if (includePass) {
      sql = 'SELECT * FROM users WHERE email = ?';
    }
    const [user] = await db.execute(sql, [email])
    return user[0] || {};
  }

  static getAllUsers = async (limit = 50, offset = 0) => {
    const [users] = await db.execute(`SELECT id, fName, lName, email FROM users LIMIT ${+limit} OFFSET ${+offset}`);
    return users;
  }

  static count = async () => {
    const [users] = await db.execute(`SELECT count(id) FROM users`);
    return users[0]['count(id)'];
  }

}

export default Users;
