#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execFile } from "child_process";
import { promisify } from "util";
import { readFile, readdir, rm } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = new Server(
  {
    name: "skillnet-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools wrapping the skillnet-ai CLI
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "import_best_skill",
        description: "Searches SkillNet for the highest-rated skill on a given topic, downloads it temporarily, and returns its full content (e.g., SKILL.md) so you can immediately use its context and rules.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "The topic, technology, or framework to find a skill for (e.g. 'NodeJS', 'Docker', 'React')",
            },
          },
          required: ["topic"],
        },
      },
      {
        name: "search_skills",
        description: "Search for skills via keyword or semantic match in SkillNet.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Search query (keywords or natural language)" },
            mode: { type: "string", description: "keyword or vector", enum: ["keyword", "vector"] },
            limit: { type: "number", description: "Results per page" },
            category: { type: "string", description: "Filter category e.g., Development, AIGC" },
            sort_by: { type: "string", description: "Sort by stars or recent", enum: ["stars", "recent"] }
          },
          required: ["q"],
        },
      },
      {
        name: "download_skill",
        description: "Install a skill from a given URL to a target directory.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL of the skill to download (e.g., GitHub repo)" },
            target_dir: { type: "string", description: "Local directory to download the skill into" },
          },
          required: ["url", "target_dir"],
        },
      },
      {
        name: "create_skill",
        description: "Convert diverse sources into structured skill packages.",
        inputSchema: {
          type: "object",
          properties: {
            source_type: { type: "string", enum: ["github", "office", "prompt", "trajectory"] },
            source: { type: "string", description: "URL or local path or prompt text" },
            output_dir: { type: "string", description: "Directory to save created skill" },
            model: { type: "string", description: "LLM model to use e.g. gpt-4o" }
          },
          required: ["source_type", "source"],
        },
      },
      {
        name: "evaluate_skill",
        description: "Score any skill across 5 quality dimensions.",
        inputSchema: {
          type: "object",
          properties: {
            target: { type: "string", description: "Target GitHub URL or local path to evaluate" },
          },
          required: ["target"],
        },
      },
      {
        name: "analyze_skills",
        description: "Map connections between skills in a directory.",
        inputSchema: {
          type: "object",
          properties: {
            skills_dir: { type: "string", description: "Local directory containing skills" },
          },
          required: ["skills_dir"],
        },
      }
    ],
  };
});

export function buildCommand(name, args) {
  if (!args) {
    throw new Error("Missing arguments");
  }

  const commandArgs = [];

  switch (name) {
    case "search_skills":
      commandArgs.push("search", args.q);
      if (args.mode) commandArgs.push("--mode", args.mode);
      if (args.limit) commandArgs.push("--limit", args.limit.toString());
      if (args.category) commandArgs.push("--category", args.category);
      if (args.sort_by) commandArgs.push("--sort-by", args.sort_by);
      break;

    case "download_skill":
      commandArgs.push("download", args.url, "-d", args.target_dir);
      break;

    case "create_skill":
      commandArgs.push("create");
      if (args.source_type === "github") commandArgs.push("--github", args.source);
      else if (args.source_type === "office") commandArgs.push("--office", args.source);
      else if (args.source_type === "prompt") commandArgs.push("--prompt", args.source);
      else if (args.source_type === "trajectory") commandArgs.push(args.source);

      if (args.output_dir) commandArgs.push("-d", args.output_dir);
      if (args.model) commandArgs.push("--model", args.model);
      break;

    case "evaluate_skill":
      commandArgs.push("evaluate", args.target);
      break;

    case "analyze_skills":
      commandArgs.push("analyze", args.skills_dir);
      break;

    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  return commandArgs;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === "import_best_skill") {
      const { topic } = args;
      try {
        const { stdout: searchOut } = await execFileAsync("skillnet", ["search", topic, "--limit", "1", "--sort-by", "stars"]);
        const urlMatch = searchOut.match(/https:\/\/github\.com\/([^\s│]+)/);
        if (!urlMatch) {
          return { content: [{ type: "text", text: `No skill found for topic: ${topic}.` }] };
        }

        const skillUrl = urlMatch[0];
        const safeTopic = topic.replace(/[^a-zA-Z0-9]/g, "_");
        const tempDir = join(__dirname, ".temp_skills", safeTopic);

        await execFileAsync("skillnet", ["download", skillUrl, "-d", tempDir]);
        const files = await readdir(tempDir);

        let contentStr = `Successfully imported skill from ${skillUrl}:\n\n`;
        const mdFiles = files.filter(f => f.toLowerCase().endsWith(".md")).sort((a, b) => a.toLowerCase() === "skill.md" ? -1 : 1);

        if (mdFiles.length > 0) {
          contentStr += await readFile(join(tempDir, mdFiles[0]), "utf-8");
        } else {
          contentStr += "No .md documentation found in this skill.";
        }

        await rm(tempDir, { recursive: true, force: true });
        return { content: [{ type: "text", text: contentStr }] };
      } catch (err) {
        return { isError: true, content: [{ type: "text", text: `Failed to import skill: \n${err.stderr || err.message}` }] };
      }
    }

    const commandArgs = buildCommand(name, args);

    const { stdout, stderr } = await execFileAsync("skillnet", commandArgs);

    return {
      content: [
        {
          type: "text",
          text: stdout + (stderr ? `\nErrors/Warnings:\n${stderr}` : ""),
        },
      ],
    };
  } catch (error) {
    const errorDetails = error.stderr ? `\nDetails:\n${error.stderr}` : "";
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Command execution failed: ${error.message}${errorDetails}\nPlease ensure 'skillnet-ai' python package is installed and accessible.`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SkillNet MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
