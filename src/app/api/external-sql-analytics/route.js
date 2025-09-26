export async function GET(request) {
  console.log('External SQL Analytics API route called');
  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get('question');
    const mrNo = searchParams.get('mrNo');
    
    console.log('External SQL Analytics API called with:', { question, mrNo });

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const baseUrl = 'https://semiallegorical-resting-rubi.ngrok-free.dev/api/v0';
    let sqlId = null;
    let finalResponse = {
      sql: null,
      data: null,
      summary: null,
      chart: null,
      shouldGenerateChart: false
    };

    try {
      // Step 1: Generate SQL
      console.log('Step 1: Generating SQL for question:', question, 'mrNo:', mrNo);
      
      // Build the question with mrNo if provided
      let fullQuestion = question;
      if (mrNo) {
        fullQuestion = `${question} for mrno: ${mrNo}`;
      }
      
      console.log('Making request to:', `${baseUrl}/generate_sql?question=${encodeURIComponent(fullQuestion)}`);
      
      const generateSqlResponse = await fetch(`${baseUrl}/generate_sql?question=${encodeURIComponent(fullQuestion)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'JSESSIONID.655a5d7d=node0125lr9dsbrmblu8xby3nlblir17.node0',
        },
      });

      if (!generateSqlResponse.ok) {
        const errorText = await generateSqlResponse.text();
        console.error('Generate SQL Error:', errorText);
        throw new Error(`Generate SQL failed: ${generateSqlResponse.status} - ${errorText}`);
      }

      const sqlData = await generateSqlResponse.json();
      console.log('SQL generated:', sqlData);
      
      finalResponse.sql = sqlData;
      sqlId = sqlData.id;

      // Step 2: Run SQL
      console.log('Step 2: Running SQL with ID:', sqlId);
      const runSqlResponse = await fetch(`${baseUrl}/run_sql?id=${sqlId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!runSqlResponse.ok) {
        const errorText = await runSqlResponse.text();
        console.error('Run SQL Error:', errorText);
        throw new Error(`Run SQL failed: ${runSqlResponse.status} - ${errorText}`);
      }

      const runData = await runSqlResponse.json();
      console.log('SQL executed:', runData);
      
      finalResponse.data = runData;
      finalResponse.shouldGenerateChart = runData.should_generate_chart;

      // Step 3 & 4: Generate summary and chart if needed
      if (runData.should_generate_chart) {
        console.log('Step 3: Generating summary');
        
        // Generate summary
        const summaryResponse = await fetch(`${baseUrl}/generate_summary?id=${sqlId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          console.log('Summary generated:', summaryData);
          finalResponse.summary = summaryData;
        }

        console.log('Step 4: Generating plotly figure');
        
        // Generate plotly figure
        const plotlyResponse = await fetch(`${baseUrl}/generate_plotly_figure?id=${sqlId}&chart_type=line`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (plotlyResponse.ok) {
          const plotlyData = await plotlyResponse.json();
          console.log('Plotly figure generated:', plotlyData);
          finalResponse.chart = plotlyData;
        }
      }

      return new Response(JSON.stringify({
        success: true,
        data: finalResponse
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } catch (apiError) {
      console.error('API Error in External SQL Analytics:', apiError);
      
      // Handle timeout errors specifically
      if (apiError.name === 'AbortError') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Request timeout - External API is not responding',
          details: 'The external API took too long to respond. Please try again later.'
        }), {
          status: 408,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      // Handle network connection errors
      if (apiError.message.includes('fetch failed') || apiError.message.includes('SocketError')) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Network connection error',
          details: 'Unable to connect to the external service. Please try again later.'
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      // Return partial data if we have some results
      if (finalResponse.sql || finalResponse.data) {
        return new Response(JSON.stringify({
          success: true,
          data: finalResponse,
          warning: `Partial results due to error: ${apiError.message}`
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      throw apiError;
    }

  } catch (error) {
    console.error('External SQL Analytics API Error:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Failed to process external SQL analytics request',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
