import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

export const initLoginForm = (auth) => {
  const loginForm = document.querySelector('#loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const alerts = document.querySelector('#alerts');

      signInWithEmailAndPassword(
        auth,
        formData.get('email'),
        formData.get('password')
      )
        .then((result) => {
          window.location.href = window.location.origin;
        })
        .catch((error) => {
          console.log(error);
          alerts.innerHTML = `<div class="alert alert-danger">${getErrorMessage(
            error
          )}</div>`;
          // window.location.href = window.location.origin;
        });
    });
    initSignInWithGoogle(auth);
  }
};

const initSignInWithGoogle = (auth) => {
  const signInButton = document.querySelector('#signInWithGoogleButton');

  if (signInButton) {
    signInButton.addEventListener('click', (event) => {
      event.preventDefault();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        window.location.href = window.location.origin;
      });
    });
  }
};

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/wrong-password':
      return 'Provided password is wrong.';
    case 'auth/user-not-found':
      return 'User with given e-mail adress is not found';
    default:
      return error;
  }
};
