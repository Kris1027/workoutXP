'use client';

interface SignUpComponentProps {
  onSwitchToSignIn?: () => void;
}

const SignUp = ({ onSwitchToSignIn }: SignUpComponentProps) => {
  return (
    <div className='text-center p-8'>
      <h2 className='text-2xl font-bold mb-4'>Sign Up</h2>
      {/* Registration form goes here */}
      <p className='mb-2'>Already have an account?</p>
      <button
        type='button'
        className='text-primary underline hover:text-primary/80'
        onClick={onSwitchToSignIn}
      >
        Sign in
      </button>
    </div>
  );
};

export default SignUp;
