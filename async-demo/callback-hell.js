console.log('before');
getUser(1, (callbackUser) => {
	console.log("User", callbackUser);
	getRepository(callbackUser.githubUserName, (callbackRepo) => {
		console.log('callbackRepo', callbackRepo);
	});
	
});
console.log('after');

function getUser (id, callbackUser) {
	setTimeout(()=>{
		console.log(`Reading a user id: ${id} from a database...`);
		callbackUser({ id: id, githubUserName: 'Edu' })
	}, 2000)
}

function getRepository (user, callbackRepo){
	setTimeout(()=>{
		console.log('Reading repositories...');
		callbackRepo(["repo1", "repo2", "repo3"])
	}, 2000)
}
