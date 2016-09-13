exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('posts', function(table){
      table.increments('id').primary();
      table.string('title');
    }),
    knex.schema.createTable('categories_posts', function(table){
      table.increments('id').primary();
      table.integer('post_id').references('posts.id');
      table.integer('category_id').references('categories.id');
    }),
    knex.schema.createTable('categories', function(table){
      table.increments('id').primary();
      table.string('title');
    })
  ]);
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('posts'),
    knex.schema.dropTable('categories_posts'),
    knex.schema.dropTable('category_id')
  ]);
};
