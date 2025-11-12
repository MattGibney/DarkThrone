import { fortificationUpgrades, housingUpgrades } from '@darkthrone/game-data';

describe('fortificationUpgrades', () => {
  [
    {
      name: 'Manor',
      levelRequirement: 1,
      cost: 0,
      defenceBonusPercentage: 5,
      goldPerTurn: 1000, // Updated to 1000 from 10000 to incrementally increase. It didn't make sense to get 10000 at this level to get 2000 at the next level.
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Village',
      levelRequirement: 5,
      goldPerTurn: 2000,
      defenceBonusPercentage: 10,
      cost: 100000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Town',
      levelRequirement: 10,
      goldPerTurn: 3000,
      defenceBonusPercentage: 15,
      cost: 250000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Outpost',
      levelRequirement: 15,
      goldPerTurn: 4000,
      defenceBonusPercentage: 20,
      cost: 500000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Outpost Level 2',
      levelRequirement: 20,
      goldPerTurn: 5000,
      defenceBonusPercentage: 25,
      cost: 1000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Outpost Level 3',
      levelRequirement: 25,
      goldPerTurn: 6000,
      defenceBonusPercentage: 30,
      cost: 2000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Stronghold',
      levelRequirement: 30,
      goldPerTurn: 7000,
      defenceBonusPercentage: 35,
      cost: 3000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Stronghold Level 2',
      levelRequirement: 35,
      goldPerTurn: 8000,
      defenceBonusPercentage: 40,
      cost: 4000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Stronghold Level 3',
      levelRequirement: 40,
      goldPerTurn: 9000,
      defenceBonusPercentage: 45,
      cost: 5000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Fortress',
      levelRequirement: 45,
      goldPerTurn: 10000,
      defenceBonusPercentage: 50,
      cost: 7500000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Fortress Level 2',
      levelRequirement: 50,
      goldPerTurn: 11000,
      defenceBonusPercentage: 55,
      cost: 10000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Fortress Level 3',
      levelRequirement: 55,
      goldPerTurn: 12000,
      defenceBonusPercentage: 60,
      cost: 15000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Citadel',
      levelRequirement: 60,
      goldPerTurn: 13000,
      defenceBonusPercentage: 65,
      cost: 20000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Citadel Level 2',
      levelRequirement: 65,
      goldPerTurn: 14000,
      defenceBonusPercentage: 70,
      cost: 30000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Citadel Level 3',
      levelRequirement: 70,
      goldPerTurn: 15000,
      defenceBonusPercentage: 75,
      cost: 40000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Castle',
      levelRequirement: 75,
      goldPerTurn: 16000,
      defenceBonusPercentage: 80,
      cost: 50000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Castle Level 2',
      levelRequirement: 80,
      goldPerTurn: 17000,
      defenceBonusPercentage: 85,
      cost: 75000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Castle Level 3',
      levelRequirement: 85,
      goldPerTurn: 18000,
      defenceBonusPercentage: 90,
      cost: 100000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Kingdom',
      levelRequirement: 90,
      goldPerTurn: 19000,
      defenceBonusPercentage: 95,
      cost: 150000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Kingdom Level 2',
      levelRequirement: 95,
      goldPerTurn: 20000,
      defenceBonusPercentage: 100,
      cost: 200000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Kingdom Level 3',
      levelRequirement: 100,
      goldPerTurn: 21000,
      defenceBonusPercentage: 105,
      cost: 250000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Empire',
      levelRequirement: 105,
      goldPerTurn: 22000,
      defenceBonusPercentage: 110,
      cost: 300000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Empire Level 2',
      levelRequirement: 110,
      goldPerTurn: 23000,
      defenceBonusPercentage: 115,
      cost: 350000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
    {
      name: 'Empire Level 3',
      levelRequirement: 115,
      goldPerTurn: 24000,
      defenceBonusPercentage: 120,
      cost: 400000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    },
  ].forEach((origionalFortification, index) => {
    it(`should maintain the correct properties for ${origionalFortification.name}`, () => {
      expect(fortificationUpgrades[index]).toEqual(origionalFortification);
    });
  });
  it('should maintain the correct number of upgrades', () => {
    expect(fortificationUpgrades).toHaveLength(24);
  });

  it('should maintain the first upgrade as Manor', () => {
    const manor = fortificationUpgrades[0];
    expect(manor).toEqual({
      name: 'Manor',
      levelRequirement: 1,
      cost: 0,
      defenceBonusPercentage: 5,
      goldPerTurn: 1000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    });
  });

  it('should maintain the last upgrade as Empire Level 3', () => {
    const empire = fortificationUpgrades[fortificationUpgrades.length - 1];
    expect(empire).toEqual({
      name: 'Empire Level 3',
      levelRequirement: 115,
      goldPerTurn: 24000,
      defenceBonusPercentage: 120,
      cost: 400000000,
      requiredFortificationLevel: 0,
      type: 'fortification',
    });
  });

  it('should maintain ascending level requirements', () => {
    for (let i = 1; i < fortificationUpgrades.length; i++) {
      expect(fortificationUpgrades[i].levelRequirement).toBeGreaterThan(
        fortificationUpgrades[i - 1].levelRequirement,
      );
    }
  });

  it('should maintain ascending gold per turn values', () => {
    for (let i = 1; i < fortificationUpgrades.length; i++) {
      expect(fortificationUpgrades[i].goldPerTurn).toBeGreaterThan(
        fortificationUpgrades[i - 1].goldPerTurn,
      );
    }
  });
});

describe('housingUpgrades', () => {
  [
    {
      name: 'Hovel',
      requiredFortificationLevel: 0,
      cost: 0,
      citizensPerDay: 1,
      type: 'housing',
    },
    {
      name: 'Hut',
      requiredFortificationLevel: 2,
      cost: 500000,
      citizensPerDay: 10,
      type: 'housing',
    },
    {
      name: 'Cottage',
      requiredFortificationLevel: 6,
      cost: 1000000,
      citizensPerDay: 20,
      type: 'housing',
    },
    {
      name: 'Longhouse',
      requiredFortificationLevel: 10,
      cost: 1500000,
      citizensPerDay: 30,
      type: 'housing',
    },
    {
      name: 'Manor House',
      requiredFortificationLevel: 14,
      cost: 2500000,
      citizensPerDay: 40,
      type: 'housing',
    },
    {
      name: 'Keep',
      requiredFortificationLevel: 18,
      cost: 3500000,
      citizensPerDay: 50,
      type: 'housing',
    },
    {
      name: 'Great Hall',
      requiredFortificationLevel: 22,
      cost: 5000000,
      citizensPerDay: 60,
      type: 'housing',
    },
  ].forEach((origionalHousing, index) => {
    it(`should maintain the correct properties for ${origionalHousing.name}`, () => {
      expect(housingUpgrades[index]).toEqual(origionalHousing);
    });
  });
  it('should maintain the correct number of upgrades', () => {
    expect(housingUpgrades).toHaveLength(7);
  });

  it('should maintain the first upgrade as Hovel', () => {
    const hovel = housingUpgrades[0];
    expect(hovel).toEqual({
      name: 'Hovel',
      requiredFortificationLevel: 0,
      cost: 0,
      citizensPerDay: 1,
      type: 'housing',
    });
  });

  it('should maintain the last upgrade as Great Hall', () => {
    const greatHall = housingUpgrades[housingUpgrades.length - 1];
    expect(greatHall).toEqual({
      name: 'Great Hall',
      requiredFortificationLevel: 22,
      cost: 5000000,
      citizensPerDay: 60,
      type: 'housing',
    });
  });

  it('should maintain ascending required fortification levels', () => {
    for (let i = 1; i < housingUpgrades.length; i++) {
      expect(housingUpgrades[i].requiredFortificationLevel).toBeGreaterThan(
        housingUpgrades[i - 1].requiredFortificationLevel,
      );
    }
  });

  it('should maintain ascending citizens per day values', () => {
    for (let i = 1; i < housingUpgrades.length; i++) {
      expect(housingUpgrades[i].citizensPerDay).toBeGreaterThan(
        housingUpgrades[i - 1].citizensPerDay,
      );
    }
  });
});
