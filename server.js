const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

const env = process.env.NODE_ENV || 'development';
const pokemontcg = process.env.pokemontcg || null; 

/*
 * SSL IN PROD
*/
var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};
   
if (env === 'production') {
    app.use(forceSsl);
}

/*
 * ASSETS
 */
app.use(express.static(__dirname + '/dist/pokemon'));

/*
 * API
 */
app.all('/api/*', function(req,res) {
    let url = req.url.replace(/\/api\//,'');
    axios.get('https://api.pokemontcg.io/v2/'+url, {
        headers: {
            'X-Api-Key': pokemontcg
        }
    }).then(function (response) {
        return res.json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        return res.status(error.response.status).json(error);
      })
})

/*
 * FRONT
 */
app.get('/*', function(req,res) {  
  res.sendFile(path.join(__dirname+'/dist/pokemon/index.html'));
});

/*
 * Heroku port
 */
app.listen(process.env.PORT || 8080);