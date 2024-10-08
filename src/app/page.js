'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [username, setUsername] = useState('');
  const [cardCount, setCardCount] = useState(0);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      setCardCount(cardCount + 1);
      router.push(`/${username}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">GitHub Profile Card Generator</h1>
        <p className="text-center text-gray-700 mb-4">Total Cards Generated: {cardCount}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Generate Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;