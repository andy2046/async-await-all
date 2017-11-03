const awaitMe = require('../awaitMe')

const promiseMe = (iterable, opts) => new Promise((resolve, reject) => {
  const opt = Object.assign({
    concurrency: Infinity
  }, opts)

  const concurrency = opt.concurrency

  if (!(typeof concurrency === 'number' && concurrency >= 1)) {
    throw new TypeError('Expected concurrency to be a number >= 1')
  }

  const ret = []
  const iterator = iterable[Symbol.iterator]()
  let isRejected = false
  let iterableDone = false
  let resolvingCount = 0
  let currentIdx = 0

  const next = () => {
    if (isRejected) {
      return
    }

    const nextItem = iterator.next()
    const idx = currentIdx
    currentIdx++

    if (nextItem.done) {
      iterableDone = true

      if (resolvingCount === 0) {
        resolve(ret)
      }

      return
    }

    resolvingCount++

    Promise.resolve(nextItem.value)
      .then(
        val => {
          ret[idx] = val
          resolvingCount--
          next()
        },
        err => {
          isRejected = true
          reject(err)
        }
      )
  }

  for (let i = 0; i < concurrency; i++) {
    next()

    if (iterableDone) {
      break
    }
  }
})

module.exports = (iterable, opts) => awaitMe(promiseMe(iterable, opts))
