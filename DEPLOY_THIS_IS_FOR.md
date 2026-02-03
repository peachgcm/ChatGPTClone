# Deploy to this-is-for.ai-builders.space

## Steps to Deploy

**Step 1: Push code to GitHub**
```bash
cd "/Users/pjiang/Documents/New Folder With Items/miniProjects/chatGPTG-cloned-deployed"
git add .
git commit -m "Rename to This-Is-For"
git push origin main
```

**Step 2: Deploy NEW service**
```bash
npm run deploy
```

Or use this command:
```bash
curl -X POST "https://space.ai-builders.com/backend/v1/deployments" \
  -H "Authorization: Bearer sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f" \
  -H "Content-Type: application/json" \
  -d '{"repo_url":"https://github.com/peachgcm/ChatGPTClone","service_name":"this-is-for","branch":"main","port":3000}' | python3 -m json.tool
```

## Result

After deployment (5-10 minutes), your app will be available at:
**https://this-is-for.ai-builders.space**

## Note

- The old service at `chatgpt-clone.ai-builders.space` will still exist
- You'll have TWO services running:
  - https://chatgpt-clone.ai-builders.space (old)
  - https://this-is-for.ai-builders.space (new)
