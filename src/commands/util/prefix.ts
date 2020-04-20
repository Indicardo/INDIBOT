import { Command } from "discord-akairo";

export default class PrefixCommand extends Command {
  constructor() {
    super("prefix", {
      aliases: ["prefix"],
      args: [
        {
          id: "prefix",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, { prefix }: { prefix: string }) {
    await this.client.settings.set(message.guild, { prefix });
    return message.reply(
      this.client.i18n.translate(
        "Done! The bot's prefix has changed to",
        message.settings.locale,
        "util"
      ) + ` \`${prefix}\`.`
    );
  }
}
