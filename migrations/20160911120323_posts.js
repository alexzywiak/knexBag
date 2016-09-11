exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('posts', function(table){
      table.increments('id').primary();
      table.string('title');
    })
  ]);
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('posts')
  ]);
};