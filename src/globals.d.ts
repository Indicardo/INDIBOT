import type { Message as DiscordMessage } from "discord.js";

declare global {
  type Message = DiscordMessage & {
    settings: { prefix: string; blacklist: string[]; locale: string };
  };
}
