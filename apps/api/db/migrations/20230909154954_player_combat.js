/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('players', table => {
      table.integer('combat').defaultTo(1000);
      table.integer('gold').defaultTo(10000);
    })
    .createTable('war_history', table => {
      table.text('id').primary();
      table.text('attacker_id').references('id').inTable('players').notNullable();
      table.text('defender_id').references('id').inTable('players').notNullable();
      table.integer('attack_turns_used').notNullable();
      table.boolean('is_attacker_victor').notNullable();
      table.integer('attacker_strength').notNullable();
      table.integer('defender_strength').notNullable();
      table.integer('gold_stolen').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schems
    .alterTable('players', table => {
      table.dropColumn('combat');
      table.dropColumn('gold');
    })
    .dropTable('war_history');
};
