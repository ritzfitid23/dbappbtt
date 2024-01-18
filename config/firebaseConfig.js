//----firebase
const admin = require("firebase-admin");

const serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://bttmanagedec23.appspot.com",
});

const bucket = admin.storage().bucket();

//firebase----

module.exports = { bucket };
