const BASE_URL = process.env.SERVICE_URL || 'http://localhost:3010';

export async function callDemoService(path) {
  const startData = Date.now();

  try {
    const response = await fetch(BASE_URL + path, {
      signal: AbortSignal.timeout(3000),
    });
    const body = await response.json();
    return { httpStatus: response.status, ms: Date.now() - startData, body };
  } catch (error) {
    return { httpStatus: 500, ms: Date.now() - startData, body: { error: error.message } };
  }
}
