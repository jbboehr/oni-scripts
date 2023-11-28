import {Args, Command, Flags} from '@oclif/core'
import {
  parseSaveGame,
  writeSaveGame,
} from "oni-save-parser";
import {readFile, writeFile} from "fs/promises";
import {Geyser, GeyserInfo, geyserInfo} from "../geyser.js";

export default class MaximizeGeysers extends Command {
  static args = {
    input: Args.file({required: true}),
    output: Args.file({required: true}),
  }

  static description = 'Maximize geysers'

  async run(): Promise<void> {
    const {args, flags} = await this.parse(MaximizeGeysers)

    this.log(`Reading save file: ${args.input}`);
    const fileData = await readFile(args.input);
    const saveData = parseSaveGame(fileData.buffer, {
      versionStrictness: 'major',
    });

    const items = saveData.gameObjects.filter(x => x.name.includes("Geyser") || x.name === "OilWell");
    for (const item of items) {
      this.log(`${item.name} ${item.gameObjects.length}`);

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
            const info: GeyserInfo|undefined = geyserInfo(short_name);
            if (!info) {
              throw new Error(`Unknown geyser type ${item.name}`)
            }

            const obj: Geyser = new Geyser(info, behavior.templateData.configuration);

            console.log('INIT', {
              ...obj,
              emitRate: obj.getEmitRate(),
            });

            const patched_obj: Geyser = obj.clone();

            const factor_p: number = 100;
            const factor_v: number = 1 - (1 / factor_p);

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

    this.log(`Writing save file: ${args.output}`);
    await writeFile(`${args.output}`, new Uint8Array(writeSaveGame(saveData)));
  }
}
