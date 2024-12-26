import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  type Interaction,
  type SlashCommandBuilder,
  Collection,
  MessageFlags,
  REST,
  Routes,
} from "discord.js";
import type { Config } from "../Config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}

export type Commands = Collection<BotCommand["data"]["name"], BotCommand>;

export const collectAllCommands = async (): Promise<Commands> => {
  const commands: Commands = new Collection();

  const commandModules = fs
    .readdirSync(__dirname)
    .filter((file) => file.slice(0, -2).endsWith(".command."))
    .map((file) => path.join(__dirname, file))
    .map((filePath) => import(filePath).then((m) => m.default));

  const commandsToRegister = await Promise.all(commandModules);

  for (const command of commandsToRegister) {
    if (!("data" in command && "execute" in command)) continue;
    commands.set(command.data.name, command);
  }

  console.log("Collected commands: ", Array.from(commands.keys()));

  return commands;
};

export const registerCommands = async (
  commandsToRegister: Commands,
  config: Config
) => {
  const rest = new REST().setToken(config["BOT_TOKEN"]);

  const commands = Array.from(commandsToRegister.values()).map((command) =>
    command.data.toJSON()
  );

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(config["APP_ID"], config["GUILD_ID"]),
      { body: commands }
    );

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleCommands =
  (commands: Commands) => async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction);

    const command = commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      const action =
        interaction.replied || interaction.deferred ? "followUp" : "reply";

      await interaction[action]({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  };
