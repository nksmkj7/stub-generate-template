export type commandJson = {
  name: string;
  description: string;
  stubPath: string;
  targetFilePath: string;
  fileExtension?: string;
  args?: Array<string>;
};
