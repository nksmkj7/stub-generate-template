import * as generator from "../lib/generator";
import path from "path";
import fs from "fs";
import { commandJson } from "../src/interfaces";

describe("Command registry path", function () {
  it("should return command.js path of current working directory when custom path is not provided", () => {
    const commandCwdPaht = path.resolve(process.cwd(), "command.js");
    expect(generator.getCommandRegistryPath()).toEqual(commandCwdPaht);
  });

  it("should return resolve path of current working directory and given relative path when custom path is provided", () => {
    const mock = jest.spyOn(fs, "existsSync");
    mock.mockReturnValue(true);
    const customPath = "/generator/command.js";
    expect(generator.getCommandRegistryPath(customPath)).toEqual(
      path.resolve(process.cwd(), customPath)
    );
    expect(mock).toHaveBeenCalled();
    mock.mockRestore();
  });

  it("should throw an error if command.js is not found", () => {
    const customPath = "/generator/command.js";
    expect(() => generator.getCommandRegistryPath(customPath)).toThrowError(
      new Error("command registry file is missing.")
    );
  });
});

describe("Get commands", () => {
  it("should return commands as an object", async () => {
    const commandObject = await generator.getCommands("test/command.js");
    expect(commandObject).toEqual(
      expect.objectContaining({
        commands: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
            stubPath: expect.any(String),
            targetFilePath: expect.any(String),
            args: expect.any(Array),
          }),
        ]),
      })
    );
  });
  it("should throw an exception if invalid path is supplied", async () => {
    await expect(generator.getCommands("/invalidPath")).rejects.toThrow(
      "command registry file is missing."
    );
  });
});

describe("generate command", () => {
  it("should generate command with arguments as per supplied command object", () => {
    const commandObject: commandJson = {
      name: "make:service",
      description: "create service",
      stubPath: "./stubs/controller.stub",
      targetFilePath: "./services",
      args: ["serviceName"],
    };
    const generatedCommand =
      generator.generateCommandWithArguments(commandObject);
    expect(generatedCommand).toEqual("make:service <serviceName>");
  });
});

describe("generate file from template ", () => {
  let variables: { personName: string },
    options: { variable: string },
    targetFilePath: string,
    sourceFilePath: string;
  beforeEach(() => {
    options = { variable: "stub" };
    variables = { personName: "nksmkj" };
    targetFilePath = path.resolve(process.cwd(), "test/writing-test.js");
    sourceFilePath = path.resolve(process.cwd(), "test/test.stub");
  });
  afterEach(() => {
    fs.writeFileSync(targetFilePath, "");
  });
  test("replace content with values", () => {
    const content = "Greetings, <%=stub.personName%>";
    expect(generator.jsSourceTemplate(content, options)(variables)).toEqual(
      "Greetings, nksmkj"
    );
  });

  test("read stub file from given path and replace the content with values", () => {
    const stubFilePath = path.resolve(process.cwd(), "test/test.stub");
    expect(generator.jsFileTemplate(stubFilePath, options)(variables)).toEqual(
      "Greetings! nksmkj"
    );
  });

  test("write content to the file specified by file path", () => {
    generator.writeJsFileUsingTemplate(
      targetFilePath,
      sourceFilePath,
      options,
      variables
    );
    const contentBuffer = fs.readFileSync(targetFilePath);
    expect(contentBuffer.toString()).toEqual("Greetings! nksmkj");
  });

  it("should throw an exception when target file is not found", () => {
    const randomTargetFilePath = "/random-path";
    expect(() =>
      generator.writeJsFileUsingTemplate(
        randomTargetFilePath,
        sourceFilePath,
        options,
        variables
      )
    ).toThrow();
  });

  it("should throw an exception when source file is not found", () => {
    const randomSourceFilePath = "/random-path";
    expect(() =>
      generator.writeJsFileUsingTemplate(
        targetFilePath,
        randomSourceFilePath,
        options,
        variables
      )
    ).toThrow();
  });

  it("should throw an exception when variable key has a value other than `stub` in options object", () => {
    expect(() =>
      generator.writeJsFileUsingTemplate(
        targetFilePath,
        sourceFilePath,
        { variable: "test" },
        variables
      )
    ).toThrow();
  });

  it("should create a file content without variable in stub file", () => {
    generator.writeJsFileUsingTemplate(
      targetFilePath,
      sourceFilePath,
      options,
      {}
    );
    const contentBuffer = fs.readFileSync(targetFilePath);
    expect(contentBuffer.toString()).toEqual("Greetings! ");
  });
});
