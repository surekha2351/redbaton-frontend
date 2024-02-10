import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Container } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error('Error signing in with email and password:', error);
            setError(error.message);
        }
    };

    const handleForgotPassword = async () => {
        try {
            if (!email) {
                setError('Email is required for password reset.');
                return;
            }

            await sendPasswordResetEmail(auth, email);
            setError('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setError(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            // eslint-disable-next-line no-undef
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (!userDoc.exists()) {
                // In the Signup component after adding user document
                // eslint-disable-next-line no-undef
                await addDoc(collection(db, 'users'), {
                    userId: user.uid,
                    email: user.email,
                    hiddenItems: [], // Initialize an empty array for hidden items
                    readItems: [],   // Initialize an empty array for read items
                });
            }
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message);
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <Container component="main" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} maxWidth="xs">
            <div style={{ width: '350px', textAlign: 'center' }} className='shadow p-3 '>
                <h2>Login</h2>
                <form onSubmit={(e) => e.preventDefault()} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        style={{ marginTop: '20px' }}
                    >
                        Login
                    </Button>
                    {error && (
                        <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
                    )}
                    <Grid container justifyContent="space-between" style={{ marginTop: '10px' }}>
                        <Grid item>
                            <Button onClick={handleForgotPassword} style={{ textDecoration: 'none', color: '#1976D2' }}>
                                Forgot Password?
                            </Button>
                        </Grid>
                        <Grid item>
                            <RouterLink to="/signup" style={{ textDecoration: 'none', color: '#1976D2' }}>
                                New User? Sign Up
                            </RouterLink>
                        </Grid>
                    </Grid>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoogleLogin}
                        style={{ margin: '20px 0' }}
                    >
                        Login with Google
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default Login;