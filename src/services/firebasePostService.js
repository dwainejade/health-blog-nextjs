// src/services/firebasePostService.js
import {
  collection,
  doc,
  addDoc,
  setDoc, // Add setDoc for custom IDs
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

  // Create a new blog post with slug as ID
  async createPost(postData) {
    try {
      // Generate slug if not provided
      const slug = postData.slug || this.generateSlug(postData.title);

      // Check if slug already exists
      await this.checkSlugAvailability(slug);

      const post = {
        ...postData,
        slug: slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        status: postData.status || "draft",
        authorId: postData.authorId,
      };

      // Use setDoc with slug as document ID instead of addDoc
      const postRef = doc(db, this.collectionName, slug);
      await setDoc(postRef, post);

      return {
        id: slug, // Document ID is now the slug
        ...post,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  // Check if slug is available
  async checkSlugAvailability(slug) {
    try {
      const postRef = doc(db, this.collectionName, slug);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        throw new Error(
          `A post with slug "${slug}" already exists. Please choose a different title or provide a custom slug.`
        );
      }

      return true;
    } catch (error) {
      if (error.message.includes("already exists")) {
        throw error;
      }
      console.error("Error checking slug availability:", error);
      throw new Error(`Failed to check slug availability: ${error.message}`);
    }
  }

  // Update an existing post
  async updatePost(postId, updates) {
    try {
      const postRef = doc(db, this.collectionName, postId);

      // If title is being updated, we might need a new slug
      if (updates.title && !updates.slug) {
        const newSlug = this.generateSlug(updates.title);

        // Only update slug if it's different and available
        if (newSlug !== postId) {
          await this.checkSlugAvailability(newSlug);

          // Create new document with new slug
          const currentPost = await this.getPostById(postId);
          const newPost = {
            ...currentPost,
            ...updates,
            slug: newSlug,
            updatedAt: serverTimestamp(),
          };

          // Create new document
          const newPostRef = doc(db, this.collectionName, newSlug);
          await setDoc(newPostRef, newPost);

          // Delete old document
          await deleteDoc(postRef);

          return {
            ...newPost,
            id: newSlug,
            updatedAt: new Date().toISOString(),
          };
        }
      }

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

  // Get a single post by ID (slug)
  async getPostById(postId) {
    try {
      const postRef = doc(db, this.collectionName, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      return {
        id: postSnap.id, // This will be the slug
        ...postSnap.data(),
        createdAt: postSnap.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: postSnap.data().updatedAt?.toDate?.()?.toISOString() || null,
      };
    } catch (error) {
      console.error("Error getting post:", error);
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }

  // Get post by slug (now same as getPostById since ID is slug)
  async getPostBySlug(slug) {
    return this.getPostById(slug);
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
        id: doc.id, // This will be the slug
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
        id: doc.id, // This will be the slug
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
      const q = query(
        this.postsRef,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id, // This will be the slug
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
        id: doc.id, // This will be the slug
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
    if (!title) {
      throw new Error("Title is required to generate slug");
    }

    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  // Generate unique slug (with suffix if needed)
  async generateUniqueSlug(title) {
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      try {
        await this.checkSlugAvailability(slug);
        return slug; // Slug is available
      } catch (error) {
        if (error.message.includes("already exists")) {
          // Try with counter suffix
          slug = `${baseSlug}-${counter}`;
          counter++;

          if (counter > 100) {
            throw new Error(
              "Unable to generate unique slug after 100 attempts"
            );
          }
        } else {
          throw error;
        }
      }
    }
  }

  // Validate post data
  validatePost(postData) {
    const required = ["title", "content", "authorId"];
    const missing = required.filter((field) => !postData[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    // Validate title for slug generation
    if (!postData.title.trim()) {
      throw new Error("Title cannot be empty or just whitespace");
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
