// CREATING A PROMISE
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1); // pending > resolved, fulfilded (.then = get result)
    reject(new Error("message")); // pending > rejected (.catch = get error)
  }, 2000);
});

//then retorna o result (que vem de resolve)
//catch retorna o reject

// CONSUMING A PROMISE
p.then((result) => console.log("Result", result)).catch((err) =>
  console.log("Error", err.message)
);
