import Request from 'request'
import * as fs from 'fs';

let authToken = '';

async function getTestExecutions() {
  var getTestExecutionsQueryString = `{\n    getTestExecutions(jql: "project ='${process.env.JIRA_PROJECT_KEY}'", limit: 100) {\n        total\n        start\n        limit\n        results {\n            issueId\n            jira(fields: ["summary"])\n        }\n    }\n}`;
  var getTestExecutionsResult = await sendRequestToXrayGraphQL(getTestExecutionsQueryString);
  if (getTestExecutionsResult.error != null) {
    throw Error(JSON.stringify(getTestExecutionsResult.error))
  }
  if (getTestExecutionsResult.errors != null) {
    throw Error(JSON.stringify(getTestExecutionsResult.errors))
  }
  var executionResults = getTestExecutionsResult.data.getTestExecutions.results;

  return executionResults;
}

async function getExistingExecutions(testExecutionName) {
  const testExecutions = await getTestExecutions();

  for (let i = 0; i < testExecutions.length; i++) {
    if (testExecutions[i].jira.summary == testExecutionName)
      return testExecutions[i].issueId;

  }
  return 'not exists';
}

async function createTestExecution(environment, frontendVersion, backendVersion) {
  let executionName = `Autotest for ${environment} env FE: ${frontendVersion} BE: ${backendVersion}`;
  var executionId = await getExistingExecutions(executionName);

  if (executionId == 'not exists') {
    var createTestExecutionQueryString = `mutation {\n    createTestExecution(\n        testIssueIds: []\n        testEnvironments: ["${environment}"]\n        jira: {\n            fields: { summary: "${executionName}", project: {key: "${process.env.JIRA_PROJECT_KEY}"} }\n        }\n    ) {\n        testExecution {\n            issueId\n            jira(fields: ["key"])\n        }\n        warnings\n        createdTestEnvironments\n    }\n}`;
    var createTestExecutionResult = await sendRequestToXrayGraphQL(createTestExecutionQueryString);
    if (createTestExecutionResult.error != null) {
      throw Error(JSON.stringify(createTestExecutionResult.error))
    }
    executionId = createTestExecutionResult.data.createTestExecution.testExecution.issueId;
    return executionId;
  }
  return executionId;
}

async function addTestToTestExecution(testIssueId, executionIssueId) {
  var addTestsToTestExecutionQueryString = `mutation {\n    addTestsToTestExecution(\n        issueId: "${executionIssueId}",\n        testIssueIds: ["${testIssueId}"]\n    ) {\n        addedTests\n        warning\n    }\n}`;

  await sendRequestToXrayGraphQL(addTestsToTestExecutionQueryString);
}

async function getTestRun(testIssueID, executionIssueId) {
  var getTestRunQueryString = `{\n    getTestRun( testIssueId: "${testIssueID}", testExecIssueId: "${executionIssueId}") {\n        id\n        status {\n            name\n            color\n            description\n        }\n        gherkin\n        examples {\n            id\n            status {\n                name\n                color\n                description\n            }\n        }\n    }\n}`;
  var getTestRunResult = await sendRequestToXrayGraphQL(getTestRunQueryString);

  return getTestRunResult;
}

async function updateTestRunStatus(testRunId, testRunStatus) {
  var updateTestRunStatusQueryString = `mutation {\n    updateTestRunStatus( id: "${testRunId}", status: "${testRunStatus}")\n}`;
  var updateTestRunStatusResult = await sendRequestToXrayGraphQL(updateTestRunStatusQueryString);

  return updateTestRunStatusResult;
}

async function addCommentToTestRun(testRunId, testRunErrorMessage) {
  var addCommentQueryString = `mutation {\n    updateTestRunComment( id: "${testRunId}", comment: "${testRunErrorMessage.replace(/\n/g,"\\n")}")\n}`;
  var addCommentResult = await sendRequestToXrayGraphQL(addCommentQueryString);

  return addCommentResult;
}

async function addEvidenceToTestRun(testRunId, evidenceFile) {
  var addEvidenceQueryString = `mutation {\n    addEvidenceToTestRun(\n        id: "${testRunId}",\n        evidence: [\n            {\n                filename: "evidence.png"\n                mimeType: "png"\n                data: "${evidenceFile}"\n            }\n        ]\n    ) {\n        addedEvidence\n        warnings\n    }\n}`;
  var evidenceResult = await sendRequestToXrayGraphQL(addEvidenceQueryString);

  return evidenceResult;
}

async function getIssueId(ticketId) {
  return new Promise((resolve, reject) => {
    Request.get({
      headers: { 'content-type': 'application/json' },
      url: `${process.env.JIRA_BASE_URL}rest/api/3/issue/${ticketId}`,
      auth: {
        user: process.env.JIRA_USER,
        password: process.env.JIRA_PASSWORD
      }
    }, (error, response, body) => {
      if (error)
        console.log(error);
      resolve(JSON.parse(body).id);
    });
  });
}

async function getAuthTokenForXray() {
  return new Promise((resolve, reject) => {
    Request.post({
      headers: { 'Content-Type': 'application/json' },
      url: 'https://xray.cloud.getxray.app/api/v2/authenticate',
      body: JSON.stringify({ client_id: `${process.env.XRAY_CLIENT_ID}`, client_secret: `${process.env.XRAY_CLIENT_SECRET}` }),
    }, (error, response, body) => {
      if (error)
        reject(error);

      resolve(JSON.parse(body));
    });
  });
}

async function sendRequestToXrayGraphQL(queryString) {
  if (authToken == '')
    authToken = await getAuthTokenForXray();

  if (authToken.error != null) {
    throw Error(JSON.stringify(authToken.error))
  }
  return new Promise((resolve, reject) => {
    Request.post({
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      url: 'https://xray.cloud.getxray.app/api/v2/graphql',
      body: JSON.stringify({ query: queryString }),
    }, (error, response, body) => {
      if (error) {
        reject(error);
        return
      }
      console.log(body);
      resolve(JSON.parse(body));
    });
  });
}

async function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  var imageData = new Buffer.from(bitmap).toString('base64');

  return imageData;
}

function getOsType() {
  let osType;
  if (os.includes('mac')) {
    osType = 'Mac';
    env = `${osType} ${browser}`;
  }
  else if (os.includes('Windows')) {
    osType = 'Windows';
    env = `${osType} ${browser}`;
  }
  else if (os.includes('iOS') || os.includes('Android')) {
    var deviceName = process.env['MOBILE_DEVICE_NAME'];

    osType = os.includes('iOS') ? 'ios' : 'android';
    env = `${deviceName} ${browser}`;
  }
  return osType;
}

async function getBackendVersion(backendVersionUrl) {
  return "v0.1.0"
}

// Guys sorry for this shitcoding.
async function getFrontendVersion(frontendVersionUrl) {
  return "v0.1.0"
}

export { getIssueId }
export { addEvidenceToTestRun }
export { addCommentToTestRun }
export { updateTestRunStatus }
export { getTestRun }
export { addTestToTestExecution }
export { createTestExecution }
export { base64_encode }
export { getTestExecutions }
export { getOsType }
export { getBackendVersion }
export { getFrontendVersion }
