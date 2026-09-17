import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDm-1uRg4ynLABFojsOR1AoR50c-2K5HGU",
    authDomain: "collaborative-coding-pla-aa1af.firebaseapp.com",
    projectId: "collaborative-coding-pla-aa1af",
    storageBucket: "collaborative-coding-pla-aa1af.firebasestorage.app",
    messagingSenderId: "1072394611831",
    appId: "1:1072394611831:web:46f29f3201dc19f4ceaa72",
    measurementId: "G-FY9E3MNBEH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };