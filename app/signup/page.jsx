'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('Jan');
  const [year, setYear] = useState('2000');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const dob = `${day} ${month} ${year}`;

      const chosenAvatar = gender === 'Female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : gender === 'Male'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const defaultBio = `Hello! I'm ${firstName}, welcome to my Facebook profile.`;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            gender,
            date_of_birth: dob,
            avatar_url: chosenAvatar,
            bio: defaultBio,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // Upsert into public.profiles for instant profile availability
      if (data?.user?.id) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            gender: gender,
            avatar_url: chosenAvatar,
            bio: defaultBio,
          });
        } catch (profileErr) {
          console.warn('Profile upsert warning:', profileErr);
        }
      }

      // Set localStorage for immediate client-side responsiveness
      if (typeof window !== 'undefined') {
        localStorage.setItem('fb_my_name', fullName);
        localStorage.setItem('fb_my_avatar', chosenAvatar);
        localStorage.setItem('fb_my_bio', defaultBio);
        window.dispatchEvent(new Event('userProfileUpdated'));
      }

      if (data?.session) {
        // Logged in immediately (if email confirmation is disabled in Supabase)
        router.push('/');
        router.refresh();
      } else {
        // Confirmation email sent or awaiting confirmation
        setSuccess('Account created successfully! You can now log in to your new Facebook account.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
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
        padding: '2rem 1rem',
      }}
    >
      <h3 style={{ color: '#1877F2', fontSize: '3.2rem', margin: '0.5rem', fontWeight: 'bold' }}>
        facebook
      </h3>
      <div
        className="container"
        style={{
          width: '28rem',
          maxWidth: '95%',
          padding: '1.5rem',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1C1E21', marginBottom: '2px' }}>
          Create a new account
        </p>
        <p style={{ fontSize: '0.9rem', color: '#606770', marginBottom: '1rem' }}>
          It's quick and easy.
        </p>

        <hr style={{ height: '1px', width: '100%', border: 'none', backgroundColor: '#dadbdd', marginBottom: '1rem' }} />

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

        {success && (
          <div
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #1877f2',
              borderRadius: '5px',
              color: '#1877f2',
              fontSize: '13px',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                flex: 1,
                height: '2.5rem',
                padding: '0 10px',
                borderRadius: '5px',
                border: '1px solid #dadbdd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Surname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                flex: 1,
                height: '2.5rem',
                padding: '0 10px',
                borderRadius: '5px',
                border: '1px solid #dadbdd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 10px',
              marginBottom: '8px',
              borderRadius: '5px',
              border: '1px solid #dadbdd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 10px',
              marginBottom: '8px',
              borderRadius: '5px',
              border: '1px solid #dadbdd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <p style={{ fontSize: '12px', color: '#606770', margin: '6px 0 4px 0' }}>Date of birth?</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{ flex: 1, height: '2.3rem', borderRadius: '5px', border: '1px solid #dadbdd', padding: '0 5px' }}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ flex: 1, height: '2.3rem', borderRadius: '5px', border: '1px solid #dadbdd', padding: '0 5px' }}
            >
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ flex: 1, height: '2.3rem', borderRadius: '5px', border: '1px solid #dadbdd', padding: '0 5px' }}
            >
              {[...Array(50)].map((_, i) => {
                const y = 2026 - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>

          <p style={{ fontSize: '12px', color: '#606770', margin: '6px 0 4px 0' }}>Gender?</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
            {['Male', 'Female', 'Custom'].map((g) => (
              <label
                key={g}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  border: '1px solid #dadbdd',
                  borderRadius: '5px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <span>{g}</span>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '2.6rem',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              backgroundColor: '#00a400',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          <Link href="/login" style={{ color: '#1877f2', fontSize: '0.9rem', textDecoration: 'none' }}>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
