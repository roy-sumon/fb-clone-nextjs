'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

const FEELINGS = ['happy 😊', 'loved 🥰', 'excited 🤩', 'blessed 😇', 'crazy 🤪', 'cool 😎', 'tired 😴'];

export default function CreatePost({ user, profile, onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [feeling, setFeeling] = useState('');
  const [showFeelings, setShowFeelings] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const userFullName = profile?.first_name || profile?.full_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name;
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = user
    ? (userFullName || customName || user.email?.split('@')[0] || 'Facebook User')
    : (customName || 'Sumon');
  const avatarUrl = user
    ? (userAvatar || customAvatar || '/images/sumon-profile-icon.jpg')
    : (customAvatar || '/images/sumon-profile-icon.jpg');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;
    if (!user) {
      setError('Please log in to create a post.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalImageUrl = imagePreview; // Default fallback to base64 preview

      // Try uploading to Supabase storage if storage is ready
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, imageFile);

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('post-images')
              .getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              finalImageUrl = publicUrlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('Storage bucket fallback to direct image:', storageErr);
        }
      }

      const fullContent = feeling ? `${content.trim()} — feeling ${feeling}` : content.trim();

      const newPostObj = {
        id: `post-${Date.now()}`,
        user_id: user.id,
        content: fullContent,
        image_url: finalImageUrl,
        created_at: new Date().toISOString(),
        profiles: {
          id: user.id,
          full_name: profile?.full_name || displayName,
          avatar_url: avatarUrl,
        },
        likes: [],
        comments: [],
      };

      // Attempt inserting into Supabase
      const { data, error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: fullContent,
            image_url: finalImageUrl,
          },
        ])
        .select(`
          *,
          profiles:user_id (id, full_name, first_name, last_name, avatar_url),
          likes (id, user_id, reaction_type),
          comments (id, content, created_at, profiles:user_id (full_name, avatar_url))
        `)
        .single();

      if (!insertError && data) {
        if (onPostCreated) onPostCreated(data);
      } else {
        // Fallback: immediately add to UI feed
        if (onPostCreated) onPostCreated(newPostObj);
      }

      // Reset
      setContent('');
      setFeeling('');
      setImageFile(null);
      setImagePreview(null);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-post-container">
        <div className="create-post-search-div">
          <img
            src={avatarUrl}
            alt={displayName}
            style={{
              height: '42px',
              width: '42px',
              borderRadius: '50%',
              cursor: 'pointer',
              objectFit: 'cover',
            }}
          />
          {user ? (
            <input
              type="text"
              readOnly
              onClick={() => setIsOpen(true)}
              placeholder={`What's on your mind, ${displayName}?`}
              className="post-search"
            />
          ) : (
            <Link
              href="/login"
              className="post-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#65676b',
              }}
            >
              Log in to create a post...
            </Link>
          )}
        </div>

        <hr className="post-hr" />

        <div className="search-activity">
          <div
            className="search-activity-icon"
            onClick={() => (user ? setIsOpen(true) : null)}
          >
            <i className="fa-solid fa-video" style={{ color: '#E42645', fontSize: '1.4rem' }}></i>
            <p>Live video</p>
          </div>
          <div
            className="search-activity-icon"
            onClick={() => (user ? setIsOpen(true) : null)}
          >
            <i className="fa-regular fa-images" style={{ color: '#44B45F', fontSize: '1.4rem' }}></i>
            <p>Photo/video</p>
          </div>
          <div
            className="search-activity-icon"
            onClick={() => {
              if (user) {
                setIsOpen(true);
                setShowFeelings(true);
              }
            }}
          >
            <i className="fa-regular fa-face-smile" style={{ color: '#EBB63B', fontSize: '1.4rem' }}></i>
            <p>Feeling/activity</p>
          </div>
        </div>
      </div>

      {/* Modal for creating a post */}
      {isOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal-header">
              <h3>Create post</h3>
              <button className="post-modal-close" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {error && (
              <div style={{ color: '#e42645', fontSize: '14px', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            <div className="flex" style={{ gap: '10px', marginBottom: '12px' }}>
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>
                  {displayName} {feeling && <span style={{ fontWeight: '400', color: '#65676b' }}>is feeling {feeling}</span>}
                </p>
                <span
                  style={{
                    fontSize: '12px',
                    background: '#e4e6eb',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#050505',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <i className="fa-solid fa-earth-americas"></i> Public
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                className="post-textarea"
                placeholder={`What's on your mind, ${displayName}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
              />

              {/* Feelings Picker */}
              {showFeelings && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                  {FEELINGS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFeeling(f);
                        setShowFeelings(false);
                      }}
                      style={{
                        padding: '4px 8px',
                        background: feeling === f ? '#e7f3ff' : '#f0f2f5',
                        border: '1px solid #ced0d4',
                        borderRadius: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              {imagePreview && (
                <div style={{ position: 'relative', marginTop: '10px' }}>
                  <img src={imagePreview} alt="Preview" className="post-image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}

              <div
                style={{
                  border: '1px solid #ced0d4',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Add to your post</span>
                <div className="flex" style={{ gap: '12px' }}>
                  <label style={{ cursor: 'pointer', margin: 0 }} title="Add Photo">
                    <i className="fa-regular fa-images" style={{ color: '#44B45F', fontSize: '1.4rem' }}></i>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <i
                    className="fa-regular fa-face-smile"
                    style={{ color: '#EBB63B', fontSize: '1.4rem', cursor: 'pointer' }}
                    title="Add Feeling"
                    onClick={() => setShowFeelings(!showFeelings)}
                  ></i>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (!content.trim() && !imagePreview)}
                className="post-submit-btn"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
