const SimpleGit = require("simple-git/promise");
const path = require("path");
const release = require("github-pr-release");
const dotenv = require("dotenv");
const superagent = require("superagent");

const projectPath = path.resolve(__dirname, "../");
const git = SimpleGit(projectPath);
dotenv.config({ path: ".env" });

let current_user = null;

const initUser = async () => {
  return new Promise((resolve, reject) => {
    superagent
      .get(`https://api.github.com/users/${process.env.current_user}`)
      .set(
        "User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
      )
      .set("Authorization", `token ${process.env.git_token}`)
      .end((err, res) => {
        if(err) {
          reject(err)
        } else {
          current_user = res.body.id;
          resolve(res.body)
        }
      });
  });
}

const pr = async (head, base) => {
  // pull request
  const config = {
    token: process.env.git_token,
    owner: "chaoyueOrg",
    repo: "interval-push",
    head,
    base,
  };
  try {
    const prResult = await release(config);
    return prResult
  } catch (error) {
    console.log(error);
  }
  return null
};

const getPrs = () => {
  return new Promise((resolve, reject) => {
    superagent
      .get("https://api.github.com/repos/chaoyueOrg/interval-push/pulls")
      .set(
        "User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
      )
      .set("Authorization", `token ${process.env.git_token}`)
      .end((err, res) => {
        if(err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      });
  });
};
const intervalCommit = async () => {
  if (!current_user) {
    await initUser();
  }
  const logs = await git.raw("cherry");
  const remoteNameOrigin = await git.remote();
  const remoteName = remoteNameOrigin.replace(/\n/g, "");
  const currentBranch = await git.branch();
  console.log(currentBranch.current);
  const needPushedArr = logs
    .split(/\n/g)
    .filter((i) => i !== "")
    .map((i) => i.split(/\s/g)[1]);
  console.log(needPushedArr);

  // 判断是否有merge
  const currentMerged = (await getPrs()) || [];
  const current_user_merged = currentMerged.filter(i => i.user.id === current_user);
  if (current_user_merged.length) {
    return;
  }
  if (needPushedArr.length) {
    const currentCommit = needPushedArr[0];
    const result = await git.push([
      remoteName,
      `${currentCommit}:${currentBranch.current}`,
    ]);
    console.log(result);
    // add pr
    await pr(currentBranch.current, "master");
  }
};

// setInterval(() => {
intervalCommit()
// }, 60000);
