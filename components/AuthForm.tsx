'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [campus, setCampus] = useState('Paris');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push('/profil');
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            campus
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        const userId = data.user?.id;
        if (userId) {
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: fullName,
            campus,
            email
          });
        }
        setMessage('Compte créé. Vérifie ton email si la confirmation est activée.');
        setIsLogin(true);
      }
    }

    setLoading(false);
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)} type="button">Connexion</button>
        <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)} type="button">Inscription</button>
      </div>
      <form onSubmit={handleSubmit} className="stack-md">
        {!isLogin && (
          <>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" required={!isLogin} />
            <select value={campus} onChange={(e) => setCampus(e.target.value)}>
              <option>Paris</option>
              <option>Lyon</option>
              <option>Lille</option>
              <option>Bordeaux</option>
            </select>
          </>
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email étudiant" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" required />
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
        </button>
        {message && <p className="notice">{message}</p>}
      </form>
    </div>
  );
}
