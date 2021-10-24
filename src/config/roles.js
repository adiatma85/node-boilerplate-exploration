const allRoles = {
  user: ['getArticles'],
  admin: [
    // User domain
    'createUsers',
    'getUsers',
    'updateUsers',
    'deleteUsers',

    // Article Domain
    'createArticles',
    'getArticles',
    'updateArticles',
    'deleteArticles',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
