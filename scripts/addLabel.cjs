const core = require('@actions/core');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const prNumberArg = process.argv[2];

const labelPriority = { patch: 1, minor: 2, major: 3 };
const versionLabels = Object.keys(labelPriority);

function getVersionLabelFromCommitMessage(commitMessage) {
    if (/^(breaking:)/.test(commitMessage)) {
        return 'major';
    }
    if (/^feat:/.test(commitMessage)) {
        return 'minor';
    }
    if (/^fix:/.test(commitMessage)) {
        return 'patch';
    }
}

function findHighestPriorityLabel(labelNames) {
    return labelNames.reduce((highestLabel, labelName) => {
        const isHigherPriority = labelPriority[labelName] >= labelPriority[highestLabel];
        if (versionLabels.includes(labelName) && (!highestLabel || isHigherPriority)) {
            return labelName;
        }
        return highestLabel;
    }, '');
}

async function addLabel(prNumber, newLabel) {
    await execPromise(`gh pr edit ${prNumber} --add-label ${newLabel}`);
    core.info(`Updated PR #${prNumber} with label: ${newLabel}`);
}

async function replaceLabel(prNumber, currentVersionLabel, versionLabelFromCommit) {
    await execPromise(`gh pr edit ${prNumber} --remove-label ${currentVersionLabel}`);
    return addLabel(prNumber, versionLabelFromCommit)
}

async function addLabelToBasedOnCommits(prNumber) {
    const { commits, labels } = JSON.parse(
        (await execPromise(
            `gh pr view ${prNumber} --json commits,labels`
        )).stdout
    );

    const versionLabelFromCommit = commits.reduce((highestLabel, commit) => {
        const label = getVersionLabelFromCommitMessage(commit.messageHeadline);
        const isHigherPriority = labelPriority[label] >= labelPriority[highestLabel];

        return isHigherPriority ? label : highestLabel;
    }, 'patch')

    if (labels.length === 0) {
        core.info(`No labels found for PR #${prNumber}`);
        return addLabel(prNumber, versionLabelFromCommit);
    }

    const labelNames = labels.map(label => label.name);
    core.info(`PR labels: ${labelNames.join(', ')}`);

    const currentVersionLabel = findHighestPriorityLabel(labelNames);

    if (!currentVersionLabel) {
        return addLabel(prNumber, versionLabelFromCommit);
    }

    const isCurrentVersionLabelHigher = labelPriority[currentVersionLabel] >= labelPriority[versionLabelFromCommit];

    if (isCurrentVersionLabelHigher) {
        core.info(`Version label not updated. Current version label is ${currentVersionLabel}`);
    } else {
        return replaceLabel(prNumber, currentVersionLabel, versionLabelFromCommit);
    }
}

module.exports = {
    addLabelToBasedOnCommits,
}

if (require.main === module) {
    try {
        addLabelToBasedOnCommits(prNumberArg);
    } catch (error) {
        core.setFailed(error.message);
    }
}