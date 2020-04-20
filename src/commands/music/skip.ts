import { Command } from "discord-akairo";

export default class SkipCommand extends Command {
  constructor() {
    super("skip", {
      aliases: ["skip", "s"],
      category: "music",
    });
  }

  async exec(message: Message) {
    if (!message.member.voice.channel)
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like you aren't connected to a voice channel. Try again",
          message.settings.locale,
          "music"
        )
      );
    if (!message.guild.voice || !message.guild.voice.connection)
      return message.channel.send(
        this.client.i18n.translate(
          "Uh oh chief! The queue is empty.",
          message.settings.locale,
          "music"
        )
      );

    message.guild.voice.connection.dispatcher.end();
  }
}
