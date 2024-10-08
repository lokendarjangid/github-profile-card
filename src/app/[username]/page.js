'use client';
// src/app/[username]/page.js
import { FaStar, FaCodeBranch, FaUsers, FaGlobe, FaMapMarkerAlt, FaTwitter } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import CountryFlag from 'react-country-flag';

const ProfileCard = ({ params }) => {
    const { username } = params;
    const [user, setUser] = useState({
        avatar_url: '',
        name: 'Loading...',
        login: 'Loading...',
        bio: 'Loading...',
        followers: 0,
        following: 0,
        public_repos: 0,
        location: 'Loading...',
        blog: '',
        totalStars: 0,
        reposCount: 0,
        skills: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) return;

        fetch(`/api/github?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                }
            })
            .catch(() => setError('Not able to call api'));
    }, [username]);

    if (error) {
        return <p>{error}</p>;
    }

    const userWebsite = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;

    return (
        <div className="container">
            <div className="max-w-sm mx-auto bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-60 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-6 text-white">
                <ProfileHeader user={user} />
                <ProfileBio bio={user.bio} />
                <ProfileLocation location={user.location} />
                <ProfileStats user={user} />
                <ProfileWebsite blog={user.blog} userWebsite={userWebsite} />
                <ProfileAdditionalStats user={user} />
                <ProfileSkills skills={user.skills} />
            </div>
            <ShareButton user={user} />
        </div>
    );
};

const ProfileHeader = ({ user }) => (
    <div className="flex items-center mb-4">
        <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg" />
            <div className="ml-4">
                <h1 className="text-3xl font-bold">{user.name || user.login}</h1>
                <p className="text-lg text-yellow-300">@{user.login}</p>
            </div>
        </a>
    </div >
);

const ProfileBio = ({ bio }) => (
    <div className="mb-4">
        <p className="text-gray-300">{bio || "No bio available"}</p>
    </div>
);

const ProfileStats = ({ user }) => (
    <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard title="Followers" value={user.followers} icon={<FaUsers />} bgColor="bg-yellow-600" />
        <StatCard title="Following" value={user.following} icon={<FaCodeBranch />} bgColor="bg-green-600" />
        <StatCard title="Public Repos" value={user.public_repos} icon={<FaStar />} bgColor="bg-blue-600" />
    </div>
);

const StatCard = ({ title, value, icon, bgColor }) => (
    <div className={`text-center ${bgColor} p-2 rounded-lg shadow flex flex-col items-center`}>
        <div className="text-2xl mb-1">{icon}</div>
        <strong>{title}</strong>
        <p>{value}</p>
    </div>
);

const ProfileLocation = ({ location }) => (
    <div className="mb-4 flex items-center justify-between">
        <div>
            <strong>Location</strong>
            <p className="text-gray-300 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {location || "N/A"}
            </p>
        </div>
        {location && (
            <CountryFlag
                countryCode={location.split(',')[1]?.trim()}
                svg
                style={{ width: '2em', height: '2em' }}
                title={location}
            />
        )}
    </div>
);

const ProfileWebsite = ({ blog, userWebsite }) => (
    <div className="mt-2">
        <strong>Website</strong>
        <p className="flex items-center">
            <FaGlobe className="mr-2" />
            <a href={userWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {blog || "No website"}
            </a>
        </p>
    </div>
);

const ProfileAdditionalStats = ({ user }) => (
    <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard title="Total Stars" value={user.totalStars} icon={<FaStar />} bgColor="bg-red-600" />
        <StatCard title="Total Repositories" value={user.reposCount} icon={<FaCodeBranch />} bgColor="bg-purple-500" />
    </div>
);

const ProfileSkills = ({ skills }) => (
    <div className="mt-4">
        <h2 className="text-xl font-semibold">Programming Languages</h2>
        <ul className="grid grid-cols-2 gap-2 mt-2">
            {Array.isArray(skills) && skills.length > 0 ? (
                skills.map((skill, index) => (
                    <li key={index} className="bg-blue-700 text-center p-1 rounded-lg">
                        {skill}
                    </li>
                ))
            ) : (
                <li className="bg-gray-700 text-center p-1 rounded-lg">
                    No skills available
                </li>
            )}
        </ul>
    </div>
);

const ShareButton = ({ user }) => (
    <button
        className="share-button mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-all duration-300 flex items-center justify-center"
        onClick={() => shareOnSocial(user)}
    >
        <FaTwitter className="mr-2" />
        Share on Twitter
    </button>
);

const shareOnSocial = (user) => {
    const tweetText = `Check out ${user.name}'s GitHub profile! https://github.com/${user.login}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
};

export default ProfileCard;
