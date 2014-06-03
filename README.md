## serially

Compose async functions into one function that runs all serially

## Install

```bash
$ npm install serially
```

## Usage

```js
var serially = require('serially')
var http = require('http')
var fs = require('fs')

serially()
      .then(foo, ['a', 'b', 'c'])
      .then(bar, [1, 2, 3])
      .then('qux alias', qux, [4, 5, 6])
      .done(function (error, results) {
        if (error) throw error
      
        console.log('done')
        console.log(results)
        // => { foo: [...], bar: [...], qux alias: [...] }
      })

function foo (pa, ra, ms, callback) {}
function bar (pa, ra, ms, callback) {}
function qux (pa, ra, ms, callback) {}
```

See `test.js` for more info.
