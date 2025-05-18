import { ApiSpec } from "../types/api-spec.ts";

export abstract class ApiSpecParser {
  public async parse(
    filePath: string,
  ): Promise<ApiSpec[]> {
    try {
      const content = await Deno.readTextFile(filePath);

      return this.parseFileContent(content);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to parse API specification file: ${error.message}`,
        );
      }
      Deno.exit(1);
    }
  }

  protected abstract parseFileContent(
    content: string,
  ): ApiSpec[] | Promise<ApiSpec[]>;
}
