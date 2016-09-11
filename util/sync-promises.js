
module.exports = syncPromises;

function syncPromises (promises)
{
    return new Promise(function (resolve, reject) {
        var index = 0;
        next();
        function next ()
        {
            if (index < promises.length) {
                index += 1;
                promises[index-1]()
                .then(next)
                .catch(reject);
            } else {
                resolve();
            }
        }
    });
}
