import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export const initLoginForm = (auth) => {
  const loginForm = document.querySelector("#loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const alerts = document.querySelector("#alerts");

      signInWithEmailAndPassword(
        auth,
        formData.get("email"),
        formData.get("password")
      )
        .then((result) => {
          const message = "Login successful";
          alerts.innerHTML = `<div class="alert alert-success">${message}</div>`;
          window.location.href = window.location.origin;
        })
        .catch((error) => {
          alerts.innerHTML = `<div class="alert alert-danger">${getErrorMessage(
            error
          )}</div>`;
        });
    });

    initSignItWithGoogle(auth);
  }
};

const initSignItWithGoogle = (auth) => {
  const signInButton = document.querySelector("#signInWithGoogleButton");

  const signInButtonWithFacebook = document.querySelector(
    "#signInWithFacebookButton"
  );

  signInButtonWithFacebook.addEventListener("click", (event) => {
    signInWithProvider(auth, new FacebookAuthProvider(), event);
  });

  if (signInButton) {
    signInButton.addEventListener("click", (event) => {
      signInWithProvider(auth, new GoogleAuthProvider(), event);
    });
  }
};

const signInWithProvider = (auth, provider, event) => {
  event.preventDefault();

  signInWithPopup(auth, provider).then((result) => {
    window.location.href = window.location.origin;
  });
};

const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/wrong-password":
      return "Provided password is wrong.";
    case "auth/user-not-found":
      return "User with given e-mail adress is not found";
    default:
      return error.message;
  }
};
