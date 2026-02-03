#!/bin/bash

# Update the existing chatgpt-clone deployment with new code

echo "🔄 Updating existing deployment at chatgpt-clone.ai-builders.space..."
echo ""

# Deploy to existing service name
curl -X POST "https://space.ai-builders.com/backend/v1/deployments" \
  -H "Authorization: Bearer sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/peachgcm/ChatGPTClone",
    "service_name": "chatgpt-clone",
    "branch": "main",
    "port": 3000
  }' | python3 -m json.tool

echo ""
echo "✅ Deployment update initiated!"
echo "🌐 Your updated app will be at: https://chatgpt-clone.ai-builders.space"
echo "⏳ This usually takes 5-10 minutes."
