export const supportedSpecFormats = ["json", "yaml", "text"] as const;

export type ApiSpecFormat = typeof supportedSpecFormats[number];
