const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);
var release = require('github-pr-release');


const pr = async (head, base) => {

    // pull request
    const config = {
      token: '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',
      owner: 'chaoyuexue',
      repo:  'interval-push',
      head,
      base
    };
    try {
      const prResult = await release(config);
      console.log(prResult);
    } catch (error) {
      console.log(error);
    }
}

const intervalCommit = async () => {
  const logs = await git.raw('cherry')
  const remoteNameOrigin = await git.remote()
  const remoteName = remoteNameOrigin.replace(/\n/g, '')
  const currentBranch = await git.branch();
  console.log(currentBranch.current);
  const needPushedArr = logs.split(/\n/g).filter(i => i !== '').map(i => i.split(/\s/g)[1]);
  console.log(needPushedArr);
  if (needPushedArr.length) {
    const currentCommit = needPushedArr[0];
    const result = await git.push([remoteName, `${currentCommit}:${currentBranch.current}`]);
    console.log(result);
    await pr(currentBranch.current, 'master');
  }
  // process.exit(1);
}

// setInterval(() => {
  intervalCommit()
// }, 60000);
