import firebase from "firebase/app";
import "firebase";

const config = {
	apiKey: "AIzaSyDMCsOchALfZqG32X9x3jLqTLHzmFdJQng",
	authDomain: "ecom-297c8.firebaseapp.com",
	projectId: "ecom-297c8",
	messagingSenderId: "345653266843",
	appId: "1:345653266843:web:1d16121307147f9171393e",
};
// Initialize Firebase

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
