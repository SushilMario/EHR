const routes = require('next-routes')();

routes
    .add('/users/admin/', '/users/admin/show');

module.exports = routes;