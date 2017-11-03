const Future = require('fibers/future')

module.exports = function (promise) {
  const future = new Future()

  promise
    .then(value => {
      future.return(value)
    })
    .catch(error => {
      future.throw(error)
    })

  return future.wait()
}
