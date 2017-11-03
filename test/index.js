const { asyncMe, awaitMe, await$ } = require('../src')

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => resolve(ms), ms)
  })
}

const awaitMeExample = asyncMe(function(ms) {
  try {
    console.log('1...', new Date)
    const ret = awaitMe(sleep(ms))
    console.log('2...', new Date)
    return ret
  } catch (e) {
    console.log(e)
  }
})

const awaitAllExample = asyncMe(function(ms) {
  try {
    console.log('3...', new Date)
    const ret = await$([sleep(ms), sleep(ms*2)])
    console.log('4...', new Date)
    return ret
  } catch (e) {
    console.log(e)
  }
})

awaitMeExample(1000)
  .then(console.log)
  .catch(console.error)
  .then(() => {
    awaitAllExample(1000)
      .then(console.log)
      .catch(console.error)
  })

/*

node ./test
1... 2017-11-02T07:49:13.636Z
2... 2017-11-02T07:49:14.643Z
1000
3... 2017-11-02T07:49:14.644Z
4... 2017-11-02T07:49:16.649Z
[ 1000, 2000 ]

*/

