import { getDocs, orderBy, query } from 'firebase/firestore';
import { handleDeleteButtons } from './delete';
import { handleDoneButtons } from './done';
import { handleAttachButtons } from './attach';




export const initList = (db, tasksCollection, storage) => {
  const tasksList = document.getElementById('tasksList');

  if (tasksList) {
    const tasksQuery = query(tasksCollection, orderBy('order'));
    getDocs(tasksQuery)
      .then((snapshot) => {
        const documentsData = snapshot.docs;

        renderTasksList(tasksList, documentsData, storage);
        handleDoneButtons(db);
        handleDeleteButtons(db);
        handleAttachButtons(storage);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
};

const renderTasksList = (tasksList, documentsData) => {
  documentsData.forEach((doc) => {
    const task = doc.data();
    const taskId = doc.id;

    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );

    if (task.done) {
      li.classList.add('task-done');
    }

    const formattedDeadline = task.deadline.toDate().toLocaleDateString();

    const doneButton = `<button data-done="${taskId}" class="btn btn-primary btn-done">${
      task.done ? 'Undone' : 'Done'
    }</button>`;
    const deleteButton = `<button data-delete="${taskId}" class="btn btn-warning btn-delete">Delete</button>`;
    const attachBtn = `<button class ="btn" id="attachBtn" data-attachment="${task.filePath}"><i class="bi bi-paperclip m-2"></button></i>`;
    li.innerHTML = `<span>
<strong>${
      task.name
    }</strong> (${formattedDeadline})</span><span class="btn-toolbar">${
      task.filePath !== 'attachments' ? attachBtn : ''
    }<div class="btn-group ml-2">${doneButton}${deleteButton}</div></span>`;

    tasksList.appendChild(li);
  });
};
