const { getStore, connectLambda } = require('@netlify/blobs');

// 94 unique signups in the Sep 26 Formspree export + 3 signups since the redesign.
// The counter shows this baseline plus every new signup from here on.
const BASELINE = 97;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Required for this function style, otherwise storage can't be reached
    connectLambda(event);
    const store = getStore('mimo-counter');
    const added = parseInt(await store.get('added') || '0', 10);

    if (event.queryStringParameters?.action === 'increment') {
      const next = added + 1;
      await store.set('added', String(next));
      return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE + next }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE + added }) };
  } catch (err) {
    console.error('Counter error:', err);
    // Visitors still see the baseline, but the error is visible when checking the function directly
    return { statusCode: 200, headers, body: JSON.stringify({ count: BASELINE, error: String(err && err.message || err) }) };
  }
};
