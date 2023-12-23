const admin = require("firebase-admin");
class Controller {
  static async create(request, response, next) {
    const serviceAccount = require("../credentials.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://bttwebbappp13-default-rtdb.asia-southeast1.firebasedatabase.app", // Replace with your database URL
    });
    const db = admin.firestore();

    db.collection("items")
      .add({ test: "test" })
      .then((docRef) => {
        response.status(201).json({ id: docRef.id });
      })
      .catch((error) => {
        next(error);
      });
  }
}

module.exports = Controller;
