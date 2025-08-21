// src/services/firebasePostService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

class FirebasePostService {
  constructor() {
    this.collectionName = "posts";
    this.postsRef = collection(db, this.collectionName);
  }

  // Create a new blog post
  async createPost(postData) {
    try {
      const post = {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        status: postData.status || "draft", // draft, published, archived
        authorId: postData.authorId,
        slug: postData.slug || this.generateSlug(postData.title),
      };

      const docRef = await addDoc(this.postsRef, post);

      return {
        id: docRef.id,
        ...post,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  // Update an existing post
  async updatePost(postId, updates) {
    try {
      const postRef = doc(db, this.collectionName, postId);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(postRef, updateData);

      // Return updated post
      return await this.getPostById(postId);
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  // Delete a post
  async deletePost(postId) {
    try {
      const postRef = doc(db, this.collectionName, postId);
      await deleteDoc(postRef);
      return { success: true, deletedId: postId };
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  // Get a single post by ID
  async getPostById(postId) {
    try {
      const postRef = doc(db, this.collectionName, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      return {
        id: postSnap.id,
        ...postSnap.data(),
        createdAt: postSnap.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: postSnap.data().updatedAt?.toDate?.()?.toISOString() || null,
      };
    } catch (error) {
      console.error("Error getting post:", error);
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }

  // Get post by slug
  async getPostBySlug(slug) {
    try {
      const q = query(this.postsRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Post not found");
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      };
    } catch (error) {
      console.error("Error getting post by slug:", error);
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }

  // Get all published posts (with pagination)
  async getPublishedPosts(pageSize = 10, lastDoc = null) {
    try {
      let q = query(
        this.postsRef,
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);

      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      }));

      return {
        posts,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        hasMore: querySnapshot.docs.length === pageSize,
      };
    } catch (error) {
      console.error("Error getting published posts:", error);
      throw new Error(`Failed to get posts: ${error.message}`);
    }
  }

  // Get all posts (admin only)
  async getAllPosts(status = null) {
    try {
      let q = query(this.postsRef, orderBy("updatedAt", "desc"));

      if (status) {
        q = query(
          this.postsRef,
          where("status", "==", status),
          orderBy("updatedAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      }));
    } catch (error) {
      console.error("Error getting all posts:", error);
      throw new Error(`Failed to get posts: ${error.message}`);
    }
  }

  // Search posts by title or content
  async searchPosts(searchTerm, status = "published") {
    try {
      // Note: Firestore doesn't have full-text search built-in
      // This is a basic implementation - consider using Algolia for better search
      const q = query(
        this.postsRef,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      }));

      // Client-side filtering (for basic search)
      const searchLower = searchTerm.toLowerCase();
      return allPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error("Error searching posts:", error);
      throw new Error(`Failed to search posts: ${error.message}`);
    }
  }

  // Get posts by tag
  async getPostsByTag(tag) {
    try {
      const q = query(
        this.postsRef,
        where("tags", "array-contains", tag),
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      }));
    } catch (error) {
      console.error("Error getting posts by tag:", error);
      throw new Error(`Failed to get posts by tag: ${error.message}`);
    }
  }

  // Increment post views
  async incrementViews(postId) {
    try {
      const postRef = doc(db, this.collectionName, postId);
      await updateDoc(postRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Don't throw error for view tracking
    }
  }

  // Generate slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  // Validate post data
  validatePost(postData) {
    const required = ["title", "content", "authorId"];
    const missing = required.filter((field) => !postData[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    if (postData.slug && !/^[a-z0-9-]+$/.test(postData.slug)) {
      throw new Error(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
    }

    return true;
  }
}

export const firebasePostService = new FirebasePostService();
export default FirebasePostService;
