'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const initialStories = [
  {
    id: 1,
    profileId: 'ayesha-rahman',
    name: 'Ayesha Rahman',
    bg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    profileId: 'tanvir-ahmed',
    name: 'Tanvir Ahmed',
    bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    profileId: 'sadia-afrin',
    name: 'Sadia Afrin',
    bg: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    profileId: 'mahir-faysal',
    name: 'Mahir Faysal',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    profileId: 'nusrat-jahan',
    name: 'Nusrat Jahan',
    bg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    profileId: 'rafiqul-islam',
    name: 'Rafiqul Islam',
    bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    profileId: 'farhana-islam',
    name: 'Farhana Islam',
    bg: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  },
];

const reelsData = [
  { id: 101, title: 'Mountain Escape 🏔️', bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80', creator: 'Tanvir Ahmed' },
  { id: 102, title: 'Morning Coffee Brew ☕', bg: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80', creator: 'Sadia Afrin' },
  { id: 103, title: 'Roadtrip Sunset 🚗🌅', bg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80', creator: 'Ayesha Rahman' },
  { id: 104, title: 'Coding Late Nights 💻✨', bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80', creator: 'Mahir Faysal' },
];

export default function StoryReels({ user, profile }) {
  const [tab, setTab] = useState('stories'); // 'stories' or 'reels'
  const [stories, setStories] = useState(initialStories);
  const [activeStory, setActiveStory] = useState(null);
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const fileInputRef = useRef(null);

  const customAvatar = typeof window !== 'undefined' ? localStorage.getItem('fb_my_avatar') : null;
  const avatarUrl = customAvatar || profile?.avatar_url || '/images/sumon-profile-icon.jpg';
  const displayName = profile?.first_name || profile?.full_name || 'Sumon';

  // Load saved user stories from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fb_user_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStories([...parsed, ...initialStories]);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleCreateStory = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStory = {
          id: Date.now(),
          profileId: 'me',
          name: displayName,
          bg: reader.result,
          avatar: avatarUrl,
        };
        const updated = [newStory, ...stories];
        setStories(updated);
        try {
          const userOnly = updated.filter((s) => s.profileId === 'me');
          localStorage.setItem('fb_user_stories', JSON.stringify(userOnly));
        } catch (err) {
          console.warn(err);
        }
        setCreateStoryOpen(false);
        setActiveStory(newStory); // Preview immediately
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="middle-storie-container">
        {/* Stories / Reels Toggle */}
        <div className="stories-reels-top">
          <div
            className={`stories-reels-top-hover ${tab === 'stories' ? 'active' : ''}`}
            onClick={() => setTab('stories')}
          >
            <i className="fa-solid fa-book-open"></i>
            <p>Stories</p>
          </div>
          <div
            className={`stories-reels-top-hover ${tab === 'reels' ? 'active' : ''}`}
            onClick={() => setTab('reels')}
          >
            <i className="fa-solid fa-clapperboard"></i>
            <p>Reels</p>
          </div>
        </div>

        {tab === 'stories' ? (
          <div className="stories-container">
            {/* Create Story card */}
            <div
              className="stories-div"
              onClick={() => fileInputRef.current?.click()}
              title="Create a story"
            >
              <img src={avatarUrl} alt="Your profile" className="stories-image" style={{ objectFit: 'cover' }} />
              <div className="stories-icon-div1">
                <div className="stories-icon-div2">
                  <i className="fa-solid fa-plus stories-icon"></i>
                </div>
                <p className="stories-pTag">Create story</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleCreateStory}
                style={{ display: 'none' }}
              />
            </div>

            {/* Friend Stories */}
            {stories.map((story) => (
              <div
                key={story.id}
                className="stories-div"
                onClick={() => setActiveStory(story)}
                title={`View ${story.name}'s story`}
              >
                <img src={story.bg} alt={story.name} className="stories-image2" style={{ objectFit: 'cover' }} />
                <div className="stories-icon-div1">
                  <div className="stories-profile-img-div">
                    <Link
                      href={`/profile/${story.profileId || 'bisu'}`}
                      onClick={(e) => e.stopPropagation()}
                      title={`Visit ${story.name}'s profile`}
                    >
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="stories-profile-img"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                  <p className="stories-profile-name">{story.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stories-container">
            {reelsData.map((reel) => (
              <div
                key={reel.id}
                className="stories-div"
                style={{ background: '#000' }}
                onClick={() => alert(`Playing reel: ${reel.title}`)}
              >
                <img src={reel.bg} alt={reel.title} className="stories-image2" style={{ opacity: 0.85 }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '24px' }}>
                  <i className="fa-solid fa-play"></i>
                </div>
                <p className="stories-profile-name">{reel.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="post-modal-backdrop" onClick={() => setActiveStory(null)}>
          <div
            style={{
              position: 'relative',
              width: '380px',
              maxWidth: '92vw',
              height: '580px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#000',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Progress Bar & Close */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '12px', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
              <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '2px', marginBottom: '8px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', animation: 'progress 5s linear' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  href={`/profile/${activeStory.profileId || 'bisu'}`}
                  className="flex"
                  style={{ gap: '10px', textDecoration: 'none' }}
                  onClick={() => setActiveStory(null)}
                >
                  <img
                    src={activeStory.avatar}
                    alt={activeStory.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #1877f2', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px', display: 'block' }}>{activeStory.name}</span>
                    <span style={{ color: '#ccc', fontSize: '11px' }}>View profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => setActiveStory(null)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Story Image */}
            <img
              src={activeStory.bg}
              alt={activeStory.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
