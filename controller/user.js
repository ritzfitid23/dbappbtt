const { User } = require("../models");
const { comparepass, hashPass, signToken } = require("../helper");

class Controller {
  static async register(request, response, next) {
    try {
      const { username, password, role } = request.body;

      if (role === "admin") {
        throw {
          err: "admin tidak boleh",
        };
      }

      const hashedpass = hashPass(password);
      const user = await User.create({
        username,
        password: hashedpass,
        role,
      });
      response.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async login(request, response, next) {
    try {
      // const { currId } = request.headers;
      const { username, password } = request.body;
      const user = await User.findOne({ where: { username } });

      if (user) {
        // Use the comparePass function to check if the entered password matches the stored hashed password
        const isPasswordValid = await comparepass(password, user.password);

        if (isPasswordValid) {
          const token = signToken({ id: user.id, username: user.username });

          response.status(200).json({
            message: "Login successful",
            token,
            id: user.id,
            role: user.role,
            username: user.username,
          });
        } else {
          response.status(401).json({ error: "Login failed" });
        }
      } else {
        response.status(401).json({ error: "Login failed" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(request, response, next) {}
}

module.exports = Controller;
