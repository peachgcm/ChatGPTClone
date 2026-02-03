const https = require('https');

const AI_BUILDER_TOKEN = 'sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f';
const SERVICE_NAME = 'this-is-for';

console.log(`📋 Checking deployment logs for: ${SERVICE_NAME}\n`);

// Check build logs
const checkLogs = (logType) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'space.ai-builders.com',
      port: 443,
      path: `/backend/v1/deployments/${SERVICE_NAME}/logs?log_type=${logType}&timeout=30`,
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
          resolve(response);
        } catch (e) {
          resolve({ logs: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

(async () => {
  try {
    console.log('🔍 Checking build logs...\n');
    const buildLogs = await checkLogs('build');
    if (buildLogs.logs) {
      console.log('📦 BUILD LOGS:');
      console.log('─'.repeat(80));
      console.log(buildLogs.logs);
      console.log('─'.repeat(80));
    }

    console.log('\n🔍 Checking runtime logs...\n');
    const runtimeLogs = await checkLogs('runtime');
    if (runtimeLogs.logs) {
      console.log('⚙️  RUNTIME LOGS:');
      console.log('─'.repeat(80));
      console.log(runtimeLogs.logs);
      console.log('─'.repeat(80));
    }

    // Check stderr
    console.log('\n🔍 Checking error logs...\n');
    const errorLogs = await checkLogs('runtime&stream=stderr');
    if (errorLogs.logs) {
      console.log('❌ ERROR LOGS:');
      console.log('─'.repeat(80));
      console.log(errorLogs.logs);
      console.log('─'.repeat(80));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
