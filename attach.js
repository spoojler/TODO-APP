import { ref, getDownloadURL } from 'firebase/storage';

export const handleAttachButtons = (storage) => {
  const attachButtons = document.querySelectorAll('#attachBtn');

  attachButtons.forEach((button) => {
    const attachUrl = button.dataset.attachment;
    button.addEventListener('click', (event) => {
      getDownloadURL(ref(storage, attachUrl)).then((url) => {
        window.open(url);
      });
    });
  });
};
