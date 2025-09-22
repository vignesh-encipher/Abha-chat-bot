export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start') || '0';
  const end = searchParams.get('end') || '10';

  try {
    const response = await fetch(`https://3f8331aabf12.ngrok-free.app/dbservice/am/patient-list?start=${start}&end=${end}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': 'Bearer ',
        'Content-Type': 'application/json',
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Role-Id, X-Tenant, X-Client, X-Org, X-Project, X-Org-based',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch patient data' }), {
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Role-Id, X-Tenant, X-Client, X-Org, X-Project, X-Org-based',
    },
  });
}
