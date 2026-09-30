'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

const REACTIONS = [
  { type: 'like', label: 'Like', emoji: '👍', color: '#1877F2', icon: 'fa-solid fa-thumbs-up' },
  { type: 'love', label: 'Love', emoji: '❤️', color: '#FA383E', icon: 'fa-solid fa-heart' },
  { type: 'care', label: 'Care', emoji: '🥰', color: '#F7B125', icon: 'fa-solid fa-face-kiss-wink-heart' },
  { type: 'haha', label: 'Haha', emoji: '😆', color: '#F7B125', icon: 'fa-solid fa-face-laugh-squint' },
  { type: 'wow', label: 'Wow', emoji: '😮', color: '#F7B125', icon: 'fa-solid fa-face-surprise' },
  { type: 'sad', label: 'Sad', emoji: '😢', color: '#F7B125', icon: 'fa-solid fa-face-sad-tear' },
  { type: 'angry', label: 'Angry', emoji: '😡', color: '#E9710F', icon: 'fa-solid fa-face-angry' },
];

export default function PostCard({ post, user, profile, onDelete }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactBar, setShowReactBar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user reacted
  const userReaction = user ? likes.find((l) => l.user_id === user.id) : null;
  const currentReactionType = userReaction?.reaction_type || (userReaction ? 'like' : null);
  const activeReaction = REACTIONS.find((r) => r.type === currentReactionType);

  const authorName = post.profiles?.full_name || post.profiles?.first_name || 'Anonymous User';
  const authorAvatar = post.profiles?.avatar_url || '/images/sumon-profile-icon.jpg';
  const isOwner = user && user.id === post.user_id;

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Handle reaction click
  const handleSelectReaction = async (reactionType) => {
    if (!user) {
      alert('Please log in to react to posts!');
      return;
    }
    setShowReactBar(false);

    try {
      if (userReaction && currentReactionType === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, user_id: user.id });

        if (!error) {
          setLikes((prev) => prev.filter((l) => l.user_id !== user.id));
        } else {
          // Local fallback
          setLikes((prev) => prev.filter((l) => l.user_id !== user.id));
        }
      } else {
        // Add or Update reaction
        const newReaction = {
          id: userReaction?.id || `local-like-${Date.now()}`,
          post_id: post.id,
          user_id: user.id,
          reaction_type: reactionType,
        };

        const { data, error } = await supabase
          .from('likes')
          .upsert([newReaction])
          .select()
          .single();

        if (!error && data) {
          setLikes((prev) => [
            ...prev.filter((l) => l.user_id !== user.id),
            { ...data, reaction_type: reactionType },
          ]);
        } else {
          // Local fallback
          setLikes((prev) => [
            ...prev.filter((l) => l.user_id !== user.id),
            newReaction,
          ]);
        }
      }
    } catch (err) {
      console.warn('Reaction error handled locally:', err);
    }
  };

  // Toggle standard Like button on quick tap
  const handleLikeClick = () => {
    if (currentReactionType) {
      handleSelectReaction(currentReactionType); // un-react
    } else {
      handleSelectReaction('like');
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      alert('Please log in to comment!');
      return;
    }

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      post_id: post.id,
      user_id: user.id,
      content: commentText.trim(),
      created_at: new Date().toISOString(),
      profiles: {
        full_name: profile?.full_name || profile?.first_name || user?.email?.split('@')[0] || 'User',
        avatar_url: profile?.avatar_url || '/images/sumon-profile-icon.jpg',
      },
    };

    setComments((prev) => [...prev, newCommentObj]);
    setCommentText('');

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: post.id,
            user_id: user.id,
            content: commentText.trim(),
          },
        ])
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (full_name, avatar_url)
        `)
        .single();

      if (!error && data) {
        setComments((prev) =>
          prev.map((c) => (c.id === newCommentObj.id ? data : c))
        );
      }
    } catch (err) {
      console.warn('Comment persisted in local feed state:', err);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      await supabase.from('comments').delete().eq('id', commentId);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Post
  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await supabase.from('posts').delete().eq('id', post.id);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.warn('Post deleted locally:', err);
      if (onDelete) onDelete(post.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique reaction emojis present on this post
  const distinctEmojis = Array.from(
    new Set(
      likes.map((l) => {
        const r = REACTIONS.find((item) => item.type === (l.reaction_type || 'like'));
        return r ? r.emoji : '👍';
      })
    )
  ).slice(0, 3);

  const getProfileLink = (uid, name) => {
    if (name?.toLowerCase().includes('bisu')) return '/profile/bisu';
    if (name?.toLowerCase().includes('dipu')) return '/profile/dipu';
    if (name?.toLowerCase().includes('niloy')) return '/profile/niloy';
    if (name?.toLowerCase().includes('sanju') || name?.toLowerCase().includes('bejoy')) return '/profile/bejoy';
    if (name?.toLowerCase().includes('touhid')) return '/profile/touhid';
    if (name?.toLowerCase().includes('uttom')) return '/profile/uttom';
    if (uid) return `/profile/${uid}`;
    return '/profile/me';
  };

  return (
    <div className="post-container" style={{ opacity: isDeleting ? 0.4 : 1, position: 'relative' }}>
      {/* Title / Post Author */}
      <div className="title-post">
        <Link
          href={getProfileLink(post.user_id, authorName)}
          className="flex"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <img
            src={authorAvatar}
            alt={authorName}
            style={{
              height: '42px',
              width: '42px',
              borderRadius: '50%',
              margin: '0.8rem 0.6rem 0.8rem 0',
              cursor: 'pointer',
              objectFit: 'cover',
            }}
          />
          <div className="post-name">
            <p style={{ color: 'var(--fb-primary-text, #050505)', fontWeight: 600, fontSize: '15px' }}>{authorName}</p>
            <p style={{ color: 'var(--fb-secondary-text, #65676b)', fontSize: '12px' }}>
              {formatDate(post.created_at)} · <i className="fa-solid fa-earth-americas"></i>
            </p>
          </div>
        </Link>

        <div className="flex" style={{ position: 'relative' }}>
          <i
            className="fa-solid fa-ellipsis post-icon"
            onClick={() => setShowMenu(!showMenu)}
            title="Options"
          ></i>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '36px',
                right: '0',
                backgroundColor: 'var(--fb-card-bg, white)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                borderRadius: '8px',
                border: '1px solid var(--fb-border, #ced0d4)',
                padding: '6px',
                width: '180px',
                zIndex: 20,
              }}
            >
              <div
                className="fb-dropdown-item"
                style={{ padding: '8px', fontSize: '13px' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Post link copied to clipboard!');
                  setShowMenu(false);
                }}
              >
                <i className="fa-solid fa-link"></i>
                <p>Copy link</p>
              </div>

              {isOwner && (
                <div
                  className="fb-dropdown-item"
                  style={{ padding: '8px', fontSize: '13px', color: '#e42645' }}
                  onClick={() => {
                    setShowMenu(false);
                    handleDeletePost();
                  }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <p>Delete post</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      {post.content && (
        <div style={{ padding: '0 16px 12px 16px', fontSize: '15px', color: 'var(--fb-primary-text, #050505)', whiteSpace: 'pre-wrap' }}>
          <p>{post.content}</p>
        </div>
      )}

      {/* Post Image */}
      {post.image_url && (
        <div style={{ width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
          <img
            src={post.image_url}
            alt="Post media"
            style={{
              width: '100%',
              maxHeight: '520px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>
      )}

      {/* Likes and Comments Counters */}
      <div className="emoji-comments">
        <div className="flex" style={{ gap: '4px' }}>
          {distinctEmojis.length > 0 ? (
            <div className="flex" style={{ fontSize: '16px', marginRight: '6px' }}>
              {distinctEmojis.map((e, idx) => (
                <span key={idx} style={{ marginLeft: idx > 0 ? '-4px' : '0' }}>
                  {e}
                </span>
              ))}
            </div>
          ) : (
            <i className="fa-solid fa-thumbs-up" style={{ color: '#1877f2', marginRight: '6px' }}></i>
          )}
          <span>{likes.length > 0 ? `${likes.length}` : 'Be the first to react'}</span>
        </div>

        <div className="flex" style={{ gap: '12px' }}>
          <p
            onClick={() => setShowComments(!showComments)}
            style={{ cursor: 'pointer' }}
          >
            {comments.length} comments
          </p>
          <p style={{ cursor: 'pointer' }}>1 share</p>
        </div>
      </div>

      {/* Reaction floating bar (Hover or Touch) */}
      <div
        className="like-comment-share-container"
        onMouseLeave={() => setShowReactBar(false)}
      >
        {showReactBar && (
          <div className="fb-reactions-bar">
            {REACTIONS.map((r) => (
              <span
                key={r.type}
                className="fb-reaction-item"
                title={r.label}
                onClick={() => handleSelectReaction(r.type)}
              >
                {r.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Like Button */}
        <div
          className="like-comment-share"
          onMouseEnter={() => setShowReactBar(true)}
          onClick={handleLikeClick}
          style={{ color: activeReaction ? activeReaction.color : '#65676b' }}
        >
          {activeReaction ? (
            <span style={{ fontSize: '18px' }}>{activeReaction.emoji}</span>
          ) : (
            <i className="fa-regular fa-thumbs-up like-margin" style={{ fontSize: '18px' }}></i>
          )}
          <p style={{ fontWeight: activeReaction ? '700' : '600' }}>
            {activeReaction ? activeReaction.label : 'Like'}
          </p>
        </div>

        {/* Comment Button */}
        <div
          className="like-comment-share"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="fa-regular fa-message like-margin" style={{ fontSize: '18px' }}></i>
          <p>Comment</p>
        </div>

        {/* Share Button */}
        <div
          className="like-comment-share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Facebook Post', text: post.content || 'Check out this post!', url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Post link copied to clipboard!');
            }
          }}
        >
          <i className="fa-solid fa-share like-margin" style={{ fontSize: '18px' }}></i>
          <p>Share</p>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <Link href={getProfileLink(comment.user_id, comment.profiles?.full_name)}>
                <img
                  src={comment.profiles?.avatar_url || '/images/sumon-profile-icon.jpg'}
                  alt={comment.profiles?.full_name || 'User'}
                  className="comment-avatar"
                />
              </Link>
              <div style={{ flex: 1 }}>
                <div className="comment-bubble">
                  <Link
                    href={getProfileLink(comment.user_id, comment.profiles?.full_name)}
                    className="comment-author"
                    style={{ textDecoration: 'none' }}
                  >
                    {comment.profiles?.full_name || 'Facebook User'}
                  </Link>
                  <p className="comment-text">{comment.content}</p>
                </div>
                <div className="flex" style={{ gap: '12px', fontSize: '11px', color: '#65676b', padding: '2px 8px' }}>
                  <span style={{ cursor: 'pointer', fontWeight: '600' }}>Like</span>
                  <span style={{ cursor: 'pointer', fontWeight: '600' }}>Reply</span>
                  <span>{formatDate(comment.created_at)}</span>
                  {user && user.id === comment.user_id && (
                    <span
                      style={{ cursor: 'pointer', color: '#e42645' }}
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="comment-input-box">
            <img
              src={profile?.avatar_url || '/images/sumon-profile-icon.jpg'}
              alt="You"
              className="comment-avatar"
            />
            <input
              type="text"
              placeholder={user ? 'Write a comment...' : 'Log in to write a comment...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
              disabled={!user}
            />
            {commentText.trim() && (
              <button type="submit" className="comment-send-btn">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
