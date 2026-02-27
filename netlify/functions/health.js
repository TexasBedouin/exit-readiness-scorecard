exports.handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const checks = {};

  // Test ActiveCampaign connectivity
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${process.env.AC_API_URL}/api/3/users/me`, {
      headers: { 'Api-Token': process.env.AC_API_TOKEN },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    checks.activecampaign = response.ok ? 'ok' : `error (status ${response.status})`;
  } catch (err) {
    checks.activecampaign = `error (${err.name === 'AbortError' ? 'timeout' : err.message})`;
  }

  const allOk = Object.values(checks).every((v) => v === 'ok');

  return {
    statusCode: allOk ? 200 : 503,
    headers,
    body: JSON.stringify({
      status: allOk ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    }),
  };
};
