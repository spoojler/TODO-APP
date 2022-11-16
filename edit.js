import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export const handleEditButtons = (db) => {
  const buttons = document.querySelectorAll("[data-edit]");
  const modal = new bootstrap.Modal("#editTaskModal");

  buttons.forEach((button) =>
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const id = event.currentTarget.dataset.edit;
      const docRef = doc(db, "tasks", id);

      modal.show();

      const editForm = document.querySelector("#editForm");

      getDoc(docRef).then((doc) => {
        patchForm(id, doc.data(), editForm);
      });
    })
  );
};

export const initEditForm = (storage, db) => {
  const editForm = document.querySelector("#editForm");
  const editFormModal = new bootstrap.Modal("#editTaskModal");

  if (editForm && editFormModal) {
    editForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(editForm);

      const deadlineDate = new Date(formData.get("deadline"));
      const deadlineTimestamp = Timestamp.fromDate(deadlineDate);

      const file = formData.get("attachment");

      if (file && file.size > 0) {
        const fileRef = ref(storage, "attachments/" + file.name);

        uploadBytes(fileRef, file)
          .then((result) => {
            getDownloadURL(result.ref).then((url) => {
              const dataToUpdate = {
                name: formData.get("name"),
                deadline: deadlineTimestamp,
                fileUrl: url,
                filePath: result.metadata.fullPath,
                order: formData.get("order"),
              };

              // Przekazac taskId
              const taskId = formData.get("taskId");
              const docRef = doc(db, "tasks", taskId);

              updateDoc(docRef, dataToUpdate).then((result) => {
                onTaskUpdated(editFormModal, editForm);
              });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const dataToUpdate = {
          name: formData.get("name"),
          deadline: deadlineTimestamp,
          order: formData.get("order"),
        };
        const taskId = formData.get("taskId");
        const docRef = doc(db, "tasks", taskId);

        updateDoc(docRef, dataToUpdate).then((result) => {
          console.log(editFormModal);
          onTaskUpdated(editFormModal, editForm);
        });
      }
    });
  }
};

const onTaskUpdated = (modal, form) => {
  modal.hide();
  form.reset();
};

const patchForm = (taskId, data, form) => {
  // Opcja 1
  const nameInput = document.querySelector("#editForm [name='name']");
  // Opcja 2
  const dateInput = form.querySelector("[name='deadline']");
  const taskIdInput = form.querySelector("[name='taskId']");
  const editInput = form.querySelector("[name='order']");

  nameInput.value = data.name;

  const deadlineDate = data.deadline.toDate(); // Date
  const deadlineDateString = deadlineDate.toISOString().split("T");
  dateInput.value = deadlineDateString[0];
  taskIdInput.value = taskId;
  editInput.value = data.order;
};
