
let fileName = 'current';

const { readFileSync, writeFileSync } = require("fs");

const {
    parseSaveGame,
    writeSaveGame,
    AIAttributeLevelsBehavior
} = require("oni-save-parser");

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

  let scaledRateSum = 0;
  for (const gameObject of item.gameObjects) {
    for (const behavior of gameObject.behaviors) {
      if (behavior.name === 'Geyser') {
        // This is close but not the same as the geyser avg output ...
        scaledRateSum += behavior.templateData.configuration.scaledRate;
      }
    }
  }

  console.log(item.name, scaledRateSum, '~g/s');
}
