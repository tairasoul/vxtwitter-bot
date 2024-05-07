import * as oceanic from "oceanic.js";
import { jsonc } from "jsonc";
import fs from "node:fs"
import path from 'path';
import { fileURLToPath } from 'url';
import util from "util";
const __dirname = path.dirname(decodeURIComponent(fileURLToPath(import.meta.url)));

const cfgpath = path.join(__dirname, "..", "config.jsonc");

const cfg = jsonc.parse(fs.readFileSync(cfgpath, 'utf8')) as { token: string; provider: "vxtwitter" | "fxtwitter" };

const bot = new oceanic.Client(
    {
        auth: cfg.token,
        gateway: {
            intents: [
                "MESSAGE_CONTENT",
                "GUILD_MESSAGES",
                "GUILDS"
            ]
        }
    }
)

const twitterLinkRegex = /https:\/\/(?:twitter|x)\.com\/[a-zA-Z0-9]+\/status\/[a-zA-Z0-9]+/g;

bot.on("messageCreate", async (message) => {
    const link = message.content.trim().match(twitterLinkRegex);
    if (link != null) {
        const replaced = link[0].replace(/(?:twitter|x)\.com/g, `${cfg.provider}.com`);
        console.log(replaced);
        await message.channel?.createMessage({content: replaced, messageReference: { messageID: message.id, guildID: message.guildID as string }});
    }
})

await bot.connect();