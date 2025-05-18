import ollama, { Message } from "ollama";
import process from "node:process";
import { Command } from "@cliffy/command";

await new Command()
  .name("apigen")
  .version("0.1.0")
  .description("Automatic REST API documentation generator using LLM")
  .parse(Deno.args);

const model = "deepseek-r1:32b";

for (;;) {
  const input = prompt(">");

  try {
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: input ?? "" }] as [Message],
      stream: true,
    });
    for await (const part of response) {
      process.stdout.write(part.message.content);
    }

    process.stdout.write("\n\n");
  } catch (error) {
    console.error(error);
  }
}
