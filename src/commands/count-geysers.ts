import {Args, Command, Flags} from '@oclif/core'
import {
    parseSaveGame,
} from "oni-save-parser";
import {readFile} from "fs/promises";

export default class CountGeysers extends Command {
    static args = {
        input: Args.file({required: true}),
    }

    static description = 'Count geysers'

    async run(): Promise<void> {
        const {args, flags} = await this.parse(CountGeysers)

        this.log(`Reading save file: ${args.input}`);
        const fileData = await readFile(args.input);
        const saveData = parseSaveGame(fileData.buffer, {
            versionStrictness: 'major',
        });

        const items = saveData.gameObjects.filter(x => x.name.includes("Geyser") || x.name === "OilWell");
        for (const item of items) {
            let scaledRateSum = 0;
            for (const gameObject of item.gameObjects) {
                for (const behavior of gameObject.behaviors) {
                    if (behavior.name === 'Geyser') {
                        // This is close but not the same as the geyser avg output ...
                        scaledRateSum += behavior.templateData.configuration.scaledRate;
                    }
                }
            }

            this.log(`${item.name} (${item.gameObjects.length}) ${scaledRateSum}`);
        }
    }
}
