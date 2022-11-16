import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

export const handleDeleteButtons = (db, storage) => {
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = event.currentTarget.dataset.delete;
      const filePath = event.currentTarget.dataset.filePath;

      const docRef = doc(db, "tasks", taskId);

      deleteDoc(docRef).then(() => {
        if (filePath && filePath !== "") {
          const fileRef = ref(storage, filePath);

          deleteObject(fileRef).then(() => {
            console.log("Plik został usunięty");
          });
        }
        console.log("Zadanie zostało usunięte");
      });
    });
  });
};
