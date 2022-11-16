import { Timestamp, addDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const initAddForm = (
  tasksCollection,
  userId,
  storage,
  tasksQuantity
) => {
  const addForm = document.querySelector("#addForm");
  const addFormModal = new bootstrap.Modal("#addTaskModal");

  if (addForm && addFormModal) {
    addForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(addForm);

      const deadlineDate = new Date(formData.get("deadline"));
      const deadlineTimestamp = Timestamp.fromDate(deadlineDate);

      const file = formData.get("attachment");

      if (file && file.size > 0) {
        const fileRef = ref(storage, "attachments/" + file.name);

        uploadBytes(fileRef, file)
          .then((result) => {
            getDownloadURL(result.ref).then((url) => {
              const newTask = makeTask(
                formData.get("name"),
                deadlineTimestamp,
                tasksQuantity + 1,
                userId,
                result.metadata.fullPath,
                url
              );

              addDoc(tasksCollection, newTask).then((data) =>
                onTaskAdded(data, addFormModal, addForm)
              );
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const newTask = makeTask(
          formData.get("name"),
          deadlineTimestamp,
          tasksQuantity + 1,
          userId,
          null,
          null
        );

        addDoc(tasksCollection, newTask).then((data) =>
          onTaskAdded(data, addFormModal, addForm)
        );
      }
    });
  }
};

const onTaskAdded = (data, addFormModal, addForm) => {
  addFormModal.hide();
  addForm.reset();
};

const makeTask = (name, deadline, order, userId, filePath, fileUrl) => {
  return {
    order: order,
    name: name,
    deadline: deadline,
    done: false,
    userId: userId,
    filePath: filePath,
    fileUrl: fileUrl,
  };
};
