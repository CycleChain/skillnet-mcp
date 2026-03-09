# SkillNet MCP 服务器

* [🇬🇧 English](README.md)
* [🇹🇷 Türkçe (Turkish)](README_TR.md)

欢迎使用 **SkillNet MCP 服务器**！本服务器充当了模型上下文协议（MCP）和 [SkillNet](https://github.com/zjunlp/SkillNet) 之间的桥梁。SkillNet 是一款用于 AI 智能体技能的开放基础设施。

通过安装此 MCP 服务器，您的 AI 智能体将可以直接使用您最喜爱的开发环境的 SkillNet CLI，从而无缝地进行技能搜索、下载、创建、评估和分析。

## 准备工作

由于本 MCP 服务器遵循 DRY 和 KISS 原则，作为官方 `skillnet-ai` CLI 接口的轻量级封装（Wrapper）运行，因此您的系统需要同时安装 Python 和 Node.js。

**1. 安装 SkillNet SDK (Python)**
```bash
pip install skillnet-ai
```

**2. 安装 MCP 依赖 (Node.js)**
导航到 `skillnet-mcp` 文件夹并安装依赖：
```bash
cd /path/to/skillnet-mcp
npm install
```

## IDE & 工具配置指南

要使您的开发工具启用此 MCP 服务器，您需要将其配置添加到对应工具的 JSON 配置文件中。在下面的示例中，请务必将 `/absolute/path/to/skillnet-mcp/index.js` 替换为本机上的绝对路径。

**关于 API Keys 的提示 (可选):** 使用 `search_skills`（搜索）和 `download_skill`（下载）工具**不需要**任何 API Key。但是，如果您打算使用 `create_skill`（创建）、`evaluate_skill`（评估）或 `analyze_skills`（分析）技能命令，则必须通过 `env` 对象提供您的 API Key。

这些密钥的用途说明如下：
* **`API_KEY`**: 它是下层 `skillnet-ai` 软件包不可或缺的一部分，用以在利用 LLM（如 OpenAI）概括日志、生成技能概述或评估工具安全质量时，正常地与模型服务端进行通信。
* **`GITHUB_TOKEN`**: 对于公开的库来说其实并不是严格强制性的，但加入 GitHub Token 能够极大地加快仓库的克隆下载速度，并且全面地避免代理使用 `create_skill` 处理包含大量文件的项目时遇到的 GitHub API 速率限制（Rate Limit）错误。

### 1. Claude Desktop
* **macOS 配置文件:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows 配置文件:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

### 2. Cursor IDE
Cursor 已内置对 MCP 的原生支持，可通过 "Cursor Settings > Tools > MCP"（Cursor 设置 > 工具 > MCP）进行管理。

* **配置文件:** `~/.cursor/mcp.json`（全局级别）或 `.cursor/mcp.json`（项目级别）

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

### 3. Windsurf (by Codium)
Windsurf 使用称为 Cascade 的智能体，具有极强的 MCP 调用能力。

* **配置文件:** `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

### 4. Roo Code (原 Roo Cline)
这是一款专为 VS Code 设计的开源智能体扩展，支持全局和工作区级别的 MCP 配置。

* **配置文件:** `.roo/mcp.json`（项目级别），或者通过 VS Code 设置面板进入 "Global MCP"（全局 MCP）编辑。

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

### 5. Claude Code (CLI)
直接在终端中运行的一款开发人员极速 MCP 集成工具。

* **配置文件:** `~/.claude.json`（全局级别）或 `.mcp.json`（项目级别）。

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": ["/absolute/path/to/skillnet-mcp/index.js"],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

### 6. Antigravity IDE
强大的本地 IDE 系统，允许结构化地连接智能体功能。

* **配置文件:** `~/.gemini/antigravity/mcp_config.json`

```json
{
  "mcpServers": {
    "skillnet": {
      "command": "node",
      "args": [
        "/absolute/path/to/skillnet-mcp/index.js"
      ],
      "env": {
        "API_KEY": "在此填写您的_api_key",
        "GITHUB_TOKEN": "在此填写您的_github_token"
      }
    }
  }
}
```

## IDE 智能体最佳实践指南

既然此 MCP 服务器是为了 AI 智能体（如 Cursor、Windsurf 或 Claude）专属优化设计的，这里提供一些如何更高效地对您的智能体发出指令的小提示：

1. **让智能体自动探索发现:** 不要自己去搜索，直接给系统指令：“*在 SkillNet MCP 里帮我搜索一个 PDF 提取相关的技能。*” 智能体会自己去调用 `search_skills` 然后把结果呈现给您。
2. **将多个动作串联起来:** 您可以给出复杂的包含一系列动作的高级指令：“*在 AIGC 分类下找个评价最高（最高星）的 PDF 解析技能，下载到 `./my_agent_skills` 目录，检查并评估它的安全性，然后用它解析我的本地文档。*” IDE 智能体不仅会顺畅地执行 `search`、`download`，接着做 `evaluate`，最后还会用它来写你的代码。
3. **将热门项目转换成能力:** 当您在寻找源码时看到完美的 GitHub 工具，只需要跟智能体讲：“*用 SkillNet 的 create_skill MCP 工具把 `https://github.com/abc/xyz` 转换为这里的本地技能包。*”

## 可用的工具

配置完成后，您的智能体将可以通过 MCP 协议执行以下核心操作：
- **`get_mcp_best_practices`**: 获取适用于所有语言的 MCP 服务器和 AI 智能体技能开发的官方最佳实践和编码标准。
- **`search_skills`**: 通过关键字或语义匹配在全球超 200,000 项技能库中进行搜索。
- **`download_skill`**: 从远程地址直接安装技能到您的本地文件系统中。
- **`create_skill`**: 将 Github 仓库、PDF 文件，甚至自然语言指令，提炼成标准化结构的技能包。
- **`evaluate_skill`**: 根据 安全性、完整性 等 5 个重点维度的质量对各项技能进行评分分析。
- **`analyze_skills`**: 映射本地文件系统内技能间的连接与依赖关系，搭建技能关系语义网。
开始愉快地为您量身打造专属 AI 的智能体“技能网”吧！
