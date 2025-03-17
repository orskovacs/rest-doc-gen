import ollama, { Message } from "ollama";
import process from "node:process";

const message: Message = { role: "user", content: "Why is the sky blue?" };
const model = "deepseek-r1:32b";
const response = await ollama.chat({
  model,
  messages: [message],
  stream: true,
});

for await (const part of response) {
  process.stdout.write(part.message.content);
}
