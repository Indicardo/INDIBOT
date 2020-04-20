import { Command } from "discord-akairo";

export default class LanguageCommand extends Command {
  constructor() {
    super("language", {
      aliases: ["language", "lenguaje"],
      args: [
        {
          id: "locale",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, { locale }: { locale: string }) {
    const locales = this.client.i18n.getLocales();
    if (!locales.includes(locale)) {
      return message.reply(
        this.client.i18n.translate(
          "Uh oh! That doesn't look like a valid locale. Valid locales include:",
          message.settings.locale,
          "util"
        ) +
          " \n" +
          locales.join("\n")
      );
    }

    await this.client.settings.set(message.guild, { locale });
    return message.reply(
      this.client.i18n.translate(
        "Done! The bot's language has changed.",
        locale,
        "util"
      )
    );
  }
}
