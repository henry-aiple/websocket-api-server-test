// import config from '../../../tools/config.js';
// import logger from '../../../tools/logger.js';
// import errors from '../../../helpers/errors/index.js';

import dataCacheModel from '../../../../models/dataCache.js';
import researchModel from '../../../../models/research.js';

// Basic Authentication Required
export const getDataCache = async (req, res) => {
  const {countryCode, type} = req.query;

  const dataCache = await dataCacheModel.getValidByCountryCodeAndType(countryCode, type);

  return res.status(200).json({
    result: 'success',
    countryCode,
    data: dataCache?.data || null,
  });
};

export const setDataCache = async (req, res) => {
  const {
    countryCode,
    type,
    data,
  } = req.body;

  const cachedAt = new Date();

  const dataCache = await dataCacheModel.add({
    countryCode,
    type,
    data,
    createdAt: cachedAt,
  });

  return res.status(200).json({
    result: 'success',
    countryCode,
    data: dataCache.data,
  });
};

export const getCountryCodeToCreateDataCache = async (req, res) => {
  const countryCodeToCreateDataCache =
    await researchModel.getCountryCodeRequestedPerOneWeek();

  return res.status(200).json({
    result: 'success',
    countryCode: countryCodeToCreateDataCache,
  });
};

export default {
  getDataCache,
  setDataCache,
  getCountryCodeToCreateDataCache,
};
