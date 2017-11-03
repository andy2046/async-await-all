require('fibers/future')

module.exports = function (fn) {
  return function () {
    const _this = this
    const _args = [].slice.call(arguments, 0)

    return new Promise((resolve, reject) => {
      fn.future().apply(_this, _args).resolve((err, value) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }
}
