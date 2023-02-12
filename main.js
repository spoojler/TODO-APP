import './style.css';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import './node_modules/bootstrap/dist/js/bootstrap.bundle';
import './node_modules/bootstrap-icons/font/bootstrap-icons.css';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initAddForm } from './add';
import { initList } from './list';
import { firebaseConfig } from './config';
import { initRegisterForm } from './register';
import { initLoginForm } from './login';
import { getStorage } from 'firebase/storage';

export { refresh };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const tasksCollection = collection(db, 'tasks');

const signOutButton = document.querySelector('#signOutButton');
if (signOutButton) {
  signOutButton.addEventListener('click', (event) => {
    event.preventDefault();

    signOut(auth).then((result) => {
      window.location.href = window.location.origin + '/login.html';
    });
  });
}

const loginPage = window.location.origin + '/login.html';
const registerPage = window.location.origin + '/register.html';
initLoginForm(auth);
const userLogged = onAuthStateChanged(auth, (user) => {
  if (user) {
    initList(db, tasksCollection, storage);
    initAddForm(tasksCollection, storage);
    if (window.location.href === loginPage) {
      window.location.href = window.location.origin;
    }
  } else {
    console.log('Nie jestes zalogowany');
    if (
      !(
        window.location.href === loginPage ||
        window.location.href === registerPage
      )
    ) {
      window.location.href = window.location.origin + '/login.html';
    }
  }
});

initRegisterForm(auth);

function refresh() {
  window.location.href = window.location.href;
}
