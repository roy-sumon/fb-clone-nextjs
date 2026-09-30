'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({
  user,
  profile,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenChat,
}) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'menu', 'messenger', 'notifications', 'profile'
  const [customAvatar, setCustomAvatar] = useState(null);
  const [customName, setCustomName] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings State
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privacySetting, setPrivacySetting] = useState('Public');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const applyDarkMode = (isDark) => {
    setDarkMode(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fb_dark_mode', isDark ? 'true' : 'false');
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
      }
      document.body.style.filter = 'none'; // NEVER INVERT!
      window.dispatchEvent(new Event('themeChanged'));
    }
  };

  useEffect(() => {
    const updateProfile = () => {
      if (typeof window !== 'undefined') {
        const a = localStorage.getItem('fb_my_avatar');
        const n = localStorage.getItem('fb_my_name');
        if (a) setCustomAvatar(a);
        if (n) {
          setCustomName(n);
          setDisplayNameInput(n);
        }
      }
    };
    updateProfile();
    window.addEventListener('userProfileUpdated', updateProfile);

    // Initial theme check
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('fb_dark_mode') === 'true';
      if (isDark) {
        setDarkMode(true);
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      }
      document.body.style.filter = 'none';
    }

    return () => window.removeEventListener('userProfileUpdated', updateProfile);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const displayName = customName || profile?.full_name || profile?.first_name || user?.email?.split('@')[0] || 'Sumon Roy';
  const avatarUrl = customAvatar || profile?.avatar_url || '/images/sumon-profile-icon.jpg';

  const notifications = [
    {
      id: 1,
      user: 'Sadia Afrin',
      profileId: 'sadia-afrin',
      action: 'sent you a friend request.',
      time: '3m ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      user: 'Tanvir Ahmed',
      profileId: 'tanvir-ahmed',
      action: 'reacted ❤️ to your post.',
      time: '24m ago',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      user: 'Ayesha Rahman',
      profileId: 'ayesha-rahman',
      action: 'commented: "Such an inspiring perspective! ✨"',
      time: '1h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      user: 'Mahir Faysal',
      profileId: 'mahir-faysal',
      action: 'shared a new photo to his feed.',
      time: '3h ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      user: 'Nusrat Jahan',
      profileId: 'nusrat-jahan',
      action: 'mentioned you in a comment.',
      time: '5h ago',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const recentChats = [
    {
      id: 'ayesha-rahman',
      name: 'Ayesha Rahman',
      msg: 'Hey! Did you check out the new design?',
      time: '2m',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'tanvir-ahmed',
      name: 'Tanvir Ahmed',
      msg: 'Are we meeting this weekend for coffee? ☕',
      time: '15m',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'sadia-afrin',
      name: 'Sadia Afrin',
      msg: 'Just uploaded the new Figma file!',
      time: '45m',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'mahir-faysal',
      name: 'Mahir Faysal',
      msg: 'The Next.js backend looks super smooth bro.',
      time: '2h',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSaveSettings = () => {
    if (displayNameInput.trim()) {
      localStorage.setItem('fb_my_name', displayNameInput.trim());
      setCustomName(displayNameInput.trim());
      window.dispatchEvent(new Event('userProfileUpdated'));
    }
    setSettingsSuccess(true);
    setTimeout(() => {
      setSettingsSuccess(false);
      setSettingsOpen(false);
    }, 1200);
  };

  return (
    <>
      <nav>
        {/* Left Nav Bar */}
        <div className="left-nav">
          <Link href="/" className="fb-logo">
            <img src="/images/fb-logo.png" alt="Facebook" className="fb-logo-image" />
          </Link>
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search Facebook"
              className="searchbar-placeholder"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Middle Nav Bar */}
        <div className="midle-nav">
          <ul>
            <li
              onClick={() => setActiveTab && setActiveTab('home')}
              className={`midle-nav-bg ${activeTab === 'home' ? 'active' : ''}`}
              title="Home"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-house midle-icon"></i>
            </li>
            <li
              onClick={() => setActiveTab && setActiveTab('watch')}
              className={`midle-nav-bg ${activeTab === 'watch' ? 'active' : ''}`}
              title="Video"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-tv midle-icon"></i>
            </li>
            <li
              onClick={() => setActiveTab && setActiveTab('marketplace')}
              className={`midle-nav-bg ${activeTab === 'marketplace' ? 'active' : ''}`}
              title="Marketplace"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-store midle-icon"></i>
            </li>
            <Link
              href="/friends"
              className={`midle-nav-bg ${activeTab === 'friends' ? 'active' : ''}`}
              title="Friends"
            >
              <i className="fa-solid fa-user-group midle-icon"></i>
            </Link>
            <li
              onClick={() => setActiveTab && setActiveTab('groups')}
              className={`midle-nav-bg ${activeTab === 'groups' ? 'active' : ''}`}
              title="Groups"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-users midle-icon"></i>
            </li>
            <li
              onClick={() => setActiveTab && setActiveTab('gaming')}
              className={`midle-nav-bg ${activeTab === 'gaming' ? 'active' : ''}`}
              title="Gaming"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-gamepad midle-icon"></i>
            </li>
          </ul>
        </div>

        {/* Right Nav Bar */}
        <div className="right-nav">
          <ul>
            <button
              className="right-nav-btn"
              onClick={() => toggleDropdown('menu')}
              title="Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <button
              className="right-nav-btn"
              onClick={() => toggleDropdown('messenger')}
              title="Messenger"
            >
              <i className="fa-brands fa-facebook-messenger"></i>
              <span className="right-nav-badge">4</span>
            </button>

            <button
              className="right-nav-btn"
              onClick={() => toggleDropdown('notifications')}
              title="Notifications"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="right-nav-badge">2</span>
            </button>
          </ul>

          {/* Profile Dropdown Icon */}
          <div
            className="right-profile-icon"
            onClick={() => toggleDropdown('profile')}
            title={displayName}
            style={{ position: 'relative' }}
          >
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                height: '40px',
                width: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* ================= DROPDOWNS ================= */}

        {/* 1. Menu Dropdown */}
        {openDropdown === 'menu' && (
          <div className="fb-dropdown-menu">
            <div className="fb-dropdown-header">
              <h3>Menu</h3>
              <button className="post-modal-close" onClick={() => setOpenDropdown(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div
                className="fb-dropdown-item"
                onClick={() => {
                  setActiveTab && setActiveTab('home');
                  setOpenDropdown(null);
                }}
              >
                <i className="fa-solid fa-newspaper" style={{ color: '#1877f2', fontSize: '20px' }}></i>
                <div>
                  <p className="fb-dropdown-title">Feeds</p>
                  <p className="fb-dropdown-subtitle">See most recent posts</p>
                </div>
              </div>
              <Link
                href="/friends"
                className="fb-dropdown-item"
                onClick={() => setOpenDropdown(null)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <i className="fa-solid fa-user-group" style={{ color: '#1877f2', fontSize: '20px' }}></i>
                <div>
                  <p className="fb-dropdown-title">Friends</p>
                  <p className="fb-dropdown-subtitle">Find and connect</p>
                </div>
              </Link>
              <div
                className="fb-dropdown-item"
                onClick={() => {
                  setActiveTab && setActiveTab('gaming');
                  setOpenDropdown(null);
                }}
              >
                <i className="fa-solid fa-gamepad" style={{ color: '#1877f2', fontSize: '20px' }}></i>
                <div>
                  <p className="fb-dropdown-title">Gaming</p>
                  <p className="fb-dropdown-subtitle">Play instant games</p>
                </div>
              </div>
              <div
                className="fb-dropdown-item"
                onClick={() => {
                  setActiveTab && setActiveTab('marketplace');
                  setOpenDropdown(null);
                }}
              >
                <i className="fa-solid fa-store" style={{ color: '#1877f2', fontSize: '20px' }}></i>
                <div>
                  <p className="fb-dropdown-title">Marketplace</p>
                  <p className="fb-dropdown-subtitle">Buy and sell items</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Messenger Dropdown */}
        {openDropdown === 'messenger' && (
          <div className="fb-dropdown-menu">
            <div className="fb-dropdown-header">
              <h3>Chats</h3>
              <button className="post-modal-close" onClick={() => setOpenDropdown(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div>
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="fb-dropdown-item"
                  onClick={() => {
                    onOpenChat && onOpenChat(chat);
                    setOpenDropdown(null);
                  }}
                >
                  <img src={chat.avatar} alt={chat.name} className="fb-dropdown-avatar" />
                  <div className="fb-dropdown-text">
                    <p className="fb-dropdown-title">{chat.name}</p>
                    <p className="fb-dropdown-subtitle">
                      {chat.msg} · {chat.time}
                    </p>
                  </div>
                  <Link
                    href={`/profile/${chat.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(null);
                    }}
                    title="View Profile"
                    style={{ color: '#65676b', padding: '6px', fontSize: '14px' }}
                  >
                    <i className="fa-solid fa-user"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Notifications Dropdown */}
        {openDropdown === 'notifications' && (
          <div className="fb-dropdown-menu">
            <div className="fb-dropdown-header">
              <h3>Notifications</h3>
              <button className="post-modal-close" onClick={() => setOpenDropdown(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={`/profile/${n.profileId}`}
                  className="fb-dropdown-item"
                  onClick={() => setOpenDropdown(null)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src={n.avatar} alt={n.user} className="fb-dropdown-avatar" />
                  <div className="fb-dropdown-text">
                    <p className="fb-dropdown-title" style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: '700' }}>{n.user}</span> {n.action}
                    </p>
                    <p className="fb-dropdown-subtitle" style={{ color: '#1877f2', fontWeight: '500' }}>
                      {n.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 4. Profile Dropdown */}
        {openDropdown === 'profile' && (
          <div className="fb-dropdown-menu" style={{ width: '310px' }}>
            <Link
              href="/profile/me"
              onClick={() => setOpenDropdown(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: '10px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>{displayName}</p>
                <p style={{ fontSize: '12px', color: '#65676b' }}>See your profile</p>
              </div>
            </Link>

            <Link
              href="/friends"
              onClick={() => setOpenDropdown(null)}
              className="fb-dropdown-item"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="fa-solid fa-user-group" style={{ fontSize: '18px', color: '#1877f2' }}></i>
              <p>Friends & Requests</p>
            </Link>

            <div
              className="fb-dropdown-item"
              onClick={() => {
                setOpenDropdown(null);
                setSettingsOpen(true);
              }}
            >
              <i className="fa-solid fa-gear" style={{ fontSize: '18px', color: '#65676b' }}></i>
              <p>Settings & privacy</p>
            </div>

            <div
              className="fb-dropdown-item"
              onClick={() => applyDarkMode(!darkMode)}
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-moon" style={{ fontSize: '18px', color: darkMode ? '#2d88ff' : '#65676b' }}></i>
                <p>Dark mode</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => applyDarkMode(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {user ? (
              <div
                className="fb-dropdown-item"
                onClick={handleLogout}
                style={{ color: '#e42645', fontWeight: '600' }}
              >
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '18px' }}></i>
                <p>Log Out</p>
              </div>
            ) : (
              <Link
                href="/login"
                className="fb-dropdown-item"
                style={{ color: '#1877f2', fontWeight: '600', textDecoration: 'none' }}
              >
                <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: '18px' }}></i>
                <p>Log In to Account</p>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Settings & Privacy Modal */}
      {settingsOpen && (
        <div className="post-modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal-header">
              <h3>Settings & Privacy</h3>
              <button className="post-modal-close" onClick={() => setSettingsOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {settingsSuccess && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#e7f3ff',
                  color: '#1877f2',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                <i className="fa-solid fa-check"></i> Settings saved successfully!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Display Name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder={displayName}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Default Post Privacy</label>
                <select
                  value={privacySetting}
                  onChange={(e) => setPrivacySetting(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option value="Public">Public (Anyone on or off Facebook)</option>
                  <option value="Friends">Friends only</option>
                  <option value="Only Me">Only Me</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>Notification Sounds</p>
                  <p style={{ fontSize: '12px', color: '#65676b' }}>Play a sound when you get a notification</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>Dark Mode</p>
                  <p style={{ fontSize: '12px', color: '#65676b' }}>Adjust the appearance of Facebook</p>
                </div>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => applyDarkMode(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '10px',
                  backgroundColor: '#1877F2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
