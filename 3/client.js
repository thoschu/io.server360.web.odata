const http = require("https"),
    events = require("events"),
    eventEmitter = new events.EventEmitter(),
    serviceRoot = "https://services.odata.org",
    path = "/v4/TripPinServiceRW/",
    resource = "People?$top=2 & $select=FirstName, LastName & $filter=Trips/any(d:d/Budget gt 3000)",
    url = `${serviceRoot}${path}${resource}`;

http.get(url, (response) => {
    let body = '';

    if ([301, 302].includes(response.statusCode)) {
        const newUrl = `${serviceRoot}${response.headers.location}`;
        http.get(newUrl, response => {
            eventEmitter.emit('scream', response);
        }).on('error', function (e) {
            console.log('2. ERROR: ' + e.message);
        });
    } else {
        eventEmitter.emit('scream', response);
    }

    eventEmitter.on('scream', (response) => {
        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            console.log(JSON.parse(body));
        });
    });
}).on('error', function (e) {
    console.log('1. ERROR: ' + e.message);
});
