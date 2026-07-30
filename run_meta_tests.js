const https = require('https');
const TOKEN = 'EAAYps4BvAckBSNRBBC7SriVrhB1UkD1SftgqwyHVc3Eb3ZC46uE3teA70ddotYTSOVDB9HZB6zZCkr7aZBhRPq9hWAOMajw6wFLp1f2xLxGY3TZBOrcqPVWeviaBXlB2QV1ZAAnGQL29suUu8mTIqYiwZA42rkVLlMuvqNbnGrEoJiERxoU0m0rSR2HZBQkdTM7u';
const IG_USER_ID = '17841409408339004';

function graphGet(path) {
  return new Promise((resolve) => {
    const url = 'https://graph.facebook.com/v19.0' + path + (path.includes('?') ? '&' : '?') + 'access_token=' + TOKEN;
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    }).on('error', e => resolve({ status: 0, data: e.message }));
  });
}

function graphPost(urlPath, params) {
  return new Promise((resolve) => {
    const postData = new URLSearchParams(params).toString();
    const req = https.request('https://graph.facebook.com/v19.0' + urlPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', e => resolve({ status: 0, data: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== 1. pages_read_user_content ===');
  let r = await graphGet('/me/accounts?fields=id,name,access_token');
  console.log('Accounts:', r.status, r.data.data ? 'OK - ' + r.data.data.length + ' pages' : r.data.error?.message);

  if (r.data.data?.[0]) {
    const pg = r.data.data[0];
    r = await graphGet('/' + pg.id + '/feed?access_token=' + pg.access_token + '&fields=id,message&limit=1');
    console.log('Feed:', r.status, r.data.id ? 'OK' : r.data.error?.message);
  }

  console.log('\n=== 2. pages_show_list ===');
  r = await graphGet('/me/accounts?fields=id,name&limit=5');
  console.log('Show list:', r.status, r.data.data ? 'OK - ' + r.data.data.length + ' pages' : r.data.error?.message);

  console.log('\n=== 3. instagram_business_manage_comments ===');
  r = await graphGet('/' + IG_USER_ID + '/media?fields=id,caption&limit=2');
  console.log('Media:', r.status, r.data.data ? 'OK - ' + r.data.data.length + ' items' : r.data.error?.message);
  if (r.data.data?.[0]) {
    const mid = r.data.data[0].id;
    r = await graphGet('/' + mid + '/comments?fields=id,text&limit=2');
    console.log('Comments:', r.status, r.data.data ? 'OK - ' + r.data.data.length + ' comments' : 'no comments');
  }

  console.log('\n=== 4. instagram_business_content_publish ===');
  r = await graphGet('/' + IG_USER_ID + '/media?fields=id,media_type&limit=2');
  console.log('Published media:', r.status, r.data.data ? 'OK - ' + r.data.data.length + ' items' : r.data.error?.message);

  console.log('\n=== 5. instagram_manage_messages ===');
  const comments = await graphGet('/' + IG_USER_ID + '/media?fields=id&limit=1');
  if (comments.data.data?.[0]) {
    const mid2 = comments.data.data[0].id;
    r = await graphGet('/' + mid2 + '/comments?fields=id,from&limit=1');
    if (r.data.data?.[0]) {
      const cid = r.data.data[0].id;
      console.log('Has comment for reply:', cid);
    }
  }

  console.log('\n=== 6. instagram_basic ===');
  r = await graphGet('/' + IG_USER_ID + '?fields=id,username,name');
  console.log('Profile:', r.status, r.data.username ? 'OK - @' + r.data.username : r.data.error?.message);

  console.log('\n=== 7. pages_read_engagement ===');
  r = await graphGet('/me/accounts?fields=id,name,fan_count');
  console.log('Engagement:', r.status, r.data.data ? 'OK' : r.data.error?.message);

  console.log('\n=== 8. business_management ===');
  const bus = await graphGet('/me/businesses?fields=id,name');
  console.log('Business:', bus.status, bus.data.data ? 'OK - ' + bus.data.data.length : bus.data);

  console.log('\n=== TODOS OS TESTES CONCLUIDOS ===');
}

run().catch(e => console.error('Fatal:', e.message));
