'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeftSidebar({ user, profile, activeTab, setActiveTab }) {
  const [customAvatar, setCustomAvatar] = useState(null);
  const [customName, setCustomName] = useState(null);

  useEffect(() => {
    const updateProfile = () => {
      if (typeof window !== 'undefined') {
        const a = localStorage.getItem('fb_my_avatar');
        const n = localStorage.getItem('fb_my_name');
        if (a) setCustomAvatar(a);
        if (n) setCustomName(n);
      }
    };
    updateProfile();
    window.addEventListener('userProfileUpdated', updateProfile);
    return () => window.removeEventListener('userProfileUpdated', updateProfile);
  }, []);

  const userFullName = profile?.full_name || profile?.first_name || user?.user_metadata?.full_name;
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = user
    ? (userFullName || customName || user.email?.split('@')[0] || 'Facebook User')
    : (customName || 'Sumon Roy');
  const avatarUrl = user
    ? (userAvatar || customAvatar || '/images/sumon-profile-icon.jpg')
    : (customAvatar || '/images/sumon-profile-icon.jpg');

  return (
    <div className="main-left">
      {/* Current User */}
      <Link
        href="/profile/me"
        className="main-left-content main-left-content-bg"
        title="Your Profile"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img
          src={avatarUrl}
          alt={displayName}
          style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <p className="margin-padding-title" style={{ fontWeight: '600' }}>{displayName}</p>
      </Link>

      {/* Navigation shortcuts */}
      <Link
        href="/friends"
        className="main-left-content main-left-content-bg"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <i className="fa-solid fa-user-group margin-padding-icon"></i>
        <p className="margin-padding-title">Friends</p>
      </Link>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => setActiveTab && setActiveTab('home')}
      >
        <i className="fa-solid fa-calendar-days margin-padding-icon" style={{ color: '#1877F2' }}></i>
        <p className="margin-padding-title">Feeds</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Memories feature: You have no memories today.')}
      >
        <i className="fa-solid fa-clock-rotate-left margin-padding-icon" style={{ color: '#1877F2' }}></i>
        <p className="margin-padding-title">Memories</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Saved posts feature: You have 3 saved items.')}
      >
        <i className="fa-solid fa-bookmark margin-padding-icon" style={{ color: '#B036D8' }}></i>
        <p className="margin-padding-title">Saved</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => setActiveTab && setActiveTab('groups')}
      >
        <i className="fa-solid fa-users margin-padding-icon" style={{ color: '#1877F2' }}></i>
        <p className="margin-padding-title">Groups</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => setActiveTab && setActiveTab('watch')}
      >
        <i className="fa-solid fa-tv margin-padding-icon" style={{ color: '#2EB55A' }}></i>
        <p className="margin-padding-title">Video</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => setActiveTab && setActiveTab('marketplace')}
      >
        <i className="fa-solid fa-store margin-padding-icon" style={{ color: '#F02849' }}></i>
        <p className="margin-padding-title">Marketplace</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => setActiveTab && setActiveTab('gaming')}
      >
        <i className="fa-solid fa-gamepad margin-padding-icon" style={{ color: '#21A2F0' }}></i>
        <p className="margin-padding-title">Play Games</p>
      </div>

      <hr className="hr" />

      {/* Your Shortcuts */}
      <div className="your-shortcut">
        <p>Your shortcuts</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Opening The New Current World Page')}
      >
        <img
          src="/images/current-world.jpg"
          alt="The New Current World"
          style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <p className="margin-padding-title">The New Current World</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Opening Chess Game')}
      >
        <img
          src="/images/chess.png"
          alt="Chess"
          style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <p className="margin-padding-title">Chess Club</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Opening Ludo Club')}
      >
        <img
          src="/images/ludo.png"
          alt="Ludo Club"
          style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <p className="margin-padding-title">Ludo Club</p>
      </div>

      <div
        className="main-left-content main-left-content-bg"
        onClick={() => alert('Opening Deep Heart Page')}
      >
        <img
          src="/images/deep-heart.jpg"
          alt="Deep Heart"
          style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <p className="margin-padding-title">Deep Heart</p>
      </div>

      {/* Mini footer */}
      <div className="mini-footer">
        <ul>
          <a href="#">Privacy</a> ·
          <a href="#">Terms</a> ·
          <a href="#">Advertising</a> ·
          <a href="#">Cookies</a> ·
          <a href="#">Meta © 2026</a>
        </ul>
      </div>
    </div>
  );
}
