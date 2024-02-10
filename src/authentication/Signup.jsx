import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';

const Signup = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // In the Signup component after adding user document
      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        email: user.email,
        hiddenItems: [], // Initialize an empty array for hidden items
        readItems: [],   // Initialize an empty array for read items
      });
      navigate('/')
    } catch (error) {
      setError('Error signing up with email and password');
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // In the Signup component after adding user document
      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        email: user.email,
        hiddenItems: [], // Initialize an empty array for hidden items
        readItems: [],   // Initialize an empty array for read items
      });
      navigate('/')
    } catch (error) {
      setError('Error signing up with Google');
    }
  };

  return (
    <Container component="main" style={{ height: '100vh', display: 'flex', alignItems: 'center' }} maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Signup
        </Typography>
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
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleEmailSignup}
            sx={{ mt: 3 }}
          >
            Signup
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleGoogleSignup}
            sx={{ mt: 2 }}
          >
            Signup with Google
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/login" variant="body2" style={{ textDecoration: 'none', color: '#1976D2' }}>
                Already have an account? Login here.
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;