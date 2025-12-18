/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('player_items', (table) => {
    table.text('id').primary();
    table
      .text('player_id')
      .notNullable()
      .references('id')
      .inTable('players');
    table.text('item_key').notNullable();
    table.integer('quantity').notNullable();
    table.unique(['player_id', 'item_key']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('player_items');
};
