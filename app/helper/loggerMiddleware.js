const loggerMiddleware = (req, res, next) => {
  const userAgent = req.useragent;

  const browser = userAgent.browser;
  const version = userAgent.version;
  const os = userAgent.os;
  const device = userAgent.device;

  console.log(`[${new Date().toISOString()}] ip: ${req.ip} ${req.method} ${req.url} status:${res.statusCode} {Browser: ${browser} Version: ${version} OS: ${os} Device: ${device}}`);
  next();
}

export default loggerMiddleware;
