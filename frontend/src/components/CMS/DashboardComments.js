import { useEffect, useState } from "react"
import { cmsAxios } from "../../helperModule"


export default function DashboardComments() {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState(null);

  const getCommentsListFromServer = async () => {
    try {
      const response = await cmsAxios.get('/user/comment');
      setComments(response.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };
  const deleteCommentToServer = async (postId, commentId) => {
    try {
      const response = await cmsAxios.delete(`/user/post/${postId}/comment/${commentId}`);
      if (response.status === 202) {
        window.location.reload();
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  useEffect(() => {
    getCommentsListFromServer();
  }, []);

  const handleDeleteComment = (e) => {
    const postId = e.target.dataset.postid;
    const commentId = e.target.value;
    deleteCommentToServer(postId, commentId);
  }

  return (
    <>
      {
        errors ? <p>{errors}</p> :
          comments.length === 0 ? <p>No Comments available</p> :
            <ul className="comments-list">
              {
                comments.map(comment => {
                  return (
                    <li key={comment._id}>
                      <p>{comment.comment_content}</p>
                      <button data-postid={comment.parent_post} value={comment._id} onClick={handleDeleteComment}>Delete this comment</button>
                    </li>
                  )
                })
              }
            </ul>
      }
    </>
  )
}