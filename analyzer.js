const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/analyze', (req, res) => {
  const { session } = req.body;
  if (!session) {
    return res.status(400).json({ error: 'Missing session data' });
  }
  const jsonStr = JSON.stringify(session).replace(/'/g, "\\'");
  exec(`python3 app/deepseek.py '${jsonStr}'`, (error, stdout, stderr) => {
    if (error) {
      console.error('Exec error', error);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) console.error('Python stderr', stderr);
    let analysis;
    try {
      analysis = JSON.parse(stdout);
    } catch (e) {
      analysis = stdout.trim();
    }
    res.json({ analysis });
  });
});

const port = 5001;
app.listen(port, () => console.log(`Analyzer server listening at http://localhost:${port}`));
