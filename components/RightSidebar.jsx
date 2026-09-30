'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialFriends = [
  { id: 'touhid', name: 'Touhid Hasan', img: '/images/Friends/touhid.jpg' },
  { id: 'uttom', name: 'Uttom Roy', img: '/images/Friends/uttom.jpg' },
  { id: 'wasius', name: 'Abu Wasius Shahid', img: '/images/Friends/wasius.jpg' },
  { id: 'atique', name: 'Atique Shahriar', img: '/images/Friends/atique.jpg' },
  { id: 'norry', name: 'Nusrat Norry', img: '/images/Friends/norry.jpg' },
  { id: 'emamul', name: 'Emamul Haque Emon', img: '/images/Friends/emamul.jpg' },
  { id: 'joydev', name: 'Joydev Roy', img: '/images/Friends/joydev.jpg' },
  { id: 'nabil', name: 'Nabil Al Tamash', img: '/images/Friends/nabil.jpg' },
  { id: 'dipu', name: 'Dipu Roy Plabon', img: '/images/Friends/dipu.jpg' },
  { id: 'nahid', name: 'Nahid Rahman', img: '/images/Friends/nahid.jpg' },
  { id: 'sraboni', name: 'Sraboni Aktar', img: '/images/Friends/sraboni.jpg' },
  { id: 'sujon', name: 'Sujon Roy', img: '/images/Friends/sujon.jpg' },
];

export default function RightSidebar({ onOpenChat }) {
  const [friendRequest, setFriendRequest] = useState({
    name: 'Sk Sanju',
    img: '/images/Friends/bejoy.jpg',
    mutual: '3 mutual friends',
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
            <Link href="/profile/bejoy">
              <img
                src={friendRequest.img}
                alt={friendRequest.name}
                style={{ height: '56px', width: '56px', borderRadius: '50%', marginRight: '12px', objectFit: 'cover' }}
              />
            </Link>
            <div style={{ flex: 1 }}>
              <Link href="/profile/bejoy" style={{ textDecoration: 'none' }}>
                <p className="color" style={{ fontWeight: '600' }}>{friendRequest.name}</p>
              </Link>
              <div className="flex" style={{ margin: '2px 0 6px 0' }}>
                <img
                  src="/images/Friends/joydev.jpg"
                  alt="Joydev"
                  style={{ height: '18px', width: '18px', borderRadius: '50%', marginRight: '4px' }}
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
          <span className="color-bold">Taposh Roy</span> and <span className="color-bold">Biplob Adhikari</span> have birthdays today.
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
