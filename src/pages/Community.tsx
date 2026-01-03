import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import baliImage from "@/assets/destination-bali.jpg";

const communityPosts = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: null,
    },
    content: "Just got back from an amazing 2-week trip to Japan! Tokyo was incredible - the perfect blend of ancient traditions and modern innovation. Pro tip: Get a JR Pass, it saves so much on travel between cities! 🇯🇵✨",
    image: tokyoImage,
    destination: "Tokyo, Japan",
    likes: 342,
    comments: 28,
    shares: 15,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: null,
    },
    content: "Paris in winter hits different. Less crowds, cheaper hotels, and the city looks magical with holiday lights. The Louvre was practically empty - I spent 4 hours just wandering around! 🗼",
    image: parisImage,
    destination: "Paris, France",
    likes: 521,
    comments: 45,
    shares: 32,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Emma Wilson",
      avatar: null,
    },
    content: "Bali exceeded all my expectations! The rice terraces in Ubud are breathtaking, and the local people are so welcoming. If you're planning a trip, don't miss the sunrise at Mount Batur - it's life-changing! 🌅",
    image: baliImage,
    destination: "Bali, Indonesia",
    likes: 289,
    comments: 19,
    shares: 8,
    timestamp: "1 day ago",
  },
  {
    id: "4",
    user: {
      name: "David Park",
      avatar: null,
    },
    content: "Hidden gem alert! Found this amazing little ramen shop in Shibuya that the locals swear by. No English menu, just point at what others are having. Best meal of the trip hands down! 🍜",
    image: tokyoImage,
    destination: "Tokyo, Japan",
    likes: 178,
    comments: 34,
    shares: 12,
    timestamp: "2 days ago",
  },
];

export default function Community() {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <>
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
      <Footer />
    </>
  );
}
