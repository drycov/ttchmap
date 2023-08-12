const sessionMiddleware = (req, res, next) => {
    
    res.locals.session = {
        isAuthenticated: req.session.isAuthenticated || false,
        user: req.session.user || null,
        // cart: req.session.cart || []
      };
      next();
  }
  
  export default sessionMiddleware;
  