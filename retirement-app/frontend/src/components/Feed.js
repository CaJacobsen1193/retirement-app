// frontend/src/components/Feed.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';

// Mock resident details (for the header)
const MOCK_RESIDENT_DETAILS = {
  r1: { name: 'Alice Johnson' },
  r2: { name: 'Bob Smith' },
  r3: { name: 'Carol Lee' },
};

// Mock posts data with likes and comments
const MOCK_COMMUNITY_POSTS = [
  {
    id: 'c1',
    author: 'Nursing Home Admin',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    content: 'Reminder: Monthly Bingo night this Friday at 7 PM in the common room!',
    likes: 5,
    comments: [
      { id: 'c1c1', author: 'Alice Johnson', text: 'Looking forward to it!', timestamp: Date.now() - 1000 * 60 * 30 },
      { id: 'c1c2', author: 'Bob Smith', text: 'I hope they have prizes!', timestamp: Date.now() - 1000 * 60 * 15 },
    ]
  },
  {
    id: 'c2',
    author: 'Activity Coordinator',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    content: 'Photos from our Spring Garden planting are now available in the gallery.',
    likes: 8,
    comments: []
  },
];

const MOCK_INDIVIDUAL_POSTS = {
  r1: [
    {
      id: 'r1p1',
      author: 'Alice Johnson',
      timestamp: Date.now() - 1000 * 60 * 30,
      content: 'Had a lovely walk in the garden today 🌷',
      likes: 3,
      comments: []
    },
    {
      id: 'r1p2',
      author: 'Alice Johnson',
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      content: 'Lunch was delicious! Thank you to the kitchen staff.',
      likes: 7,
      comments: [
        { id: 'r1p2c1', author: 'Kitchen Staff', text: 'You\'re welcome! Glad you enjoyed it.', timestamp: Date.now() - 1000 * 60 * 60 * 4 },
      ]
    },
  ],
  r2: [
    {
      id: 'r2p1',
      author: 'Bob Smith',
      timestamp: Date.now() - 1000 * 60 * 10,
      content: 'Enjoyed the live piano concert this afternoon 🎹',
      likes: 4,
      comments: []
    },
  ],
};

export default function Feed() {
  const { residentId } = useParams();
  const resident = MOCK_RESIDENT_DETAILS[residentId] || { name: residentId };
  const userRole = localStorage.getItem('userRole') || 'Resident';
  const [showCommunity, setShowCommunity] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({});

  useEffect(() => {
    const sourceData = showCommunity
      ? MOCK_COMMUNITY_POSTS
      : (MOCK_INDIVIDUAL_POSTS[residentId] || []);

    const initialPostData = {};
    sourceData.forEach(post => {
      initialPostData[post.id] = {
        likes: post.likes || 0,
        comments: [...(post.comments || [])],
        liked: false
      };
    });

    setPosts(sourceData);
    setPostData(initialPostData);
  }, [showCommunity, residentId]);

  const myUpdatesLabel = userRole === 'Resident'
    ? 'My Updates'
    : `${resident.name}'s Updates`;

  const handleLike = (postId) => {
    setPostData(prev => {
      const { liked, likes } = prev[postId];
      const newLiked = !liked;
      const newCount = newLiked ? likes + 1 : likes - 1;
      return {
        ...prev,
        [postId]: {
          ...prev[postId],
          liked: newLiked,
          likes: newCount
        }
      };
    });
  };

  const handleComment = (postId, commentText) => {
    const newComment = {
      id: `${postId}-c${Date.now()}`,
      author: resident.name,
      text: commentText,
      timestamp: Date.now()
    };
    
    setPostData(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        comments: [...prev[postId].comments, newComment]
      }
    }));
  };

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
  };

  return (
    <div style={{
      backgroundColor: colors.beige,
      minHeight: '100vh',
      paddingTop: 24,
      paddingBottom: 24
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: colors.mahogany,
          marginBottom: 24,
          fontSize: '2rem'
        }}>
          {resident.name}’s Feed
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <button
            onClick={() => setShowCommunity(true)}
            style={{
              padding: '8px 16px',
              marginRight: 8,
              background: showCommunity ? colors.mahogany : '#fff',
              color: showCommunity ? colors.textLight : colors.textDark,
              border: `2px solid ${colors.mahogany}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Community Updates
          </button>
          <button
            onClick={() => setShowCommunity(false)}
            style={{
              padding: '8px 16px',
              background: !showCommunity ? colors.mahogany : '#fff',
              color: !showCommunity ? colors.textLight : colors.textDark,
              border: `2px solid ${colors.mahogany}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {myUpdatesLabel}
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: `2px solid ${colors.mahogany}`
        }}>
          {posts.length > 0
            ? posts.map(post => (
                <PostCard
                  key={post.id}
                  postId={post.id}
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
                  likes={postData[post.id]?.likes || 0}
                  liked={postData[post.id]?.liked || false}
                  comments={postData[post.id]?.comments || []}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            : <p style={{ textAlign: 'center', color: '#666', padding: 16 }}>No posts to display.</p>
          }
        </div>
      </div>
    </div>
  );
}
