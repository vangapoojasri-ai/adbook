const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 4002;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage
let createdItems = [];

// Sheet IDs
const ADBOOK_SHEET_ID = process.env.ADBOOK_SHEET_ID || '1MNb13kteliu8oIWHNeRtCIL-2VoeQXJxxY6BtlLLXo8';
const JAMI_SHEET_ID = process.env.JAMI_SHEET_ID || '1gJV6r7BcWdkslSmjW9v6QqxHHxFirGPlM-6Ykevqnkg';

async function getSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

// Write line items to Sheet 2
async function writeLineItemsToSheet(items) {
  try {
    const sheets = await getSheetsClient();
    const rows = items.map(item => [
      item.uniqueId,
      item.dealsheetName || 'N/A',
      item.clientName || 'N/A',
      item.lineItemName,
      item.package,
      item.reach_sends || 'N/A',
      item.reach_impressions || 'N/A',
      item.reach_views || 'N/A',
      item.internal_rate || 'N/A',
      item.internal_quantity || 'N/A',
      item.internal_revenue_allocation || 'N/A',
      item.external_rate_type || 'N/A',
      item.external_net_cost || 'N/A',
      item.creative_format || 'N/A',
      item.creative_lives_on || 'N/A',
      item.creative_supplied_by || 'N/A',
      item.creative_clicks_out_to || 'N/A',
      item.hard_cost_budget || 'N/A',
      item.hard_cost_rate || 'N/A',
      item.hard_cost_tied_to || 'N/A',
      item.createdAt
    ]);
    await sheets.spreadsheets.values.append({
      spreadsheetId: ADBOOK_SHEET_ID,
      range: 'Sheet1!A:U',
      valueInputOption: 'RAW',
      requestBody: { values: rows }
    });
  } catch (err) {
    console.error('Google Sheets write error:', err.message);
  }
}

// Delete line items from Sheet 2 by dealsheet name
async function deleteLineItemsFromSheet(dealsheetName) {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: ADBOOK_SHEET_ID,
      range: 'Sheet1!A:U'
    });
    const rows = res.data.values || [];
    // Find rows to delete (column B = dealsheetName)
    const rowsToDelete = rows
      .map((r, i) => ({ row: r, index: i + 1 }))
      .filter(r => r.row[1] === dealsheetName)
      .map(r => r.index)
      .reverse();

    for (const rowIndex of rowsToDelete) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: ADBOOK_SHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      });
    }
  } catch (err) {
    console.error('Google Sheets delete error:', err.message);
  }
}

// Update Jami ticket status
async function updateJamiTicketStatus(ticketId, status) {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: JAMI_SHEET_ID,
      range: 'Sheet1!A:F'
    });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] === ticketId);
    if (rowIndex === -1) return;
    await sheets.spreadsheets.values.update({
      spreadsheetId: JAMI_SHEET_ID,
      range: `Sheet1!F${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[status]] }
    });
  } catch (err) {
    console.error('Jami sheet update error:', err.message);
  }
}

const PACKAGES = {
  "Atlantic Newsletter Sponsorship": ["The Atlantic Daily","This Week","The Books Briefing","The Atlantic Photo","The Weekly Planet","One Story to Read","Wonder Reader","How to Build a Life","Up for Debate","The Good Word","Work in Progress","Dear Therapist","Galaxy Brain","Famous People","Limited Edition"],
  "Atlantic E-Blast": ["E-Blast"],
  "Atlantic Newsletter ROS": ["Box / Billboard","Native Driver"],
  "Apple News ROS": ["Native Driver","Standard Banners","Outstream Video"],
  "The Atlantic App": ["Box"],
  "TheAtlantic.com Sponsorship": ["Custom Content Landing Page","Editorial Content Roadblock","Grant"],
  "TheAtlantic.com ROS": ["Native Driver","Impact Unit","Outstream Video","Mobile Vertical Ad","Box / Leaderboard / Billboard"],
  "TheAtlantic.com Contextual": ["Native Driver","Impact Unit","Outstream Video","Mobile Vertical Ad","Box / Leaderboard / Billboard"],
  "TheAtlantic.com Audience": ["Native Driver","Impact Unit","Outstream Video","Mobile Vertical Ad","Box / Leaderboard / Billboard"],
  "TheAtlantic.com Takeover": ["Homepage","Ideas Landing Page","Politics Landing Page","Culture Landing Page","Family Landing Page","Health Landing Page","Science Landing Page","Technology Landing Page","Books Landing Page","Education Landing Page","Business Landing Page"],
  "Atlantic Audio": ["Podcast Sponsorship","Narrated Article Sponsorship","Rotational Pre/Mid/Post Roll"],
  "The Atlantic Magazine": ["Cover 2 Page 1","Cover 4","Cover 3","TOC 1","TOC 2","ROB Half Page","ROB Full Page","ROB Spread"],
  "Off Network": ["Paid Distribution","Audience Extension","Speaking Fee"],
  "O&O Packages": ["Editorial Sponsorship Package","Custom Content Package","Homepage Takeover Package","Culture Section Front Package","Family Section Front Package","Health Section Front Package","Science Section Front Package","Tech Section Front Package","Media Supporting Event Package","Impact Unit Package","Standard Banner Package","Print Package","Event Package"],
  "AtlanticLIVE": ["Event Fee","Grant"],
  "Production": ["Content / Asset Creation","Brand Study"]
};

app.get('/api/packages', (req, res) => res.json(PACKAGES));

// Create line items
app.post('/api/lineitems/create', async (req, res) => {
  try {
    const { items } = req.body;
    const created = items.map(item => ({
      uniqueId: `LI-${Math.floor(Math.random() * 90000) + 10000}`,
      ...item,
      createdAt: new Date().toISOString()
    }));
    createdItems.push(...created);
    await writeLineItemsToSheet(created);
    res.json({ success: true, created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all line items
app.get('/api/lineitems', (req, res) => res.json(createdItems));

// Update line item
app.patch('/api/lineitems/:id', (req, res) => {
  const idx = createdItems.findIndex(i => i.uniqueId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  createdItems[idx] = { ...createdItems[idx], ...req.body };
  res.json(createdItems[idx]);
});

// Delete line items by dealsheet name (Don't Add)
app.delete('/api/lineitems/dealsheet/:name', async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  createdItems = createdItems.filter(i => i.dealsheetName !== name);
  await deleteLineItemsFromSheet(name);
  res.json({ success: true, message: `Deleted all line items for ${name}` });
});

// Mark Jami ticket as finished
app.patch('/api/jami/tickets/:id/finish', async (req, res) => {
  await updateJamiTicketStatus(req.params.id, 'Finished');
  res.json({ success: true });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
  });
}

app.listen(PORT, () => console.log(`Adbook running on port ${PORT}`));
