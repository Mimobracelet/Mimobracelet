const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const store = getStore({ name: 'mimo-counter', consistency: 'strong' });
    const action = event.queryStringParameters?.action;

    if (action === 'increment') {
      const current = await store.get('count') || '0';
      const newCount = parseInt(current) + 1;
      await store.set('count', String(newCount));
      return { statusCode: 200, headers, body: JSON.stringify({ count: newCount }) };
    }

    const current = await store.get('count') || '0';
    return { statusCode: 200, headers, body: JSON.stringify({ count: parseInt(current) }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 200, headers, body: JSON.stringify({ count: 0 }) };
  }
};
