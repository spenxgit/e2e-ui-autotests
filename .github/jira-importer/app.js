import * as utils from './utils.js'
import * as fs from 'fs';
import {RequestHelper} from './request-helper.js'

const buildDir = process.env.CI_BUILDS_DIR
const env = "TEST"
const backendVersionUrl = "https://app.dev.apps.spenxy.com"
const frontendUrl = "https://wlspenxy.dev.apps.spenxy.com/login"

const TestStatus = {
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED',
    PASSED: 'PASSED'
}


async function main() {
    await createJiraReport();
}

async function createJiraReport() {

    let executionId = await createJiraTestExecution();
    console.debug("Created test execution id:", executionId);

    let report = getReport(`${buildDir}/report.json`)
    console.debug(report)

    await addTestsToJiraExecution(report, executionId)
}

async function createJiraTestExecution() {

    let frontendVersion = await utils.getFrontendVersion(frontendUrl)
    let backendVersion = await utils.getBackendVersion(backendVersionUrl);

    console.debug("Backend version is:", backendVersion)
    console.debug("Frontend version is:", frontendVersion)

    return await utils.createTestExecution(env, frontendVersion, backendVersion);

}

function getReport(reportPath) {
    return JSON.parse(fs.readFileSync(reportPath))
}

async function addTestsToJiraExecution(report, executionId) {
    for (const fixture of report.fixtures) {
        for (const test of fixture.tests) {
            await setTestData(test, executionId)
        }
    }
}

async function setTestData(test, executionId) {
    let testRunStatus = getTestRunStatus(test)

    let testIssueId = await getTestIssueId(test);

    let testRunData = await getTestRunData(testIssueId, executionId);

    let testRunId = await getTestRunId(testRunData, testIssueId, executionId);

    await utils.updateTestRunStatus(testRunId, testRunStatus);

    if (testRunStatus === TestStatus.FAILED) {
        let testRunError = getTestRunError(test);
        await addArtifactsForFailedTests(test, testRunId, testRunError);
    }
}



function getTestRunStatus(test) {
    if (test.errs.length > 0)
        return TestStatus.FAILED;
    else if (test.skipped)
        return TestStatus.SKIPPED;
    else
        return TestStatus.PASSED;
}

async function getTestIssueId(test) {
    let testKey = test.name.split(' ')[0];
    let testIssueId = null

    try {
        testIssueId = await utils.getIssueId(testKey)
    } catch (err) {
        console.error(err)
    }

    console.debug('\n' + testKey, "have", testIssueId, "id",)
    return testIssueId;
}


async function getTestRunData(testIssueId, executionId){
    return RequestHelper.retry({
        fetch: () => utils.getTestRun(testIssueId, executionId),
        maxAttempts: 3,
        getValueFunc: fetchResult => {
            if(fetchResult.data !== undefined){
                return fetchResult;
            }else {
                throw Error('TestRunData is undefined');
            }
        }
    });
}

async function getTestRunId(testRunData, testIssueId, executionId) {
    if (testRunData.data.getTestRun != null) {
        return testRunData.data.getTestRun.id;
    } else {
        await utils.addTestToTestExecution(testIssueId, executionId);
        return RequestHelper.retry({
            fetch: () => utils.getTestRun(testIssueId, executionId),
            maxAttempts: 3,
            getValueFunc: fetchResult => fetchResult.data.getTestRun.id
        });
    }
}

function getTestRunError(test) {
    var testRunError = '';
    test.errs.forEach(function (error) {
        testRunError += error;
    });
    return testRunError;
}

async function addArtifactsForFailedTests(test, testRunId, testRunError) {

    await utils.addCommentToTestRun(testRunId, testRunError);

    let newScreenshotPaths = `/${buildDir}/screenshots/${test.screenshotPath.split("screenshots")[1]}`
    var imageData = await utils.base64_encode(newScreenshotPaths);
    await utils.addEvidenceToTestRun(testRunId, imageData);

}

main();
