const knex = require('knex');
const environment = 'development'
const config = require('./knexfile');

exports.db = knex(config[environment]);

exports.TABLES =  {
    CATEGORIES: 'categories',
    POSTS: 'posts',
    CATEGORIES_POSTS: 'categories_posts'
};