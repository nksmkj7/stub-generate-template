module.exports = {
  commands: [
    {
      name: "make:controller",
      description: "create controller",
      stubPath: "./stubs/controller.stub",
      targetFilePath: "./controllers",
      fileExtension: ".js",
      args: ["controllerName"],
    },
    {
      name: "make:service",
      description: "create service",
      stubPath: "./stubs/controller.stub",
      targetFilePath: "./services",
      args: ["serviceName"],
    },
  ],
};
