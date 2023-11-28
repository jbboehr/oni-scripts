
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

const sg = saveData.gameObjects.find(x => x.name === "SaveGame");
for (const obj of sg.gameObjects) {
  for (const behavior of obj.behaviors) {
    if (behavior.name === 'SaveGame') {
      console.log('sandboxEnabled', behavior.templateData.sandboxEnabled);
      behavior.templateData.sandboxEnabled = false;
    }
  }
}

saveFile(`${fileName}-tweaked`, saveData);