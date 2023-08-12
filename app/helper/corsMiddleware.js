const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Cache-Control', 'no-store, private');
    res.append('Referrer-Policy', 'origin-when-cross-origin');
    res.append('Strict-Transport-Security', 'max-age=86400');
    res.append('X-XSS-Protection', '1; mode=block');
    res.append('X-Content-Type-Options', 'nosniff');
    // res.append('Link', 'https://sitisarm.tk; rel=canonical');
    res.append('Timing-Allow-Origin', '');
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', 'MyServer');
    next();
};

export default corsMiddleware;