import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "./commands.js";

const EGHIZIO_ID = "288034654173396993";

const positiveEmojis = [
  "👋",
  "😎",
  "🔥",
  "✨",
  "🎉",
  "⭐",
  "👀",
  "🥸",
  "😴",
  "🤑",
  "😵‍💫",
  "🤖",
  "🙈",
  "🙉",
  "🙊",
  "🤙",
  "🤝",
  "🚀",
  "👑",
  "🧸",
  "🧯",
  "🧏 🤫",
];

const negativeEmojis = ["🫣", "👀", "🥸", "😶‍🌫️", "😒", "🙄", "🫥", "😪", "😴"];

const randomSymbol = (symbols: string[] = positiveEmojis) =>
  Math.random() > 0.5
    ? symbols[Math.floor(Math.random() * symbols.length)]
    : "";

export default {
  data: new SlashCommandBuilder()
    .setName("hi")
    .setDescription("Say Hi to our Bot 👋"),

  execute: async (interaction) => {
    const userId = interaction.user.id;
    const fallbackSymbol = userId === EGHIZIO_ID ? "❤️" : "";

    const isBotInGoodMood = Math.random() > 0.2;

    const symbol =
      randomSymbol(isBotInGoodMood ? positiveEmojis : negativeEmojis) ||
      fallbackSymbol;

    const message = isBotInGoodMood ? `Hi <@${userId}> ${symbol}` : symbol;

    await interaction.reply(message);
  },
} satisfies BotCommand;
