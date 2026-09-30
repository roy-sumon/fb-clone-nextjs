'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialFriends = [
  { id: 'ayesha-rahman', name: 'Ayesha Rahman', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'tanvir-ahmed', name: 'Tanvir Ahmed', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { id: 'sadia-afrin', name: 'Sadia Afrin', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'mahir-faysal', name: 'Mahir Faysal', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'nusrat-jahan', name: 'Nusrat Jahan', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'rafiqul-islam', name: 'Rafiqul Islam', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'farhana-islam', name: 'Farhana Islam', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'fahim-shahriar', name: 'Fahim Shahriar', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'anika-tabassum', name: 'Anika Tabassum', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'samin-yasar', name: 'Samin Yasar', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'tasnim-zahan', name: 'Tasnim Zahan', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'samira-khan', name: 'Samira Khan', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'bisu', name: 'Bisuu ʚíɞ', img: '/images/Friends/bisu.jpg' },
  { id: 'dipu', name: 'Dipu Roy Plabon', img: '/images/Friends/dipu.jpg' },
  { id: 'joydev', name: 'Joydev Roy', img: '/images/Friends/joydev.jpg' },
  { id: 'uttom', name: 'Uttom Roy', img: '/images/Friends/uttom.jpg' },
];

export default function RightSidebar({ onOpenChat }) {
  const [friendRequest, setFriendRequest] = useState({
    id: 'sadia-afrin',
    name: 'Sadia Afrin',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mutual: '5 mutual friends',
    mutualAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80',
    status: 'pending', // 'pending', 'confirmed', 'deleted'
  });

  const [friendsSearch, setFriendsSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredFriends = initialFriends.filter((f) =>
    f.name.toLowerCase().includes(friendsSearch.toLowerCase())
  );

  return (
    <div className="main-right">
      {/* Friend Request Section */}
      {friendRequest.status === 'pending' ? (
        <div className="friend-request">
          <div className="friend-req-clr flex1">
            <p className="margin-botom" style={{ fontWeight: '600', color: '#65676b' }}>
              Friend requests
            </p>
            <Link href="/friends" className="color margin-botom">
              See all
            </Link>
          </div>

          <div className="flex main-left-content-bg" style={{ padding: '8px', borderRadius: '8px' }}>
            <Link href={`/profile/${friendRequest.id}`}>
              <img
                src={friendRequest.img}
                alt={friendRequest.name}
                style={{ height: '56px', width: '56px', borderRadius: '50%', marginRight: '12px', objectFit: 'cover' }}
              />
            </Link>
            <div style={{ flex: 1 }}>
              <Link href={`/profile/${friendRequest.id}`} style={{ textDecoration: 'none' }}>
                <p className="color" style={{ fontWeight: '600' }}>{friendRequest.name}</p>
              </Link>
              <div className="flex" style={{ margin: '2px 0 6px 0' }}>
                <img
                  src={friendRequest.mutualAvatar || '/images/Friends/joydev.jpg'}
                  alt="Mutual"
                  style={{ height: '18px', width: '18px', borderRadius: '50%', marginRight: '4px', objectFit: 'cover' }}
                />
                <p style={{ fontSize: '12px', color: '#65676b' }}>{friendRequest.mutual}</p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="friend-req-btn1"
                  onClick={() => setFriendRequest({ ...friendRequest, status: 'confirmed' })}
                >
                  Confirm
                </button>
                <button
                  className="friend-req-btn2"
                  onClick={() => setFriendRequest({ ...friendRequest, status: 'deleted' })}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : friendRequest.status === 'confirmed' ? (
        <div style={{ padding: '8px 12px', color: '#31a24c', fontSize: '13px', fontWeight: '500' }}>
          <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i> You are now friends with {friendRequest.name}!
        </div>
      ) : null}

      <hr className="hr" />

      {/* Birthdays Section */}
      <div className="birthdays flex" style={{ cursor: 'pointer' }}>
        <img
          src="/images/fb-birthday-box.png"
          alt="Birthday"
          style={{ height: '36px', width: '36px', borderRadius: '50%' }}
        />
        <p className="birth-para">
          <span className="color-bold">Ayesha Rahman</span> and <span className="color-bold">Rafiqul Islam</span> have birthdays today.
        </p>
      </div>

      <hr className="hr" />

      {/* Contacts Section */}
      <div className="contacts-section">
        <div className="contacts-clr flex1">
          <p style={{ fontWeight: '600', color: '#65676b' }}>Contacts</p>
          <div className="flex" style={{ gap: '10px' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ cursor: 'pointer', color: '#65676b' }}
              onClick={() => setShowSearch(!showSearch)}
              title="Search contact"
            ></i>
            <i className="fa-solid fa-ellipsis" style={{ cursor: 'pointer', color: '#65676b' }}></i>
          </div>
        </div>

        {showSearch && (
          <div style={{ padding: '0 12px 8px 12px' }}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={friendsSearch}
              onChange={(e) => setFriendsSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #ced0d4',
                fontSize: '13px',
                outline: 'none',
              }}
              autoFocus
            />
          </div>
        )}

        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex main-left-content-bg"
            style={{ padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Link
              href={`/profile/${friend.id}`}
              className="contact-img-div"
              title={`View ${friend.name}'s profile`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={friend.img}
                alt={friend.name}
                style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div className="blue-light"></div>
            </Link>
            <p
              className="marginLeft color"
              style={{ marginLeft: '12px', flex: 1 }}
              onClick={() => onOpenChat && onOpenChat({ id: friend.id, name: friend.name, avatar: friend.img })}
              title={`Chat with ${friend.name}`}
            >
              {friend.name}
            </p>
          </div>
        ))}
      </div>

      <hr className="hr" />

      {/* Group conversations */}
      <div className="group-conversation">
        <p className="group-conversation-paraTag" style={{ padding: '4px 12px', fontWeight: '600', color: '#65676b', fontSize: '14px' }}>
          Group conversations
        </p>

        <div
          className="flex main-left-content-bg"
          style={{ padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => onOpenChat && onOpenChat({ id: 'g1', name: 'Deep Heart 💬', avatar: '/images/deep-heart.jpg' })}
        >
          <div className="contact-img-div">
            <img
              src="/images/deep-heart.jpg"
              alt="Deep Heart"
              style={{ height: '36px', width: '36px', borderRadius: '50%' }}
            />
            <div className="blue-light"></div>
          </div>
          <p className="marginLeft color" style={{ marginLeft: '12px' }}>Deep Heart</p>
        </div>

        <div
          className="flex main-left-content-bg"
          style={{ padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => onOpenChat && onOpenChat({ id: 'g2', name: 'Chess Master ♟️', avatar: '/images/chess.png' })}
        >
          <div className="contact-img-div">
            <img
              src="/images/chess.png"
              alt="Chess Master"
              style={{ height: '36px', width: '36px', borderRadius: '50%' }}
            />
            <div className="blue-light"></div>
          </div>
          <p className="marginLeft color" style={{ marginLeft: '12px' }}>Chess Master</p>
        </div>

        <div
          className="main-left-content flex main-left-content-bg"
          style={{ padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => {
            const groupName = prompt('Enter new group name:');
            if (groupName) {
              alert(`Group "${groupName}" created!`);
            }
          }}
        >
          <i className="fa-solid fa-plus margin-padding-icon" style={{ fontSize: '18px', color: '#65676b' }}></i>
          <p className="margin-padding-title">Create new group</p>
        </div>
      </div>
    </div>
  );
}
