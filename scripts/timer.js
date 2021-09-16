const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);
var release = require('github-pr-release');


const pr = async () => {

    // pull request
    const config = {
      token: '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',
      owner: 'chaoyuexue',
      repo:  'interval-push',
      base: 'develop1',
      head: 'master'
    };
    try {
      release(config).then(res => {
        console.log(res);
      }).catch(e => console.log(e, '=========='));
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
  }
  // process.exit(1);
}
pr()

// setInterval(() => {
  // intervalCommit()
// }, 60000);
