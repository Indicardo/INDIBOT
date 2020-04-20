import { Command } from "discord-akairo";

export default class StopCommand extends Command {
  constructor() {
    super("stop", {
      aliases: ["stop"],
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
    if (!message.guild.voice.connection)
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like nothing is playing",
          message.settings.locale,
          "music"
        )
      );

    message.guild.voice.connection.disconnect();
    this.client.videoHandler.queue.delete(message.guild.id);
    return message.react("🛑");
  }
}
