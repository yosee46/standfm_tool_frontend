import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzEy1LYwyKNugwaCypkooMRxa-jAhfDuw",
  authDomain: "snsresearch.firebaseapp.com",
  projectId: "snsresearch",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);