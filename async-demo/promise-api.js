const p = Promise.resolve({ id: 1 });
p.then((result) => console.log(result));

//const r = Promise.reject(new Error("Reason for reject..."));
//r.catch((error) => console.log(error));

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async operation 1...");
    resolve(1);
    //reject(new Error("P1 Fail"));
  }, 2000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("Async operation 2...");
    resolve(2);
  }, 2000);
});

Promise.all([p1, p2]) //if one promise in array is rejected, Promise.all returns rejected.
  .then((resultOfPs) => console.table(resultOfPs))
  .catch((error) => console.log(error));

Promise.race([p1, p2])
  .then((resultOfPs) => console.table("Race: " + resultOfPs)) //Result its not an array, but the result of the first completed promise
  .catch((error) => console.log(error));
