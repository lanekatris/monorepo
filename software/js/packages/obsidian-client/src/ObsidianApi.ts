export interface ObsidianApi {
  app: {
    vault: {
      create: (path: string, content: string) => void;
    };
  };
  obsidian: {
    Notice: (message: string) => void;
  };
}
