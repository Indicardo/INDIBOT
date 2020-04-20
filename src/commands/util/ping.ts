import { Command } from "discord-akairo";

export default class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
    });
  }

  exec(message: Message) {
    return message.reply("Pong!");
  }
}
