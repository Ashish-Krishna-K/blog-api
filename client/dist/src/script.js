"use strict";
const addCommentBtn = document.querySelector('button#add-comment-btn');
const addCommentModal = document.querySelector('dialog#add-comment-modal');
const addCommentFrm = document.querySelector('form#add-comment');
addCommentBtn === null || addCommentBtn === void 0 ? void 0 : addCommentBtn.addEventListener('click', () => {
    if (addCommentModal) {
        addCommentModal.showModal();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3ZFLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMzRSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFakUsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDNUMsSUFBSSxlQUFlLEVBQUU7UUFDbEIsZUFBcUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNwRDtBQUNILENBQUMsQ0FBQyxDQUFBIn0=