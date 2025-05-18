import { Command } from "@cliffy/command";
import { ensureDir, exists } from "@std/fs";
import { join } from "@std/path";
import { EndpointDocumentationGenerator } from "./src/generators/endpoint-documentation-generator.ts";
import {
  ApiSpecFormat,
  supportedSpecFormats,
} from "./src/types/api-spec-format.ts";
import { parsers } from "./src/parsers/api-spec-parsers.ts";
import { GlobalConfig } from "./src/config/global-config.ts";

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
    { default: "text" },
  )
  .option(
    "-o, --output <directory:string>",
    "Output directory for documentation",
    { default: "./docs" },
  )
  .option("-v, --verbose", "Enable verbose output", { default: false })
  .parse(Deno.args);

GlobalConfig.getInstance().modelName = options.model;
GlobalConfig.getInstance().verbose = options.verbose;

if (!(await exists(options.input))) {
  console.error(`Input file not found: ${options.input}`);
  Deno.exit(1);
}

// Ensure output directory exists
await ensureDir(options.output);

if (!supportedSpecFormats.map((x) => x as string).includes(options.format)) {
  console.error(`Unsupported specification format: ${options.format}`);
  Deno.exit(1);
}

// Parse API specification
console.log(`Parsing API specification from ${options.input}...`);
const apiSpecs = await parsers[options.format as ApiSpecFormat].parse(
  options.input,
);
console.log(`Found ${apiSpecs.length} endpoints to document.`);

// Generate documentation for each endpoint
let indexContent = "# API Documentation\n\n## Endpoints\n\n";

const endpointDocumentationGenerator = new EndpointDocumentationGenerator();

for (const [index, spec] of apiSpecs.entries()) {
  console.log(
    `[${index + 1}/${apiSpecs.length}] Processing ${spec.method} ${spec.path}`,
  );

  // Generate documentation
  const documentation = await endpointDocumentationGenerator.generate(spec);

  // Create file name from endpoint
  const fileName = `${spec.method.toLowerCase()}_${
    spec.path.replace(/\//g, "_").replace(/[{}]/g, "")
  }.md`;
  const filePath = join(options.output, fileName);

  // Save to file
  await Deno.writeTextFile(filePath, documentation);
  console.log(`Documentation saved to ${filePath}`);

  // Add to index
  indexContent += `- [${spec.method} ${spec.path}](./${fileName}) ${
    spec.description ? "- " + spec.description : ""
  }\n`;
}

// Save index to file
await Deno.writeTextFile(join(options.output, "index.md"), indexContent);
console.log(`Index file saved to ${join(options.output, "index.md")}`);

console.log("Documentation generation complete!");
