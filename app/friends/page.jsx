'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { allMockUsers } from '../../lib/mockUsers';
import Navbar from '../../components/Navbar';
import FloatingChat from '../../components/FloatingChat';

export default function FriendsPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('suggestions'); // 'requests', 'suggestions', 'all'
  const [requests, setRequests] = useState([
    {
      id: 'sadia-afrin',
      name: 'Sadia Afrin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      mutual: '5 mutual friends',
      status: 'pending',
    },
    {
      id: 'tanvir-ahmed',
      name: 'Tanvir Ahmed',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      mutual: '12 mutual friends',
      status: 'pending',
    },
    {
      id: 'farhana-islam',
      name: 'Farhana Islam',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
      mutual: '3 mutual friends',
      status: 'pending',
    },
    {
      id: 'bisu',
      name: 'Bisuu ʚíɞ',
      avatar: '/images/Friends/bisu.jpg',
      mutual: '7 mutual friends',
      status: 'pending',
    },
  ]);
  const [suggestions, setSuggestions] = useState(
    allMockUsers.filter((u) => u.id !== 'sumon-roy' && !['sadia-afrin', 'tanvir-ahmed', 'farhana-islam', 'bisu'].includes(u.id))
  );
  const [friendsSearch, setFriendsSearch] = useState('');
  const [sentRequests, setSentRequests] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (prof) setProfile(prof);
      }
    };
    fetchSession();
  }, []);

  const handleConfirm = (id) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'confirmed' } : r)));
  };

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddFriend = (id) => {
    setSentRequests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="app-page-wrapper">
      <Navbar user={user} profile={profile} onOpenChat={(u) => setActiveChat(u)} />

      <div
        style={{
          display: 'flex',
          maxWidth: '1600px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 56px)',
        }}
        className="friends-layout"
      >
        {/* Left Friends Menu Sidebar */}
        <div
          style={{
            width: '360px',
            backgroundColor: '#ffffff',
            boxShadow: '1px 0 2px rgba(0,0,0,0.1)',
            padding: '16px 12px',
            flexShrink: 0,
            height: 'calc(100vh - 56px)',
            position: 'sticky',
            top: '56px',
            overflowY: 'auto',
          }}
          className="friends-sidebar"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Friends</h2>
            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e4e6eb',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              onClick={() => setActiveTab('suggestions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'suggestions' ? '#f0f2f5' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1877f2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                <i className="fa-solid fa-user-group"></i>
              </div>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>Home / Suggestions</span>
            </div>

            <div
              onClick={() => setActiveTab('requests')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'requests' ? '#f0f2f5' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div className="flex" style={{ gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e4e6eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>Friend Requests</span>
              </div>
              <span
                style={{
                  backgroundColor: '#e42645',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                {requests.filter((r) => r.status === 'pending').length}
              </span>
            </div>

            <div
              onClick={() => setActiveTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'all' ? '#f0f2f5' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e4e6eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                <i className="fa-solid fa-address-book"></i>
              </div>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>All Friends</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '24px' }}>
          {/* Section: Friend Requests */}
          {(activeTab === 'requests' || activeTab === 'suggestions') && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Friend Requests</h3>
              </div>

              {requests.length === 0 ? (
                <p style={{ color: '#65676b' }}>No pending friend requests.</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Link href={`/profile/${r.id}`}>
                        <img
                          src={r.avatar}
                          alt={r.name}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </Link>
                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Link
                          href={`/profile/${r.id}`}
                          style={{
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#050505',
                            textDecoration: 'none',
                          }}
                        >
                          {r.name}
                        </Link>
                        <p style={{ fontSize: '13px', color: '#65676b', margin: '4px 0 12px 0' }}>{r.mutual}</p>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {r.status === 'confirmed' ? (
                            <button
                              disabled
                              style={{
                                padding: '8px',
                                backgroundColor: '#e7f3ff',
                                color: '#1877f2',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                              }}
                            >
                              <i className="fa-solid fa-check"></i> Request accepted
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleConfirm(r.id)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: '#1877F2',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleDelete(r.id)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: '#e4e6eb',
                                  color: '#050505',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: People You May Know / Suggestions */}
          {activeTab === 'suggestions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>People You May Know</h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {suggestions.map((person, idx) => {
                  const isSent = sentRequests[person.id];
                  return (
                    <div
                      key={person.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Link href={`/profile/${person.id}`}>
                        <img
                          src={person.avatar_url}
                          alt={person.full_name}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </Link>
                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Link
                          href={`/profile/${person.id}`}
                          style={{
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#050505',
                            textDecoration: 'none',
                          }}
                        >
                          {person.full_name}
                        </Link>
                        <p style={{ fontSize: '13px', color: '#65676b', margin: '4px 0 12px 0' }}>
                          {2 + (idx % 6)} mutual friends
                        </p>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => handleAddFriend(person.id)}
                            style={{
                              padding: '8px',
                              backgroundColor: isSent ? '#e7f3ff' : '#1877F2',
                              color: isSent ? '#1877f2' : 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            {isSent ? (
                              <>
                                <i className="fa-solid fa-check"></i> Request sent
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-user-plus"></i> Add friend
                              </>
                            )}
                          </button>

                          {!isSent && (
                            <button
                              onClick={() => handleRemoveSuggestion(person.id)}
                              style={{
                                padding: '8px',
                                backgroundColor: '#e4e6eb',
                                color: '#050505',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: All Friends Directory */}
          {activeTab === 'all' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700' }}>All Friends</h3>
                  <p style={{ fontSize: '13px', color: '#65676b' }}>{allMockUsers.length - 1} friends</p>
                </div>
                <div style={{ position: 'relative', width: '260px' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '10px', color: '#65676b' }}></i>
                  <input
                    type="text"
                    placeholder="Search Friends"
                    value={friendsSearch}
                    onChange={(e) => setFriendsSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '20px',
                      border: '1px solid #ced0d4',
                      outline: 'none',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px',
                }}
              >
                {allMockUsers
                  .filter((u) => u.id !== 'sumon-roy')
                  .filter((u) => u.full_name.toLowerCase().includes(friendsSearch.toLowerCase()))
                  .map((friend) => (
                    <div
                      key={friend.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Link
                        href={`/profile/${friend.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}
                      >
                        <img
                          src={friend.avatar_url}
                          alt={friend.full_name}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: '600', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {friend.full_name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#65676b' }}>{friend.lives_in || 'Dhaka, Bangladesh'}</p>
                        </div>
                      </Link>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setActiveChat({ id: friend.id, name: friend.full_name, avatar: friend.avatar_url })}
                          title="Message"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#e7f3ff',
                            color: '#1877f2',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-brands fa-facebook-messenger"></i>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingChat chatUser={activeChat} onClose={() => setActiveChat(null)} />
    </div>
  );
}
