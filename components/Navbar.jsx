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
    { id: 1, user: 'Sk Sanju', profileId: 'bejoy', action: 'sent you a friend request.', time: '5m ago', avatar: '/images/Friends/bejoy.jpg' },
    { id: 2, user: 'Niloy Roy', profileId: 'niloy', action: 'commented on your photo.', time: '1h ago', avatar: '/images/Friends/niloy.jpg' },
    { id: 3, user: 'Dipu Roy', profileId: 'dipu', action: 'reacted to your post.', time: '2h ago', avatar: '/images/Friends/dipu.jpg' },
    { id: 4, user: 'Bisuu ʚíɞ', profileId: 'bisu', action: 'posted a new photo.', time: '5h ago', avatar: '/images/Friends/bisu.jpg' },
  ];

  const recentChats = [
    { id: 'touhid', name: 'Touhid Hasan', msg: 'Hey! How are you doing?', time: '2m', avatar: '/images/Friends/touhid.jpg' },
    { id: 'joydev', name: 'Joydev Roy', msg: 'Are we playing Ludo tonight?', time: '15m', avatar: '/images/Friends/joydev.jpg' },
    { id: 'emamul', name: 'Emamul Haque Emon', msg: 'Sent an attachment.', time: '1h', avatar: '/images/Friends/emamul.jpg' },
    { id: 'uttom', name: 'Uttom Roy', msg: 'Check out this new project!', time: '3h', avatar: '/images/Friends/uttom.jpg' },
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
                  onChange={(e) => {
                    setDarkMode(e.target.checked);
                    if (e.target.checked) {
                      document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
                    } else {
                      document.body.style.filter = 'none';
                    }
                  }}
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
