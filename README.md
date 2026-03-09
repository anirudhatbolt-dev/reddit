# Reddit Manifestation Scanner 🔮

Automatically scans manifestation subreddits, analyzes posts with Claude AI, and drafts personalized comments for manual review.

## 🎯 What This Does

1. **Scans Reddit** - Fetches latest posts from r/lawofattraction, r/Manifestation, r/NevilleGoddard
2. **Analyzes with Claude** - Identifies which posts are worth commenting on
3. **Drafts Comments** - Generates personalized responses in your unique writing style
4. **Logs to Google Sheets** - Outputs everything for your manual review
5. **Runs on Schedule** - Automatically executes at 4:30 PM IST daily (via GitHub Actions)

---

## 📦 What You'll Get

A Google Sheet filled with:
- Post URLs ready to click
- Draft comments ready to copy-paste
- DM recommendations (Yes/No)
- Status tracking (Pending/Posted/Skipped)

---

## 🚀 Setup Instructions

### Step 1: Create Google Service Account (5 minutes)

This allows the bot to write to your Google Sheet.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "Reddit Scanner" or anything)
3. Enable Google Sheets API:
   - Search for "Google Sheets API" in the search bar
   - Click "Enable"
4. Create Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `reddit-scanner`
   - Click "Create and Continue"
   - Skip optional steps, click "Done"
5. Create Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON"
   - Download the JSON file (keep this safe!)
6. **Share your Google Sheet with the service account:**
   - Open the JSON file
   - Copy the `client_email` value (looks like `reddit-scanner@...gserviceaccount.com`)
   - Go to your Google Sheet
   - Click "Share"
   - Paste the service account email
   - Give it "Editor" access
   - Uncheck "Notify people"
   - Click "Share"

---

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new **private** repository
3. Name it: `reddit-manifestation-scanner`
4. **Do NOT initialize with README**
5. Click "Create repository"

---

### Step 3: Upload Code to GitHub

You have two options:

#### Option A: Upload via GitHub Web Interface (Easiest)

1. On your new repository page, click "uploading an existing file"
2. Drag and drop ALL the files from the `reddit-scanner` folder I gave you
3. Commit the files

#### Option B: Use Git Command Line

```bash
cd reddit-scanner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/reddit-manifestation-scanner.git
git push -u origin main
```

---

### Step 4: Add GitHub Secrets

These are your API keys - stored securely in GitHub.

1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** and add each of these:

#### Secret 1: `ANTHROPIC_API_KEY`
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** Your Anthropic API key (starts with `sk-ant-...`)

#### Secret 2: `GOOGLE_SHEET_ID`
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** `15J_Y3ACSeQ1aduWJXKmK-HESwyqZDzgTGjghSBgfJKI`

#### Secret 3: `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Name:** `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Value:** 
  - Open the JSON file you downloaded from Google Cloud
  - Copy the ENTIRE contents (it's one big JSON object)
  - Paste it here as one line
  - Make sure there are no extra spaces or line breaks

---

### Step 5: Test the Workflow

1. Go to **Actions** tab in your GitHub repository
2. Click on "Evening Reddit Scan" workflow
3. Click "Run workflow" (dropdown button)
4. Click the green "Run workflow" button
5. Wait 2-5 minutes
6. Check your Google Sheet - it should be filled with opportunities!

---

## 📅 Schedule

The workflow runs automatically at:
- **4:30 PM IST** (11:00 AM UTC) every day

This catches fresh US morning posts (6-9 AM EST).

You can also trigger it manually anytime from the GitHub Actions tab.

---

## 🎯 Target Subreddits

Currently scans:
- r/lawofattraction
- r/Manifestation
- r/NevilleGoddard

**To add more:** Edit `src/index.js` and add to the `TARGET_SUBREDDITS` array.

---

## 📊 Google Sheet Columns

| Column | Description |
|--------|-------------|
| Serial | Auto-incrementing number |
| Timestamp | When the scan ran (IST) |
| Subreddit | Which subreddit the post is from |
| Post URL | Direct link to Reddit post |
| upvotes | Number of upvotes |
| comments | Number of existing comments |
| Draft Comment | AI-generated comment in your style |
| DM recommendation | Yes/No (should you DM this person?) |
| Status | Pending/Posted/Skipped (you update this manually) |

---

## 🔧 Customization

### Change Scanning Frequency

Edit `.github/workflows/evening-scan.yml`:

```yaml
schedule:
  # Run twice daily: 6 AM IST and 4:30 PM IST
  - cron: '30 0 * * *'   # 6:00 AM IST
  - cron: '0 11 * * *'   # 4:30 PM IST
```

### Change Number of Posts Scanned

Edit `src/index.js`:

```javascript
const POSTS_PER_SUBREDDIT = 20; // Change this number
```

### Modify Comment Style

Edit `src/claude-analyzer.js` and update the `COMMENT_STYLE_GUIDE` section with your preferences.

---

## 🐛 Troubleshooting

### "Error writing to Google Sheets"
- Make sure you shared the sheet with the service account email (from the JSON file)
- Make sure the sheet is set to "Editor" access, not "Viewer"

### "Missing ANTHROPIC_API_KEY"
- Check that you added all 3 secrets in GitHub Settings → Secrets
- Secret names must match exactly (case-sensitive)

### "No posts found"
- Reddit might be rate-limiting. Wait 30 minutes and try again.
- Check if the subreddits are spelled correctly in `src/index.js`

### Workflow not running automatically
- GitHub Actions may be disabled. Go to Settings → Actions → General
- Make sure "Allow all actions and reusable workflows" is selected

---

## 📈 Usage Tips

1. **Review the sheet daily** between 5-8 PM IST
2. **Copy-paste comments** directly from the sheet to Reddit
3. **Update Status column** after posting (Pending → Posted)
4. **Skip low-quality opportunities** by marking them as "Skipped"
5. **Track which comments get engagement** to refine your style

---

## 🔐 Security

- All API keys stored as GitHub Secrets (encrypted)
- Google Service Account only has access to your one sheet
- Repository is private by default
- No credentials stored in code files

---

## 📝 License

MIT

---

## 💡 Need Help?

- Check GitHub Actions logs if something fails
- Make sure all 3 secrets are added correctly
- Verify Google Sheet is shared with service account email

---

**Built for manifestation community engagement 🔮✨**
