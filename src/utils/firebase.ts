import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json"

var credentials = require("./serviceAccount.json")

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      //databaseURL: "https://web-project-73507-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error);
  }
}

export default admin;
