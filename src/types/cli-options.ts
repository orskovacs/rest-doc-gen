import { ApiSpecFormat } from "./api-spec-format.ts";

export interface CliOptions {
  model: string;
  input: string;
  format: ApiSpecFormat;
  output: string;
  verbose: boolean;
}
