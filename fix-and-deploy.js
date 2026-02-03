const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

const AI_BUILDER_TOKEN = 'sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f';
const GITHUB_REPO = 'https://github.com/peachgcm/ChatGPTClone';
const SERVICE_NAME = 'this-is-for';

console.log('🔧 Fixing deployment and redeploying...\n');

// Step 1: Commit Dockerfile fix
try {
  console.log('📝 Committing Dockerfile fix...');
  execSync('git add Dockerfile', { stdio: 'inherit', cwd: __dirname });
  execSync('git commit -m "Fix Dockerfile for Next.js standalone deployment"', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Changes committed\n');
} catch (error) {
  console.log('ℹ️  Git commit skipped\n');
}

// Step 2: Push to GitHub
try {
  console.log('📤 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Pushed to GitHub\n');
} catch (error) {
  console.log('⚠️  Push may have failed\n');
}

// Step 3: Update existing deployment (POST to same endpoint - API handles updates automatically)
console.log('🔄 Updating deployment to trigger rebuild...\n');
console.log(`📦 Repository: ${GITHUB_REPO}`);
console.log(`🏷️  Service Name: ${SERVICE_NAME}`);
console.log(`🌐 URL: https://${SERVICE_NAME}.ai-builders.space\n`);

const deployData = JSON.stringify({
  repo_url: GITHUB_REPO,
  service_name: SERVICE_NAME,
  branch: 'main',
  port: 3000
});

const deployOptions = {
  hostname: 'space.ai-builders.com',
  port: 443,
  path: '/backend/v1/deployments',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AI_BUILDER_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(deployData)
  }
};

const deployReq = https.request(deployOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📊 Deployment Response:\n');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.status || res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✅ Deployment update initiated!');
        console.log(`🌐 Your app will be available at: https://${SERVICE_NAME}.ai-builders.space`);
        console.log('\n⏳ Rebuild usually takes 5-10 minutes.');
        console.log('\n💡 Run "npm run check" to check deployment status.');
      } else if (response.error || response.message) {
        console.log('\n⚠️  Deployment issue:');
        if (response.error) console.log('Error:', response.error);
        if (response.message) console.log('Message:', response.message);
      } else {
        console.log('\n⚠️  Unexpected response status:', res.statusCode);
      }
    } catch (e) {
      console.log('\n📄 Raw Response:');
      console.log(data);
      console.log('\n💡 Status Code:', res.statusCode);
    }
  });
});

deployReq.on('error', (error) => {
  console.error('\n❌ Deployment error:', error.message);
});

deployReq.write(deployData);
deployReq.end();
