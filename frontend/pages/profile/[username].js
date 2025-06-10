import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
import DashboardLayout from '../../components/DashboardLayout';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  function getAuthToken() {
    return localStorage.getItem("token");
  }

  function getUserFromToken() {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const decodedUser = jwtDecode(token);
      return {
        id: decodedUser.id || decodedUser._id || decodedUser.userId || decodedUser.sub
      };
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }

  useEffect(() => {
    async function fetchMyProfile() {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      const user = getUserFromToken();

      if (!token || !user?.id) {
        setProfile(null);
        setLoading(false);
        setError("You need to be logged in to view your profile.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          setError("Session expired. Please log in again.");
          setProfile(null);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          let message = `Error ${res.status}`;
          if (contentType?.includes("application/json")) {
            const err = await res.json();
            message = err.message || message;
          }
          throw new Error(message);
        }

        const { user: userInfo, posts, streak, receivedRequests } = await res.json();
        setProfile({
          username: userInfo.username,
          name: userInfo.name,
          bio: userInfo.bio || "",
          postsCount: posts.length,
          receivedRequestsCount: receivedRequests.length,
          streak: streak?.streak || 0,
        });
      } catch (error) {
        setError(error.message || "Failed to fetch profile.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMyProfile();
  }, [API_BASE_URL]);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto px-4 py-8 bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center text-gray-500">Loading your profile...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        ) : !profile ? (
          <div className="text-center">
            <p className="text-gray-600">Profile not found. Try logging in again.</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">{profile.name}</h1>
            <p className="text-gray-500 mb-3">@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm italic text-gray-600 mb-6">{profile.bio}</p>
            )}

            <div className="flex justify-around items-center mt-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-600">{profile.postsCount}</h3>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-600">{profile.receivedRequestsCount}</h3>
                <p className="text-sm text-gray-600">Requests</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-500">{profile.streak} 🔥</h3>
                <p className="text-sm text-gray-600">Streak</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
