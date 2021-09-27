import Users from "../models/Users";
import HttpError from "http-errors";
import md5 from "md5";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

class UsersController {

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.getUserByEmail(email, true);
      console.log(user)
      const isLogin = user && user.password === md5(md5(password) + '_safe');

      if (!isLogin) {
        throw HttpError(403, 'Invalid email or password')
      }

      const token = jwt.sign({ email }, JWT_SECRET);

      res.json({
        status: 'ok',
        token,
        isLogin
      })
    } catch (e) {
      next(e)
    }
  }

  static register = async (req, res, next) => {
    try {
      const { email, password, fName, lName } = req.body;

      const userId = await Users.createUser(email, fName, lName, password)

      const user = await Users.getUser(userId);

      res.json({
        status: 'ok',
        user
      })
    } catch (e) {
      next(e)
    }
  }

  static profile = (req, res, next) => {
    try {
      const { userEmail } = req;
      const user = Users.getUser(userEmail);
      res.json({
        status: 'ok',
        user
      })
    } catch (e) {
      next(e)
    }
  }


  static usersList = async (req, res, next) => {
    try {
      const { page = 1 } = req.query;
      const limit = 2;
      const offset = (page - 1) * limit;
      const users = await Users.getAllUsers(limit, offset);
      const total = await Users.count();
      res.json({
        status: 'ok',
        total,
        pages: Math.ceil(total / limit),
        users
      })
    } catch (e) {
      next(e)
    }
  }

}

export default UsersController;
