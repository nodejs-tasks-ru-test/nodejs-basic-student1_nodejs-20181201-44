const request = require('request-promise').defaults({
  simple: false,
  json: true
});
const run_tests = require('./run_tests');
const BASE = process.env.LEARN_JS_HOST;

if (!process.env.CI)
  throw new Error('run_tests_ci can be run only on CI');

if (process.env.TRAVIS_EVENT_TYPE !== 'pull_request') return;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retrievePRInfo() {
  const repo_slug = process.env.TRAVIS_REPO_SLUG;
  const number = process.env.TRAVIS_PULL_REQUEST;
  
  const response = await request({
    uri: `${BASE}/taskbook/pr-title`,
    qs: {
      slug: repo_slug,
      number
    },
    method: 'GET'
  });
  console.log(response);
  if (!response.title) {
    console.error(response.message);
    process.exit(1);
  }
  
  const moduleName = response.title.match(/\d+-module/i) || [];
  const taskName = response.title.match(/\d+-task/i) || [];

  return [moduleName[0], taskName[0]];
}

retrievePRInfo()
  .then(([moduleName, taskName]) => {
    run_tests(moduleName, taskName, { reporter: 'json', useColors: false, });
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
