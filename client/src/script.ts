const addCommentBtn = document.querySelector('button#add-comment-btn') as HTMLButtonElement | null;
const cancelBtn = document.querySelector('button#cancel-btn') as HTMLButtonElement | null;
const addCommentModal = document.querySelector('dialog#add-comment-modal') as HTMLDialogElement | null;

const showModal = () => {
  if (addCommentModal) {
    addCommentModal.classList.add('openModal');
    addCommentModal.showModal();
  }
};

const closeModal = () => {
  if (addCommentModal) {
    addCommentModal.classList.remove('openModal');
    addCommentModal.classList.add('closeModal');
    setTimeout(() => {
      addCommentModal.close();
    }, 199);
    addCommentModal.addEventListener('close', () => {
      addCommentModal.classList.remove('closeModal');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (addCommentBtn?.value === 'true') {
    showModal();
  }
});

document.addEventListener('keydown', function (ev: KeyboardEvent) {
  if (ev.key === 'Escape') closeModal();
});

addCommentBtn?.addEventListener('click', showModal);

cancelBtn?.addEventListener('click', closeModal);
