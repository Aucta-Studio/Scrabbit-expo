import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAfNf-vYuWKwdSNwWteBYIvH1p8hBbveMs",
  authDomain: "scrabbit-app-test-1.firebaseapp.com",
  projectId: "scrabbit-app-test-1",
  storageBucket: "scrabbit-app-test-1.appspot.com",
  messagingSenderId: "123116420409",
  appId: "1:123116420409:web:f928651cd5a4975831bce8",
  measurementId: "G-2CXPM7M3R4"
};

export const myFireBase = initializeApp(firebaseConfig);
