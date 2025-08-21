// src/components/test/FirebaseTest.js - Enhanced with Firestore Testing
"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";

export default function FirebaseTest() {
  const [testResults, setTestResults] = useState({});
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPassword, setTestPassword] = useState("testpassword123");
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuthStore();

  // Test 1: Firebase Configuration
  const testFirebaseConfig = () => {
    try {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const missingVars = Object.entries(config)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        setTestResults((prev) => ({
          ...prev,
          config: {
            status: "error",
            message: `Missing environment variables: ${missingVars.join(", ")}`,
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          config: {
            status: "success",
            message: "All Firebase environment variables are present",
            data: config,
          },
        }));
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        config: {
          status: "error",
          message: `Configuration error: ${error.message}`,
        },
      }));
    }
  };

  // Test 2: Firebase Auth Instance
  const testAuthInstance = () => {
    try {
      if (auth) {
        setTestResults((prev) => ({
          ...prev,
          authInstance: {
            status: "success",
            message: "Firebase Auth instance created successfully",
            data: {
              currentUser: auth.currentUser?.email || "No user signed in",
              app: auth.app.name,
              config: auth.config,
            },
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          authInstance: {
            status: "error",
            message: "Firebase Auth instance not found",
          },
        }));
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        authInstance: {
          status: "error",
          message: `Auth instance error: ${error.message}`,
        },
      }));
    }
  };

  // Test 3: Firestore Database Instance
  const testFirestoreInstance = () => {
    try {
      if (db) {
        setTestResults((prev) => ({
          ...prev,
          firestoreInstance: {
            status: "success",
            message: "Firestore database instance created successfully",
            data: {
              app: db.app.name,
              settings: db._settings || {},
            },
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          firestoreInstance: {
            status: "error",
            message: "Firestore database instance not found",
          },
        }));
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        firestoreInstance: {
          status: "error",
          message: `Firestore instance error: ${error.message}`,
        },
      }));
    }
  };

  // Test 4: Auth Store Connection
  const testAuthStore = () => {
    try {
      const storeData = {
        user: user,
        isAuthenticated: isAuthenticated,
        isAdmin: isAdmin(),
        adminEmails: useAuthStore.getState().adminEmails,
      };

      setTestResults((prev) => ({
        ...prev,
        authStore: {
          status: "success",
          message: "Auth store is working correctly",
          data: storeData,
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        authStore: {
          status: "error",
          message: `Auth store error: ${error.message}`,
        },
      }));
    }
  };

  // Test 5: Google Auth Provider
  const testGoogleAuth = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();

      // Just test provider creation, don't actually sign in
      setTestResults((prev) => ({
        ...prev,
        googleAuth: {
          status: "success",
          message: "Google Auth Provider created successfully",
          data: {
            providerId: provider.providerId,
            scopes: provider._scopes || [],
          },
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        googleAuth: {
          status: "error",
          message: `Google Auth error: ${error.message}`,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Connection to Firebase Project
  const testFirebaseConnection = async () => {
    try {
      setLoading(true);

      // Test connection by attempting to sign in with wrong credentials
      try {
        await signInWithEmailAndPassword(
          auth,
          "nonexistent@test.com",
          "wrongpassword"
        );
      } catch (authError) {
        // If we get an auth error (not network), connection is working
        if (
          authError.code === "auth/user-not-found" ||
          authError.code === "auth/wrong-password" ||
          authError.code === "auth/invalid-credential"
        ) {
          setTestResults((prev) => ({
            ...prev,
            connection: {
              status: "success",
              message: "Successfully connected to Firebase Auth service",
            },
          }));
        } else if (authError.code === "auth/network-request-failed") {
          setTestResults((prev) => ({
            ...prev,
            connection: {
              status: "error",
              message: "Network connection to Firebase failed",
            },
          }));
        } else {
          setTestResults((prev) => ({
            ...prev,
            connection: {
              status: "warning",
              message: `Connection test uncertain: ${authError.message}`,
            },
          }));
        }
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        connection: {
          status: "error",
          message: `Connection test failed: ${error.message}`,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test 7: Firestore Database Operations (NEW!)
  const testFirestoreOperations = async () => {
    try {
      setLoading(true);
      setTestResults((prev) => ({
        ...prev,
        firestoreOps: {
          status: "loading",
          message: "Testing Firestore operations...",
        },
      }));

      // Test 1: Create a test document
      const testCollection = collection(db, "test_posts");
      const testDoc = {
        title: "Firebase Test Post",
        content: "This is a test post to verify Firestore connectivity",
        createdAt: serverTimestamp(),
        author: "Firebase Test Suite",
        status: "test",
      };

      const docRef = await addDoc(testCollection, testDoc);

      // Test 2: Read documents from the collection
      const querySnapshot = await getDocs(testCollection);
      const docsCount = querySnapshot.size;

      // Test 3: Delete the test document
      await deleteDoc(doc(db, "test_posts", docRef.id));

      setTestResults((prev) => ({
        ...prev,
        firestoreOps: {
          status: "success",
          message: "Firestore operations successful! Ready for blog posts.",
          data: {
            testDocId: docRef.id,
            documentsFound: docsCount,
            operations: ["CREATE ✅", "READ ✅", "DELETE ✅"],
          },
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        firestoreOps: {
          status: "error",
          message: `Firestore operations failed: ${error.message}`,
          data: {
            errorCode: error.code,
            errorDetails: error.message,
          },
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test 8: Firestore Security Rules (NEW!)
  const testFirestoreRules = async () => {
    try {
      setLoading(true);

      // Test reading from posts collection (should work for public posts)
      const postsCollection = collection(db, "posts");

      try {
        const snapshot = await getDocs(postsCollection);
        setTestResults((prev) => ({
          ...prev,
          firestoreRules: {
            status: "success",
            message: `Firestore security rules allow reading. Found ${snapshot.size} posts.`,
            data: {
              postsFound: snapshot.size,
              canRead: true,
            },
          },
        }));
      } catch (rulesError) {
        if (rulesError.code === "permission-denied") {
          setTestResults((prev) => ({
            ...prev,
            firestoreRules: {
              status: "warning",
              message:
                "Firestore security rules are restricting access (this might be expected)",
              data: {
                errorCode: rulesError.code,
                suggestion:
                  "Make sure your security rules allow reading published posts",
              },
            },
          }));
        } else {
          throw rulesError;
        }
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        firestoreRules: {
          status: "error",
          message: `Firestore rules test failed: ${error.message}`,
          data: {
            errorCode: error.code,
          },
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults({});
    setLoading(true);

    try {
      testFirebaseConfig();
      testAuthInstance();
      testFirestoreInstance();
      testAuthStore();
      await testGoogleAuth();
      await testFirebaseConnection();
      await testFirestoreOperations();
      await testFirestoreRules();
    } catch (error) {
      console.error("Test suite error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run basic tests on component mount
  useEffect(() => {
    testFirebaseConfig();
    testAuthInstance();
    testFirestoreInstance();
    testAuthStore();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "loading":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "loading":
        return "⏳";
      default:
        return "⏳";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔥 Firebase Test Suite
        </h2>
        <p className="text-gray-600">
          Test your Firebase configuration, authentication, and Firestore
          database
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running Tests..." : "Run All Tests"}
        </button>

        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Test Connection
        </button>

        <button
          onClick={testFirestoreOperations}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Test Firestore
        </button>
      </div>

      {/* Current User Info */}
      {user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-900">Currently Signed In:</h3>
          <p className="text-blue-700">Email: {user.email}</p>
          <p className="text-blue-700">UID: {user.uid}</p>
          <p className="text-blue-700">Admin: {isAdmin() ? "Yes" : "No"}</p>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-4 border rounded-md ${getStatusColor(result.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  {testName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </h3>
                <p className="mt-1">{result.message}</p>

                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">
                      View Details
                    </summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="font-semibold text-gray-900 mb-2">
          📝 Firebase Setup Checklist
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <div>
            <strong>For Authentication:</strong>
            <ul className="ml-4 space-y-1">
              <li>• ✅ Firebase project created</li>
              <li>• ✅ Authentication enabled</li>
              <li>• ✅ Google provider configured</li>
              <li>• ✅ Authorized domains added</li>
            </ul>
          </div>

          <div>
            <strong>For Firestore (Blog Posts):</strong>
            <ul className="ml-4 space-y-1">
              <li>• ⏳ Go to Firebase Console → Firestore Database</li>
              <li>• ⏳ Click "Create database"</li>
              <li>• ⏳ Choose "Start in test mode"</li>
              <li>• ⏳ Select your region</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="font-medium text-blue-900">
              🎯 Ready for Blog Migration?
            </p>
            <p className="text-blue-700 text-sm">
              Once all tests pass, you can migrate your GitHub posts to
              Firestore!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
