import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { cmsAxios } from "../../backendInteraction";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [titleInput, setTitleInput] = useState({ text: '' });
  const [contentInput, setContentInput] = useState({ text: '' });
  const [formErrors, setFormErrors] = useState([]);
  const [otherErrors, setOtherErrors] = useState(null);

  const getPostFromServer = async (id) => {
    try {
      const response = await cmsAxios.get(`/user/post/${id}`);
      console.log(response.data);
      setTitleInput({ text: response.data.title });
      setContentInput({ text: response.data.content })
    } catch (error) {
      setOtherErrors(error.response.data.message);
    }
  }

  const submitFormToServer = async (data) => {
    try {
      const response = await cmsAxios.put(`/user/post/${postId}`, data);
      setFormErrors([]);
      setOtherErrors(null);
      navigate('/cms_dashboard/posts');
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.message;
        errors?.errors ? setFormErrors(errors.errors) : setOtherErrors(errors);
      } else {
        setOtherErrors(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    getPostFromServer(postId);
  }, [postId])

  const handleTitleInput = (e) => {
    setTitleInput({
      text: e.target.value,
    })
  };
  const handleContentInput = (e) => {
    setContentInput({
      text: e.target.value
    })
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title: titleInput.text,
      content: contentInput.text,
    }
    submitFormToServer(formData);
  }
  return (
    <>
      <form id="create-post-form" onSubmit={handleFormSubmit}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          id="title"
          name="title"
          value={titleInput.text}
          onChange={handleTitleInput}
        />
        <label htmlFor="content">Content: </label>
        <textarea
          type="text"
          id="content"
          name="content"
          value={contentInput.text}
          onChange={handleContentInput}
        />
        <button type="submit">Submit</button>
      </form>
      {
        formErrors.length !== 0 && formErrors.map((err, index) => <p key={index}>{err.msg} at {err.param}</p>)
      }
      {
        otherErrors && <p>{otherErrors}</p>
      }
    </>
  )
}