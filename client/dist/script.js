"use strict";
const addCommentBtn = document.querySelector('button#add-comment-btn');
const cancelBtn = document.querySelector('button#cancel-btn');
const addCommentModal = document.querySelector('dialog#add-comment-modal');
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
    if ((addCommentBtn === null || addCommentBtn === void 0 ? void 0 : addCommentBtn.value) === 'true') {
        showModal();
    }
});
document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape')
        closeModal();
});
addCommentBtn === null || addCommentBtn === void 0 ? void 0 : addCommentBtn.addEventListener('click', showModal);
cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', closeModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBNkIsQ0FBQztBQUNuRyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUE2QixDQUFDO0FBQzFGLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQTZCLENBQUM7QUFFdkcsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQ3JCLElBQUksZUFBZSxFQUFFO1FBQ25CLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUM3QjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUN0QixJQUFJLGVBQWUsRUFBRTtRQUNuQixlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5QyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNSLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzdDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUM7QUFFRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2pELElBQUksQ0FBQSxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsS0FBSyxNQUFLLE1BQU0sRUFBRTtRQUNuQyxTQUFTLEVBQUUsQ0FBQztLQUNiO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBaUI7SUFDOUQsSUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLFFBQVE7UUFBRSxVQUFVLEVBQUUsQ0FBQztBQUN4QyxDQUFDLENBQUMsQ0FBQztBQUVILGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFcEQsU0FBUyxhQUFULFNBQVMsdUJBQVQsU0FBUyxDQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyJ9