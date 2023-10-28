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
    // play the fadeout animation
    addCommentModal.classList.add('closeModal');
    // close modal after the fadeout animation
    setTimeout(() => {
      addCommentModal.close();
    }, 199);
    addCommentModal.addEventListener('close', () => {
      // remove the class that adds the fadeout animation after
      // the modal closes to avoid bugs
      addCommentModal.classList.remove('closeModal');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // the page is showing validation errors from addComment
  // show the modal on load
  if (addCommentBtn?.value === 'true') {
    showModal();
  }
});

document.addEventListener('keydown', function (ev: KeyboardEvent) {
  if (ev.key === 'Escape') closeModal();
});

addCommentBtn?.addEventListener('click', showModal);

cancelBtn?.addEventListener('click', closeModal);
