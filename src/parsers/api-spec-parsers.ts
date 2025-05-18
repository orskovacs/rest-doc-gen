import { ApiSpecFormat } from "../types/api-spec-format.ts";
import { ApiSpecParser } from "./api-spec-parser.ts";
import { ApiSpecJsonParser } from "./api-spec-json-parser.ts";
import { ApiSpecYamlParser } from "./api-spec-yaml-parser.ts";
import { ApiSpecTextParser } from "./api-spec-text-parser.ts";

export const parsers: Record<ApiSpecFormat, ApiSpecParser> = {
  json: new ApiSpecJsonParser(),
  yaml: new ApiSpecYamlParser(),
  text: new ApiSpecTextParser(),
};
