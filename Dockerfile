# Step 1: Use a lightweight Node.js image
FROM node:20-slim

# Step 2: Install Python and necessary system tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Install SkillNet Python SDK
# The --break-system-packages flag might be required for pip installations on newer Debian versions
RUN pip3 install --no-cache-dir --break-system-packages skillnet-ai

# Step 4: Create application directory and copy files
WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

# Step 5: Execution command
# Since MCP communicates over stdio, we start it directly with node
ENTRYPOINT ["node", "index.js"]
