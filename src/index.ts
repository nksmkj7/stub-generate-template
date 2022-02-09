#!/usr/bin/env node
"use strict";

import path from "path";
import { Command } from "commander";
import {
  writeJsFileUsingTemplate,
  ensureDirectoryExists,
  checkIfFileAlreadyExists,
  getCommands,
  generateCommandWithArguments,
} from "./generator";
import { commandJson } from "./interfaces";

const program = new Command().option(
  "-f, --stubCommandFile [filePath]",
  "File path to stub commands registry"
);

export const buildCommands = async () => {
  program.parseAsync(process.argv);
  const options = program.opts();
  const commands = (await getCommands(options.stubCommandFile)).commands;
  commands.forEach((commandJson: commandJson) => {
    const stubPath = commandJson.stubPath;
    program
      .command(generateCommandWithArguments(commandJson))
      .description(commandJson.description)
      .action(function (this: any) {
        const sourceFilePath = path.resolve(process.cwd(), stubPath);
        const fileExtension = commandJson.fileExtension ?? ".js";
        const targetFilePath = path.join(
          path.resolve(process.cwd(), commandJson.targetFilePath)
        );
        const argumentToPass: { [index: string]: any } = {};
        for (const arg of commandJson.args) {
          argumentToPass[arg] = this.args[commandJson.args.indexOf(arg)];
        }
        if (
          checkIfFileAlreadyExists(
            path.join(targetFilePath, `${this.args[0]}${fileExtension}`)
          )
        ) {
          throw new Error(`${this.args[0]}${fileExtension} is already exist`);
        }
        ensureDirectoryExists(targetFilePath);
        writeJsFileUsingTemplate(
          path.join(targetFilePath, `${this.args[0]}${fileExtension}`),
          sourceFilePath,
          {
            variable: "stub",
          },
          argumentToPass
        );
      });
  });
  program.parseAsync(process.argv);
};
