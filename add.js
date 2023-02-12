import { Timestamp, addDoc } from 'firebase/firestore';
import { refresh } from './main';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const initAddForm = (tasksCollection, storage) => {
  const addForm = document.querySelector('#addForm');

  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(addForm);

      const deadlineDate = new Date(formData.get('deadline'));
      const deadlineTimestamp = Timestamp.fromDate(deadlineDate);

      const file = formData.get('attachment');

      const fileRef = ref(storage, 'attachments/' + file.name);

      uploadBytes(fileRef, file)
        .then((result) => {
          getDownloadURL(result.ref).then((url) => {
            console.log('obrazek został dodany');

            const newTask = {
              name: formData.get('name'),
              deadline: deadlineTimestamp,
              done: false,
              startTime: formData.get('startTime'),
              order: 9999,
              filePath: result.metadata.fullPath,
              fileUrl: url,
            };

            addDoc(tasksCollection, newTask).then((data) => {
              console.log('Task has been added!');
              refresh();
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
};
