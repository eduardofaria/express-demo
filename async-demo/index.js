console.log('Before');
getUser(1, getRepositories);
console.log('After');




function getRepositories(user){
	console.log(`Recebe: ${user.gitHubUsername}`)
	getRepositories2(user.gitHubUsername, getCommits)
}

function getCommits(repo){
	console.log(`Recebe: ${repo}`)
	getCommits2(repo[0], displayCommits)
}

function displayCommits(commits) {
	console.log(`Recebe: ${commits}`)
	console.log(commits);
}





function getUser(id, cb) {
  setTimeout(() => {
    console.log('Reading a user from a database...');
    cb({ id: id, gitHubUsername: 'Edu' });
  }, 2000);
}

function getRepositories2(username, cb) {
  setTimeout(() => {
    console.log('Calling GitHub API...');
    cb(['repo1', 'repo2', 'repo3']);
  }, 2000);
}

function getCommits2(repo, cb) {
  setTimeout(() => {
    console.log('Calling GitHub API...');
    cb(['commit']);
  }, 2000);
}