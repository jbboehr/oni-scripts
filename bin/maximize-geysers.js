
let fileName = 'current';

const { readFileSync, writeFileSync } = require("fs");

const {
    parseSaveGame,
    writeSaveGame,
    AIAttributeLevelsBehavior
} = require("oni-save-parser");

const {
  Geyser,
  geyserInfo,
  resample,
} = require('./geyser.js');

function loadFile(fileName) {
  const fileData = readFileSync(`./${fileName}.sav`);
  return parseSaveGame(fileData.buffer, {
    versionStrictness: 'major',
  });
}

function saveFile(fileName, save) {
  const fileData = writeSaveGame(save);
  writeFileSync(`./${fileName}.sav`, new Uint8Array(fileData));
}

const saveData = loadFile(fileName);

const items = saveData.gameObjects.filter(x => x.name.includes("Geyser") || x.name === "OilWell");
for (const item of items) {
  console.log(item.name, item.gameObjects.length);

  for (const gameObject of item.gameObjects) {
    for (const behavior of gameObject.behaviors) {
      if (behavior.name === 'Studyable') {
        if (behavior.templateData.studied === false) {
          console.log("Patching studyable", item.name);
          behavior.templateData.studied = true;
          behavior.templateData.markedForStudy = true;
          behavior.templateData.numberOfUses = 3;
        }
      }

      if (behavior.name === 'Geyser') {
        let short_name = item.name.replace("GeyserGeneric_", "");
        let info = geyserInfo(short_name);

        let obj = new Geyser({
          name: short_name,
          minRatePerCycle: info.minRatePerCycle,
          maxRatePerCycle: info.maxRatePerCycle,

          rateRoll: behavior.templateData.configuration.rateRoll,
          iterationLengthRoll: behavior.templateData.configuration.iterationLengthRoll,
          yearLengthRoll: behavior.templateData.configuration.yearLengthRoll,
          yearPercentRoll: behavior.templateData.configuration.yearPercentRoll,
          scaledRate: behavior.templateData.configuration.scaledRate,
          scaledIterationLength: behavior.templateData.configuration.scaledIterationLength,
          scaledIterationPercent: behavior.templateData.configuration.scaledIterationPercent,
          scaledYearLength: behavior.templateData.configuration.scaledYearLength,
          scaledYearPercent: behavior.templateData.configuration.scaledYearPercent,
        });

        console.log('INIT', {
          ...obj,
          emitRate: obj.getEmitRate(),
        });

        let patched_obj = obj.clone();

        let factor_p = 100;
        let factor_v = 1 - (1 / factor_p);

        if (obj.rateRoll < factor_v) {
          patched_obj.setRateRoll(factor_v + (obj.rateRoll / factor_p));

          console.log("Patching rateRoll", item.name, obj.rateRoll, patched_obj.rateRoll);
          console.log("Patching scaledRate", item.name, obj.scaledRate, patched_obj.scaledRate);
        }

        console.log('PATCH', {
          ...patched_obj,
          emitRate: patched_obj.getEmitRate(),
        });

        behavior.templateData.configuration.rateRoll = patched_obj.rateRoll;
        behavior.templateData.configuration.scaledRate = patched_obj.scaledRate;
      }
    }
  }
}

saveFile(`${fileName}-tweaked`, saveData);
