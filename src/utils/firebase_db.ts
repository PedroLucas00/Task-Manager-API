import Firebase from 'Firebase/app';
import 'Firebase/auth';

const FirebaseCredentials = {
    apiKey: "AIzaSyAAn9-HXAZSw4dQ8oLhJdAfhduD6Q5UgOQ",
    authDomain: "web-project-73507.firebaseapp.com",
    databaseURL: "https://web-project-73507-default-rtdb.firebaseio.com",
    projectId: "web-project-73507",
    storageBucket: "web-project-73507.appspot.com",
    messagingSenderId: "1018233390440",
    appId: "1:1018233390440:web:ee64c9d23247fbb6e842dd",
    measurementId: "G-3T3DNZF673"
}
// if a Firebase instance doesn't exist, create one
if (!Firebase.getApp.length) {
  Firebase.initializeApp(FirebaseCredentials)
}

export default Firebase;