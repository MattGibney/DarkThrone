/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').primary();
    table.string('email').unique();
    table.string('password_hash');
    table.timestamp('confirmed_email_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
  .createTable('user_sessions', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users');
    table.string('token');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('user_sessions');
};
