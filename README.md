# SkillNet MCP Server

* [🇹🇷 Türkçe (Turkish)](README_TR.md)
* [🇨🇳 中文 (Chinese)](README_ZN.md)

Welcome to the **SkillNet MCP Server**! This server bridges the Model Context Protocol (MCP) with [SkillNet](https://github.com/zjunlp/SkillNet), the open infrastructure for AI agent skills.

By installing this MCP server, your AI Agent will be able to seamlessly search, download, create, evaluate, and analyze agent skills using the SkillNet CLI directly from your favorite editor or environment.

## Prerequisites

Since this MCP server acts as a DRY and KISS wrapper over the official `skillnet-ai` CLI, you need to have both Python and Node.js installed on your system.

**1. Install SkillNet SDK (Python)**
```bash
pip install skillnet-ai
```

**2. Install MCP Dependencies (Node.js)**
Navigate to the `skillnet-mcp` folder and install dependencies:
```bash
cd /path/to/skillnet-mcp
npm install
```

## IDE & Tool Configuration Guide

To enable this MCP server in your tools, you will need to edit their respective JSON configuration files. Replace `/absolute/path/to/skillnet-mcp/index.js` with the actual path to your `index.js` file.

**Note on API Keys (Optional):** The `search_skills` and `download_skill` tools **do not** require any API keys. However, if you intend to use the `create_skill`, `evaluate_skill`, or `analyze_skills` endpoints, you must provide your API keys in the `env` object as shown below. 

Here is why they are needed:
* **`API_KEY`**: Required by the underlying `skillnet-ai` package to communicate with LLM endpoints (like OpenAI) when using LLMs to trace logs, summarize skills, or evaluate capabilities.
* **`GITHUB_TOKEN`**: While not strictly required for public repositories, providing a GitHub token greatly accelerates cloning and prevents rate-limit errors when parsing GitHub repositories during `create_skill`.

### 1. Claude Desktop
* **macOS Configuration:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows Configuration:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### 2. Cursor IDE
You can manage MCP natively in Cursor under "Cursor Settings > Tools > MCP".

* **Configuration File:** `~/.cursor/mcp.json` (Global) or `.cursor/mcp.json` (Project level)

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### 3. Windsurf (by Codium)
Windsurf's Cascade agent uses this configuration to interact aggressively with MCP servers.

* **Configuration File:** `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### 4. Roo Code (formerly Roo Cline)
An excellent VS Code extension that supports global and workspace-level MCP configurations.

* **Configuration File:** `.roo/mcp.json` (Project level) or via VS Code settings for Global MCP.

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### 5. Claude Code (CLI)
The fastest MCP integration tool running directly in your terminal.

* **Configuration File:** `~/.claude.json` (Global) or `.mcp.json` (Project level).

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

## Best Practices for IDE Agents

Since this MCP server is optimized to be used by AI Agents (like Cursor, Windsurf, or Claude), here are some tips on how to interact with the agent as a user:

1. **Ask Your Agent to Auto-Discover:** Instead of searching manually, just tell your Agent: *"Search the SkillNet MCP for a PDF extraction skill."* The agent will call `search_skills` and list the options itself.
2. **Chain Actions Together:** You can give complex instructions like: *"Find a PDF parser skill in the AIGC category, download the one with the highest stars to `./my_agent_skills`, evaluate its safety, and then use it to parse my local document."* The IDE Agent will autonomously run `search`, then `download`, then `evaluate`, and finally interact with the codebase.
3. **Turn Repositories into Capabilities:** While coding, if you spot a cool GitHub repository, just tell your Agent: *"Use the SkillNet create_skill MCP tool to turn the repository `https://github.com/abc/xyz` into a localized skill package here."*

## Available Tools

Once configured, your agent gets access to the following underlying actions via the MCP protocol:
- **`import_best_skill`**: Dynamically searches for the highest-rated skill on a given topic, downloads it, and immediately returns its documentation to your agent's context.
- **`search_skills`**: Search across 200,000+ skills by keywords or semantics.
- **`download_skill`**: Install remote skill code directly to your local file system.
- **`create_skill`**: Turn repos, PDFs, and prompts into structured skill packages locally.
- **`evaluate_skill`**: Get a 5-D report (Safety, Completeness, etc.) of any skill.
- **`analyze_skills`**: Trace dependencies and build semantic relationship maps over a group of skills.

### Example Usage Prompts
Here are some autonomous prompt examples you can give to your AI Agent:
- **`import_best_skill`**: *"I'm going to write a project with React Native. Find the most popular React Native skill on Skillnet, import it into your memory, and then generate the app."*
- **`search_skills`**: *"What skills are available on Skillnet regarding database optimization? List the top 3 highest-rated ones."*
- **`download_skill`**: *"Download the skill from this GitHub link, read its SKILL.md, and summarize its architecture to me."*
- **`create_skill`**: *"Analyze the code in our `src/` directory and create a standardized skill package from it that our team can reuse."*
- **`evaluate_skill`**: *"Generate a 5-dimensional evaluation report for this downloaded skill regarding its safety and completeness, and warn me if there are vulnerabilities."*
- **`analyze_skills`**: *"Map the dependency relationships between all our downloaded skills and show me if any overlap or conflict."*

Enjoy building your personal AI agent skill graph!
