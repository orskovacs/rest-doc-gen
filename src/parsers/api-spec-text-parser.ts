import { ApiSpec } from "../types/api-spec.ts";
import { ApiSpecParser } from "./api-spec-parser.ts";

export class ApiSpecTextParser extends ApiSpecParser {
  protected override parseFileContent(
    content: string,
  ): ApiSpec[] | Promise<ApiSpec[]> {
    throw new Error("Method not implemented.");
  }
}
