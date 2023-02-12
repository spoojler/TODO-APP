import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { refresh } from './main';

export const handleDoneButtons = (db) => {
  const doneButtons = document.querySelectorAll('.btn-done');

  doneButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const taskId = event.target.dataset.done;

      const docRef = doc(db, 'tasks', taskId);

      getDoc(docRef).then((doc) => {
        const isDone = doc.data().done;

        updateDoc(docRef, {
          done: !isDone,
        }).then(() => {
          console.log('Task has been done');
          refresh();
        });
      });
    });
  });
};
