import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';

// UI
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Lock, ChromeIcon } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        profileImage: user.photoURL || null,
        role: 'user',
      }));

      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        profileImage: user.photoURL || null,
        role: 'user',
      }));

      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Google login failed: ' + (error.message || 'Try again'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="max-w-sm border shadow bg-white mx-auto p-8 rounded-xl">
        <h2 className="text-2xl font-semibold pt-5 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto pt-8">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3 rounded-md"
          />
          {message && <p className="text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-5 bg-indigo-600 text-white hover:bg-indigo-500 font-medium py-3 rounded-md"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 🔹 Bouton Google avec logo */}
        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition w-full"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>
        </div>

        <p className="my-5 italic text-sm text-center">
          Don’t have an account?{' '}
          <Link to="/register" className="text-red-700 px-1 underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
