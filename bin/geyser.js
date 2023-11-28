
class Geyser {
  constructor({
    name,
    minRatePerCycle,
    maxRatePerCycle,
    rateRoll,
    iterationLengthRoll,
    yearLengthRoll,
    yearPercentRoll,
    scaledRate,
    scaledIterationLength,
    scaledIterationPercent,
    scaledYearLength,
    scaledYearPercent
  }) {
    this.name = name;
    this.minRatePerCycle = minRatePerCycle;
    this.maxRatePerCycle = maxRatePerCycle;
    this.rateRoll = rateRoll;
    this.iterationLengthRoll = iterationLengthRoll;
    this.yearLengthRoll = yearLengthRoll;
    this.yearPercentRoll = yearPercentRoll;
    this.scaledRate = scaledRate;
    this.scaledIterationLength = scaledIterationLength;
    this.scaledIterationPercent = scaledIterationPercent;
    this.scaledYearLength = scaledYearLength;
    this.scaledYearPercent = scaledYearPercent;
  }

  setRateRoll(rateRoll) {
    this.rateRoll = rateRoll;
    this.scaledRate = resample(this.rateRoll, this.minRatePerCycle, this.maxRatePerCycle);
  }

  getEmitRate() {
    const num = 600 / this.getIterationLength();
    return this.getMassPerCycle() / num / this.getOnDuration();
  }

  getIterationLength() {
    return this.scaledIterationLength;
    // return this.GetModifiedValue(this.scaledIterationLength, this.modifier.iterationDurationModifier, Geyser.IterationDurationModificationMethod);
  }

  getMassPerCycle()
  {
    return this.scaledRate;
    // return this.GetModifiedValue(this.scaledRate, this.modifier.massPerCycleModifier, Geyser.massModificationMethod);
  }

  getOnDuration() {
    return this.getIterationLength() * this.getIterationPercent()
  };

  getIterationPercent() {
    return clamp(
      this.scaledIterationPercent,
      // this.GetModifiedValue(this.scaledIterationPercent, this.modifier.iterationPercentageModifier, Geyser.IterationPercentageModificationMethod),
      0.0,
      1.0
    );
  }

  clone() {
    return new Geyser({
      name: this.name,
      minRatePerCycle: this.minRatePerCycle,
      maxRatePerCycle: this.maxRatePerCycle,
      rateRoll: this.rateRoll,
      iterationLengthRoll: this.iterationLengthRoll,
      yearLengthRoll: this.yearLengthRoll,
      yearPercentRoll: this.yearPercentRoll,
      scaledRate: this.scaledRate,
      scaledIterationLength: this.scaledIterationLength,
      scaledIterationPercent: this.scaledIterationPercent,
      scaledYearLength: this.scaledYearLength,
      scaledYearPercent: this.scaledYearPercent,
    });
  }
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
};

function resample(t, min, max) {
  let num1 = 6;
  let num2 = 0.002472623;
  return ((-Math.log((1.0 / (t * (1.0 -  num2 * 2.0) + num2) - 1.0)) + num1) / (num1 * 2.0) * (max - min)) + min;
}

let db = new Map();

function GeyserType(
  name,
  unused1,
  unused2,
  temperature,
  minRatePerCycle,
  maxRatePerCycle,
  maxPressure,
  ...etc
) {
  let info = {
    name,
    temperature,
    minRatePerCycle,
    maxPressure,
    maxRatePerCycle,
  };
  db.set(name, info);
}

GeyserType("steam", "SimHashes.Steam", "GeyserConfigurator.GeyserShape.Gas", 383.15, 1000, 2000, 5);
GeyserType("hot_steam", "SimHashes.Steam", "GeyserConfigurator.GeyserShape.Gas", 773.15, 500, 1000, 5);
GeyserType("hot_water", "SimHashes.Water", "GeyserConfigurator.GeyserShape.Liquid", 368.15, 2000, 4000, 500);
GeyserType("slush_water", "SimHashes.DirtyWater", "GeyserConfigurator.GeyserShape.Liquid", 263.15, 1000, 2000, 500, {geyserTemperature: 263});
GeyserType("filthy_water", "SimHashes.DirtyWater", "GeyserConfigurator.GeyserShape.Liquid", 303.15, 2000, 4000, 500)
GeyserType("slush_salt_water", "SimHashes.Brine", "GeyserConfigurator.GeyserShape.Liquid", 263.15, 1000, 2000, 500, {geyserTemperature: 263});
GeyserType("salt_water", "SimHashes.SaltWater", "GeyserConfigurator.GeyserShape.Liquid", 368.15, 2000, 4000, 500);
GeyserType("small_volcano", "SimHashes.Magma", "GeyserConfigurator.GeyserShape.Molten", 2000, 400, 800, 150, 6000, 12000, 0.005, 0.01);
GeyserType("big_volcano", "SimHashes.Magma", "GeyserConfigurator.GeyserShape.Molten", 2000, 800, 1600, 150, 6000, 12000, 0.005, 0.01);
GeyserType("liquid_co2", "SimHashes.LiquidCarbonDioxide", "GeyserConfigurator.GeyserShape.Liquid", 218, 100, 200, 50, {geyserTemperature: 218});
GeyserType("hot_co2", "SimHashes.CarbonDioxide", "GeyserConfigurator.GeyserShape.Gas", 773.15, 70, 140, 5);
GeyserType("hot_hydrogen", "SimHashes.Hydrogen", "GeyserConfigurator.GeyserShape.Gas", 773.15, 70, 140, 5);
GeyserType("hot_po2", "SimHashes.ContaminatedOxygen", "GeyserConfigurator.GeyserShape.Gas", 773.15, 70, 140, 5);
GeyserType("slimy_po2", "SimHashes.ContaminatedOxygen", "GeyserConfigurator.GeyserShape.Gas", 333.15, 70, 140, 5);
GeyserType("chlorine_gas", "SimHashes.ChlorineGas", "GeyserConfigurator.GeyserShape.Gas", 333.15, 70, 140, 5);
GeyserType("methane", "SimHashes.Methane", "GeyserConfigurator.GeyserShape.Gas", 423.15, 70, 140, 5);
GeyserType("molten_copper", "SimHashes.MoltenCopper", "GeyserConfigurator.GeyserShape.Molten", 2500, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_iron", "SimHashes.MoltenIron", "GeyserConfigurator.GeyserShape.Molten", 2800, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_gold", "SimHashes.MoltenGold", "GeyserConfigurator.GeyserShape.Molten", 2900, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_aluminum", "SimHashes.MoltenAluminum", "GeyserConfigurator.GeyserShape.Molten", 2000, 200, 400, 150, 480, 1080, 0.016666668, 0.1, {DlcID: "EXPANSION1_ID"});
GeyserType("molten_tungsten", "SimHashes.MoltenTungsten", "GeyserConfigurator.GeyserShape.Molten", 4000, 200, 400, 150, 480, 1080, 0.016666668, 0.1, {DlcID: "EXPANSION1_ID"});
GeyserType("molten_niobium", "SimHashes.MoltenNiobium", "GeyserConfigurator.GeyserShape.Molten", 3500, 800, 1600, 150, 6000, 12000, 0.005, 0.01, {DlcID: "EXPANSION1_ID"});
GeyserType("molten_cobalt", "SimHashes.MoltenCobalt", "GeyserConfigurator.GeyserShape.Molten", 2500, 200, 400, 150, 480, 1080, 0.016666668, 0.1, {DlcID: "EXPANSION1_ID"});
GeyserType("oil_drip", "SimHashes.CrudeOil", "GeyserConfigurator.GeyserShape.Liquid", 600, 1, 250, 50, 600, 600, 1, 1, 100, 500);
GeyserType("liquid_sulfur", "SimHashes.LiquidSulfur", "GeyserConfigurator.GeyserShape.Liquid", 438.34998, 1000, 2000, 500, {DlcID: "EXPANSION1_ID"});
GeyserType("molten_niobium", "SimHashes.MoltenNiobium", "GeyserConfigurator.GeyserShape.Molten", 3500, 800, 1600, 150, 6000, 12000, 0.005, 0.01);

function geyserInfo(name) {
  return db.get(name);
}

module.exports = {
  geyserInfo,
  Geyser,
  resample,
};
