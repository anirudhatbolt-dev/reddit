import 'dotenv/config';
import { scanMultipleSubreddits } from './reddit-scanner.js';
import { analyzePosts } from './claude-analyzer.js';
import { writeToGoogleSheets } from './sheets-logger.js';

// Configuration
const TARGET_SUBREDDITS = [
  'lawofattraction',
  'Manifestation',
  'NevilleGoddard'
];

const POSTS_PER_SUBREDDIT = 15; // Scan top 15 posts from each subreddit

async function main() {
  console.log('🚀 Reddit Manifestation Scanner Starting...\n');
  console.log('⏰ Time:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'IST\n');
  
  // Validate environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Missing ANTHROPIC_API_KEY in environment');
    process.exit(1);
  }
  
  if (!process.env.GOOGLE_SHEET_ID) {
    console.error('❌ Missing GOOGLE_SHEET_ID in environment');
    process.exit(1);
  }
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error('❌ Missing GOOGLE_SERVICE_ACCOUNT_JSON in environment');
    process.exit(1);
  }

  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
    console.error('❌ Missing REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET in environment');
    process.exit(1);
  }

  try {
    // Parse Google service account credentials
    const serviceAccountCreds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    
    // Step 1: Scan Reddit using OAuth
    const posts = await scanMultipleSubreddits(
      TARGET_SUBREDDITS, 
      POSTS_PER_SUBREDDIT,
      process.env.REDDIT_CLIENT_ID,
      process.env.REDDIT_CLIENT_SECRET
    );
    
    if (posts.length === 0) {
      console.log('⚠️  No posts found. Exiting.');
      return;
    }
    
    // Step 2: Analyze with Claude
    const analyzedPosts = await analyzePosts(posts, process.env.ANTHROPIC_API_KEY);
    
    if (analyzedPosts.length === 0) {
      console.log('⚠️  No posts worth commenting on. Exiting.');
      return;
    }
    
    // Step 3: Write to Google Sheets
    const success = await writeToGoogleSheets(
      analyzedPosts,
      process.env.GOOGLE_SHEET_ID,
      serviceAccountCreds
    );
    
    if (success) {
      console.log('✅ All done! Check your Google Sheet for opportunities.\n');
    } else {
      console.log('❌ Failed to write to Google Sheets.\n');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
