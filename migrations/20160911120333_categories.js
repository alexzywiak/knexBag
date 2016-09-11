exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('categories', function(table){
      table.increments('id').primary();
      table.string('title');
    })
  ]);
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('categories')
  ]);
};