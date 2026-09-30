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
    id: 'post-ayesha-1',
    user_id: 'ayesha-rahman',
    content: 'Chasing golden hour at the edge of the world! Nature always has a way of resetting the soul 🌅✨ #TravelBangladesh #SunsetVibes',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    profiles: {
      id: 'ayesha-rahman',
      full_name: 'Ayesha Rahman',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l1', user_id: 'tanvir-ahmed', reaction_type: 'love' },
      { id: 'l2', user_id: 'sadia-afrin', reaction_type: 'care' },
      { id: 'l3', user_id: 'mahir-faysal', reaction_type: 'like' },
      { id: 'l4', user_id: 'nusrat-jahan', reaction_type: 'love' },
    ],
    comments: [
      {
        id: 'c1',
        user_id: 'tanvir-ahmed',
        content: 'Breathtaking capture Ayesha! Which beach was this?',
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        profiles: {
          id: 'tanvir-ahmed',
          full_name: 'Tanvir Ahmed',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'c2',
        user_id: 'sadia-afrin',
        content: 'The colors in this sky are so aesthetic! 😍 Need to plan our next trip soon.',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        profiles: {
          id: 'sadia-afrin',
          full_name: 'Sadia Afrin',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'post-tanvir-1',
    user_id: 'tanvir-ahmed',
    content: 'Late night coding session with a fresh brew of coffee. Shipped a major performance refactor tonight! 💻🚀 Who else is burning the midnight oil?',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    profiles: {
      id: 'tanvir-ahmed',
      full_name: 'Tanvir Ahmed',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l5', user_id: 'anika-tabassum', reaction_type: 'like' },
      { id: 'l6', user_id: 'samin-yasar', reaction_type: 'haha' },
      { id: 'l7', user_id: 'farhana-islam', reaction_type: 'care' },
    ],
    comments: [
      {
        id: 'c3',
        user_id: 'anika-tabassum',
        content: 'Clean desk setup bro! Don’t forget to hydrate 💧',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        profiles: {
          id: 'anika-tabassum',
          full_name: 'Anika Tabassum',
          avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'post-sadia-1',
    user_id: 'sadia-afrin',
    content: 'Found this hidden gem of a cafe in Dhanmondi today! 🌿 The iced Spanish latte is an absolute 10/10. Definitely my new favorite remote work spot. ☕',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    profiles: {
      id: 'sadia-afrin',
      full_name: 'Sadia Afrin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l8', user_id: 'tasnim-zahan', reaction_type: 'love' },
      { id: 'l9', user_id: 'ayesha-rahman', reaction_type: 'love' },
    ],
    comments: [
      {
        id: 'c4',
        user_id: 'tasnim-zahan',
        content: 'Drop the location please! Need to try their pastries! 🥐',
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        profiles: {
          id: 'tasnim-zahan',
          full_name: 'Tasnim Zahan',
          avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'post-mahir-1',
    user_id: 'mahir-faysal',
    content: '500 kilometers on two wheels this weekend. The monsoon clouds hovering over the hills was purely magical. 🏍️🏔️ #BikerLife #SajekTour',
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    profiles: {
      id: 'mahir-faysal',
      full_name: 'Mahir Faysal',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l10', user_id: 'rafiqul-islam', reaction_type: 'wow' },
      { id: 'l11', user_id: 'fahim-shahriar', reaction_type: 'like' },
    ],
    comments: [],
  },
  {
    id: 'post-nusrat-1',
    user_id: 'nusrat-jahan',
    content: 'Finally submitted our university thesis project! 4 years of countless sleepless nights, coffee cups, and memories that will last a lifetime. Grateful for this squad! 🎓🎉',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    profiles: {
      id: 'nusrat-jahan',
      full_name: 'Nusrat Jahan',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l12', user_id: 'farhana-islam', reaction_type: 'love' },
      { id: 'l13', user_id: 'anika-tabassum', reaction_type: 'care' },
      { id: 'l14', user_id: 'tanvir-ahmed', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c5',
        user_id: 'farhana-islam',
        content: 'Heartiest congratulations Nusrat! So proud of your hard work! 🌟',
        created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        profiles: {
          id: 'farhana-islam',
          full_name: 'Farhana Islam',
          avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'demo-1',
    user_id: 'bisu',
    content: 'Weekend picnic with the crew! Fresh river breeze and great conversations 🌿🚣',
    image_url: '/images/Friends-Post/bisu.jpg',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    profiles: {
      id: 'bisu',
      full_name: 'Bisuu ʚíɞ',
      avatar_url: '/images/Friends/bisu.jpg',
    },
    likes: [
      { id: '1', user_id: 'dipu', reaction_type: 'like' },
      { id: '2', user_id: 'niloy', reaction_type: 'love' },
    ],
    comments: [
      {
        id: 'c6',
        user_id: 'dipu',
        content: 'Memories brother! Let’s repeat next month.',
        created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
        profiles: { id: 'dipu', full_name: 'Dipu Roy', avatar_url: '/images/Friends/dipu.jpg' },
      },
    ],
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
