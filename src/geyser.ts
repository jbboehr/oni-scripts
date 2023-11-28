import {clamp, resample} from "./util.js";

export interface GeyserBehaviorData {
  rateRoll: number;
  iterationLengthRoll: number;
  yearLengthRoll: number;
  yearPercentRoll: number;
  scaledRate: number;
  scaledIterationLength: number;
  scaledIterationPercent: number;
  scaledYearLength: number;
  scaledYearPercent: number;
}

export class Geyser implements GeyserBehaviorData {
  public info: GeyserInfo;

  public iterationLengthRoll: number;
  public rateRoll: number;
  public scaledIterationLength: number;
  public scaledIterationPercent: number;
  public scaledRate: number;
  public scaledYearLength: number;
  public scaledYearPercent: number;
  public yearLengthRoll: number;
  public yearPercentRoll: number;

  get minRatePerCycle() {
    return this.info.minRatePerCycle;
  }

  get maxRatePerCycle() {
    return this.info.maxRatePerCycle;
  }

  constructor(info: GeyserInfo, data: GeyserBehaviorData) {
    this.info = info;
    this.rateRoll = data.rateRoll;
    this.iterationLengthRoll = data.iterationLengthRoll;
    this.yearLengthRoll = data.yearLengthRoll;
    this.yearPercentRoll = data.yearPercentRoll;
    this.scaledRate = data.scaledRate;
    this.scaledIterationLength = data.scaledIterationLength;
    this.scaledIterationPercent = data.scaledIterationPercent;
    this.scaledYearLength = data.scaledYearLength;
    this.scaledYearPercent = data.scaledYearPercent;
  }

  setRateRoll(rateRoll: number): void {
    this.rateRoll = rateRoll;
    this.scaledRate = resample(this.rateRoll, this.minRatePerCycle, this.maxRatePerCycle);
  }

  getEmitRate(): number {
    const num = 600 / this.getIterationLength();
    return this.getMassPerCycle() / num / this.getOnDuration();
  }

  getIterationLength(): number {
    return this.scaledIterationLength;
  }

  getMassPerCycle(): number {
    return this.scaledRate;
  }

  getOnDuration(): number {
    return this.getIterationLength() * this.getIterationPercent()
  };

  getIterationPercent(): number {
    return clamp(
      this.scaledIterationPercent,
      0.0,
      1.0
    );
  }

  clone(): Geyser {
    return new Geyser(this.info, {
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

let db = new Map<string, GeyserInfo>();

export interface GeyserInfo {
  name: string;
  temperature: number;
  minRatePerCycle: number;
  maxRatePerCycle: number;
  maxPressure: number;
}

function GeyserType(
  name: string,
  temperature: number,
  minRatePerCycle: number,
  maxRatePerCycle: number,
  maxPressure: number,
  ...etc: unknown[]
) {
  const info: GeyserInfo = {
    name,
    temperature,
    minRatePerCycle,
    maxPressure,
    maxRatePerCycle,
  };
  db.set(name, info);
}

GeyserType("steam", 383.15, 1000, 2000, 5);
GeyserType("hot_steam", 773.15, 500, 1000, 5);
GeyserType("hot_water", 368.15, 2000, 4000, 500);
GeyserType("slush_water", 263.15, 1000, 2000, 500, {geyserTemperature: 263});
GeyserType("filthy_water", 303.15, 2000, 4000, 500)
GeyserType("slush_salt_water", 263.15, 1000, 2000, 500, {geyserTemperature: 263});
GeyserType("salt_water", 368.15, 2000, 4000, 500);
GeyserType("small_volcano", 2000, 400, 800, 150, 6000, 12000, 0.005, 0.01);
GeyserType("big_volcano", 2000, 800, 1600, 150, 6000, 12000, 0.005, 0.01);
GeyserType("liquid_co2", 218, 100, 200, 50, {geyserTemperature: 218});
GeyserType("hot_co2", 773.15, 70, 140, 5);
GeyserType("hot_hydrogen", 773.15, 70, 140, 5);
GeyserType("hot_po2", 773.15, 70, 140, 5);
GeyserType("slimy_po2", 333.15, 70, 140, 5);
GeyserType("chlorine_gas", 333.15, 70, 140, 5);
GeyserType("methane", 423.15, 70, 140, 5);
GeyserType("molten_copper", 2500, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_iron", 2800, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_gold", 2900, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_aluminum", 2000, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_tungsten", 4000, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("molten_niobium", 3500, 800, 1600, 150, 6000, 12000, 0.005, 0.01);
GeyserType("molten_cobalt", 2500, 200, 400, 150, 480, 1080, 0.016666668, 0.1);
GeyserType("oil_drip", 600, 1, 250, 50, 600, 600, 1, 1, 100, 500);
GeyserType("liquid_sulfur", 438.34998, 1000, 2000, 500);
GeyserType("molten_niobium", 3500, 800, 1600, 150, 6000, 12000, 0.005, 0.01);

export function geyserInfo(name: string): GeyserInfo|undefined {
  return db.get(name);
}
