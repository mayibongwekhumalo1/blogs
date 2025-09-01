"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, getSession } from 'next-auth/react';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (confirmation !== 'DELETE') {
      setError('Please type &quot;DELETE&quot; to confirm account deletion');
      setIsLoading(false);
      return;
    }

    try {
      const session = await getSession();
      if (!session?.user?.email) {
        setError('You must be logged in to delete your account');
        setIsLoading(false);
        return;
      }

      // Verify email matches current user
      if (email !== session.user.email) {
        setError('Email does not match your account email');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Your account and all associated data have been successfully deleted.');
        // Sign out the user
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete account');
      }
    } catch {
      setError('An error occurred while deleting your account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Delete Account
        </h1>

        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Warning</h3>
          <p className="text-red-700 text-sm">
            This action cannot be undone. All your data, including posts, comments, and account information will be permanently deleted.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Your Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Type &quot;DELETE&quot; to confirm
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type DELETE"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? 'Deleting Account...' : 'Delete My Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Changed your mind?{' '}
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}