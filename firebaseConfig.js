import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYOjJb1sQag_eqD83fBgTIJX4XLWJct7w",
  authDomain: "oral-board.firebaseapp.com",
  projectId: "oral-board",
  storageBucket: "oral-board.appspot.com",
  messagingSenderId: "934680161269",
  appId: "1:934680161269:web:0dc706e4c822345aa48ebc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
