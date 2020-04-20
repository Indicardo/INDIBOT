import { Command } from "discord-akairo";
import { User } from "discord.js";

export default class BlacklistCommand extends Command {
  constructor() {
    super("blacklist", {
      aliases: ["blacklist"],
      args: [
        {
          id: "user",
          type: "user",
        },
      ],
    });
  }

  async exec(message: Message, { user }: { user: User }) {
    if (!user || !(user instanceof User)) return;
    if (message.author === user)
      return message.channel.send(
        this.client.i18n.translate(
          "You can't blacklist yourself!",
          message.settings.locale,
          "util"
        )
      );

    if (message.settings.blacklist.includes(user.id)) {
      const blacklist = message.settings.blacklist;
      if (blacklist.indexOf(user.id) > -1) {
        blacklist.splice(blacklist.indexOf(user.id), 1);
      }

      await this.client.settings.set(message.guild, { blacklist });
      return message.channel.send(
        this.client.i18n.translate(
          "Done! Welcome back,",
          message.settings.locale,
          "util"
        ) + ` ${user}.`
      );
    }

    const blacklist = message.settings.blacklist.concat([user.id]);
    await this.client.settings.set(message.guild, { blacklist });
    return message.channel.send(
      this.client.i18n.translate(
        "Done! Shame on you,",
        message.settings.locale,
        "util"
      ) + ` ${user}.`
    );
  }
}
