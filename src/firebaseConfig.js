// firebaseConfig.js (Firebase v9+ modular)
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt3Uy8X41IVBw3_KJxYIwNaNadCmixswg",
  authDomain: "titan-dfac7.firebaseapp.com",
  databaseURL: "https://titan-dfac7.firebaseio.com",
  projectId: "titan-dfac7",
  storageBucket: "titan-dfac7.appspot.com",
  messagingSenderId: "960271134865",
  appId: "1:960271134865:web:5ea899b18b2884d62a8f30",
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(firebaseApp);

// Colecciones
const $turnos = collection(db, "titan_turnos");
const $ph_usuarios = collection(db, "usuarios");
const $ph_asambleas = collection(db, "asambleas");
const $ph_preguntas = collection(db, "preguntas");
const $ph_respuestas = collection(db, "respuestas");

export {
  firebaseApp,
  db,
  $turnos,
  $ph_usuarios,
  $ph_asambleas,
  $ph_preguntas,
  $ph_respuestas,
};
