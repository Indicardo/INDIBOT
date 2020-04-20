import chalk from "chalk";
import moment from "moment";
import { inspect } from "util";
import { createLogger, format, transports } from "winston";
import RotateFile from "winston-daily-rotate-file";

export class LoggerService {
  public logger = createLogger({
    transports: [
      new transports.Console(),
      new RotateFile({
        filename: "%DATE%.log",
        dirname: process.cwd() + "/logs",
        maxFiles: "15d",
        maxSize: "256m",
      }),
    ],
    exitOnError: false,
    format: this.baseFormat(),
  });

  protected baseFormat() {
    const formatMessage = (log: { level: string; message: any }) =>
      `${this.setColour(
        "timestamp",
        `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`
      )}: [${this.setColour(log.level)}] ${log.message}`;
    const formatError = (log: any) =>
      `${this.setColour(
        "timestamp",
        `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`
      )}: [${this.setColour(log.level)}] ${log.message}\n ${log.stack}\n`;
    const _format = (log: { message: any; level: any }) =>
      log instanceof Error
        ? formatError(log)
        : formatMessage(
            typeof log.message === "string"
              ? log
              : Object.create({
                  level: log.level,
                  message: inspect(log.message, { showHidden: true, depth: 1 }),
                })
          );

    return format.combine(format.printf(_format));
  }

  protected setColour(type: string, content?: string) {
    type = type.toUpperCase();

    switch (type.toLowerCase()) {
      default:
        return chalk.cyan(type);
      case "info":
        return chalk.greenBright(type);
      case "debug":
        return chalk.magentaBright(type);
      case "warn":
        return chalk.yellowBright(type);
      case "error":
        return chalk.redBright(type);
      case "timestamp":
        return chalk.gray(content);
    }
  }
}
