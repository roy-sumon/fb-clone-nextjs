'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { getMockProfile, allMockUsers } from '../../../lib/mockUsers';
import Navbar from '../../../components/Navbar';
import CreatePost from '../../../components/CreatePost';
import PostCard from '../../../components/PostCard';
import FloatingChat from '../../../components/FloatingChat';

export default function ProfilePage() {
  const params = useParams();
  const profileId = params?.id || 'sumon-roy';

  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [activeChat, setActiveChat] = useState(null);
  const [friendStatus, setFriendStatus] = useState('none');
  const [posts, setPosts] = useState([]);
  const [bioText, setBioText] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [editWork, setEditWork] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [editLivesIn, setEditLivesIn] = useState('');
  const [editFrom, setEditFrom] = useState('');

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Load Session and Profile Data
  useEffect(() => {
    const loadData = async () => {
      // 1. Get logged-in session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: userProf } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (userProf) setCurrentProfile(userProf);
      }

      // Check localStorage for custom overrides
      const customAvatar =
        localStorage.getItem(`fb_avatar_${profileId}`) ||
        (profileId === 'me' ? localStorage.getItem('fb_my_avatar') : null);
      const customCover =
        localStorage.getItem(`fb_cover_${profileId}`) ||
        (profileId === 'me' ? localStorage.getItem('fb_my_cover') : null);

      // 2. Fetch Profile to display
      if (profileId === 'me' || (session?.user && profileId === session.user.id)) {
        if (session?.user) {
          const { data: userProf } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const fallback = getMockProfile('sumon-roy');
          const merged = {
            ...fallback,
            ...(userProf || {}),
            id: session.user.id,
            full_name: userProf?.full_name || session.user.email?.split('@')[0] || fallback.full_name,
            avatar_url: customAvatar || userProf?.avatar_url || fallback.avatar_url,
            cover_url: customCover || fallback.cover_url,
          };
          setProfileData(merged);
          setBioText(merged.bio || '');
          setEditName(merged.full_name);
          setEditWork(merged.work || '');
          setEditEducation(merged.education || '');
          setEditLivesIn(merged.lives_in || '');
          setEditFrom(merged.from || '');
        } else {
          const p = getMockProfile('sumon-roy');
          const merged = {
            ...p,
            avatar_url: customAvatar || p.avatar_url,
            cover_url: customCover || p.cover_url,
          };
          setProfileData(merged);
          setBioText(merged.bio);
          setEditName(merged.full_name);
          setEditWork(merged.work || '');
          setEditEducation(merged.education || '');
          setEditLivesIn(merged.lives_in || '');
          setEditFrom(merged.from || '');
        }
      } else {
        const { data: dbProf } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (dbProf) {
          const fallback = getMockProfile(dbProf.full_name || 'sumon-roy');
          const merged = {
            ...fallback,
            ...dbProf,
            avatar_url: customAvatar || dbProf.avatar_url || fallback.avatar_url,
            cover_url: customCover || fallback.cover_url,
          };
          setProfileData(merged);
          setBioText(dbProf.bio || fallback.bio);
          setEditName(merged.full_name);
          setEditWork(merged.work || '');
          setEditEducation(merged.education || '');
          setEditLivesIn(merged.lives_in || '');
          setEditFrom(merged.from || '');
        } else {
          const p = getMockProfile(profileId);
          const merged = {
            ...p,
            avatar_url: customAvatar || p.avatar_url,
            cover_url: customCover || p.cover_url,
          };
          setProfileData(merged);
          setBioText(merged.bio);
          setEditName(merged.full_name);
          setEditWork(merged.work || '');
          setEditEducation(merged.education || '');
          setEditLivesIn(merged.lives_in || '');
          setEditFrom(merged.from || '');
        }
      }

      // 3. Load posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select(`
          id, content, image_url, created_at, user_id,
          profiles:user_id (id, full_name, avatar_url),
          likes (id, user_id, reaction_type),
          comments (id, content, created_at, profiles:user_id (full_name, avatar_url))
        `)
        .order('created_at', { ascending: false });

      if (userPosts && userPosts.length > 0) {
        setPosts(userPosts);
      } else {
        setPosts([
          {
            id: `p-${profileId}-1`,
            user_id: profileId,
            content: `Excited to connect with everyone on Facebook! 🎉`,
            image_url: customCover || '/images/Friends-Post/bisu.jpg',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            profiles: {
              full_name: profileData?.full_name || 'User',
              avatar_url: customAvatar || profileData?.avatar_url || '/images/sumon-profile-icon.jpg',
            },
            likes: [{ id: '1', user_id: 'u1', reaction_type: 'like' }, { id: '2', user_id: 'u2', reaction_type: 'love' }],
            comments: [
              {
                id: 'c1',
                content: 'Welcome to Facebook!',
                created_at: new Date().toISOString(),
                profiles: { full_name: 'Niloy Roy', avatar_url: '/images/Friends/niloy.jpg' },
              },
            ],
          },
        ]);
      }
    };

    loadData();
  }, [profileId]);

  const isOwnProfile =
    profileId === 'me' ||
    (currentUser && profileData?.id === currentUser.id) ||
    (!currentUser && profileData?.id === 'sumon-roy');

  // Handle Cover Photo Upload
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setProfileData((prev) => ({ ...prev, cover_url: dataUrl }));
      localStorage.setItem(`fb_cover_${profileId}`, dataUrl);
      if (isOwnProfile) {
        localStorage.setItem('fb_my_cover', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Picture Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setProfileData((prev) => ({ ...prev, avatar_url: dataUrl }));
      localStorage.setItem(`fb_avatar_${profileId}`, dataUrl);
      if (isOwnProfile) {
        localStorage.setItem('fb_my_avatar', dataUrl);
        window.dispatchEvent(new Event('userProfileUpdated'));
        if (currentUser) {
          try {
            await supabase.from('profiles').update({ avatar_url: dataUrl }).eq('id', currentUser.id);
          } catch (err) {
            console.warn(err);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Edit Profile Modal
  const handleSaveProfile = () => {
    setProfileData((prev) => ({
      ...prev,
      full_name: editName,
      work: editWork,
      education: editEducation,
      lives_in: editLivesIn,
      from: editFrom,
    }));

    if (isOwnProfile) {
      localStorage.setItem('fb_my_name', editName);
      window.dispatchEvent(new Event('userProfileUpdated'));
    }

    setEditProfileOpen(false);
  };

  if (!profileData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#65676b' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
        <p style={{ marginTop: '12px' }}>Loading profile...</p>
      </div>
    );
  }

  const friendsList = allMockUsers.filter((u) => u.id !== profileData.id).slice(0, 9);

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', paddingBottom: '40px' }}>
      <Navbar
        user={currentUser}
        profile={currentProfile}
        onOpenChat={(u) => setActiveChat(u)}
      />

      {/* Hidden File Inputs for Cover and Avatar */}
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Header Container */}
      <div style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          {/* Cover Photo */}
          <div
            style={{
              width: '100%',
              height: '350px',
              maxHeight: '40vw',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
              backgroundColor: '#ced0d4',
              position: 'relative',
            }}
          >
            <img
              src={profileData.cover_url || '/images/Friends-Post/bisu.jpg'}
              alt="Cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isOwnProfile && (
              <button
                onClick={() => coverInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                <i className="fa-solid fa-camera"></i> Edit cover photo
              </button>
            )}
          </div>

          {/* Profile Bar (Avatar + Details + Buttons) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              padding: '0 24px 16px 24px',
              position: 'relative',
              gap: '20px',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                marginTop: '-80px',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <img
                src={profileData.avatar_url || '/images/sumon-profile-icon.jpg'}
                alt={profileData.full_name}
                style={{
                  width: '168px',
                  height: '168px',
                  borderRadius: '50%',
                  border: '4px solid #ffffff',
                  objectFit: 'cover',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              {isOwnProfile && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#e4e6eb',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                  title="Update profile picture"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              )}
            </div>

            {/* Name, Bio, Friends Counter */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#050505', marginBottom: '2px' }}>
                {profileData.full_name}
              </h1>
              <p style={{ fontSize: '14px', color: '#65676b', fontWeight: '500' }}>
                {profileData.friends_count || 1200} friends
              </p>

              {/* Overlapping Friend Avatars */}
              <div style={{ display: 'flex', marginTop: '6px' }}>
                {friendsList.slice(0, 6).map((f, i) => (
                  <Link key={f.id} href={`/profile/${f.id}`}>
                    <img
                      src={f.avatar_url}
                      alt={f.full_name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        marginLeft: i > 0 ? '-8px' : 0,
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      title={f.full_name}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isOwnProfile ? (
                <>
                  <Link
                    href="/"
                    style={{
                      backgroundColor: '#1877F2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="fa-solid fa-plus"></i> Add to story
                  </Link>
                  <button
                    onClick={() => setEditProfileOpen(true)}
                    style={{
                      backgroundColor: '#e4e6eb',
                      color: '#050505',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fa-solid fa-pen"></i> Edit profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (friendStatus === 'none') setFriendStatus('requested');
                      else setFriendStatus('none');
                    }}
                    style={{
                      backgroundColor: friendStatus === 'requested' ? '#e7f3ff' : '#1877F2',
                      color: friendStatus === 'requested' ? '#1877f2' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {friendStatus === 'requested' ? (
                      <>
                        <i className="fa-solid fa-user-check"></i> Request sent
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-user-plus"></i> Add friend
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setActiveChat({
                        id: profileData.id,
                        name: profileData.full_name,
                        avatar: profileData.avatar_url,
                      })
                    }
                    style={{
                      backgroundColor: '#e4e6eb',
                      color: '#050505',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fa-brands fa-facebook-messenger"></i> Message
                  </button>
                </>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ced0d4', margin: '0 24px' }} />

          {/* Profile Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', padding: '0 24px', overflowX: 'auto' }}>
            {['posts', 'about', 'friends', 'photos', 'videos'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  color: activeTab === t ? '#1877F2' : '#65676b',
                  borderBottom: activeTab === t ? '3px solid #1877F2' : '3px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Profile Body (Two columns) */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '16px auto',
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 400px) 1fr',
          gap: '16px',
        }}
        className="profile-content-grid"
      >
        {/* Left Column: Intro, Photos, Friends */}
        <div>
          {/* Intro Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Intro</h3>

            {/* Bio */}
            {isEditingBio ? (
              <div style={{ marginBottom: '12px' }}>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    fontFamily: 'inherit',
                  }}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBio(false);
                      setProfileData((prev) => ({ ...prev, bio: bioText }));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#1877F2',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#050505',
                  marginBottom: '12px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {bioText || 'No bio yet.'}
              </p>
            )}

            {isOwnProfile && !isEditingBio && (
              <button
                onClick={() => setIsEditingBio(true)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#e4e6eb',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
              >
                Edit bio
              </button>
            )}

            {/* Intro Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div className="flex" style={{ gap: '10px' }}>
                <i className="fa-solid fa-briefcase" style={{ color: '#898A8D', fontSize: '18px', width: '20px' }}></i>
                <span>Works as <strong>{profileData.work || 'Developer'}</strong></span>
              </div>
              <div className="flex" style={{ gap: '10px' }}>
                <i className="fa-solid fa-graduation-cap" style={{ color: '#898A8D', fontSize: '18px', width: '20px' }}></i>
                <span>Studied at <strong>{profileData.education || 'University'}</strong></span>
              </div>
              <div className="flex" style={{ gap: '10px' }}>
                <i className="fa-solid fa-house" style={{ color: '#898A8D', fontSize: '18px', width: '20px' }}></i>
                <span>Lives in <strong>{profileData.lives_in || 'Dhaka, Bangladesh'}</strong></span>
              </div>
              <div className="flex" style={{ gap: '10px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#898A8D', fontSize: '18px', width: '20px' }}></i>
                <span>From <strong>{profileData.from || 'Bangladesh'}</strong></span>
              </div>
              <div className="flex" style={{ gap: '10px' }}>
                <i className="fa-solid fa-clock" style={{ color: '#898A8D', fontSize: '18px', width: '20px' }}></i>
                <span>{profileData.joined || 'Joined October 2021'}</span>
              </div>
            </div>
          </div>

          {/* Photos Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Photos</h3>
              <a href="#" style={{ fontSize: '14px', color: '#1877f2', textDecoration: 'none' }}>
                See all photos
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', borderRadius: '8px', overflow: 'hidden' }}>
              {(profileData.photos || ['/images/sumon-profile-icon.jpg', '/images/Friends-Post/bisu.jpg', '/images/Friends-Post/dipu.jpg']).map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Photo"
                    style={{ width: '100%', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                  />
                )
              )}
            </div>
          </div>

          {/* Friends Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Friends</h3>
              <Link href="/friends" style={{ fontSize: '14px', color: '#1877f2', textDecoration: 'none' }}>
                See all friends
              </Link>
            </div>
            <p style={{ fontSize: '13px', color: '#65676b', marginBottom: '12px' }}>
              {profileData.friends_count || 1200} friends
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {friendsList.map((f) => (
                <Link
                  key={f.id}
                  href={`/profile/${f.id}`}
                  style={{ textDecoration: 'none', color: '#050505' }}
                >
                  <img
                    src={f.avatar_url}
                    alt={f.full_name}
                    style={{ width: '100%', height: '90px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {f.full_name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Feed and Posts */}
        <div>
          {isOwnProfile && (
            <CreatePost
              user={currentUser}
              profile={currentProfile || profileData}
              onPostCreated={(newP) => setPosts([newP, ...posts])}
            />
          )}

          {/* Posts list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={currentUser}
                profile={currentProfile}
                onDelete={(delId) => setPosts(posts.filter((p) => p.id !== delId))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="post-modal-backdrop" onClick={() => setEditProfileOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal-header">
              <h3>Edit Profile</h3>
              <button className="post-modal-close" onClick={() => setEditProfileOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Work</label>
                <input
                  type="text"
                  value={editWork}
                  onChange={(e) => setEditWork(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Education</label>
                <input
                  type="text"
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>Lives in</label>
                <input
                  type="text"
                  value={editLivesIn}
                  onChange={(e) => setEditLivesIn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#65676b' }}>From</label>
                <input
                  type="text"
                  value={editFrom}
                  onChange={(e) => setEditFrom(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ced0d4',
                    marginTop: '4px',
                  }}
                />
              </div>

              <button
                onClick={handleSaveProfile}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Messenger Window */}
      <FloatingChat chatUser={activeChat} onClose={() => setActiveChat(null)} />
    </div>
  );
}
