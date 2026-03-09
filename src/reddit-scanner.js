import axios from 'axios';

// Reddit OAuth credentials (will come from environment variables)
let accessToken = null;
let tokenExpiry = 0;

/**
 * Gets Reddit OAuth access token
 * @param {string} clientId - Reddit app client ID
 * @param {string} clientSecret - Reddit app client secret
 * @returns {Promise<string>} Access token
 */
async function getAccessToken(clientId, clientSecret) {
  // Check if we have a valid token already
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ManifestationResearch/1.0 by Still-Jeweler-4097'
        }
      }
    );

    accessToken = response.data.access_token;
    // Token expires in 1 hour, refresh 5 minutes early
    tokenExpiry = Date.now() + (55 * 60 * 1000);
    
    console.log('✅ Reddit OAuth token obtained');
    return accessToken;

  } catch (error) {
    console.error('❌ Failed to get Reddit access token:', error.message);
    throw error;
  }
}

/**
 * Fetches recent posts from a subreddit using official Reddit API
 * @param {string} subreddit - Subreddit name (e.g., 'lawofattraction')
 * @param {number} limit - Number of posts to fetch (max 100)
 * @param {string} clientId - Reddit client ID
 * @param {string} clientSecret - Reddit client secret
 * @returns {Promise<Array>} Array of post objects
 */
export async function scanSubreddit(subreddit, limit = 20, clientId, clientSecret) {
  try {
    // Get access token
    const token = await getAccessToken(clientId, clientSecret);
    
    const url = `https://oauth.reddit.com/r/${subreddit}/new?limit=${limit}`;
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'ManifestationResearch/1.0 by Still-Jeweler-4097'
      }
    });

    const posts = response.data.data.children.map(post => {
      const data = post.data;
      
      return {
        id: data.id,
        title: data.title,
        selftext: data.selftext || '',
        author: data.author,
        subreddit: data.subreddit,
        url: `https://www.reddit.com${data.permalink}`,
        upvotes: data.ups,
        numComments: data.num_comments,
        createdUtc: data.created_utc,
        flair: data.link_flair_text || '',
        postAge: getPostAge(data.created_utc),
        upvoteRatio: data.upvote_ratio || 0
      };
    });

    console.log(`✅ Scanned r/${subreddit}: Found ${posts.length} posts`);
    return posts;
    
  } catch (error) {
    console.error(`❌ Error scanning r/${subreddit}:`, error.response?.data || error.message);
    return [];
  }
}

/**
 * Calculate how long ago a post was created
 * @param {number} createdUtc - Unix timestamp
 * @returns {string} Human-readable age (e.g., "2 hours ago")
 */
function getPostAge(createdUtc) {
  const now = Math.floor(Date.now() / 1000);
  const ageInSeconds = now - createdUtc;
  
  const hours = Math.floor(ageInSeconds / 3600);
  const minutes = Math.floor(ageInSeconds / 60);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
}

/**
 * Scans multiple subreddits
 * @param {Array<string>} subreddits - Array of subreddit names
 * @param {number} postsPerSubreddit - Posts to fetch per subreddit
 * @param {string} clientId - Reddit client ID
 * @param {string} clientSecret - Reddit client secret
 * @returns {Promise<Array>} Combined array of all posts
 */
export async function scanMultipleSubreddits(subreddits, postsPerSubreddit = 20, clientId, clientSecret) {
  console.log(`\n🔍 Scanning ${subreddits.length} subreddits with Reddit API...`);
  
  const allPosts = [];
  
  for (const subreddit of subreddits) {
    const posts = await scanSubreddit(subreddit, postsPerSubreddit, clientId, clientSecret);
    allPosts.push(...posts);
  }
  
  console.log(`\n📊 Total posts found: ${allPosts.length}\n`);
  return allPosts;
}
