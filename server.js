const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4002;
app.use(cors());
app.use(express.json());

const createdItemsFile = path.join(__dirname, 'created_items.json');
if (!fs.existsSync(createdItemsFile)) fs.writeFileSync(createdItemsFile, '[]');
function getCreatedItems() { return JSON.parse(fs.readFileSync(createdItemsFile)); }
function saveCreatedItems(i) { fs.writeFileSync(createdItemsFile, JSON.stringify(i, null, 2)); }

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
app.get('/api/packages/:name/lineitems', (req, res) => {
  const items = PACKAGES[req.params.name];
  if (!items) return res.status(404).json({ error: 'Not found' });
  res.json(items);
});
app.post('/api/lineitems/create', (req, res) => {
  const created = (req.body.items || []).map(item => ({
    uniqueId: `LI-${Math.floor(Math.random()*90000)+10000}`,
    ...item,
    createdAt: new Date().toISOString()
  }));
  const existing = getCreatedItems();
  existing.push(...created);
  saveCreatedItems(existing);
  res.json({ success: true, created });
});
app.get('/api/lineitems', (req, res) => res.json(getCreatedItems()));
app.patch('/api/lineitems/:id', (req, res) => {
  const items = getCreatedItems();
  const idx = items.findIndex(i => i.uniqueId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  saveCreatedItems(items);
  res.json(items[idx]);
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
  });
}

app.listen(PORT, () => console.log(`Adbook running on port ${PORT}`));
