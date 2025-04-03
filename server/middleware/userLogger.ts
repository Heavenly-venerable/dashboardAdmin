import pino from 'pino';

const logger = pino({
});

export default defineEventHandler(async (event) => {
  try {
    const url = getRequestURL(event);
    const headers = getHeaders(event);
    const method = getMethod(event);
    const query = getQuery(event);

    logger.info({
      method,
      url: url.pathname,
      query,
      ip: headers['x-forwarded-for'] || event.node?.req?.socket?.remoteAddress,
    }, 'User Request');
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error handling request');
  }
});
