import React, { useState } from 'react';
import moment from 'moment'; // Import moment library
import LoginNavbar from '../../components/Navbar/LoginNavbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError(""); // Clear previous error message


        //Login api call

        try {
            const response = await axiosInstance.post("https://note-well-backend-dtdg6t8rc-harshs-projects-03602f72.vercel.app/login", {
                email: email,
                password: password,
            });

            // Handle successful login response
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/'); // Fixed typo Navigate to navigate
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
        <div>
            <LoginNavbar />
            <div className='flex items-center justify-center mt-20'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleLogin}>
                        <h4 className='text-2xl mb-7'>Login</h4>
                        <input
                            type="text"
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

                        <button type="submit" className='btn-primary'>Login</button>

                        <p className='text-sm text-center mt-4'>
                            Not registered yet?{" "}
                            <Link to="/signup" className='font-medium text-primary underline'>
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
