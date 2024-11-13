import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC--DMYa-svuQ_-lc3_OdBDF3TmQLOQAx0",
  authDomain: "meu-racha-3299a.firebaseapp.com",
  databaseURL: "https://meu-racha-3299a-default-rtdb.firebaseio.com",
  projectId: "meu-racha-3299a",
  storageBucket: "meu-racha-3299a.firebasestorage.app",
  messagingSenderId: "258821677604",
  appId: "1:258821677604:web:d72540b62b791d3a662eb1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
export { app };
