import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../Provider/Authprovider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import auth from '../../Firebase/firebase.config';

const Login = () => {
    const { signInWithEmail, googleProvider } = useContext(AuthContext);
    const [, setError] = useState('');
    const [showPassword, setShowPassWord] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                const user = result.user;
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    createdAt: user.metadata.creationTime,
                    lastLogin: new Date().toISOString()
                };
                
                const res = await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                await res.json();
                
                Swal.fire({
                    title: 'Welcome back!',
                    text: `Hello, ${user.displayName || user.email}`,
                    icon: 'success',
                    confirmButtonText: 'Okay',
                });
                navigate('/');
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                Swal.fire({
                    title: 'Error',
                    text: 'Google Sign-In failed. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        setEmail(email);

        signInWithEmail(email, password)
            .then(async (result) => {
                const user = result.user;
                
                await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, lastLogin: new Date().toISOString() })
                });
                
                Swal.fire({
                    title: 'Login Successful!',
                    text: `Welcome back, ${user.email}`,
                    icon: 'success',
                    confirmButtonText: 'Okay',
                });
                navigate('/');
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                Swal.fire({
                    title: 'Login Failed',
                    text: 'Please check your email and password.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Helmet><title>Login | TaskManager</title></Helmet>
            <div className="w-full max-w-md p-6 border border-gray-200 shadow-lg rounded-lg">
                <h1 className="text-2xl lg:text-4xl font-bold text-center mb-6">Login Now!</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Email</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Password</span>
                        </label>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassWord(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 text-lg"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <Link state={{ email }} className="label-text-alt text-sm text-right mt-2 block">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn bg-teal-600 w-full">Login</button>
                    </div>
                </form>
                <p className="mt-4 text-sm text-center">
                    New here?{' '}
                    <Link to="/register" className="text-teal-600 font-medium">
                        Register now
                    </Link>
                </p>
                <button
                    onClick={handleGoogleSignIn}
                    className="btn btn-neutral mt-4 w-full"
                >
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;