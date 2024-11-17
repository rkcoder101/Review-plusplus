import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import Fab from '@mui/material/Fab';
import Channeli_Icon from '../Channeli_Icon/Channeli_Icon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login() {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div>
            <div className="flex flex-row h-screen">
                <div className="w-[70%] h-screen flex flex-col justify-center gap-4 ">
                    <b className="text-5xl text-center">Login To Your Account</b>
                    <p className="text-lg text-center text-gray-500">Login using your socials</p>

                    <div className="flex flex-row justify-center gap-4">                       

                        <Channeli_Icon />

                    </div>
                    <div className="flex items-center text-center">
                        <hr className="flex-1 border border-grey-500" />
                        <span className="mx-2 text-gray-500">OR</span>
                        <hr className="flex-1 border border-grey-500" />
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        <TextField id="outlined-basic" label="Enrollment Number" variant="outlined" style={{ width: '30%' }} />
                        <TextField id="outlined-basic" label="Password" variant="outlined" style={{ width: '30%' }} type='password' />
                        <Button variant="contained" sx={{ width: '30%', height: '50px' }}><p className='text-lg'>Login</p></Button>

                    </div>
                </div>

                <div className="w-[30%] h-screen flex flex-col justify-center items-center gap-8" style={{

                    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,53,121,1) 34%, rgba(0,212,255,1) 100%)',
                }} >
                    <b className='text-5xl text-center text-white'>New Here?</b>
                    <p className='text-3xl text-center text-white'>Sign up to Connect, Collaborate, and Conquer!</p>
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
                        <b className='text-lg'>Signup</b>
                    </Button>

                </div>

            </div>

        </div>
    );
}