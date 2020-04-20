import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import youtube from "../../providers/youtube";

export default class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play", "p"],
      category: "music",
      args: [
        {
          id: "search",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, { search }: { search: string }) {
    if (!search) return;
    if (search.startsWith("http")) search.replace(/<(.+)>/g, "$1");

    if (
      search.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
    ) {
      const playlist = await youtube.getPlaylist(search);
      const videos = await playlist.getVideos();

      for (const playlistVideo of Object.values(videos)) {
        const video = await youtube.getVideoByID(playlistVideo); // eslint-disable-line no-await-in-loop
        await this.client.videoHandler.send(video, message, true); // eslint-disable-line no-await-in-loop
      }
      return message.channel.send(
        new MessageEmbed()
          .setTitle(
            `🎵  ${this.client.i18n.translate(
              "Adding...",
              message.settings.locale,
              "music"
            )}`
          )
          .setDescription(
            this.client.i18n.translate(
              "All songs from playlist %s have been added to the queue",
              message.settings.locale,
              "music",
              playlist.title
            )
          )
          .setColor(0x41f4e8)
      );
    } else {
      let video: {
        id: any;
        title: string;
        durationSeconds: number;
        channel: { title: string; url: string };
      };

      try {
        video = await youtube.getVideo(search);
        await this.client.videoHandler.send(video, message);
      } catch {
        try {
          let id = await youtube.searchVideos(search, 1);
          video = await youtube.getVideoByID(id[0].id);
          await this.client.videoHandler.send(video, message);
        } catch {
          return message.channel.send(
            `🆘 ${this.client.i18n.translate(
              "Uh oh chief! Nothing has been found. Better luck next time!",
              message.settings.locale,
              "music"
            )}`
          );
        }
      }
    }
  }
}
