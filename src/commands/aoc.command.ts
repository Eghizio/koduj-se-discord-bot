import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "./commands.js";
import { AocClient } from "../lib/aoc/AocClient.js";
import { Config } from "../Config.js";

const LEADERBOARD_ID = 1586078; // Also id of my AOC user :D
const LEADERBOARD_CODE = `1586078-adbbc896`;
const JOIN_LINK = `https://adventofcode.com/${new Date().getFullYear()}/leaderboard/private`;

const aoc = new AocClient(new Config()["AOC_SESSION_COOKIE"]); // Single instance to keep cache.

export default {
  data: new SlashCommandBuilder()
    .setName("aoc")
    .setDescription("Advent of Code leaderboard!"),

  execute: async (interaction) => {
    try {
      const leaderboard = await aoc.getLeaderboard(LEADERBOARD_ID);

      const year = leaderboard.event ?? new Date().getFullYear();

      const topMembers = Object.values(leaderboard.members)
        .toSorted((a, b) => b.local_score - a.local_score)
        .slice(0, 10);

      const messages = [
        `**🎄 Advent of Code ${year} 🎁**`,
        ...topMembers.map(
          ({ name, stars }, index) =>
            `\`${(index + 1)
              .toString()
              .padStart(2, " ")}\`. ${name} - ${stars} ⭐️`
        ),
      ];

      await interaction.reply(messages.join("\n"));
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "🛑 Nie udało się załadować wyników. Możliwe że ciastko wygasło? 🍪"
      );
    } finally {
      await interaction.followUp(
        `🌟 Dołącz do wspólnej zabawy z kodem \`${LEADERBOARD_CODE}\` tutaj:\n${JOIN_LINK}`
      );
    }
  },
} satisfies BotCommand;
