const { getStore } = require('@netlify/blobs');

// Unique waitlist signups from the Formspree export (Apr 21 – Sep 26, 2026).
// The counter shows this baseline plus every new signup since.
const BASELINE = 94;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const store = getStore({ name: 'mimo-counter', consistency: 'strong' });
    const added = parseInt(await store.get('count') || '0');

    if (event.queryStringParameters?.action === 'increment') {
      const next = added + 1;
      await store.set('count', String(next));
      return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE + next }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE + added }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE }) };
  }
};
