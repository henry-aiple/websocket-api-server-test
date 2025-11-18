import fs from 'fs';
import {pool} from '../../src/backend/rdb/index.js';

import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// const __filename = fileURLToPath(import.meta.url);

const DELIMITER = ';';
const DELIMITER2 = '//';

const RDB_TABLES = [
  'user',
];

export async function cleanUp() {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query('SET foreign_key_checks = 0; ');
    for await (const table of RDB_TABLES) {
      await conn.query(`TRUNCATE TABLE \`${table}\`; `);
    }
    await conn.query('SET foreign_key_checks = 1; ');

    await conn.commit();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    conn.rollback();
  } finally {
    conn.release();
  }
}

export async function dropTable() {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query('SET foreign_key_checks = 0; ');
    for await (const table of RDB_TABLES) {
      await conn.query(`DROP TABLE IF EXISTS \`${table}\`; `);
    }
    await conn.query('SET foreign_key_checks = 1; ');

    await conn.commit();
  } catch {
    conn.rollback();
  } finally {
    conn.release();
  }
}

async function applySchema() {
  const dataSql = fs.readFileSync(`${__dirname}/scheme.sql`).toString();
  const dataArr = dataSql.toString().split(DELIMITER);

  for await (const queryStmt of dataArr) {
    if (queryStmt?.length > 1) {
      const query = queryStmt + DELIMITER;

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query(query);
        await conn.commit();
      } catch (err) {
        console.log(err);
        conn.rollback();
      } finally {
        conn.release();
      }
    }
  }
}

async function applyTriggers() {
  const dataSql = fs.readFileSync(`${__dirname}/triggers.sql`).toString();
  const dataArr = dataSql.toString().split(DELIMITER2);

  for await (const queryStmt of dataArr) {
    if (queryStmt.includes('##')) {
      continue;
    }
    if (queryStmt?.length > 1) {
      const query = queryStmt; // + DELIMITER2;

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query(query);
        await conn.commit();
      } catch {
        conn.rollback();
      } finally {
        conn.release();
      }
    }
  }
}

export async function init() {
  await applySchema();
  await applyTriggers();
}

export default {
  init,
  cleanUp,
  dropTable,
};
