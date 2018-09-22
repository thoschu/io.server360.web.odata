const http = require('https'),
    events = require('events'),
    serviceRoot = 'https://services.odata.org',
    path = '/v4/TripPinServiceRW/',
    resource = 'People',
    url = `${serviceRoot}${path}${resource}`;

http.get(url, response => {
    const eventEmitter = new events.EventEmitter();
    let body = '';

    if ([301, 302].includes(response.statusCode)) {
        http.get(`${serviceRoot}${response.headers.location}`, response => {
            eventEmitter.emit('result', response);
        });
    } else {
        eventEmitter.emit('result', response);
    }

    eventEmitter.on('result', (response) => {
        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            console.log(JSON.parse(body));
        });
    });
}).on('error', e => {
    console.log('ERROR: ' + e.message);
});
