const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);

const initMethod = async () => {
  console.log('=================')
  const unmergedBranches = await git.branch(['--no-merged'])
  const branchLen = Object.keys(unmergedBranches.branches).length;
  // if (branchLen > 0) {
  //   process.exit(1)
  // }
  process.exit(0)
}

const intervalCommit = async () => {
  const logs = await git.raw('cherry')
  const needPushedArr = logs.split(/\n/g).filter(i => i !== '').map(i => i.split(/\s/g)[1]);
  console.log(needPushedArr);
  // process.exit(1);
}

intervalCommit()
// initMethod()