export class RequestHelper {
    static retry ({
                      fetch,
                      maxAttempts = 3,
                      getValueFunc
                  }) {
        return new Promise((resolve, reject) => {
            let attempt = 0

            async function retryFunc () {
                try {
                    console.log('Trying to fetch the data...')
                    const fetchResult = await fetch()

                    try {
                        console.log('Trying to get the value...')
                        const value = getValueFunc(fetchResult)

                        resolve(value)
                    } catch (e) {
                        console.error('Attempt to get value failed')
                        console.error(e)
                        attempt++

                        if (attempt === maxAttempts) {
                            console.error(`Getting value failed after ${attempt} attempts`)
                            reject(new Error('Max attempts reached'))

                            return
                        }
                        console.log("Failed request time is " + new Date());
                        sleep(120000).then(() => { retryFunc(); });
                    }
                } catch (e) {
                    console.error('An error occurred during the fetch request')
                    reject(e)
                }
            }

            retryFunc()
        })
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
