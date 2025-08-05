const express = require('express');
const axios = require('axios');
const sslChecker = require('ssl-checker');
const whois = require('whois-json');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { domain } = req.body;
  const url = `https://${domain}`;
  let result = {
    ssl: {},
    headers: {},
    cms: null,
    whois: {}
  };

  try {
    const ssl = await sslChecker(domain);
    result.ssl = ssl;

    const response = await axios.get(url);
    result.headers = response.headers;

    const $ = cheerio.load(response.data);
    if (
      $('meta[name="generator"]').attr('content')?.toLowerCase().includes("wordpress") ||
      response.data.includes("wp-content") ||
      response.data.includes("wp-includes")
    ) {
      result.cms = "WordPress (Detected)";
    } else {
      result.cms = "Unknown / Not Detected";
    }

    result.whois = await whois(domain);

    res.json({ success: true, data: result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
