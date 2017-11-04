module.exports = {
  createRoutingMethod,
  processMiddlewares
};

function createRoutingMethod(method, middlewares) {
  return function() {
    let route;
    let middleware;

    if(arguments.length === 1 && typeof arguments[0] === 'function') {
      route = '*';
      middleware = arguments[0];
    } else if(arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
      route = arguments[0];
      middleware = arguments[1];
    }
    middlewares.push({
      middlewareMethod: method,
      middlewareRoute: route,
      middleware
    });
  }
}

function processMiddlewares(req, res, middlewareIndex, middlewares) {
  if(middlewares.length <= middlewareIndex) {
    return;
  }

  const {middlewareMethod, middlewareRoute, middleware} = middlewares[middlewareIndex];

  if(isValidMethod(middlewareMethod, req.method) && isValidRoute(middlewareRoute, req.url)) {
    middleware(req, res, () => {
      processMiddlewares(req, res, middlewareIndex + 1, middlewares);
    });
  } else {
    processMiddlewares(req, res, middlewareIndex + 1, middlewares);
  }
}

function isValidMethod(middlewareMethod, reqMethod) {
  return middlewareMethod === 'USE' || middlewareMethod === reqMethod;
}

function isValidRoute(middlewareRoute, reqRoute) {
  return middlewareRoute === '*' || middlewareRoute.indexOf(reqRoute) === 0;
}
