const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const AI_BUILDER_TOKEN = 'sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f';
const GITHUB_REPO = 'https://github.com/peachgcm/ChatGPTClone';
const SERVICE_NAME = 'this-is-for';

console.log('🚀 Deploying This-Is-For...\n');

// Step 1: Commit and push changes
try {
  console.log('📝 Committing changes...');
  execSync('git add .', { stdio: 'inherit', cwd: __dirname });
  execSync('git commit -m "Rename to This-Is-For"', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Changes committed\n');
} catch (error) {
  console.log('ℹ️  No changes to commit or already committed\n');
}

try {
  console.log('📤 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Pushed to GitHub\n');
} catch (error) {
  console.log('⚠️  Push failed or already up to date\n');
}

// Step 2: Deploy
console.log('⏳ Deploying to AI Builder platform...\n');

const postData = JSON.stringify({
  repo_url: GITHUB_REPO,
  service_name: SERVICE_NAME,
  branch: 'main',
  port: 3000
});

const options = {
  hostname: 'space.ai-builders.com',
  port: 443,
  path: '/backend/v1/deployments',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AI_BUILDER_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📊 Deployment Response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.status) {
        console.log('\n✅ Deployment initiated successfully!');
        console.log(`🌐 Your app will be available at: https://${SERVICE_NAME}.ai-builders.space`);
        console.log('\n⏳ Deployment usually takes 5-10 minutes.');
        console.log(`📊 Check status: curl -H "Authorization: Bearer ${AI_BUILDER_TOKEN}" https://space.ai-builders.com/backend/v1/deployments/${SERVICE_NAME}`);
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Deployment error:', error.message);
});

req.write(postData);
req.end();
