import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider(); // ✅ Fournisseur Google

  // 🔹 Inscription classique par email/mot de passe
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 1️⃣ Crée l'utilisateur avec Email/Password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Ajoute les infos dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        createdAt: serverTimestamp(),
      });

      alert('Inscription réussie !');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Échec de l’inscription');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Inscription / Connexion avec Google
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔍 Vérifie si le user existe déjà dans Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // 🆕 Crée le document Firestore si nouveau
        await setDoc(userRef, {
          username: user.displayName || 'No Username',
          email: user.email,
          profileImage: user.photoURL || null,
          createdAt: serverTimestamp(),
        });
      }

      alert('Connexion avec Google réussie !');
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Échec de la connexion Google');
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="max-w-sm border shadow bg-white mx-auto p-8 rounded-xl">
        <h2 className="text-2xl font-semibold pt-5 text-center">Please Register</h2>

        {/* 🔑 Formulaire classique */}
        <form onSubmit={handleRegister} className="space-y-5 max-w-sm mx-auto pt-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3 rounded-md"
          />
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* 🚀 Bouton Google */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleGoogleRegister}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>Register with Google</span>
          </button>
        </div>

        <p className="my-5 italic text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-red-700 px-1 underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;