import {Args, Command, Flags} from '@oclif/core'
import {
    parseSaveGame, writeSaveGame,
} from "oni-save-parser";
import {readFile, writeFile} from "fs/promises";

export default class DisableSandbox extends Command {
    static args = {
        input: Args.file({required: true}),
        output: Args.file({required: true}),
    }

    static description = 'Disable sandbox'

    async run(): Promise<void> {
        const {args, flags} = await this.parse(DisableSandbox)

        this.log(`Reading save file: ${args.input}`);
        const fileData = await readFile(args.input);
        const saveData = parseSaveGame(fileData.buffer, {
            versionStrictness: 'major',
        });

        const sg = saveData.gameObjects.find(x => x.name === "SaveGame");
        if (sg) {
            for (const obj of sg.gameObjects) {
                for (const behavior of obj.behaviors) {
                    if (behavior.name === 'SaveGame') {
                        this.log(`Setting sandboxEnabled, prev value ${behavior.templateData.sandboxEnabled}, to false`);
                        behavior.templateData.sandboxEnabled = false;
                    }
                }
            }
        }

        this.log(`Writing save file: ${args.output}`);
        await writeFile(`${args.output}`, new Uint8Array(writeSaveGame(saveData)));
    }
}
