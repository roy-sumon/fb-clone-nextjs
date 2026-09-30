'use client';

import { useState } from 'react';
import Link from 'next/link';
import { friendSuggestions } from '../lib/mockUsers';

export default function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState(friendSuggestions);
  const [sentRequests, setSentRequests] = useState({});

  const handleAddFriend = (id) => {
    setSentRequests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemove = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  if (suggestions.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontWeight: '700', fontSize: '16px', color: '#050505' }}>
          People you may know
        </p>
        <Link
          href="/friends"
          style={{ fontSize: '14px', color: '#1877f2', textDecoration: 'none', fontWeight: '500' }}
        >
          See all
        </Link>
      </div>

      {/* Horizontal Scroll Cards */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
        }}
      >
        {suggestions.map((item) => {
          const isSent = sentRequests[item.id];
          return (
            <div
              key={item.id}
              style={{
                width: '160px',
                minWidth: '160px',
                border: '1px solid #ced0d4',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <Link href={`/profile/${item.id}`}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
              </Link>

              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link
                  href={`/profile/${item.id}`}
                  style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#050505',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.name}
                >
                  {item.name}
                </Link>
                <p style={{ fontSize: '12px', color: '#65676b', margin: '2px 0 8px 0' }}>
                  {item.mutual}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => handleAddFriend(item.id)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      backgroundColor: isSent ? '#e7f3ff' : '#1877f2',
                      color: isSent ? '#1877f2' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
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
                      onClick={() => handleRemove(item.id)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#e4e6eb',
                        color: '#050505',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
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
  );
}
