# stub-generates-template

# About
Command line tool to create templates from stub files according to the command registry file i.e. command.js.

# installation
```npm
npm install -D stub-generates-template
```

### command.js
This is the file where all your commands are registered. One should create command.js file at root of your project. If path of command.js is other that root directory, one should pass path to command.js from directory as -f or --stubCommandFile option. Command file should look like below:

<mark>**command.js**</mark>
```json
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
      stubPath: "./stubs/service.stub",
      targetFilePath: "./services",
      args: ["serviceName],
    },
  ],
};
```
### Description object keys included in command.json
<u>**commands**</u> <br>
commands key consists the array of objects and each object defines the necessary values to generate specific template from specific stub. 
|key| value | Description
| ----------- | ----------- |----------- 
|name| string| command name
|description | string| command description
|stubPath| string|  path to the stub file
|targetFilePath| string| path where templates to be created
|fileExtension| string [optional] default is ".js"| extension of template files. *Note: extension should be like .js / .ts*
|args| [string]| array of string that has been used in stub file to be replaced while creating template. *Note: At least one argument must be passed and first argument is also used for file name.*

### stub files (*.stub)
`stub files` are the files based upon which templates are created. A stub file that create controller template looks like: 

<mark>**controller.stub**</mark>
```js
export class <%=stub.controllerName>{

}

```
<u>*stub.controllerName*</u> will eventually replaced by the argument that has been passed in command.

**Note**: `stub.` should always be appended before every arguments and should be wrapped by `<%= >`


# usage (CLI)
```
stub-wiz make:controller TestController
```
Above command will create TestController.js file inside controllers folder (i.e. targetFilePath).

```
stub-wiz make:controller MyFolder/TestController
```
Above command will create TestController.js file inside controllers/MyFolder.

```
stub-wiz
```
To list all the available commands.