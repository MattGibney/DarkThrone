/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('war_history', function (table) {
    table.integer('attacker_experience').defaultTo(0);
    table.integer('defender_experience').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('war_history', function (table) {
    table.dropColumn('attacker_experience');
    table.dropColumn('defender_experience');
  });
};
