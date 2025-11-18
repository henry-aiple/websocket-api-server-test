export default function response() {
  return function(req, res, next) {
    res.errorJson = function(bodyJson) {
      const body = {
        result: 'error',
        ...bodyJson,
      };
      res.json(body);
    };
    return next();
  };
}
