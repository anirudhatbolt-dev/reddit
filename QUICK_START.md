# 🚀 Quick Start Checklist

Follow these steps in order:

## ✅ Pre-Setup (5 minutes)

- [ ] Have your Anthropic API key ready
- [ ] Have your Google Sheet URL ready
- [ ] Make sure your Google Sheet has "Editor" access set to "Anyone with the link"

---

## 1️⃣ Google Service Account (5 minutes)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project
- [ ] Enable Google Sheets API
- [ ] Create Service Account named "reddit-scanner"
- [ ] Download JSON key file
- [ ] Copy the `client_email` from JSON file
- [ ] Share your Google Sheet with that email (Editor access)

---

## 2️⃣ Create GitHub Repository (2 minutes)

- [ ] Go to [GitHub](https://github.com/new)
- [ ] Name: `reddit-manifestation-scanner`
- [ ] Set to **Private**
- [ ] Don't initialize with README
- [ ] Create repository

---

## 3️⃣ Upload Files (3 minutes)

- [ ] Download all files from the `reddit-scanner` folder I provided
- [ ] Upload to GitHub via web interface OR use git commands
- [ ] Verify all files are uploaded (check for `.github/workflows/evening-scan.yml`)

---

## 4️⃣ Add GitHub Secrets (3 minutes)

Go to your repository → Settings → Secrets and variables → Actions

Add these 3 secrets:

- [ ] **ANTHROPIC_API_KEY** = `your_key_here`
- [ ] **GOOGLE_SHEET_ID** = `15J_Y3ACSeQ1aduWJXKmK-HESwyqZDzgTGjghSBgfJKI`
- [ ] **GOOGLE_SERVICE_ACCOUNT_JSON** = `{entire JSON file contents as one line}`

---

## 5️⃣ Test Run (2 minutes)

- [ ] Go to Actions tab
- [ ] Click "Evening Reddit Scan"
- [ ] Click "Run workflow" → "Run workflow"
- [ ] Wait 3-5 minutes
- [ ] Check your Google Sheet for results!

---

## 🎉 Success!

If you see rows in your Google Sheet with draft comments, you're all set!

The workflow will now run automatically at **4:30 PM IST** every day.

---

## ⏭️ Next Steps

1. Review the sheet between 5-8 PM IST
2. Copy-paste comments to Reddit
3. Update Status column (Pending → Posted)
4. Track what works best

---

## 🐛 Something Not Working?

**Google Sheets error?**
- Verify you shared the sheet with the service account email
- Check that it has "Editor" access, not "Viewer"

**Workflow not running?**
- Check all 3 secrets are added in GitHub
- Names must match exactly (case-sensitive)

**No posts found?**
- Reddit may be rate-limiting
- Wait 30 min and run again

**Check logs:**
- Go to Actions tab → Click on the workflow run → Click on "scan-reddit" job
- Look for error messages in red

---

**Total setup time: ~20 minutes** ⏱️
