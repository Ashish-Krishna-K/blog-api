import { useState } from "react";
import { Link } from "react-router-dom";
import { cmsAxios } from "../../helperModule";

export default function SignUp() {
  const [usernameField, setUsernameField] = useState({ text: '' });
  const [emailField, setEmailField] = useState({ text: '' });
  const [passwordField, setPasswordField] = useState({ text: '' });
  const [confirmPasswordField, setConfirmPasswordField] = useState({ text: '' });
  const [status, setStatus] = useState({ loading: false, code: null });
  const [responseErrors, setResponseErrors] = useState([]);

  const submitFormToServer = async (data) => {
    try {
      const response = await cmsAxios.post('/user/signup', data);
      setStatus({ loading: false, code: response.status });
    } catch (error) {
      setStatus({ loading: false, code: error.response.status });
      const errors = error.response.data.message.errors;
      setResponseErrors(errors);
    }
  };

  const handleUsernameInput = (e) => {
    setUsernameField({
      text: e.target.value
    })
  };
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
  const handleConfirmPasswordInput = (e) => {
    setConfirmPasswordField({
      text: e.target.value
    })
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true })
    const formData = {
      username: usernameField.text,
      email: emailField.text,
      password: passwordField.text,
      confirm_password: confirmPasswordField.text,
    }
    submitFormToServer(formData);
  };

  return (
    <section>
      {status.loading ? <p>Loading...</p> :
        <>
          {
            status.code === 201 ?
              <p>
                <span>Sign Up Successful </span>
                <span><Link to={`/cms/login`}>Login now</Link></span>
                <span> to access your Dashboard</span>
              </p>
              :
              <>
                {
                  <>
                    <form id="signup-form" onSubmit={handleFormSubmit}>
                      <label htmlFor="username">Name*: </label>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        value={usernameField.text}
                        onChange={handleUsernameInput}
                      />
                      <label htmlFor="email">Email*: </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={emailField.text}
                        onChange={handleEmailInput}
                      />
                      <label htmlFor="password">Password*: </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={passwordField.text}
                        onChange={handlePasswordInput}
                      />
                      <label htmlFor="confirmPassword">Confirm Password*: </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirm_password"
                        value={confirmPasswordField.text}
                        onChange={handleConfirmPasswordInput}
                      />
                      <button type="submit">Submit</button>
                    </form>
                    {
                      responseErrors.length !== 0 &&
                      responseErrors.map((err, index) => {
                        if (typeof err === 'object') {
                          const { msg, location } = err;
                          return <p key={index}>{msg} at {location}</p>
                        }
                        return <p key={index}>{err}</p>
                      })
                    }
                  </>
                }
              </>
          }
        </>
      }

    </section>
  )
}