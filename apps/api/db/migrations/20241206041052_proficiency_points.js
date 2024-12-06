exports.up = function(knex) {
  return knex.schema.alterTable('players', function (table) {
    table.jsonb('proficiencyPoints').defaultTo({
      strength: 0,
      constitution: 0,
      wealth: 0,
      dexterity: 0,
      charisma: 0,
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('players', function (table) { 
    table.dropColumn('proficiencyPoints');
  });
}
