import axios from 'axios';

/**
 * Fetches recent posts from a subreddit using public JSON endpoint
 * @param {string} subreddit - Subreddit name (e.g., 'lawofattraction')
 * @param {number} limit - Number of posts to fetch (max 25)
 * @returns {Promise<Array>} Array of post objects
 */
export async function scanSubreddit(subreddit, limit = 20) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/new/.json?limit=${limit}`;
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'ManifestationResearchTool/1.0'
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
        postAge: getPostAge(data.created_utc)
      };
    });

    console.log(`✅ Scanned r/${subreddit}: Found ${posts.length} posts`);
    return posts;
    
  } catch (error) {
    console.error(`❌ Error scanning r/${subreddit}:`, error.message);
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
 * @returns {Promise<Array>} Combined array of all posts
 */
export async function scanMultipleSubreddits(subreddits, postsPerSubreddit = 20) {
  console.log(`\n🔍 Scanning ${subreddits.length} subreddits...`);
  
  const allPosts = [];
  
  for (const subreddit of subreddits) {
    const posts = await scanSubreddit(subreddit, postsPerSubreddit);
    allPosts.push(...posts);
  }
  
  console.log(`\n📊 Total posts found: ${allPosts.length}\n`);
  return allPosts;
}
