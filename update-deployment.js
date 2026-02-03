const https = require('https');

const AI_BUILDER_TOKEN = 'sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f';
const GITHUB_REPO = 'https://github.com/peachgcm/ChatGPTClone';
const SERVICE_NAME = 'chatgpt-clone'; // Update existing deployment

console.log('🔄 Updating existing deployment...\n');
console.log(`📦 Repository: ${GITHUB_REPO}`);
console.log(`🏷️  Service Name: ${SERVICE_NAME}`);
console.log(`🌐 URL: https://${SERVICE_NAME}.ai-builders.space\n`);

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

console.log('⏳ Sending deployment request...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📊 Deployment Response:\n');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.status) {
        console.log('\n✅ Deployment update initiated successfully!');
        console.log(`🌐 Your updated app will be at: https://${SERVICE_NAME}.ai-builders.space`);
        console.log('\n⏳ Deployment usually takes 5-10 minutes.');
        console.log('The page will show "This-Is-For" once deployment completes.');
      } else if (response.error) {
        console.log('\n❌ Deployment failed:');
        console.log(response.error);
        if (response.message) {
          console.log(response.message);
        }
      }
    } catch (e) {
      console.log('\n📄 Raw Response:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Deployment error:', error.message);
});

req.write(postData);
req.end();
