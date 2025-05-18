import { ApiSpec } from "../types/api-spec.ts";
import { ApiSpecParser } from "./api-spec-parser.ts";

export class ApiSpecJsonParser extends ApiSpecParser {
  protected override async parseFileContent(
    content: string,
  ): Promise<ApiSpec[]> {
    return await JSON.parse(content) as ApiSpec[];
  }
}
