/**
 * Cloudflare Pages Function - API catch-all
 *
 * Handles:
 *   - POST /api/track
 *   - GET /api/hot?tool=...
 *   - GET /api/health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      if (pathname === '/api/track' && request.method === 'POST') {
        return await handleTrack(request, env, corsHeaders);
      }

      if (pathname === '/api/hot' && request.method === 'GET') {
        return await handleHot(request, env, corsHeaders);
      }

      if (pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.error('Function error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

async function handleTrack(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { toolId } = body;

    if (!toolId || typeof toolId !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid toolId' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const key = `tool:${toolId}`;
    const current = await env.STATS.get(key);
    let clicks = 0;

    if (current) {
      const data = JSON.parse(current);
      clicks = data.clicks || 0;
    }

    clicks++;
    const updated = {
      toolId,
      clicks,
      lastUpdated: new Date().toISOString(),
    };

    await env.STATS.put(key, JSON.stringify(updated));

    return new Response(JSON.stringify({ success: true, clicks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Track error:', error);
    return new Response(JSON.stringify({ error: 'Failed to track' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

async function handleHot(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const tool = url.searchParams.get('tool');

    if (!tool) {
      return new Response(JSON.stringify({ error: 'Missing tool parameter' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const key = `tool:${tool}`;
    const data = await env.STATS.get(key);

    if (!data) {
      return new Response(JSON.stringify({ toolId: tool, clicks: 0 }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const stats = JSON.parse(data);
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Hot error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
