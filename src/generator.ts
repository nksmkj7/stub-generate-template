import { template } from "lodash";

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  existsSync,
} from "fs";

import path from "path";
import { commandJson } from "./interfaces";

export const getCommandRegistryPath = (customPath?: string) => {
  if (!customPath) {
    customPath = path.resolve(process.cwd(), "command.js");
  } else {
    customPath = path.resolve(process.cwd(), customPath);
    console.log(customPath, "custom path is");
  }
  if (!existsSync(customPath)) {
    throw new Error("command registry file is missing.");
  }
  return customPath;
};

export const getCommands = async (registryPath?: string) => {
  return import(getCommandRegistryPath(registryPath));
};

export const generateCommandWithArguments = (commandJson: commandJson) => {
  if (!commandJson || !commandJson.name) {
    throw new Error("Invalid command object");
  }
  let command = `${commandJson.name}`;
  commandJson?.args &&
    commandJson.args.map((arg) => {
      command += ` <${arg}>`;
    });
  return command;
};

export const jsSourceTemplate = (
  content: string,
  options: { [index: string]: any }
) =>
  template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options,
  });

export const jsFileTemplate = (
  filePath: string,
  options: { [index: string]: any }
) => {
  const contentBuffer = readFileSync(filePath);
  return jsSourceTemplate(contentBuffer.toString(), options);
};

export const writeJsFileUsingTemplate = (
  targetFilePath: string,
  sourceFilePath: string,
  options: { [index: string]: any },
  variables: { [index: string]: any }
) =>
  writeFileSync(
    targetFilePath,
    jsFileTemplate(sourceFilePath, options)(variables)
  );

export const ensureDirectoryExists = (dir: string) => {
  console.log("dir is", dir);
  try {
    return statSync(dir);
  } catch (error) {
    mkdirSync(dir, { recursive: true });
  }
};

export const checkIfFileAlreadyExists = (filePath: string) => {
  try {
    return statSync(filePath);
  } catch (error) {
    return false;
  }
};

export const targetFilePathWithoutFilename = (targetFilePath: string) => {
  console.log(targetFilePath, "target file path is");
  const splitedPath = targetFilePath.split("/");
  splitedPath.pop();
  return splitedPath.join("/");
};
