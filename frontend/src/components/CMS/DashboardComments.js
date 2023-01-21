import { useEffect, useState } from "react"
import { cmsAxios } from "../../backendInteraction"


export default function DashboardComments() {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState(null);

  const getCommentsListFromServer = async () => {
    try {
      const response = await cmsAxios.get('/user/comment');
      console.log(response.data);
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
  }, [])

  return (
    <>
      {
        errors ? <p>{errors}</p> :
          comments.length === 0 ? <p>No Comments available</p> :
            comments.map(comment => {
              return (
                <></>
              )
            })
      }
    </>
  )
}