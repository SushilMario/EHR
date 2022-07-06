const routes = require('next-routes')();

routes
    .add('/users/admin/', '/users/admin/index');

module.exports = routes;