import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../..//utils/axiosInstance'; // Import axiosInstance
import LoginNavbar from '../../components/Navbar/LoginNavbar';
import PasswordInput from '../../Input/PasswordInput';
import { validateEmail } from '../../utils/helper';

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Unused hook
  // const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email Address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    // signUp API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullname: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        // Navigate to the desired page after successful signup
        // navigate("/");
      }
    } catch (error) {
      console.log(error);

      // Handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
    <LoginNavbar />
      <div className='flex items-center justify-center mt-20'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>Sign Up</h4>
            <input
              type="text"
              placeholder="Name"
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type="submit" className='btn-primary'>Create Account</button>

            <p className='text-sm text-center mt-4'>
              Already have an account{" "}
              <Link to="/login" className='font-medium text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp;
