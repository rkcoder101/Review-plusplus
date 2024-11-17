import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import Fab from '@mui/material/Fab';
import Channeli_Icon from '../Channeli_Icon/Channeli_Icon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Signup() {

    return (
        <div>
            <div className="flex flex-row h-screen">
                <div className="w-[70%] h-screen flex flex-col justify-center gap-4 ">
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
                    <div className='flex flex-col items-center gap-4'>
                        <TextField id="outlined-basic" label="Enrollment Number" variant="outlined" style={{ width: '30%' }} />

                        <TextField id="outlined-basic" label="Password" variant="outlined" style={{ width: '30%' }} type='password' />
                        <TextField id="outlined-basic" label="Confirm Password" variant="outlined" style={{ width: '30%' }} type='password' />
                        <Button variant="contained" sx={{ width: '30%', height: '50px' }}><p className='text-lg'>Sign Up</p></Button>

                    </div>
                </div>

                <div className="w-[30%] h-screen flex flex-col justify-center items-center gap-8" style={{

                    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,53,121,1) 34%, rgba(0,212,255,1) 100%)',
                }} >
                    <b className='text-5xl text-center text-white'>Already have an account?</b>
                    <p className='text-3xl text-center text-white'>Login to Connect, Collaborate, and Conquer!</p>
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
                        <b className='text-lg'>Login</b>
                    </Button>

                </div>

            </div>

        </div>
    );
}