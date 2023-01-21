import { useState } from "react"
import { clientAxios } from "../backendInteraction";

export default function AddComment({ postId }) {
  const [authorInput, setAuthorInput] = useState({ text: '' });
  const [contentInput, setContentInput] = useState({ text: '' });
  const [errors, setErrors] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    code: ''
  });

  const postCommentFormDataToServer = async (data) => {
    try {
      const response = await clientAxios.post(`/post/${postId}/comment/create`, data);
      setStatus({
        loading: false,
        code: response.status
      });
      if (response.status === 201) window.location.reload();
    } catch (error) {
      setStatus({
        loading: false,
        code: error.response.status
      });
      setErrors(error.response.data.message);
    }
  };

  const handleAuthorInput = (e) => {
    setAuthorInput({
      text: e.target.value
    });
  };
  const handleContentInput = (e) => {
    setContentInput({
      text: e.target.value
    });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      author: authorInput.text,
      comment_content: contentInput.text,
    }
    setStatus({
      loading: true,
      code: ''
    })
    postCommentFormDataToServer(formData)
  };

  return (
    <>
      {
        status.loading ? <p>Loading...</p> :
          <>
            <form id="add-comment-form" onSubmit={handleFormSubmit}>
              <textarea
                id="content"
                name="comment_content"
                value={contentInput.text}
                onChange={handleContentInput}
              ></textarea>
              <label htmlFor="author">Name*: </label>
              <input
                id="author"
                name="author"
                value={authorInput.text}
                onChange={handleAuthorInput}
              />
              <button>Submit</button>
            </form>
          </>
      }
    </>
  )
}