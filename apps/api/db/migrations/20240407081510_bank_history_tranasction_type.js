/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('bank_history', function (table) {
    table.string('transaction_type', 10).notNullable().defaultTo('deposit');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('bank_history', function (table) {
    table.dropColumn('transaction_type');
  });
};
