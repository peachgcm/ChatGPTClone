# Deploy This-Is-For

## Quick Deploy Commands

Run these commands in your terminal:

```bash
cd "/Users/pjiang/Documents/New Folder With Items/miniProjects/chatGPTG-cloned-deployed"

# 1. Commit and push changes
git add .
git commit -m "Rename to This-Is-For"
git push origin main

# 2. Deploy
export AI_BUILDER_TOKEN=sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f

curl -X POST "https://space.ai-builders.com/backend/v1/deployments" \
  -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/peachgcm/ChatGPTClone",
    "service_name": "this-is-for",
    "branch": "main",
    "port": 3000
  }' | python3 -m json.tool
```

Your app will be available at: **https://this-is-for.ai-builders.space**
