import Anthropic from '@anthropic-ai/sdk';

const COMMENT_STYLE_GUIDE = `
You are drafting Reddit comments for manifestation subreddits in a very specific writing style.

## YOUR WRITING VOICE:
- Conversational, supportive, like talking to a friend
- Use manifestation community language naturally: "living in the end", "bridge of incidents", "3D/4D", "affirming", "subconscious"
- Empathetic but direct - point out what's working AND what might be blocking them
- 2-4 sentences MAX
- CRITICAL: Always use 2 sentences, then a blank line, then 1-2 more sentences if needed

## FORMATTING RULE (MOST IMPORTANT):
Write exactly 2 sentences. Then add a blank line. Then optionally 1-2 more sentences.

Example structure:
"First insight sentence. Second supporting sentence.

Optional third sentence for actionable advice."

## EXAMPLES OF YOUR STYLE:

Example 1:
"8 months is a long time to hold the vision – that takes real commitment. But here's what jumped out: 'opportunities knock, things get finalised, then cancelled at the last moment.'

That's not the Universe blocking you. That's you expecting the last-minute cancellation."

Example 2:
"Wait, you visualized your crush specifically, but then played subliminals about 'pulling guys' in general?

Girl, that's like telling the Universe two different things at once. The subliminals are probably overpowering your specific visualization because you're listening to them repeatedly."

Example 3:
"I love the handwriting aesthetic too. Something about seeing it written out makes it hit different than typing it on your phone.

What helps me is getting personalized ones at 11:11 AM every day — same energy as this, but tailored to what I'm manifesting."

Example 4:
"Oh my god, yes, I deal with this too. A week before my period, I can go from 'I'm a manifestation goddess' to 'nothing works, and my life is a mess' in like 24 hours.

But here's what helped me stop spiraling about it - those few days aren't erasing your progress. You're not starting over every month."

## MENTION 11:11 DAILY REMINDERS SUBTLY:
In ~30% of comments, naturally mention "daily reminders at 11:11 AM" or "personalized notes" as something that helped you. Make it conversational, not promotional.

Examples:
- "What helped me was daily reminders that treated money as already mine. I used 11:11 AM as my anchor..."
- "I get personalized ones at 11:11 AM every day — same energy as this, but tailored to what I'm manifesting"

## NEVER:
- Say "check out my app" or be promotional
- Offer to DM in public comments
- Give generic advice
- Write in paragraphs (always 2 sentences + space + optional 1-2 sentences)
- Sound like a bot or AI

## YOUR TASK:
Read the post carefully. Identify the core issue or what they're celebrating. Write a comment in this exact style that adds genuine value.
`;

/**
 * Analyzes a Reddit post and generates a personalized comment
 * @param {Object} post - Reddit post object
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<Object>} Analysis result with comment draft
 */
export async function analyzePost(post, apiKey) {
  const anthropic = new Anthropic({ apiKey });

  const prompt = `Analyze this Reddit post from r/${post.subreddit} and decide if it's worth commenting on.

POST TITLE: ${post.title}

POST CONTENT:
${post.selftext || '(No text content - title only)'}

POST METADATA:
- Upvotes: ${post.upvotes}
- Comments: ${post.numComments}
- Age: ${post.postAge}
- Flair: ${post.flair || 'None'}

ANALYSIS TASK:
1. Is this worth commenting on? (Yes/No)
   - Skip if: spam, low-effort, meme, purely positive (no advice needed), or too vague
   - Comment if: genuine question, struggle, specific manifestation story, seeking advice

2. Should we consider DMing this person? (Yes/No)
   - DM-worthy if: shows specific goal (SP, money, career), emotional investment, under 10 comments, posted recently
   - NOT DM-worthy if: just celebrating, vague post, lots of existing comments

3. If worth commenting: Draft a comment in the exact style described above

RESPOND IN THIS FORMAT:
WORTH_COMMENTING: Yes/No
DM_RECOMMENDATION: Yes/No
DM_REASON: (one sentence explaining why or why not)

DRAFT_COMMENT:
(your comment here - follow the 2 sentences + space + optional 1-2 sentences format)
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: COMMENT_STYLE_GUIDE + '\n\n' + prompt
      }]
    });

    const response = message.content[0].text;
    
    // Parse the response
    const worthCommenting = response.includes('WORTH_COMMENTING: Yes');
    const dmRecommendation = response.includes('DM_RECOMMENDATION: Yes');
    
    const dmReasonMatch = response.match(/DM_REASON: (.+)/);
    const dmReason = dmReasonMatch ? dmReasonMatch[1].trim() : 'N/A';
    
    const commentMatch = response.match(/DRAFT_COMMENT:\s*([\s\S]+)$/);
    const draftComment = commentMatch ? commentMatch[1].trim() : '';

    return {
      worthCommenting,
      dmRecommendation: dmRecommendation ? 'Yes' : 'No',
      dmReason,
      draftComment,
      action: worthCommenting ? (dmRecommendation ? 'Comment + DM' : 'Comment') : 'Skip'
    };

  } catch (error) {
    console.error('❌ Error analyzing post:', error.message);
    return {
      worthCommenting: false,
      dmRecommendation: 'No',
      dmReason: 'Analysis failed',
      draftComment: '',
      action: 'Skip'
    };
  }
}

/**
 * Analyzes multiple posts in batch
 * @param {Array} posts - Array of Reddit post objects
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<Array>} Array of analyzed posts with comments
 */
export async function analyzePosts(posts, apiKey) {
  console.log(`\n🤖 Analyzing ${posts.length} posts with Claude AI...\n`);
  
  const analyzedPosts = [];
  let commentCount = 0;
  let dmCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] Analyzing: "${post.title.substring(0, 60)}..."`);
    
    const analysis = await analyzePost(post, apiKey);
    
    if (analysis.worthCommenting) {
      commentCount++;
      if (analysis.dmRecommendation === 'Yes') {
        dmCount++;
      }
      
      analyzedPosts.push({
        ...post,
        ...analysis
      });
      
      console.log(`   ✅ ${analysis.action}`);
    } else {
      console.log(`   ⏭️  Skipped`);
    }
    
    // Small delay between API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Analysis Complete:`);
  console.log(`   - Posts worth commenting: ${commentCount}`);
  console.log(`   - DM opportunities: ${dmCount}\n`);

  return analyzedPosts;
}
