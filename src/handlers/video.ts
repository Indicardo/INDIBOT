import { Util, MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";

import type INDIBOT from "../client";
import type { GuildMember } from "discord.js";

export class VideoHandler {
  public client: INDIBOT;

  constructor(client: INDIBOT) {
    this.client = client;
  }

  public queue: Map<any, any> = new Map();

  /**
   * Handles a search result from YouTube
   * @param {Object} video The actual video itself
   * @param {string} video.id The video's YouTube ID
   * @param {string} video.title The video's title
   * @param {number} video.durationSeconds The video's duration in seconds
   * @param {Object} video.channel The YouTube channel that uploaded that video
   * @param {string} video.channel.title The channel's name
   * @param {string} video.channel.url The channel's YouTube link
   */
  async send(
    video: {
      id: string;
      title: string;
      durationSeconds: number;
      channel: { title: string; url: string };
    },
    message: Message,
    playlist = false
  ) {
    const serverQueue = this.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      if (!message.member.voice.channel)
        return message.channel.send(
          this.client.i18n.translate(
            "Well... It seems like you aren't connected to a voice channel. Try again",
            message.settings.locale,
            "music"
          )
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT")) {
      return message.channel.send(
        this.client.i18n.translate(
          "Uh oh chief! Couldn't connect to your channel because I don't have permissions to do so.Well... It seems like you aren't connected to a voice channel. Try again",
          message.settings.locale,
          "music"
        )
      );
    }
    if (!permissions.has("SPEAK")) {
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like I can't speak here! I don't have permissions to do so.",
          message.settings.locale,
          "music"
        )
      );
    }

    const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`,
      duration:
        Math.floor(video.durationSeconds / 60) +
        ":" +
        ("0" + Math.floor(video.durationSeconds % 60)).slice(-2),
      durationSeconds: video.durationSeconds,
      by: message.author,
      author: video.channel,
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        videos: [],
        volume: 5,
        playing: true,
      };

      this.queue.set(message.guild.id, queueConstruct);
      queueConstruct.videos.push(song);

      try {
        let connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        this.play(message, queueConstruct.videos[0]);
      } catch (error) {
        this.client.logger.error(`Couldn't join channel: ${error}`);
        this.queue.delete(message.guild.id);
        return message.channel.send(
          this.client.i18n.translate(
            "Couldn't join channel",
            message.settings.locale,
            "music"
          ) +
            ": " +
            error
        );
      }
    } else {
      serverQueue.videos.push(song);

      if (playlist) return undefined;
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
              "**{{title}}** `[{{duration}}]` has been added to the queue",
              message.settings.locale,
              "music",
              { title: song.title, duration: song.duration }
            )
          )
          .setColor(0x41f4e8)
      );
    }
    return undefined;
  }

  /**
   * Plays an already handled YouTube video
   * @param {Guild} guild The guild where the video is going to be played
   * @param {Object} video The actual video itself
   * @param {string} video.id The video's YouTube ID
   * @param {string} video.url The video's YouTube URL
   * @param {string} video.title The video's title
   * @param {string} video.duration The video's duration
   * @param {GuildMember} video.by The video requester
   * @param {Message} message Latest message announcement of a video playing
   */
  async play(
    message: Message,
    video: {
      id: string;
      url: string;
      title: string;
      duration: string;
      by: GuildMember;
    },
    last?: Message
  ): Promise<void> {
    const serverQueue = this.queue.get(message.guild.id);

    const leave = () => {
      serverQueue.voiceChannel.leave();
      this.queue.delete(message.guild.id);
      return;
    };

    if (!video) leave();

    serverQueue.videos[0].timestamp = new Date();

    if (last) last.delete();
    const playMessage: Message = await serverQueue.textChannel.send(
      new MessageEmbed()
        .setTitle(
          `🎶 ${this.client.i18n.translate(
            "Playing...",
            message.settings.locale,
            "music"
          )}`
        )
        .setDescription(
          `[${video.title}](https://youtube.com/watch?v=${video.id}) \`[${video.duration}]\` - <@${video.by.id}>`
        )
        .setColor(0x41f4e8)
    );

    const dispatcher = serverQueue.connection
      .play(ytdl(video.url))
      .on("finish", () => {
        serverQueue.videos.shift();
        if (serverQueue.videos.length > 0) {
          setTimeout(() => {
            this.play(message, serverQueue.videos[0], playMessage);
          }, 250);
        } else {
          leave();
        }
      })
      .on("error", (error: any) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
    return;
  }
}
