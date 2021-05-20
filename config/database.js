if(process.env.NODE_ENV === 'production'){

    module.exports = require('./prod-db');

} else {
    module.exports = require('./dev-db');
}