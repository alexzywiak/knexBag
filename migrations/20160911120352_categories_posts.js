exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('categories_posts', function(table){
      table.increments('id').primary();
      table.integer('post_id').references('posts.id');
      table.integer('category_id').references('categories.id');
    })
  ]);
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('categories_posts')
  ]);
};