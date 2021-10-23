const allRoles = {
  user: [],
  admin: [
    // User domain
    'getUsers',
    'manageUsers',

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
