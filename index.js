const isPromise = p => Promise.resolve(p) == p;

module.exports = obj => {
  var promises = [];

  return new Promise((resolve, reject) => {
    const resolver = (objs, parent) => {
      return new Promise(resolve => {
        for (let key in objs) {
          if (isPromise(objs[key])) {
            promises.push(
              new Promise(res => {
                objs[key].then(value => {
                  value = typeof value == "object" ? JSON.stringify(value) : ('"'+value+'"')

                  eval(
                    'obj' +
                      (parent + '"]["' + key + '"]').slice(11) +
                      '=' +
                      value
                  );
                  res(obj);
                });
              })
            );
          } else {
            if (typeof objs[key] == 'object') {
              resolver(objs[key], parent + '"]["' + key);
            }
          }
        }
      });
    };

    resolver(obj);

    Promise.all(promises).then(arr => {
      resolve(arr.reduce((a, b) => Object.assign(a, b)));
    }).catch(reject)
  });
};
