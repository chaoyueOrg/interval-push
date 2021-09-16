const SimpleGit = require('simple-git/promise');
const path = require('path');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);
var release = require('github-pr-release');

const intervalCommit = async () => {
  const logs = await git.raw('cherry')
  const needPushedArr = logs.split(/\n/g).filter(i => i !== '').map(i => i.split(/\s/g)[1]);
  console.log(needPushedArr);
  if (needPushedArr.length) {
    const current = needPushedArr[0];
    const result = await git.push();
    console.log(reuslt);
  }
  // process.exit(1);
}

setInterval(() => {
  intervalCommit()
}, 60000);