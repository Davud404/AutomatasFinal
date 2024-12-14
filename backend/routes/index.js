var express = require('express');
var router = express.Router();

let AutocorrectorControl = require('../app/AutocorrectorControl');
let autoC = new AutocorrectorControl();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/autocorrector', autoC.autocorrector);

module.exports = router;
