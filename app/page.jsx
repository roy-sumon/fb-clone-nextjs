'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import StoryReels from '../components/StoryReels';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import FloatingChat from '../components/FloatingChat';
import FriendSuggestions from '../components/FriendSuggestions';

// Realistic sample posts that load immediately so the user can interact right away
const defaultInitialPosts = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    content: 'Enjoying the nice day with friends! Beautiful weather outside 🌿☀️',
    image_url: '/images/Friends-Post/bisu.jpg',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    profiles: {
      full_name: 'Bisuu ʚíɞ',
      avatar_url: '/images/Friends/bisu.jpg',
    },
    likes: [
      { id: '1', user_id: 'u1', reaction_type: 'like' },
      { id: '2', user_id: 'u2', reaction_type: 'love' },
      { id: '3', user_id: 'u3', reaction_type: 'care' },
    ],
    comments: [
      {
        id: 'c1',
        content: 'Awesome photo brother! Looking great 🔥',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        profiles: { full_name: 'Niloy Roy', avatar_url: '/images/Friends/niloy.jpg' },
      },
      {
        id: 'c2',
        content: 'Where was this taken?',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        profiles: { full_name: 'Dipu Roy', avatar_url: '/images/Friends/dipu.jpg' },
      },
    ],
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    content: 'Weekend travel vibes! Road trip with family 🚗💨',
    image_url: '/images/Friends-Post/dipu.jpg',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    profiles: {
      full_name: 'Dipu Roy',
      avatar_url: '/images/Friends/dipu.jpg',
    },
    likes: [
      { id: '4', user_id: 'u4', reaction_type: 'love' },
      { id: '5', user_id: 'u5', reaction_type: 'haha' },
    ],
    comments: [
      {
        id: 'c3',
        content: 'Have a safe trip bro!',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        profiles: { full_name: 'Touhid Hasan', avatar_url: '/images/Friends/touhid.jpg' },
      },
    ],
  },
  {
    id: 'demo-3',
    user_id: 'demo-user-3',
    content: 'Throwback to last summer picnic with best buddies! Always special memories.',
    image_url: '/images/Friends-Post/niloy.jpg',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    profiles: {
      full_name: 'Niloy Roy',
      avatar_url: '/images/Friends/niloy.jpg',
    },
    likes: [
      { id: '6', user_id: 'u6', reaction_type: 'like' },
      { id: '7', user_id: 'u7', reaction_type: 'love' },
    ],
    comments: [],
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(defaultInitialPosts);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  // Load User & Session from Supabase
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (e) {
        console.warn('Session fetch handled:', e);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profileData) setProfile(profileData);
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch Posts from Supabase and merge
  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          created_at,
          user_id,
          profiles:user_id (id, full_name, first_name, last_name, avatar_url),
          likes (id, user_id, reaction_type),
          comments (id, content, created_at, profiles:user_id (full_name, avatar_url))
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Supabase posts loaded with initial feed:', err);
    }
  };

  useEffect(() => {
    loadPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Filter posts based on Search Query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const contentMatch = post.content?.toLowerCase().includes(q);
    const authorMatch = post.profiles?.full_name?.toLowerCase().includes(q);
    return contentMatch || authorMatch;
  });

  return (
    <div>
      {/* Top Navbar */}
      <Navbar
        user={user}
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenChat={(chatUser) => setActiveChat(chatUser)}
      />

      {/* Main 3-Column Facebook Layout */}
      <div className="main-section">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          user={user}
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Center Feed */}
        <div className="main-midle">
          {activeTab === 'home' && (
            <>
              <StoryReels user={user} profile={profile} />
              <CreatePost
                user={user}
                profile={profile}
                onPostCreated={handlePostCreated}
              />

              {/* Feed Posts */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#65676b' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
                  <p style={{ marginTop: '10px' }}>Loading Feed...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#65676b',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '28px', marginBottom: '8px' }}></i>
                  <p>No posts found matching "{searchQuery}"</p>
                </div>
              ) : (
                filteredPosts.map((post, idx) => (
                  <div key={post.id}>
                    <PostCard
                      post={post}
                      user={user}
                      profile={profile}
                      onDelete={handlePostDeleted}
                    />
                    {idx === 0 && <FriendSuggestions />}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'watch' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <i className="fa-solid fa-tv" style={{ fontSize: '48px', color: '#2EB55A', marginBottom: '12px' }}></i>
              <h2>Facebook Watch & Reels</h2>
              <p style={{ color: '#65676b', marginTop: '8px' }}>Watch trending videos and creators.</p>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <i className="fa-solid fa-store" style={{ fontSize: '48px', color: '#F02849', marginBottom: '12px' }}></i>
              <h2>Marketplace</h2>
              <p style={{ color: '#65676b', marginTop: '8px' }}>Buy and sell items with people nearby.</p>
            </div>
          )}

          {activeTab === 'groups' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <i className="fa-solid fa-users" style={{ fontSize: '48px', color: '#1877F2', marginBottom: '12px' }}></i>
              <h2>Your Groups</h2>
              <p style={{ color: '#65676b', marginTop: '8px' }}>Find and join groups with your interests.</p>
            </div>
          )}

          {activeTab === 'gaming' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <i className="fa-solid fa-gamepad" style={{ fontSize: '48px', color: '#21A2F0', marginBottom: '12px' }}></i>
              <h2>Instant Gaming</h2>
              <p style={{ color: '#65676b', marginTop: '8px' }}>Play Chess, Ludo Club and more with friends.</p>
            </div>
          )}
        </div>

        {/* Right Contacts & Requests Sidebar */}
        <RightSidebar onOpenChat={(chatUser) => setActiveChat(chatUser)} />
      </div>

      {/* Floating Messenger Chat Box */}
      <FloatingChat
        chatUser={activeChat}
        onClose={() => setActiveChat(null)}
      />
    </div>
  );
}
