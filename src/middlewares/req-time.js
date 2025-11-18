import moment from 'moment';

export default function(req, res, next) {
  req.startedAt = moment();
  next();
}
