import { Command } from "discord-akairo";
import { MessageEmbed, GuildMember } from "discord.js";

function display(seconds: number) {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
}

export default class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue", "q"],
      category: "music",
    });
  }

  async exec(message: Message) {
    const serverQueue = this.client.videoHandler.queue.get(message.guild.id);

    if (!message.guild.voice.connection)
      return message.channel.send(
        this.client.i18n.translate(
          "Uh oh chief! The queue is empty.",
          message.settings.locale,
          "music"
        )
      );

    return message.channel.send(
      new MessageEmbed()
        .setTitle(
          `🎵  ${this.client.i18n.translate(
            "Current queue",
            message.settings.locale,
            "music"
          )} | ${serverQueue.videos.length} ${this.client.i18n.translate(
            "videos",
            message.settings.locale,
            "music"
          )} | \`${display(
            serverQueue.videos
              .map((item: { durationSeconds: number }) => item.durationSeconds)
              .reduce((prev: number, next: number) => prev + next)
          )}\``
        )
        .setDescription(
          `${serverQueue.videos
            .map(
              (
                video: { title: string; duration: string; by: GuildMember },
                index: number
              ) =>
                `\`${index + 1}.\` \`[${video.duration}]\` **${
                  video.title
                }** - <@${video.by.id}>`
            )
            .join("\n")}`
        )
        .setFooter(
          `▶️ ${serverQueue.videos[0].title} - ${serverQueue.videos[0].by.username}#${serverQueue.videos[0].by.discriminator}`
        )
        .setColor(0x41f4e8)
    );
  }
}
