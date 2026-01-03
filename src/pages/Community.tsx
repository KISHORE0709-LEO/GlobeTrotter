import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, User, Plus, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import baliImage from "@/assets/destination-bali.jpg";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  title?: string;
  content: string;
  place?: string;
  date?: string;
  image?: string;
  destination?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  isLiked: boolean;
}

const initialPosts: CommunityPost[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: null,
    },
    title: "Amazing Japan Adventure",
    content: "Just got back from an amazing 2-week trip to Japan! Tokyo was incredible - the perfect blend of ancient traditions and modern innovation. Pro tip: Get a JR Pass, it saves so much on travel between cities! 🇯🇵✨",
    place: "Tokyo, Japan",
    image: tokyoImage,
    destination: "Tokyo, Japan",
    likes: 342,
    comments: [
      { id: "c1", author: "Mike Chen", text: "Looks amazing! How was the food?", timestamp: "1 hour ago" },
      { id: "c2", author: "Emma Wilson", text: "I'm planning a trip there next year!", timestamp: "30 minutes ago" }
    ],
    shares: 15,
    timestamp: "2 hours ago",
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: null,
    },
    title: "Paris Winter Magic",
    content: "Paris in winter hits different. Less crowds, cheaper hotels, and the city looks magical with holiday lights. The Louvre was practically empty - I spent 4 hours just wandering around! 🗼",
    place: "Paris, France",
    image: parisImage,
    destination: "Paris, France",
    likes: 521,
    comments: [
      { id: "c3", author: "Sarah Johnson", text: "Winter in Paris sounds perfect!", timestamp: "2 hours ago" }
    ],
    shares: 32,
    timestamp: "5 hours ago",
    isLiked: false,
  },
  {
    id: "3",
    user: {
      name: "Emma Wilson",
      avatar: null,
    },
    title: "Bali Paradise",
    content: "Bali exceeded all my expectations! The rice terraces in Ubud are breathtaking, and the local people are so welcoming. If you're planning a trip, don't miss the sunrise at Mount Batur - it's life-changing! 🌅",
    place: "Bali, Indonesia",
    image: baliImage,
    destination: "Bali, Indonesia",
    likes: 289,
    comments: [],
    shares: 8,
    timestamp: "1 day ago",
    isLiked: false,
  },
];

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "", place: "", date: "" });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const isLoggedIn = true; // Simulate logged in user

  const toggleLike = (postId: string) => {
    if (!isLoggedIn) {
      alert("Please login to like posts");
      return;
    }
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const addComment = (postId: string) => {
    if (!isLoggedIn) {
      alert("Please login to comment");
      return;
    }
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "John Doe", // Current user
      text: commentText,
      timestamp: "Just now"
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const createPost = () => {
    if (!isLoggedIn) {
      alert("Please login to create posts");
      return;
    }
    if (!newPost.content.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      user: { name: "John Doe", avatar: null },
      title: newPost.title,
      content: newPost.content,
      place: newPost.place,
      date: newPost.date,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: "Just now",
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: "", content: "", place: "", date: "" });
    setShowCreatePost(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Community
          </h1>
          <p className="text-muted-foreground">
            Share your travel experiences and discover inspiration from fellow travelers
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar placeholder="Search posts, destinations, or travelers..." />
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {communityPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{post.user.name}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
                <Badge variant="outline">{post.destination}</Badge>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-foreground/90 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Image */}
              <div className="relative aspect-video">
                <img
                  src={post.image}
                  alt={post.destination}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.includes(post.id) ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
                <button
                  onClick={() => toggleSave(post.id)}
                  className={`transition-colors ${
                    savedPosts.includes(post.id) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${savedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Layout>
  );
}