import { Command } from "discord-akairo";

export default class ResumeCommand extends Command {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      category: "music",
    });
  }

  async exec(message: Message) {
    const serverQueue = this.client.videoHandler.queue.get(message.guild.id);

    if (message.guild.voice.connection) {
      serverQueue.playing = true;
      message.guild.voice.connection.dispatcher.resume();
      return message.react("▶");
    } else {
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like nothing is playing",
          message.settings.locale,
          "music"
        )
      );
    }
  }
}
