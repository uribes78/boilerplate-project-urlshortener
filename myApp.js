const dns = require('dns');
const { Router } = require('express');
const urlShorts = new Map();

const resolver = (url) => {
    return new Promise((resolve, reject) => {
        dns.lookup(url, (err, addr) => {
            console.log(err, addr);
            if (err)
                return reject(err);

            return resolve(addr);
        });
    });
};

const urlValidator = (url) => {
    try {
        let item = new URL(url);
        
        if (!/^http/i.test(item.protocol))
            throw new Error('Invalid protocol');

        return resolver(item.host);
    } catch (e) {
        return Promise.reject(e);
    }
};

const api = () => {
    let routes = new Router();

    // Your first API endpoint
    routes.get('/hello', function(req, res) {
        res.json({ greeting: 'hello API' });
    });

    routes.get(['/shorturl', '/shorturl/:id'], (req, res) => {
        let { id } = req.params;

        if (isNaN(id) || !urlShorts.has( Number(id) ))
            return res.status(400).json({error: 'invalid url'}).end();

        let url = urlShorts.get(Number(id));

        res.redirect(url);
    });
    
    routes.post('/shorturl', (req, res) => {
        let { url } = req.body;

        urlValidator(url).then(addr => {
            let shortId = urlShorts.size + 1;

            urlShorts.set(shortId, url);

            res.status(200).json({
                original_url: url,
                short_url: shortId
            });
        }).catch(err => {
            console.log("Response -> ", err);
            res.status(200)
                .json({error: 'invalid url'})
                .end();
        });
    });

    return routes;
};

module.exports = api;
