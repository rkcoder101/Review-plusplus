import React, { useState } from 'react';
import Channeli_Icon from '../Channeli_Icon/Channeli_Icon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Signup() {
    const [formData, setFormData] = useState({
        enrollment_number: '',
        name: '',
        branch: '',
        password: '',
        confirm_password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/asgns/signup/', {
                enrollment_number: formData.enrollment_number,
                password: formData.password,
                name: formData.name,
                branch: formData.branch,
                },
                {
                    withCredentials: true   
                }
            );

            alert(`Signup successful! Welcome`);
            window.location.href = 'http://localhost:5173/dashboard';
            setError('');
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex flex-row h-screen">
                {/* Left Section */}
                <div className="w-[70%] h-screen flex flex-col justify-center gap-4">
                    <b className="text-5xl text-center">Sign up into your new account</b>
                    <p className="text-lg text-center text-gray-500">Sign up using your socials</p>

                    <div className="flex flex-row justify-center gap-4">
                        <a href="http://127.0.0.1:8000/asgns/authorize">
                            <Channeli_Icon />
                        </a>
                    </div>
                    <div className="flex items-center text-center">
                        <hr className="flex-1 border border-grey-500" />
                        <span className="mx-2 text-gray-500">OR</span>
                        <hr className="flex-1 border border-grey-500" />
                    </div>

                    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
                        <TextField
                            id="enrollment"
                            label="Enrollment Number"
                            name="enrollment_number"
                            variant="outlined"
                            value={formData.enrollment_number}
                            onChange={handleChange}
                            style={{ width: '30%' }}
                        />
                        <TextField
                            id="name"
                            label="Name"
                            name="name"
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '30%' }}
                        />
                        <TextField
                            id="branch"
                            label="Branch"
                            name="branch"
                            variant="outlined"
                            value={formData.branch}
                            onChange={handleChange}
                            style={{ width: '30%' }}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            name="password"
                            variant="outlined"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: '30%' }}
                        />
                        <TextField
                            id="confirm_password"
                            label="Confirm Password"
                            name="confirm_password"
                            variant="outlined"
                            type="password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            style={{ width: '30%' }}
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <Button type="submit" variant="contained" sx={{ width: '30%', height: '50px' }}>
                            <p className="text-lg">Sign Up</p>
                        </Button>
                    </form>
                </div>

                {/* Right Section */}
                <div
                    className="w-[30%] h-screen flex flex-col justify-center items-center gap-8"
                    style={{
                        background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,53,121,1) 34%, rgba(0,212,255,1) 100%)',
                    }}
                >
                    <b className="text-5xl text-center text-white">Already have an account?</b>
                    <p className="text-3xl text-center text-white">Login to Connect, Collaborate, and Conquer!</p>
                    <Button
                        variant="contained"
                        sx={{
                            width: '30%',
                            height: '50px',
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                    >
                        <a href="http://localhost:5173/login">
                            <b className="text-lg">Login</b>
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
