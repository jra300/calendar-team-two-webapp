let weeks = [];
let month = moment().month() + 1; //months are zero-indexed
let year = moment().year();
let today = moment().date();
let events = {};

const ENTER_KEY = 13;
let input;
var jsalarm;

var alarm = new Audio("http://soundbible.com/grab.php?id=2197&type=mp3");

window.onload = function () {
    input = document.getElementById("textInput");

    input.addEventListener("keydown", function (event) {
        if (event.keyCode === ENTER_KEY) {
            create();
        }
    });

    //http://www.javascriptkit.com/script/script2/alarm.shtml
    var jsalarm = {
        padfield: function (f) {
            return (f < 10) ? "0" + f : f
        },
        showcurrenttime: function () {
            var dateobj = new Date()
            var ct = this.padfield(dateobj.getHours()) + ":" + this.padfield(dateobj.getMinutes()) + ":" + this.padfield(dateobj.getSeconds())
            this.ctref.innerHTML = ct
            this.ctref.setAttribute("title", ct)
            if (typeof this.hourwake != "undefined") { //if alarm is set
                if (this.ctref.title == (this.hourwake + ":" + this.minutewake + ":" + this.secondwake)) {
                    clearInterval(jsalarm.timer)

                    alarm.play()
                }
            }
        },
        init: function () {
            var dateobj = new Date()
            this.ctref = document.getElementById("jsalarm_ct")
            this.submitref = document.getElementById("submitbutton")
            this.submitref.onclick = function () {
                jsalarm.setalarm()
                this.value = "Alarm Set"
                this.disabled = true
                return false
            }
            this.resetref = document.getElementById("resetbutton")
            this.resetref.onclick = function () {
                jsalarm.submitref.disabled = false
                jsalarm.hourwake = undefined
                jsalarm.hourselect.disabled = false
                jsalarm.minuteselect.disabled = false
                jsalarm.secondselect.disabled = false
                jsalarm.showcurrenttime()
                jsalarm.timer = setInterval(function () {
                    jsalarm.showcurrenttime()
                }, 1000)

                alarm.pause();
                alarm.currentTime = 0;

                submitref = document.getElementById("submitbutton")
                submitref.value = "Set Alarm!";

                return false
            }
            var selections = document.getElementsByTagName("select")
            this.hourselect = selections[0]
            this.minuteselect = selections[1]
            this.secondselect = selections[2]
            for (var i = 0; i < 60; i++) {
                if (i < 24) //If still within range of hours field: 0-23
                    this.hourselect[i] = new Option(this.padfield(i), this.padfield(i), false, dateobj.getHours() == i)
                this.minuteselect[i] = new Option(this.padfield(i), this.padfield(i), false, dateobj.getMinutes() == i)
                this.secondselect[i] = new Option(this.padfield(i), this.padfield(i), false, dateobj.getSeconds() == i)

            }
            jsalarm.showcurrenttime()
            jsalarm.timer = setInterval(function () {
                jsalarm.showcurrenttime()
            }, 1000)
        },
        setalarm: function () {
            this.hourwake = this.hourselect.options[this.hourselect.selectedIndex].value
            this.minutewake = this.minuteselect.options[this.minuteselect.selectedIndex].value
            this.secondwake = this.secondselect.options[this.secondselect.selectedIndex].value
            this.hourselect.disabled = true
            this.minuteselect.disabled = true
            this.secondselect.disabled = true
        },
    }

    jsalarm.init();
}

function getEvents() {
    axios.get('http://localhost:8090/events')
        .then(function (response) {
            events = response['data'];
            loadDates();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function resetToPresent() {
    month = moment().month() + 1;
    year = moment().year();

    getEvents();
}

function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

//https://gist.github.com/jrhames/5200024
(function () {
    var moment;

    moment = typeof require !== "undefined" && require !== null ? require("moment") : this.moment;

    //Holiday definitions
    var _holidays = {
        'M': { //Month, Day
            '01/01': "New Year's Day",
            '07/04': "Independence Day",
            '11/11': "Veteran's Day",
            '12/24': "Christmas Eve",
            '12/25': "Christmas Day",
            '12/31': "New Year's Eve",
            '10/06': "Appiah's Birthday",
            '10/09': "John's Birthday",
            '08/28': "Olga's Birthday",
            '08/03': "Webster's Birthday",
            '05/29': "Linda's Birthday"
        },
        'W': { //Month, Week of Month, Day of Week
            '1/3/1': "Martin Luther King Jr. Day",
            '2/3/1': "Washington's Birthday",
            '5/5/1': "Memorial Day",
            '9/1/1': "Labor Day",
            '10/2/1': "Columbus Day",
            '11/4/4': "Thanksgiving Day",
            '6/3/0': "Father's Day",
            "5/2/0": "Mother's Day"
        }
    };

    moment.fn.holiday = function () {
        var diff = 1 + (0 | (this._d.getDate() - 1) / 7),
            memorial = (this._d.getDay() === 1 && (this._d.getDate() + 7) > 30) ? "5" : null;

        return (_holidays['M'][this.format('MM/DD')] || _holidays['W'][this.format('M/' + (memorial || diff) + '/d')]);
    };

    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
        module.exports = moment;
    }

}(this));

function loadDates() {
    if (month == moment().month() + 1 && year == moment().year()) {
        document.getElementById("reset").style.visibility = "hidden";
    } else {
        document.getElementById("reset").style.visibility = "visible";
    }

    //fills the calendar weeks array
    calculateWeeks();

    //gets the unordered list that contains the days
    let days = document.getElementsByClassName("days")[0];

    //gets the month and year and assigns the date to this element
    let currentMonth = document.getElementById("month");
    let currentYear = document.getElementById("year");

    let splitDate = formattedDate().split(" ");
    currentMonth.innerHTML = splitDate[0];
    currentYear.innerHTML = splitDate[1];

    //adds the calculated dates to the calendar
    for (let i = 0; i < weeks.length; i++) {
        for (let j = 0; j < weeks[i].length; j++) {
            //create a list item and a span to contain notes
            let li = document.createElement("li");
            let span = document.createElement("span");

            //makes a date string like 2018-6-15
            let todaysDate = "" + moment().year() + "-" + (moment().month() + 1) + "-" + moment().date();

            if (weeks[i][j].unix() == moment(todaysDate, "YYYY-MM-DD").unix()) {
                li.style.backgroundColor = "lightgreen";
                span.innerHTML = "Today <br />";
            }

            if (moment(weeks[i][j]).holiday() != undefined) {
                span.innerHTML = moment(weeks[i][j]).holiday() + "<br />";
            }

            li.innerHTML = weeks[i][j].format('D') + "<br />"; //example: innerHTML = 31
            span.value = weeks[i][j];
            span.style = "font-size: small";


            //adds the events to the date
            for (let i = 0; i < events.length; i++) {
                if (span.value.format("MMMM DD YYYY") == moment(events[i].date).format("MMMM DD YYYY")) {
                    span.innerHTML = span.innerHTML + events[i].time + ": " + events[i].text + "<br />";
                }
            }

            //grays out the dates not in this month
            if (weeks[i][j].format('M') != month) {
                li.setAttribute("style", "color: grey; font-style: italic;");
                li.style.backgroundColor = "lightgrey";
            }

            if (moment(weeks[i][j]).holiday() != undefined) {
                li.style.backgroundColor = "lightblue";
            }

            li.onclick = clickedBox;
            li.appendChild(span);
            days.appendChild(li);
        }
    }


}

function create(event) {
    let textInput = document.getElementById("textInput");
    let timeInput = document.getElementById("timeInput");
    let eventForm = document.getElementById("event-form");

    axios.post('http://localhost:8090/events', {
        date: eventForm.value,
        time: timeInput.value,
        text: textInput.value
    })
        .then(function (response) {
            getEvents();
            eventForm.classList.add("inactive");
            eventForm.classList.remove("active");
            textInput.value = "";
            timeInput.value = "";
        })
        .catch(function (error) {
            console.log(error);
        });

}

function clickedBox(event) {

    let eventForm = document.getElementById("event-form");
    eventForm.classList.remove("inactive");
    eventForm.classList.add("active");
    eventForm.style = "top: " + event.clientY + "; left: " + event.clientX;
    let p = eventForm.getElementsByTagName("p")[0];
    let span = event.target.getElementsByTagName("span")[0];
    document.getElementById("timeInput").select();

    p.innerHTML = span.value.format('MMMM DD YYYY');
    eventForm.value = span.value;
}

function closeBox() {
    let eventForm = document.getElementById("event-form");
    eventForm.classList.remove("active");
    eventForm.classList.add("inactive");
}

//adapted from https://github.com/vuejsdevelopers/vuejs-calendar
function calculateWeeks() {
    let days = [];
    weeks = [];

    //resets the ul that holds the days
    let daysUL = document.getElementsByClassName("days")[0];
    daysUL.innerHTML = '';

    let currentDay = moment(`${year}-${month}`, 'YYYY-M-D');

    do {
        days.push(currentDay);
        currentDay = moment(currentDay).add(1, 'days');
    } while ((currentDay.month() + 1) === month);

    // Add previous days to start of month
    currentDay = moment(days[0]);

    const SUNDAY = 0;
    const SATURDAY = 6;

    if (currentDay.day() !== SUNDAY) {
        do {
            currentDay = moment(currentDay).subtract(1, 'days');
            days.unshift(currentDay);
        } while (currentDay.day() !== SUNDAY);
    }

    // Add following days to end of month
    currentDay = moment(days[days.length - 1]);

    if (currentDay.day() !== SATURDAY) {
        do {
            currentDay = moment(currentDay).add(1, 'days');
            days.push(currentDay);
        } while (currentDay.day() !== SATURDAY);
    }

    let week = [];

    for (let day of days) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
}

//adapted from https://github.com/vuejsdevelopers/vuejs-calendar
function formattedDate() {
    return moment(`${year}-${month}-1`, 'YYYY-M-D').format('MMMM YYYY');
}


function incrementMonth() {
    if (month === 12) {
        month = 1;
        year += 1;
    } else {
        month += 1;
    }

    getEvents();
}

function decrementMonth() {
    if (month === 1) {
        month = 12;
        year -= 1;
    } else {
        month -= 1;
    }

    getEvents();
}

function incrementYear() {
    year++;

    getEvents();
}

function decrementYear() {
    year--;

    getEvents();
}