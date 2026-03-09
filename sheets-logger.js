import { GoogleSpreadsheet } from 'google-spreadsheet';

/**
 * Writes analyzed posts to Google Sheets
 * @param {Array} posts - Analyzed posts with draft comments
 * @param {string} sheetId - Google Sheet ID
 * @param {Object} serviceAccountCreds - Google service account credentials
 */
export async function writeToGoogleSheets(posts, sheetId, serviceAccountCreds) {
  try {
    console.log('\n📊 Writing to Google Sheets...');
    
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountCreds);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0]; // First sheet
    
    // Get current row count to start serial numbers
    const rows = await sheet.getRows();
    let serialNumber = rows.length + 1;
    
    // Prepare rows for batch insert
    const newRows = posts.map(post => ({
      Serial: serialNumber++,
      Timestamp: new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Kolkata',
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      Subreddit: `r/${post.subreddit}`,
      'Post URL': post.url,
      upvotes: post.upvotes,
      comments: post.numComments,
      'Draft Comment': post.draftComment,
      'DM recommendation': post.dmRecommendation,
      Status: 'Pending'
    }));
    
    await sheet.addRows(newRows);
    
    console.log(`✅ Added ${newRows.length} opportunities to Google Sheets`);
    console.log(`📋 Sheet URL: https://docs.google.com/spreadsheets/d/${sheetId}\n`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error writing to Google Sheets:', error.message);
    return false;
  }
}

/**
 * Gets the current status counts from the sheet
 * @param {string} sheetId - Google Sheet ID
 * @param {Object} serviceAccountCreds - Google service account credentials
 */
export async function getSheetStats(sheetId, serviceAccountCreds) {
  try {
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountCreds);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const stats = {
      total: rows.length,
      pending: rows.filter(r => r.get('Status') === 'Pending').length,
      posted: rows.filter(r => r.get('Status') === 'Posted').length,
      skipped: rows.filter(r => r.get('Status') === 'Skipped').length
    };
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error getting sheet stats:', error.message);
    return null;
  }
}
