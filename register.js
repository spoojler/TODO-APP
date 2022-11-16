import { createUserWithEmailAndPassword } from "firebase/auth";

export const initRegisterForm = (auth) => {
  const registerForm = document.querySelector("#registerForm");

  if (registerForm) {
    // Czy dany element zostal znaleziony w HTMlu?
    console.log("Register form has been initialized");

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);

      const email = formData.get("email");
      const password = formData.get("password");

      const alerts = document.querySelector("#alerts");
      alerts.innerHTML = "";

      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const alert = document.createElement("div");
          alert.classList.add("alert", "alert-success");
          alert.innerHTML = `User has been created!`;
          alerts.appendChild(alert);
          window.location.href = window.location.origin;
        })
        .catch((error) => {
          const alert = document.createElement("div");
          alert.classList.add("alert", "alert-danger");

          if (error.code === "auth/email-already-in-use") {
            alert.innerHTML = "This address e-mail is already in use.";
          }

          if (error.code === "auth/weak-password") {
            alert.innerHTML = "Password should be at least 6 characters.";
          }
          alerts.appendChild(alert);
        });
    });
  }
};
