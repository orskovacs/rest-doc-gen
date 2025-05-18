import ollama, { Message } from "ollama";
import { ApiSpec } from "../types/api-spec.ts";

export class DocumentationGenerator {
  public async generate(
    spec: ApiSpec,
    model: string,
    verbose: boolean,
  ): Promise<string> {
    const prompt = PROMPT_TEMPLATE
      .replace("{method}", spec.method)
      .replace("{path}", spec.path)
      .replace("{description}", spec.description ?? "No description provided")
      .replace(
        "{requestBody}",
        JSON.stringify(spec.requestBody, null, 2) ?? "None",
      )
      .replace(
        "{responseBody}",
        JSON.stringify(spec.responseBody, null, 2) ?? "None",
      );

    if (verbose) {
      console.log("Sending prompt to LLM:", prompt);
    }

    try {
      let fullResponse = "";
      const response = await ollama.chat({
        model,
        messages: [{ role: "user", content: prompt }] as [Message],
        stream: true,
      });

      console.log(`Generating docs for ${spec.method} ${spec.path}...`);

      for await (const part of response) {
        if (verbose) {
          await Deno.stdout.write(
            new TextEncoder().encode(part.message.content),
          );
        }
        fullResponse += part.message.content;
      }

      return fullResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error generating documentation: ${error.message}`);
        return `# Error Generating Documentation\n\nFailed to generate documentation for ${spec.method} ${spec.path}: ${error.message}`;
      }

      return `# Error Generating Documentation\n\nFailed to generate documentation for ${spec.method} ${spec.path}: ${error}`;
    }
  }
}

const PROMPT_TEMPLATE = `
You are an API documentation expert. Generate comprehensive documentation for the following REST API endpoint.
Analyze the input and output structures carefully.

Endpoint: {method} {path}

Description: {description}

Request Body:
{requestBody}

Response Body:
{responseBody}

Format your response as markdown with the following sections:
1. Endpoint Overview
2. Request Parameters (path, query, headers as applicable)
3. Request Body (with field descriptions, types, constraints, and examples)
4. Response (with status codes, field descriptions, types, and examples)
5. Error Responses
6. Usage Examples (curl and JavaScript fetch)

It is very important that you don not leave out any sections and to format your response as markdown.
`;
