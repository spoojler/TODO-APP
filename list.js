import { onSnapshot, query, where } from "firebase/firestore";
import { handleDeleteButtons } from "./delete";
import { handleDoneButtons } from "./done";
import { handleEditButtons } from "./edit";

export const initList = (db, tasksCollection, userId, storage) => {
  const tasksList = document.getElementById("tasksList");

  if (tasksList) {
    const tasksQuery = query(tasksCollection, where("userId", "==", userId));

    onSnapshot(tasksQuery, (querySnapshot) => {
      const documentsData = querySnapshot.docs;

      renderTasksList(tasksList, documentsData);
      handleDoneButtons(db);
      handleDeleteButtons(db, storage);
      handleEditButtons(db);
    });
  }
};

const renderTasksList = (tasksList, documentsData) => {
  tasksList.innerHTML = "";

  documentsData
    .sort((docA, docB) => {
      return docA.data().order - docB.data().order;
    })
    .forEach((doc) => {
      const task = doc.data();
      const taskId = doc.id;

      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      if (task.done) {
        li.classList.add("list-group-item-dark");
      }

      const formattedDeadline = task.deadline.toDate().toLocaleDateString();

      const doneButton = `<button data-done="${taskId}" class="btn btn-primary btn-done">${
        task.done
          ? `<i class="bi bi-backspace"></i>`
          : `<i class="bi bi-check2-square"></i>`
      }</button>`;

      const deleteButton = `<button data-delete="${taskId}" data-file-path="${
        task.filePath ? task.filePath : ""
      }" class="btn btn-warning btn-delete"><i class="bi bi-trash-fill"></i></button>`;

      const attachmentButton = `<a class="btn btn-light" href="${task.fileUrl}" target="_blank"><i class="bi bi-paperclip"></i></a>`;

      const editButton = `<button class="btn btn-success" data-edit="${taskId}"><i class="bi bi-pencil-fill"></i></button>`;

      li.innerHTML = `<span><strong>${
        task.name
      }</strong> (${formattedDeadline})</span> <span class="btn-group">${doneButton}${editButton}${deleteButton}${
        task.filePath ? attachmentButton : ""
      }</span>`;

      tasksList.appendChild(li);
    });
};
