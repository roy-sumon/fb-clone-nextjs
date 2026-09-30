'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.user) {
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const meta = data.user.user_metadata || {};
          const isFemale = meta.gender === 'Female';
          const defaultAvatar = isFemale
            ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

          const resolvedName = prof?.full_name || meta.full_name || data.user.email?.split('@')[0] || 'Facebook User';
          const resolvedAvatar = prof?.avatar_url || meta.avatar_url || defaultAvatar;

          if (typeof window !== 'undefined') {
            localStorage.setItem('fb_my_name', resolvedName);
            localStorage.setItem('fb_my_avatar', resolvedAvatar);
            if (prof?.bio || meta.bio) localStorage.setItem('fb_my_bio', prof?.bio || meta.bio);
            if (prof?.cover_url) localStorage.setItem('fb_my_cover', prof.cover_url);
            window.dispatchEvent(new Event('userProfileUpdated'));
          }

          // If no profile row exists, create it
          if (!prof) {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: resolvedName,
              first_name: meta.first_name || '',
              last_name: meta.last_name || '',
              gender: meta.gender || 'Not specified',
              avatar_url: resolvedAvatar,
              bio: meta.bio || `Hello! I'm ${meta.first_name || 'new here'}, welcome to my Facebook profile.`
            });
          }
        } catch (syncErr) {
          console.warn('Profile sync on login warning:', syncErr);
        }

        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#F0F2F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ color: '#1877F2', fontSize: '3.2rem', margin: '1rem', fontWeight: 'bold' }}>
        facebook
      </h3>
      <div
        className="container"
        style={{
          width: '24rem',
          maxWidth: '92%',
          padding: '1.5rem',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: '#1c1e21' }}>
          Log in to Facebook
        </p>

        {error && (
          <div
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#ffebe8',
              border: '1px solid #dd3c10',
              borderRadius: '5px',
              color: '#dd3c10',
              fontSize: '13px',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              height: '3rem',
              padding: '0 1rem',
              marginBottom: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #dadbdd',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              height: '3rem',
              padding: '0 1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #dadbdd',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              height: '3rem',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              backgroundColor: '#1877F2',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          <a
            href="#"
            style={{ color: '#1877f2', fontSize: '0.9rem', textDecoration: 'none' }}
          >
            Forgotten account?
          </a>
        </div>

        <hr
          style={{
            height: '1px',
            width: '100%',
            margin: '1.2rem 0',
            border: 'none',
            backgroundColor: '#dadbdd',
          }}
        />

        <Link
          href="/signup"
          style={{
            display: 'inline-block',
            textAlign: 'center',
            padding: '0.7rem 1.5rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#42B72A',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: '0.2s',
          }}
        >
          Create new account
        </Link>
      </div>
    </div>
  );
}
