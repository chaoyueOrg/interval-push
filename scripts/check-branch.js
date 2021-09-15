const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);

const initMethod = async () => {
  console.log('=================')
  const unmergedBranches = await git.branch(['--no-merged'])
  const branchLen = Object.keys(unmergedBranches.branches).length;
  if (branchLen > 0) {
    process.exit(1)
  }
}
initMethod()