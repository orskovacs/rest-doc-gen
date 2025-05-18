import { Command } from "@cliffy/command";
import { ensureDir, exists } from "@std/fs";
import { join } from "@std/path";
import { CliOptions } from "./src/types/cli-options.ts";
import { DocumentationGenerator } from "./src/generators/documentation-generator.ts";
import { ApiSpecFormat } from "./src/types/api-spec-format.ts";
import { parsers } from "./src/parsers/api-spec-parsers.ts";

const { options } = await new Command()
  .name("apigen")
  .version("0.1.0")
  .description("Automatic REST API documentation generator using LLM")
  .option("-m, --model <model:string>", "Ollama LLM model to use", {
    required: true,
  })
  .option(
    "-i, --input <file:string>",
    "API specification file (JSON, YAML or text)",
    { required: true },
  )
  .option(
    "-f, --format <format:string>",
    "Input file format (json, yaml or text)",
    { default: "json" },
  )
  .option(
    "-o, --output <directory:string>",
    "Output directory for documentation",
    { default: "./docs" },
  )
  .option("-v, --verbose", "Enable verbose output", { default: false })
  .parse(Deno.args);

const config: CliOptions = {
  model: options.model,
  input: options.input,
  format: options.format as ApiSpecFormat,
  output: options.output,
  verbose: options.verbose,
};

if (!(await exists(config.input))) {
  console.error(`Input file not found: ${config.input}`);
  Deno.exit(1);
}

// Ensure output directory exists
await ensureDir(config.output);

// Parse API specification
console.log(`Parsing API specification from ${config.input}...`);
const apiSpecs = await parsers[config.format].parse(config.input);
console.log(`Found ${apiSpecs.length} endpoints to document.`);

// Generate documentation for each endpoint
let indexContent = "# API Documentation\n\n## Endpoints\n\n";

for (const [index, spec] of apiSpecs.entries()) {
  console.log(
    `[${index + 1}/${apiSpecs.length}] Processing ${spec.method} ${spec.path}`,
  );

  // Generate documentation
  const documentation = await new DocumentationGenerator().generate(
    spec,
    config.model,
    config.verbose,
  );

  // Create file name from endpoint
  const fileName = `${spec.method.toLowerCase()}_${
    spec.path.replace(/\//g, "_").replace(/[{}]/g, "")
  }.md`;
  const filePath = join(config.output, fileName);

  // Save to file
  await Deno.writeTextFile(filePath, documentation);
  console.log(`Documentation saved to ${filePath}`);

  // Add to index
  indexContent += `- [${spec.method} ${spec.path}](./${fileName}) ${
    spec.description ? "- " + spec.description : ""
  }\n`;
}

// Save index to file
await Deno.writeTextFile(join(config.output, "index.md"), indexContent);
console.log(`Index file saved to ${join(config.output, "index.md")}`);

console.log("Documentation generation complete!");
