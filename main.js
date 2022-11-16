import "./style.css";
import "./node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./node_modules/bootstrap-icons/font/bootstrap-icons.css";

import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initAddForm } from "./add";
import { initList } from "./list";
import { firebaseConfig } from "./config";
import { initRegisterForm } from "./register";
import { initLoginForm } from "./login";
import { initEditForm } from "./edit";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const tasksCollection = collection(db, "tasks");

const signOutButton = document.querySelector("#signOutButton");

if (signOutButton) {
  signOutButton.addEventListener("click", (event) => {
    event.preventDefault();

    signOut(auth).then((result) => {
      window.location.href = window.location.origin + "/login.html";
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    initList(db, tasksCollection, user.uid, storage);
    initAddForm(tasksCollection, user.uid, storage);
    initEditForm(storage, db);
  } else {
    const allowedUrls = ["/register.html", "/login.html"];

    if (!allowedUrls.includes(window.location.pathname)) {
      window.location.href = window.location.origin + "/login.html";
    }
  }
});

initRegisterForm(auth);
initLoginForm(auth);
