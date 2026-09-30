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
  {
    id: 'post-farhana-1',
    user_id: 'farhana-islam',
    content: 'Rainy Sunday morning with a warm cup of Assam tea and a classic novel ☕📖🌿 There is something so peaceful about the sound of raindrops tapping against the window sill. Wishing everyone a restful weekend!',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 52).toISOString(),
    profiles: {
      id: 'farhana-islam',
      full_name: 'Farhana Islam',
      avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l15', user_id: 'sadia-afrin', reaction_type: 'love' },
      { id: 'l16', user_id: 'anika-tabassum', reaction_type: 'care' },
      { id: 'l17', user_id: 'ayesha-rahman', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c7',
        user_id: 'sadia-afrin',
        content: 'Cozy vibes! Which book is this Farhana?',
        created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
        profiles: { id: 'sadia-afrin', full_name: 'Sadia Afrin', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-rafiqul-1',
    user_id: 'rafiqul-islam',
    content: 'Summit conquered! 🏔️✨ 3,172 feet above sea level at Keokradong, Bandarban. Watching the cloud ocean roll beneath our tents at 6:00 AM made every kilometer of that steep rocky trek worth it. Nature never fails to humble us. #HikingBangladesh',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    profiles: {
      id: 'rafiqul-islam',
      full_name: 'Rafiqul Islam',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l18', user_id: 'tanvir-ahmed', reaction_type: 'wow' },
      { id: 'l19', user_id: 'mahir-faysal', reaction_type: 'like' },
      { id: 'l20', user_id: 'fahim-shahriar', reaction_type: 'love' },
    ],
    comments: [
      {
        id: 'c8',
        user_id: 'mahir-faysal',
        content: 'Incredible view bhai! Next tour e amio jabo.',
        created_at: new Date(Date.now() - 3600000 * 55).toISOString(),
        profiles: { id: 'mahir-faysal', full_name: 'Mahir Faysal', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-anika-1',
    user_id: 'anika-tabassum',
    content: 'Old Dhaka through watercolor strokes 🎨🖌️ Spent this afternoon sketching the vibrant lanes of Shankhari Bazar. Every corner here has centuries of heritage etched into its brick walls. How do you guys like the color palette?',
    image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    profiles: {
      id: 'anika-tabassum',
      full_name: 'Anika Tabassum',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l21', user_id: 'ayesha-rahman', reaction_type: 'love' },
      { id: 'l22', user_id: 'nusrat-jahan', reaction_type: 'care' },
    ],
    comments: [
      {
        id: 'c9',
        user_id: 'ayesha-rahman',
        content: 'You are so gifted Anika! Would love to buy a framed print of this! 😍',
        created_at: new Date(Date.now() - 3600000 * 68).toISOString(),
        profiles: { id: 'ayesha-rahman', full_name: 'Ayesha Rahman', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-fahim-1',
    user_id: 'fahim-shahriar',
    content: 'Thrilled to share that our developer platform has officially crossed 50,000 active developers worldwide! 🚀🤖 Deeply grateful to our brilliant engineering team and everyone in the tech community who believed in our vision from Day 1. Onwards and upwards! #TechBangladesh #StartupMilestone',
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 80).toISOString(),
    profiles: {
      id: 'fahim-shahriar',
      full_name: 'Fahim Shahriar',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l23', user_id: 'tanvir-ahmed', reaction_type: 'like' },
      { id: 'l24', user_id: 'samin-yasar', reaction_type: 'love' },
      { id: 'l25', user_id: 'mahir-faysal', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c10',
        user_id: 'tanvir-ahmed',
        content: 'Huge milestone Fahim! Well deserved success bro! 🔥',
        created_at: new Date(Date.now() - 3600000 * 76).toISOString(),
        profiles: { id: 'tanvir-ahmed', full_name: 'Tanvir Ahmed', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-samin-1',
    user_id: 'samin-yasar',
    content: 'Weekend culinary project: Handcrafted 48-hour fermented sourdough Neapolitan pizza! 🍕🔥 High hydration dough, San Marzano tomato sauce, fresh mozzarella and basil leaves from our balcony garden. The leoparding on this crust came out perfect.',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 90).toISOString(),
    profiles: {
      id: 'samin-yasar',
      full_name: 'Samin Yasar',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l26', user_id: 'sadia-afrin', reaction_type: 'love' },
      { id: 'l27', user_id: 'bisu', reaction_type: 'haha' },
      { id: 'l28', user_id: 'farhana-islam', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c11',
        user_id: 'sadia-afrin',
        content: 'Save a slice for us next time Samin! Looks restaurant grade! 🤤',
        created_at: new Date(Date.now() - 3600000 * 85).toISOString(),
        profiles: { id: 'sadia-afrin', full_name: 'Sadia Afrin', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-tasnim-1',
    user_id: 'tasnim-zahan',
    content: 'Golden hours by the Bay of Bengal 🌊🌅 Barefoot walks on the damp sands of Cox\'s Bazar as gentle waves wash over. Sometimes all we need is the rhythmic sound of the ocean to clear our minds and recharge.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 105).toISOString(),
    profiles: {
      id: 'tasnim-zahan',
      full_name: 'Tasnim Zahan',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l29', user_id: 'ayesha-rahman', reaction_type: 'love' },
      { id: 'l30', user_id: 'farhana-islam', reaction_type: 'like' },
    ],
    comments: [],
  },
  {
    id: 'post-samira-1',
    user_id: 'samira-khan',
    content: 'Adopted this little bundle of joy from the animal shelter today! 🐾 Meet Mochi 🐱 She is already exploring every nook and cranny of the living room and purring non-stop. Any cat parent tips are warmly welcomed in the comments!',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    profiles: {
      id: 'samira-khan',
      full_name: 'Samira Khan',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l31', user_id: 'anika-tabassum', reaction_type: 'love' },
      { id: 'l32', user_id: 'farhana-islam', reaction_type: 'care' },
      { id: 'l33', user_id: 'tanvir-ahmed', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c12',
        user_id: 'anika-tabassum',
        content: 'She is so precious!! Look at those big green eyes 🥺💕',
        created_at: new Date(Date.now() - 3600000 * 110).toISOString(),
        profiles: { id: 'anika-tabassum', full_name: 'Anika Tabassum', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      },
    ],
  },
  {
    id: 'post-rashed-1',
    user_id: 'rashed-karim',
    content: 'Hatirjheel morning cycling circuit done! 🚴‍♂️ 25 km before 7:30 AM. Crisp morning air, no traffic honking, and the sun rising over the lakes. Best way to start any day! #CyclingCommunity #DhakaRiders',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 3600000 * 135).toISOString(),
    profiles: {
      id: 'rashed-karim',
      full_name: 'Rashed Karim',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    },
    likes: [
      { id: 'l34', user_id: 'tanvir-ahmed', reaction_type: 'like' },
      { id: 'l35', user_id: 'rafiqul-islam', reaction_type: 'care' },
    ],
    comments: [],
  },
  {
    id: 'post-dipu-1',
    user_id: 'dipu',
    content: 'Historic evening walk through the grand Lalbagh Fort garden. Mughal craftsmanship in the heart of Dhaka will never stop inspiring me. 🏰✨ Photography is the pause button of life.',
    image_url: '/images/Friends-Post/dipu.jpg',
    created_at: new Date(Date.now() - 3600000 * 150).toISOString(),
    profiles: {
      id: 'dipu',
      full_name: 'Dipu Roy Plabon',
      avatar_url: '/images/Friends/dipu.jpg',
    },
    likes: [
      { id: 'l36', user_id: 'bisu', reaction_type: 'love' },
      { id: 'l37', user_id: 'niloy', reaction_type: 'like' },
    ],
    comments: [
      {
        id: 'c13',
        user_id: 'bisu',
        content: 'Awesome angle bro! Lighting is great.',
        created_at: new Date(Date.now() - 3600000 * 140).toISOString(),
        profiles: { id: 'bisu', full_name: 'Bisuu ʚíɞ', avatar_url: '/images/Friends/bisu.jpg' },
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
        // Merge Supabase user posts with defaultInitialPosts so the feed is never wiped or truncated
        const dbPostIds = new Set(data.map((p) => p.id));
        const merged = [...data, ...defaultInitialPosts.filter((dp) => !dbPostIds.has(dp.id))];
        setPosts(merged);
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
    <div className="app-page-wrapper">
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
