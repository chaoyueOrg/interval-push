const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);

const initMethod = async () => {
  console.log('=================')
  const currentBranch = await git.branch(['--no-merged'])
  console.log(currentBranch);
}
initMethod()