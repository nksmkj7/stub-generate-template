import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

describe("template generate command", function () {
  let execute: any;
  beforeEach(() => {
    execute = util.promisify(exec);
  });

  test("throw an exception when command registry i.e. command.js is not found in root of current working directory", async () => {
    expect(() => fs.statSync(path.join(process.cwd(), "command.js"))).toThrow();
  });

  test("command.js path is specified by --stubCommandFile options", async () => {
    const filePath = path.join(
      process.cwd(),
      "controllers",
      "test/controller/TestController.js"
    );
    await execute(
      "stub-wiz make:controller test/controller/TestController --stubCommandFile=test/command.js"
    );
    const fileExist = fs.existsSync(filePath);
        if (fileExist) {
      fs.rmSync(filePath, { recursive: true });
        }
    expect(fileExist).toBeTruthy();
  });

  test("at least one argument must be passed", async () => {
     await expect(
      execute("stub-wiz make:service --stubCommandFile=test/command.js")
    ).rejects.toThrow("At least one argument should be passed");
  });

  test("file should be created in the specified path, passed as the first argument", async () => {
    const filePath = path.join(
      process.cwd(),
      "controllers",
      "test/controller/TestController.js"
    );
    await execute(
      "stub-wiz make:controller test/controller/TestController --stubCommandFile=test/command.js"
    );
    const fileExist = fs.existsSync(filePath);
    expect(fileExist).toBeTruthy();
    if (fileExist) {
      fs.rmSync(filePath, { recursive: true });
    }
  });
});
