const knex = require('knex');
const environment = 'development'
const config = require('./knexfile');

exports.db = knex(config[environment]);

exports.createTrxFunc = existingTransaction => {
    return existingTransaction ? func => func(existingTransaction) : exports.db.transaction;
};

exports.TABLES =  {
    CATEGORIES: 'categories',
    POSTS: 'posts',
    CATEGORIES_POSTS: 'categories_posts'
};