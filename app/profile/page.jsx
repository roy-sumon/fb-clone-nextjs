'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile/me');
  }, [router]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#65676b' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
      <p style={{ marginTop: '12px' }}>Redirecting to your profile...</p>
    </div>
  );
}
