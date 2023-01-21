import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cmsAxios, saveAuthTokenToLocalStorage } from "../../backendInteraction";


export default function Login() {
  const [emailField, setEmailField] = useState({ text: '' });
  const [passwordField, setPasswordField] = useState({ text: '' });
  const [status, setStatus] = useState({ loading: false, code: null });
  const [responseErrors, setResponseErrors] = useState({})
  const navigate = useNavigate();

  const submitLoginFormDataToServer = async (data) => {
    try {
      const response = await cmsAxios.post('/user/login', data);
      setStatus({ loading: false, code: response.status });
      setResponseErrors({});
      saveAuthTokenToLocalStorage(response.data.token);
      navigate('/cms_dashboard/posts');
      window.location.reload();
    } catch (error) {
      setStatus({ loading: false, code: error.response.status });
      const errors = error.response.data.message;
      setResponseErrors(errors);
    }
  }

  const handleEmailInput = (e) => {
    setEmailField({
      text: e.target.value
    })
  };
  const handlePasswordInput = (e) => {
    setPasswordField({
      text: e.target.value
    })
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true })
    const formData = {
      email: emailField.text,
      password: passwordField.text,
    }
    submitLoginFormDataToServer(formData);
  };

  return (
    <section>
      {
        status.loading ? <p>Loading...</p> :
          <>
            <form id="login-form" onSubmit={handleFormSubmit}>
              <label htmlFor="email">
                Email*:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={emailField.text}
                onChange={handleEmailInput}
              />
              <label htmlFor="password">
                Password*:
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={passwordField.text}
                onChange={handlePasswordInput}
              />
              <button type="submit">Submit</button>
            </form>
            {
              responseErrors.message && <p>{responseErrors.message}</p>
            }
          </>
      }
    </section>
  )
}