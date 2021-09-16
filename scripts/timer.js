const SimpleGit = require('simple-git/promise');
const path = require('path');
const https = require('https');
const projectPath = path.resolve(__dirname, '../')
const git = SimpleGit(projectPath);
var release = require('github-pr-release');

const axiosInstance = axios()

const pr = async (head, base) => {

    // pull request
    const data = JSON.stringify({
      head,
      base,
      title: 'adfafd',
    })
    const config = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/chaoyuexue/interval-push/pulls',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': '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'
      }
    };
    const req = https.request(config, res => {
      console.log(res);
      res.on('data', d => {
        process.stdout.write(d);
      })
    });
    req.on('error', error => {
      console.error(error)
    });
    req.write(data)
    req.end()
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
    // add pr
    await pr(currentBranch.current, 'master');
  }
  // process.exit(1);
}

// setInterval(() => {
  intervalCommit()
// }, 60000);
