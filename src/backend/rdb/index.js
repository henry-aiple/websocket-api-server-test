import mysql from 'mysql2';
import config from '../../tools/config.js';

const dbInfo = new URL(config.db.writer + config.db.dbConn);

function getOptions() {
  const options = {};
  if (dbInfo.search) {
    const optionsArr = dbInfo.search.slice(1).split('&');
    optionsArr.forEach((e) => {
      const [key, value] = e.split('=');
      options[key] = value;
    });
  }
  return options;
}

const connInfo = {
  ...getOptions(),
  host: dbInfo.hostname,
  port: dbInfo.port,
  user: dbInfo.username,
  password: dbInfo.password,
  database: dbInfo.pathname.slice(1),
};

export const pool = mysql.createPool(connInfo).promise();

const dbInfoRo = new URL(config.db.reader + config.db.dbConn);

function getOptionsRo() {
  const options = {};
  if (dbInfoRo.search) {
    const optionsArr = dbInfoRo.search.slice(1).split('&');
    optionsArr.forEach((e) => {
      const [key, value] = e.split('=');
      options[key] = value;
    });
  }
  return options;
}

const connInfoRo = {
  ...getOptionsRo(),
  host: dbInfoRo.hostname,
  port: dbInfoRo.port,
  user: dbInfoRo.username,
  password: dbInfoRo.password,
  database: dbInfoRo.pathname.slice(1),
};

export const poolRo = mysql.createPool(connInfoRo).promise();

export async function testConnection() {
  const [result] = await poolRo.query('SELECT 1');
  return result;
}

export default {
  poolRo,
  pool,
  testConnection,
};
