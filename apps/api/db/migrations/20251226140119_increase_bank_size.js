/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('players', function(table) {
    table.bigInteger('gold').alter();
    table.bigInteger('gold_in_bank').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('players', function(table) {
    table.integer('gold').alter();
    table.integer('gold_in_bank').alter();
  });
};
