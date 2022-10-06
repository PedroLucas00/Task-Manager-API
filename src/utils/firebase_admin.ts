import admin from "firebase-admin";
var credentials = require("./serviceAccount.json");

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(credentials),
			storageBucket: 'gs://web-project-73507.appspot.com'
		});
	} catch (error) {
		console.log("Firebase admin initialization error", error);
	}
}

export default admin;