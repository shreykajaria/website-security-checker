async function scanWebsite() {
  const domain = document.getElementById('domain').value.trim();
  const results = document.getElementById('results');
  results.innerHTML = '⏳ Scanning...';

  try {
    const response = await fetch('https://website-security-checker.onrender.com/scan', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain })
    });

    const data = await response.json();

    if (!data.success) {
      results.innerHTML = `<p style="color: red;">❌ Error: ${data.error}</p>`;
      return;
    }

    const { ssl, headers, cms, whois } = data.data;
    results.innerHTML = `
      <h3>✅ Scan Complete</h3>
      <p><strong>CMS:</strong> ${cms}</p>
      <h4>SSL Info</h4>
      <pre>${JSON.stringify(ssl, null, 2)}</pre>
      <h4>Headers</h4>
      <pre>${JSON.stringify(headers, null, 2)}</pre>
      <h4>WHOIS Info</h4>
      <pre>${JSON.stringify(whois, null, 2)}</pre>
    `;
  } catch (err) {
    results.innerHTML = `<p style="color: red;">❌ Error: ${err.message}</p>`;
  }
} 
