const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);

const initMethod = async () => {
  const currentBranch = await git.branch()
  console.log(currentBranch);
}
initMethod()