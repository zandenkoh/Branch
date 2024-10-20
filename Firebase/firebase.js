// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkSiaaq7hMmYatDf2vVUf929Pi9zg0sEo",
    authDomain: "quicklink-45bf3.firebaseapp.com",
    databaseURL: "https://quicklink-45bf3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quicklink-45bf3",
    storageBucket: "quicklink-45bf3.appspot.com",
    messagingSenderId: "1017626607788",
    appId: "1:1017626607788:web:c6716958e509c6c67edf09"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
