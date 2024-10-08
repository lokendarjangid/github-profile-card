export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
    }

    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            const errorMessage = errorData.message || 'User not found';
            let status;

            switch (userResponse.status) {
                case 403:
                    status = errorMessage.includes('API rate limit exceeded') ? 403 : 403;
                    break;
                case 404:
                    status = 404;
                    break;
                case 500:
                    status = 500;
                    break;
                default:
                    status = userResponse.status;
            }

            return new Response(JSON.stringify({ error: errorMessage }), { status });
        }

        const userData = await userResponse.json();
        const reposResponse = await fetch(userData.repos_url);
        const reposData = await reposResponse.json();

        let totalStars = 0;
        let totalForks = 0;
        const languages = new Set();
        let totalContributions = 0;

        const fetchCommits = async (repo) => {
            const commitsResponse = await fetch(`${repo.commits_url.replace('{/sha}', '')}?author=${username}`);
            if (commitsResponse.ok) {
                const commitsData = await commitsResponse.json();
                return commitsData.length;
            }
            return 0;
        };

        for (const repo of reposData) {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            if (repo.language) {
                languages.add(repo.language);
            }

            const contributions = await fetchCommits(repo);
            totalContributions += contributions;
        }

        const userProfile = {
            ...userData,
            totalStars,
            totalForks,
            reposCount: reposData.length,
            totalContributions,
            skills: Array.from(languages),
        };

        return new Response(JSON.stringify(userProfile), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
    }
}
