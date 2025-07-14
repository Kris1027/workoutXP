'use client';

import { useState } from 'react';
import SignIn from './sign-in';
import SignUp from './sign-up';

const AuthContainer = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <>
      {mode === 'signin' ? (
        <SignIn onSwitchToSignUp={() => setMode('signup')} />
      ) : (
        <SignUp onSwitchToSignIn={() => setMode('signin')} />
      )}
    </>
  );
};

export default AuthContainer;
