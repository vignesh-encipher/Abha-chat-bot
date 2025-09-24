export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');
    const mrNo = searchParams.get('mrNo');

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Build the external API URL with both prompt and mrNo parameters
    // https://qacogentamapi.encipherhealth.com/secure/
    const externalUrl = new URL('https://7ce5237ecc49.ngrok-free.app/dbservice/am/chat');
    externalUrl.searchParams.set('prompt', prompt);
    if (mrNo) {
      externalUrl.searchParams.set('mrNo', mrNo);
    }

    const response = await fetch(externalUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ',
        'ngrok-skip-browser-warning': 'true',
        'X-Role-Id': 'Summa',
        'X-Tenant': 'Summa',
        'X-Client': 'Summa',
        'X-Org': 'Summa',
        'X-Project': 'Summa',
        'X-Org-based': 'Summa',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
