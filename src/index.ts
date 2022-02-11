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
  targetFilePathWithoutFilename,
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
        if (this.args.length <= 0) {
          throw new Error("At least one argument should be passed");
        }
        const sourceFilePath = path.resolve(process.cwd(), stubPath);
        const fileExtension = commandJson.fileExtension ?? ".js";
        const targetFilePath = path.join(
          process.cwd(),
          commandJson.targetFilePath
        );
        const argumentToPass: { [index: string]: any } = {};
        if (commandJson.args && commandJson.args.length >= 0) {
          for (const arg of commandJson.args) {
            argumentToPass[arg] = this.args[commandJson.args.indexOf(arg)];
          }
        }
        if (
          checkIfFileAlreadyExists(
            path.join(targetFilePath, `${this.args[0]}${fileExtension}`)
          )
        ) {
          throw new Error(`${this.args[0]}${fileExtension} is already exist`);
        }
        ensureDirectoryExists(
          targetFilePathWithoutFilename(
            path.join(targetFilePath, `${this.args[0]}`)
          )
        );
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
  return program.parseAsync(process.argv);
};
buildCommands();
