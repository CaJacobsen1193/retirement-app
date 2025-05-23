// frontend/src/components/PostCard.js
import React, { useState } from 'react';

export default function PostCard({
  postId,
  author,
  timestamp,
  content,
  likes,
  liked,
  comments,
  onLike,
  onComment
}) {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onComment(postId, newComment.trim());
    setNewComment('');
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.mahogany}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 14, color: colors.textDark }}>
        <strong>{author}</strong> • {new Date(timestamp).toLocaleString()}
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.4, marginBottom: 16 }}>
        {content}
      </div>

      {/* Like and Comment buttons */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 12,
        borderTop: `1px solid ${colors.beige}`,
        paddingTop: 12
      }}>
        <button
          onClick={() => onLike(postId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: liked ? '#0056b3' : colors.mahogany,
            fontWeight: 'bold'
          }}
        >
          {liked ? '💙' : '👍'} Like ({likes})
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.mahogany,
            fontWeight: 'bold'
          }}
        >
          💬 Comment ({comments.length})
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ marginTop: 12 }}>
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 20,
                  border: `1px solid ${colors.beige}`,
                  fontSize: 14
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  background: colors.mahogany,
                  color: colors.textLight,
                  border: 'none',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Post
              </button>
            </div>
          </form>

          {comments.length > 0 ? (
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {comments.map(comment => (
                <div key={comment.id} style={{
                  marginBottom: 8,
                  padding: 8,
                  backgroundColor: colors.beige,
                  borderRadius: 4
                }}>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
                    <strong>{comment.author}</strong> • {new Date(comment.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: 14 }}>{comment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
