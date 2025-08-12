typescriptreact
import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import firebase from 'firebase/compat/app';
const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true); // Toggle between signup and login

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (isSigningUp) {
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('Signed up user:', user);
          })
          .catch((error) => {
            console.error('Error signing up:', error.message);
          });
      } else {
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Logged in user:', user);
          })
          .catch((error) => {
            console.error('Error logging in:', error.message);
          });
      }
    }
  };

  const handleGoogleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log('Signed in with Google:', user);
      }).catch((error) => {
        console.error('Error signing in with Google:', error.message);
      });
  };

  const toggleAuthMode = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <div>
      <h2>{isSigningUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleEmailAuth}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isSigningUp ? 'Sign Up' : 'Login'}</button>
      </form>

      <p>
        {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button type="button" onClick={toggleAuthMode}>
          {isSigningUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
 );
};

export default AuthPage;
