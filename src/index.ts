import { Client, Events, GatewayIntentBits } from "discord.js";
import { Config } from "./Config.js";
import {
  collectAllCommands,
  registerCommands,
  handleCommands,
} from "./commands/commands.js";

const config = new Config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = await collectAllCommands();

await registerCommands(commands, config); // TODO: Env Flag to enable/disable.

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, handleCommands(commands));

client.login(config["BOT_TOKEN"]);
