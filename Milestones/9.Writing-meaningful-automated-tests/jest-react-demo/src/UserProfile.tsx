import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div data-testid="loading">Loading user data...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>;
  }

  if (!user) {
    return <div data-testid="no-data">No user data available</div>;
  }

  return (
    <div data-testid="user-profile">
      <h2>User Profile</h2>
      <div data-testid="user-name">Name: {user.name}</div>
      <div data-testid="user-email">Email: {user.email}</div>
      <div data-testid="user-phone">Phone: {user.phone}</div>
      <div data-testid="user-website">Website: {user.website}</div>
      <button data-testid="refresh-button" onClick={fetchUserData}>
        Refresh Data
      </button>
    </div>
  );
}
