import {pool, poolRo} from '../src/backend/rdb/index.js';
import queries from './queries/user.js';
import {like, TYPES} from '../src/helpers/assert.js';
import {inspect} from 'util';

export const add = async (param) => {
  if (!like(
    param,
    {
      username: TYPES.STRING.NONEMPTY,
      email: TYPES.STRING.NONEMPTY,
      createdAt: TYPES.DATE,
    },
  )) throw new Error(`invalid param to add user: ${inspect(param)}`);

  const {
    username, email, createdAt,
  } = param;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      queries.add,
      [
        username, email, createdAt,
      ],
    );

    await conn.commit();
  } catch (err) {
    conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getByEmail = async (email) => {
  if (!like(email, TYPES.STRING.NONEMPTY)) {
    throw new Error(`invalid email to get user: ${email}`);
  }

  const conn = await poolRo.getConnection();
  try {
    const [user] = await conn.query(queries.getByEmail, [email]);
    if (user[0]) return user[0];
    return null;
  } finally {
    conn.release();
  }
};

export const getByUsername = async (username) => {
  if (!like(username, TYPES.STRING.NONEMPTY)) {
    throw new Error(`invalid username to get user: ${username}`);
  }

  const conn = await poolRo.getConnection();
  try {
    const [user] = await conn.query(queries.getByUsername, [username]);
    if (user[0]) return user[0];
    return null;
  } finally {
    conn.release();
  }
};

export default {
  add,
  getByEmail,
  getByUsername,
};
