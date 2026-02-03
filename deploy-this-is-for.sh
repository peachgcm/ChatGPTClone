#!/bin/bash

# Deploy This-Is-For to AI Builder platform
# Service name: this-is-for
# URL will be: https://this-is-for.ai-builders.space

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying This-Is-For...${NC}\n"

# Check if AI_BUILDER_TOKEN is set
if [ -z "$AI_BUILDER_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  AI_BUILDER_TOKEN not found in environment${NC}"
    echo "Please set it: export AI_BUILDER_TOKEN=your_token_here"
    exit 1
fi

# Get GitHub repo URL
GITHUB_REPO=$(git remote get-url origin 2>/dev/null | sed 's/\.git$//' | sed 's/git@github.com:/https:\/\/github.com\//')

if [ -z "$GITHUB_REPO" ]; then
    echo -e "${YELLOW}⚠️  No GitHub remote found${NC}"
    echo "Please set up a GitHub remote first:"
    echo "  git remote add origin https://github.com/yourusername/yourrepo.git"
    exit 1
fi

echo -e "${BLUE}📦 Repository: ${GITHUB_REPO}${NC}"
echo -e "${BLUE}🏷️  Service Name: this-is-for${NC}"
echo -e "${BLUE}🌐 URL: https://this-is-for.ai-builders.space${NC}\n"

# Deploy
echo -e "${BLUE}⏳ Deploying...${NC}\n"

RESPONSE=$(curl -s -X POST "https://space.ai-builders.com/backend/v1/deployments" \
  -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"repo_url\": \"$GITHUB_REPO\",
    \"service_name\": \"this-is-for\",
    \"branch\": \"main\",
    \"port\": 3000
  }")

# Check if deployment was successful
if echo "$RESPONSE" | grep -q '"status"'; then
    echo -e "${GREEN}✅ Deployment initiated successfully!${NC}\n"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo -e "\n${BLUE}📊 Check status:${NC}"
    echo "  curl -H \"Authorization: Bearer \$AI_BUILDER_TOKEN\" https://space.ai-builders.com/backend/v1/deployments/this-is-for | python3 -m json.tool"
    echo -e "\n${BLUE}🌐 Your app will be available at:${NC}"
    echo -e "${GREEN}   https://this-is-for.ai-builders.space${NC}\n"
else
    echo -e "${YELLOW}⚠️  Deployment response:${NC}"
    echo "$RESPONSE"
    exit 1
fi
