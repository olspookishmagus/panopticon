/* globals moment, ActiveXObject */

var currentLang = 'en';

function ical_parser(feed_url, callback){
    /**
       * Javascript ical Parser
       * Proof of concept method of reading icalendar (.ics) files with javascript.
       *
       * @author: Carl Saggs
       * @source: https://github.com/thybag/
       * @version: 0.2
       *
       * heavily modified for the needs of this app
    */

    this.raw_data = null;
    this.events = [];

    this.loadFile = function(url, callback){
        try {
            var xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } catch (e) {
            // pass
        }
        xmlhttp.onreadystatechange = function(){
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send(null);
    };

    this.makeDate = function(ical_date){
        var dt =  {
            year: ical_date.substr(0,4),
            month: ical_date.substr(4,2),
            day: ical_date.substr(6,2),
            hour: ical_date.substr(9,2),
            minute: ical_date.substr(11,2)
        };
        dt.date = new Date(dt.year, (dt.month-1), dt.day, dt.hour, dt.minute);
        dt.dayname =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dt.date.getDay()];

        return dt;
    };

    this.parseICAL = function(data){
        this.events = [];

        var cal_array = data.replace(new RegExp( '\\r', 'g' ), '').split('\n');

        var in_event = false;

        var cur_event = null;
        for (var i=0; i<cal_array.length; i++) {
            var ln = cal_array[i];
            if (!in_event && ln == 'BEGIN:VEVENT') {
                in_event = true;
                cur_event = {};
            }
            if (in_event && ln == 'END:VEVENT') {
                in_event = false;
                this.events.push(cur_event);
                cur_event = null;
            }
            if (in_event) {
                var idx = ln.indexOf(':');
                var colum = ln.indexOf(';');
                if (colum =='-1') {
                    colum = idx;
                }
                var type = ln.substr(0,colum).replace(/^\s\s*/, '').replace(/\s\s*$/, '');//Trim
                var val = ln.substr(idx+1,ln.length-(idx+1)).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                if (type == 'DTSTART') {
                    var dt = this.makeDate(val);
                    val = dt.date;
                    cur_event.start_time = dt.hour+':'+dt.minute;
                    cur_event.start_date = dt.day+'/'+dt.month+'/'+dt.year;
                    cur_event.start_day = dt.day;
                    cur_event.start_month = dt.month;
                    cur_event.start_year = dt.year;
                    cur_event.day = dt.dayname;
                }

                if (type =='DTEND') {
                    dt = this.makeDate(val);
                    val = dt.date;
                    cur_event.end_time = dt.hour+':'+dt.minute;
                    cur_event.end_date = dt.day+'/'+dt.month+'/'+dt.year;
                    cur_event.end_day = dt.day;
                    cur_event.end_month = dt.month;
                    cur_event.end_year = dt.year;
                }
                if (type =='DTSTAMP') {
                    val = this.makeDate(val).date;
                }

                cur_event[type] = val;
            }
        }
        this.complete();
    };


    this.complete = function(){
        this.events.sort(function(a,b){
            return a.DTSTART-b.DTSTART;
        });
        if (typeof callback == 'function') {
            callback(this);
        }
    };

    this.getEvents = function(){
        return this.events;
    };

    this.getFutureEvents = function() {
        var future_events = [];
        var current_date = new Date();

        this.events.forEach(function(itm) {
            if (itm.DTSTART > current_date) {
                future_events.push(itm);
            }
        });
        return future_events;
    };

    this.getCurrentEvents = function() {
        var current_events = [];
        var current_date = new Date();

        this.events.forEach(function(itm){
            if (itm.DTEND > current_date && itm.DTSTART < current_date) {
                current_events.push(itm);
            }
        });
        return current_events;
    };

    this.load = function(ical_file){
        var tmp_this = this;
        this.raw_data = null;
        this.loadFile(ical_file, function(data){
            tmp_this.raw_data = data;
            tmp_this.parseICAL(data);
        });
    };

    this.feed_url = feed_url;
    this.load(this.feed_url);
}

function get_counter() {
    $.ajax({
        url: 'https://www.hackerspace.gr/spaceapi',
        dataType: 'json',
        cache: false
    }).done(function(json) {
        var message = json.state.message;
        var state = json.state.open;
        var count = message.split(' hacker(s) in space')[0];
        var random_no = Math.floor((Math.random()*10)+2);
        var skadalia = [
            'thieves',
            'ghosts',
            'rats',
            'mosquitos',
            'resistors',
            'capacitors',
            'supermodels',
            'astronauts',
            'aliens',
            'M$ users',
            'books',
            'unicorns',
            'nyan cats',
            'ground stations'
        ];
        var random_text = Math.floor(Math.random()*skadalia.length);
        if (state) {
            var hackers = ' hackers';
            if (count == 1) {
                hackers = ' hacker';
            }
            $('#openornot').html('<b>' + count + hackers + '</b> and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now <b>open</b>!');
        } else {
            $('#openornot').html(count + ' and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now closed!');
        }
    });
}


// Display All future events in ical file as list.
function displayEvents(events, events_current, limit) {
    // Foreach event
    var li;
    for ( var i=0; i<Math.min(limit, events.length); i++) {
        // Create a list item
        li = document.createElement('li');
        // var eventid = '#EventModal-c' + i;
        var eventdesc = '#EventDescription-c' + i;
        var eventtitle = '#EventLabel-c' + i;
        var eventdate = '#EventDate-c' + i;
        var eventedit = '#EventEdit-c' + i;
        li.setAttribute('class', 'event');
        // Add details from cal file.
        li.innerHTML = '<span class="fa fa-calendar"></span> <a href="'+events[i].URL+'" target="_blank">' +
        events[i].SUMMARY + '</a><div class="events-date">' + events[i].day + ', ' + events[i].start_day + '.' +
        events[i].start_month + ' ' + events[i].start_time + '</div>';
        // Add list item to list.
        document.getElementById('calendar').appendChild(li);
        $(eventdesc).html(events[i].DESCRIPTION);
        $(eventtitle).html(events[i].SUMMARY);
        $(eventdate).html(events[i].day + ', ' + events[i].start_day + '.' + events[i].start_month + ' ' + events[i].start_time);
        $(eventedit).attr('href', events[i].URL);
    }
    for ( var j=0; j<Math.min(limit,events.length); j++) {
        // Create a list item
        li = document.createElement('li');
        li.setAttribute('class', 'list-item');
        // Add details from cal file.
        li.innerHTML = '<span class="fa fa-calendar"></span> <a target="_blank" href="'+ events_current[j].URL + '">' +
        events_current[j].SUMMARY + '</a><br>&nbsp;&nbsp;&nbsp;&nbsp;' + events_current[j].day + ', ' + events_current[j].start_day + '/' +
        events_current[j].start_month + ' ' +events_current[j].start_time + ' - ' + events_current[j].end_time + '';
        document.getElementById('calendar_current').appendChild(li);
    }
}

function getLang() {
    var qlang = window.location.search.substring(1).split('=')[1];
    if (typeof qlang != 'undefined') {
        currentLang = qlang;
    }
    var option = $('#lang option[value=' + currentLang + ']');
    option.prop('selected', 'selected');
    document.webL10n.setLanguage(currentLang);
}

var a;
var b;
function get_events() {
    var ical_url = 'https://www.hackerspace.gr/wiki/Special:Ask/-5B-5BCategory:Events-5D-5D/-3FTitle%3Dsummary/-3FStart-20date%3Dstart/-3FEnd-20date%3Dend/-3FLocation%3Dlocation/-3Ftagline%3Ddescription/format%3D-20icalendar/limit%3D-2050/sort%3D-20Start-20date/order%3Ddesc/searchlabel%3D-20iCal/title%3D-20hsgr/offset%3D0';
    ical_parser(ical_url, function(cal) {
        a = cal.getFutureEvents();
        b = cal.getCurrentEvents();
        displayEvents(a,b,6);
    });
}

function get_news() {
    $.get('/feed/', function (data) {
        var news_html = '';
        $(data).find('entry').each(function (i) {
            var item = $(this);
            var link = item.find('id').text();
            var title = item.find('title').text();
            var pubdate = moment(item.find('published').text()).fromNow();
            news_html += '<li><div class="itemTitle"><span class="fa fa-newspaper-o"></span> <a href="/#/updates/' + link.split('https://librenet.gr/p/')[1] + '">' + title + '</a><div class="events-date">' + pubdate + '</div></li>';
            return i<5;
        });
        $('#news').html(news_html);
    });
}
