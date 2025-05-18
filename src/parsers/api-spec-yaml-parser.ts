import { ApiSpec } from "../types/api-spec.ts";
import { parse as parseYAML } from "@std/yaml";
import { ApiSpecParser } from "./api-spec-parser.ts";

export class ApiSpecYamlParser extends ApiSpecParser {
  protected override parseFileContent(
    content: string,
  ): ApiSpec[] | Promise<ApiSpec[]> {
    return parseYAML(content) as ApiSpec[];
  }
}
