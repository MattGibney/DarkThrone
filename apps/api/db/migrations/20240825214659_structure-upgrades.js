/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('players', table => {
    table.jsonb('structureUpgrades').defaultTo({
      fortification: 0,
      economy: 0,
      armory: 0,
      housing: 0,
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('players', table => {
    table.dropColumn('structureUpgrades');
  });
};
