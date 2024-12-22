import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAXcBdzB-dwtmNCEYGICxii2_nY1zWocgY",
    authDomain: "dhina-kaattru.firebaseapp.com",
    databaseURL: "https://dhina-kaattru-default-rtdb.firebaseio.com",
    projectId: "dhina-kaattru",
    storageBucket: "dhina-kaattru.appspot.com",
    messagingSenderId: "114098196199",
    appId: "1:114098196199:web:48cc25edbd6e3a38c05c42",
    measurementId: "G-FJ5CQB2CR7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);