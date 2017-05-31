import test from 'ava';
import or from './index';

test('foo', async t => {
  let r = await or({
    a: {
      b: {
        c: new Promise(resolve => {
          setTimeout(() => {
            resolve('d')
          }, 2000)
        })
      }
    },
    z: new Promise(resolve => {
      setTimeout(() => {
         resolve('k') 
      }, 3000)
    }),
  })

  t.deepEqual(r,{
    a: { b: { c: 'd' } }, z: 'k'
  })

});
