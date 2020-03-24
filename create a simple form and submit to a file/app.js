const http = require('http');
const { parse } = require('querystring');
var fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            fs.writeFile('message.txt', result.message, function (err){
                if (err) throw err;
                console.log('Saved!');
                res.end();
                // res.end(`Parsed data belonging to ${result.message}`);
            });
            
            
        });
    } 
    else {
        res.end(`
                <!doctype html>
                <html>
                <body>
                    <h3>Please enter a message below.</h3>
                    <form action="/message" method="post">
                    <label for="message">Message:</label><input type="text" name="message" value=""><br>
                    <label for="button">submit message</label><button type="submit" name="button">Submit</button>
                    </form>
                </body>
                </html>
            `);
    }
});
server.listen(8080);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}