export const add =
  'INSERT INTO user(username, email, createdAt)' +
  ' VALUES (?, ?, ?)';

// export const set = {
//   clause: 'UPDATE User SET ${subclause} WHERE id = ?',
//   subclause: {
//     name: 'name = ?',
//     username: 'username = ?',
//     email: 'email = ?',
//     profileImg: 'profileImg = ?',
//     description: 'description = ?',
//     birthdate: 'birthdate = ?',
//     gender: 'gender = ?',
//     meta: 'meta = ?',
//     properties: 'properties = ?',
//     lastActiveTime: 'lastActiveTime = ?',
//   },
// };

export const getByEmail =
  'SELECT *' +
  ' FROM user' +
  ' WHERE email = ?';

export const getByUsername =
  'SELECT *' +
  ' FROM user' +
  ' WHERE username = ?';

export default {
  add,
  getByEmail,
  getByUsername,
};
