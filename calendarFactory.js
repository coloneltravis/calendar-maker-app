const fs = require('fs');
const pug = require('pug');
const wkhtmltopdf = require('wkhtmltopdf');


    const CAL_TYPES = [
        {
            name: "fortnight_strip",
            layout: "strip-cal",
            stylesheet: "calendar-strip-blue",
            orientation: "portrait",
        },
        {
            name: "month_view",
            layout: "weekcal",
            stylesheet: "calendar-month",
            orientation: "landscape"
        },
        {
            name: "month_view_artwork",
            layout: "weekcal-artwork",
            stylesheet: "calendar-month",
            orientation: "portrait"
        },
        {
            name: "full_year",
            layout: "fullyear-cal",
            stylesheet: "calendar-year",
            orientation: "portrait"
        }
    ];


    function makeCalendar(caltype, events, year, month, count, name, res, next)
    {
        if (caltype >= 0)
        {
            var calType = CAL_TYPES[caltype];

            var fn = pug.compileFile(`./layouts/${calType.layout}.pug`, {events: events});
            var data = fn({ events: events, currentYear: year, startMonth: month, monthCount: count });

            //fs.writeFileSync("./calendar.html", data);

            var pageOptions = {
                pageSize: 'A4',
                orientation: calType.orientation,
                encoding: 'utf-8',
                userStyleSheet: `css/${calType.stylesheet}.css`,
                enableLocalFileAccess: true,
                printMediaType: true,
                marginLeft: '0mm',
                marginRight: '0mm'
            };
                    
            wkhtmltopdf(data, pageOptions, next)
                .pipe(res);
        }

    }        

exports.makeCalendar = makeCalendar;



