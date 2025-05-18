import ollama, { Message } from "ollama";
import { ApiSpec } from "../types/api-spec.ts";
import { ApiSpecParser } from "./api-spec-parser.ts";
import { GlobalConfig } from "../config/global-config.ts";

export class ApiSpecTextParser extends ApiSpecParser {
  protected override async parseFileContent(
    content: string,
  ): Promise<ApiSpec[]> {
    try {
      console.log("Parsing text-based API specification...");

      const prompt = PROMPT_TEMPLATE
        .replace("{content}", content);

      let fullResponse = "";
      const response = await ollama.chat({
        model: GlobalConfig.getInstance().modelName,
        messages: [{ role: "user", content: prompt }] as [Message],
        stream: true,
      });

      for await (const part of response) {
        if (GlobalConfig.getInstance().verbose) {
          await Deno.stdout.write(
              new TextEncoder().encode(part.message.content),
          );
        }
        fullResponse += part.message.content;
      }

      // Extract JSON from the response
      // Ollama might wrap the JSON in code blocks or add extra text
      const jsonMatches = fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
        fullResponse.match(/```\n([\s\S]*?)\n```/) ||
        [null, fullResponse.trim()];

      const jsonString = jsonMatches[1]?.trim() || fullResponse.trim();

      // Parse the JSON response into API specs
      try {
        const specs = JSON.parse(jsonString) as ApiSpec[];
        console.log(`Successfully parsed ${specs.length} endpoints from text`);
        return specs;
      } catch (jsonError) {
        console.error("Failed to parse JSON from Ollama response:", jsonError);
        console.log("Raw response:", fullResponse);
        throw new Error("Failed to parse JSON from Ollama response");
      }
    } catch (error) {
      console.error("Error parsing text API specification:", error);
      throw error;
    }
  }
}

const PROMPT_TEMPLATE = `
Parse the following API documentation draft into a structured JSON format. 
Each endpoint should be an object with the following properties:
- method: HTTP method (GET, POST, PUT, DELETE, etc.)
- path: API endpoint path
- description: Optional description of the endpoint
- requestBody: Request body (if any)
- responseBody: Response body (if any)

Return only valid JSON array of these objects, nothing else.

API Documentation draft:
{content}
`;
