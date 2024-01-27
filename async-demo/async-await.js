console.log("before");

//getUser(1).then((user) => console.log(`User: ${user.githubUserName}`));

//PROMISE-BASED
getUser(1)
  .then((user) => getRepository(user.githubUserName))
  .then((repo) => getCommits(repo[0]))
  .then((commits) => console.log(`Commits: ${commits}`))
  .catch((error) => console.error("Error Promise: " + error.message));

// ASYNC AND AWAIT APPROACH
async function displayCommits() {
  // If you call an await, you must call it in an "async function(){...}".
  try {
    // This approach doesn't has an catch method like Promise approach. Must use a try/catch block to get errors
    const user = await getUser(1);
    const repos = await getRepository(user.githubUserName);
    const commits = await getCommits(repos[0]);
    console.log(commits);
  } catch (error) {
    console.log("Error Async/Await: " + error.message);
  }
}

displayCommits(); // Calling ASYNC function (its returning a void Promise)

console.log("after");

async function getUser(id) {
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

async function getRepository(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Reading repositories...");
      resolve(["repo1", "repo2", "repo3"]);
      //reject(new Error("Could not get repository..."));
    }, 2000);
  });
}

async function getCommits(repo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["commit 1"]);
    }, 2000);
  });
}
