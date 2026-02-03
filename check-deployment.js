const https = require('https');

const AI_BUILDER_TOKEN = 'sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f';
const SERVICE_NAME = 'this-is-for';

console.log(`📊 Checking deployment status for: ${SERVICE_NAME}\n`);

const options = {
  hostname: 'space.ai-builders.com',
  port: 443,
  path: `/backend/v1/deployments/${SERVICE_NAME}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${AI_BUILDER_TOKEN}`,
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
      
      console.log('📊 Deployment Status:\n');
      console.log(`Service Name: ${response.service_name}`);
      console.log(`Status: ${response.status}`);
      console.log(`Koyeb Status: ${response.koyeb_status || 'N/A'}`);
      console.log(`Public URL: ${response.public_url || 'Not available yet'}`);
      console.log(`Branch: ${response.branch}`);
      console.log(`Port: ${response.port}`);
      
      if (response.message) {
        console.log(`\nMessage: ${response.message}`);
      }
      
      if (response.status === 'HEALTHY') {
        console.log('\n✅ Deployment is HEALTHY and ready!');
        console.log(`🌐 Visit: ${response.public_url}`);
      } else if (response.status === 'deploying' || response.status === 'queued') {
        console.log('\n⏳ Deployment is in progress...');
        console.log('Please wait 5-10 minutes and check again.');
      } else if (response.status === 'UNHEALTHY' || response.status === 'ERROR') {
        console.log('\n❌ Deployment has issues.');
        if (response.message) {
          console.log(`Details: ${response.message}`);
        }
        console.log('\n💡 Check logs for more details.');
      }
      
      if (response.last_deployed_at) {
        console.log(`\nLast Deployed: ${response.last_deployed_at}`);
      }
      
    } catch (e) {
      console.log('📄 Raw Response:');
      console.log(data);
      if (data.includes('not found') || data.includes('404')) {
        console.log('\n❌ Service not found. It may not have been deployed yet.');
        console.log('💡 Try deploying first with: npm run deploy');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error checking deployment:', error.message);
});

req.end();
