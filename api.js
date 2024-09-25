const express = require('express')
const fs = require('fs')
var bodyParser = require('body-parser')
const calendarFactory = require('./calendarFactory.js')

const app = express()
const port = 8080


var jsonParser = bodyParser.json()
var formParser = bodyParser.urlencoded({ extended: false });


function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.send('Server error: ' + err);
}


app.get('/', (req, res) => {

    res.send("Calendar Maker API");
    res.end();
})


app.get('/calendar/:caltype', (req, res, next) => {

  try {
    validateParams(req.params.caltype);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');
  
    var d = new Date();

    calendarFactory.makeCalendar(req.params.caltype, null, d.getFullYear(), d.getMonth()+1, 1, 'mycal', res, next);
  }
  catch(err) {
      next(err);
  }
})


app.get('/calendar/:caltype/year/:year/month/:month/count/:mcount', (req, res, next) => {

  try {
    validateParams(req.params.caltype, req.params.month, req.params.mcount);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');

    calendarFactory.makeCalendar(req.params.caltype, null, req.params.year, req.params.month, req.params.mcount, 'mycal', res);
  }
  catch(err) {
    next(err);
  }

});



app.post('/calendar', jsonParser, function (req, res, next) {


  try {
    validateParams(req.body.caltype, req.body.month, req.body.count);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');

    calendarFactory.makeCalendar(req.body.caltype, req.body.events, req.body.year, req.body.month, req.body.count, 'mycal', res);
  
  }
  catch(err)
  {
    next(err);
  }
})


app.post('/webhook', jsonParser, function (req, res, next) {

  try {
    var jsonObj = JSON.parse(req.body.rawRequest);
    var eventsObj = (jsonObj.hasOwnProperty('q12_events') ? JSON.parse(jsonObj.q12_events) : null);
``
    validateParams(jsonObj.q14_caltype, jsonObj.q15_month, jsonObj.q7_Lengthmonths);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');

    calendarFactory.makeCalendar(jsonObj.q14_caltype, eventsObj, jsonObj.q3_year, jsonObj.q15_month, jsonObj.q7_Lengthmonths, 'mycal', res);
  }
  catch(err)
  {
    next(err);
  }
})


app.post('/jotform', formParser, function (req, res, next) {

  try {
    var data = req.body;


    var eventsObj = (req.body.events && req.body.events !== '' ? JSON.parse(req.body.events) : null);

    validateParams(req.body.caltype, req.body.month, req.body.lengthmonths);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');

    calendarFactory.makeCalendar(req.body.caltype, null, req.body.year, req.body.month, req.body.lengthmonths, 'mycal', res);
  }
  catch(err)
  {
    next(err);
  }
})


app.use(function(req, res, next){
  res.status(404);

  res.format({
    html: function () {
      res.send('Resource not found: ' + req.url);
    },
    json: function () {
      res.json({ error: 'Resource not found' })
    },
    default: function () {
      res.type('txt').send('Resource not found')
    }
  })
});



function validateParams(caltype, month = 1, count = 1 )
{
  if (parseInt(caltype) < 0 || parseInt(caltype) >  3) {
    throw new Error('Invalid calendar type');
  }

  if (caltype == 0 || caltype || 1) {
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      throw new Error('Incorrect month');
    }
    else if (parseInt(count) < 1 || parseInt(count) > 12) {
      throw new Error('Invalid count');
    }  
  }
}





app.use(errorHandler);



app.listen(port, () => {
  console.log(`Calendar Maker API is listening on port ${port}`)
})


