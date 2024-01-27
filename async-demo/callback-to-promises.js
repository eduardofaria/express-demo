console.log("before");

//getUser(1).then((user) => console.log(`User: ${user.githubUserName}`));

getUser(1)
  .then((user) => getRepository(user.githubUserName))
  .then((repo) => getCommits(repo[0]))
  .then((commits) => console.log(`Commits: ${commits}`))
  .catch((error) => console.error("Error" + error.message));

console.log("after");

function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Reading a user id: ${id} from a database...`);
      if (true) {
        resolve({ id: id, githubUserName: "Edu" });
      } else {
        reject(console.log("An error"));
      }
    }, 2000);
  });
}

function getRepository(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Reading repositories...");
      resolve(["repo1", "repo2", "repo3"]);
    }, 2000);
  });
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["commit 1"]);
    }, 2000);
  });
}
