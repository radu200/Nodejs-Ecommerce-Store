
exports.up = function(knex, Promise) {
   return Promise.all([
       knex.schema.createTable('users', function(table){
        table.increments('id').unsigned().primary();
        table.string('title').notNull();
        table.string('description').notNull();
        table.string('image').notNull();
        table.timestamps();
       })
   ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),   
    ])
};
