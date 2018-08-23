//key code for enter, used in submitting forms
const ENTER_KEY = 13;

//shared between the calendar and the alarm
let alarmTimes = [];

let alarm = new Audio("http://soundbible.com/grab.php?id=2197&type=mp3");
let calendar = {};

$( function() {
    $("#event-form").draggable({
        containment: "html"
    });
    $("#edit-form").draggable({
        containment: "html"
    });
  } 
);

//required for materialize
window.addEventListener('load', load, false);
$(document).ready(function () {
    $('select').formSelect();
    $('option').formSelect();
});

function load() {
    moment.modifyHolidays.add({
        "Appiah's Birthday": {
            date: '10/06',
        },
        "John's Birthday": {
            date: '10/09',
        },
        "Olga's Birthday": {
            date: '08/28',
        },
        "Webster's Birthday": {
            date: '08/03',
        },
        "Linda's Birthday": {
            date: '05/29',
        }
    });

    calendar = new Calendar();
 
    jsalarm.init();

}

function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

//adapted and extended from http://www.javascriptkit.com/script/script2/alarm.shtml
let jsalarm = {
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

                alarm.play();

                document.getElementById("monthBar").classList.add("blink");
                document.getElementsByClassName("days")[0].classList.add("blink");


                setTimeout(function () {
                    document.getElementById("monthBar").classList.remove("blink");
                    document.getElementsByClassName("days")[0].classList.remove("blink");

                    let confirmation = confirm('Check Your Calendar');
                    if (confirmation === true) {
                        document.getElementById("resetbutton").click();
                    }
                }, 10000)
            }
        }
        this.findClosestTime();
    },
    findClosestTime: function () {
        let currentTime = moment();

        let validAlarmTimes = [];

        for (let e of alarmTimes) {
            if (!moment(e, ["h:mm A"]).isValid()) {
                continue;
            }
            let alarmHour = moment(e, ["h:mm A"]).format("H");
            let alarmMinutes = moment(e, ["h:mm A"]).format("m");

            if (alarmHour > currentTime.format("H")) {
                validAlarmTimes.push(e);
            } else if (alarmHour == currentTime.format("H")
                && parseInt(alarmMinutes) > parseInt(currentTime.format("m"))) {
                validAlarmTimes.push(e);
            }
        }

        let minElement = undefined;
        let minHour = 0;
        let minMinutes = 0;

        for (let i = 0; i < validAlarmTimes.length; i++) {
            let alarmHour = moment(validAlarmTimes[i], ["h:mm A"]).format("HH");
            let alarmMinutes = moment(validAlarmTimes[i], ["h:mm A"]).format("m");

            if (i === 0) {
                minElement = validAlarmTimes[i];
                minHour = alarmHour;
                minMinutes = alarmMinutes;
            } else {
                if (alarmHour < minHour) {
                    minElement = validAlarmTimes[i];
                    minHour = alarmHour;
                    minMinutes = alarmMinutes;
                } else if (alarmHour == minHour && alarmMinutes < minMinutes) {
                    minElement = validAlarmTimes[i];
                    minHour = alarmHour;
                    minMinutes = alarmMinutes;
                }
            }
        }

        if (minElement != undefined) {
            this.setEventAlarm(minElement);
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
    setEventAlarm: function (alarmTime) {
        this.hourwake = moment(alarmTime, ["h:mm A"]).format("HH")
        this.minutewake = moment(alarmTime, ["h:mm A"]).format("mm")
        this.secondwake = moment(alarmTime, ["h:mm A"]).format("ss")
        this.hourselect.disabled = true
        this.minuteselect.disabled = true
        this.secondselect.disabled = true
    }
}

function Calendar() {
    this.weeks = [];
    this.month = moment().month() + 1; //months are zero-indexed
    this.year = moment().year();
    this.today = moment().date();
    this.events = [];

    this.input = document.getElementById("textInput");

    this.input.addEventListener("keydown", function (event) {
        if (event.keyCode === ENTER_KEY) {
            calendar.create();
        }
    });

    this.deleteEvents = function () {
        let token = document.querySelector('meta[name="_csrf"]')['content'];
        let header_name = document.querySelector('meta[name="_csrf_header"]')['content'];
        axios({
            method: 'delete',
            url: 'http://localhost:8050/events',
            headers: {
                'X-CSRF-TOKEN': token 
            }
        })
        .then(function (response) {
            //events = response['data'];
            loadEvents();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    this.resetToPresent = function () {
        this.month = moment().month() + 1;
        this.year = moment().year();

        this.loadEvents();
    }

    this.loadEventsToEdit = function (event, momentDay = undefined) {  
        let eventForm = document.getElementById("event-form");
        let editForm = document.getElementById("edit-form");

        editForm.classList.remove("inactive");
        editForm.classList.add("active");
        editForm.style = "top: " + eventForm.style.top + "; left: " + eventForm.style.left +";";

        let p = eventForm.getElementsByTagName("p")[0];
        let div = editForm.getElementsByTagName("div")[0]

        div.innerHTML = "";
        div.className = "text";

        if (momentDay == undefined) {
            momentDay = p.innerHTML;
        }

        this.resetForm();

        if (this.events.length == 0) {
            this.closeEditBox();
            return;
        }

        //if no events are on the current date don't show the edit box
        foundEventsForDate = false;

        console.log(momentDay);
        
        for (let i = 0; i < this.events.length; i++) {
            if (momentDay == moment(this.events[i].date).format("MMMM DD YYYY")) {
                foundEventsForDate = true;
                break;
            }
        }

        if (!foundEventsForDate) {
            this.closeEditBox();
            return;
        }
                
        for (let i = 0; i < this.events.length; i++) {
            if (momentDay == moment(this.events[i].date).format("MMMM DD YYYY")) {
                let buttonDiv = document.createElement("div");
                let label0 = document.createElement("span");
                let textInput0 = document.createElement("input");

                let label1 = document.createElement("span");
                let textInput1 = document.createElement("input");

                let updateButton = document.createElement("button");
                let deleteButton = document.createElement("button");

                buttonDiv.className = "buttons";

                buttonDiv.appendChild(updateButton);
                buttonDiv.appendChild(deleteButton);

                label0.innerHTML = "Time:";
                label1.innerHTML = "Description:";

                updateButton.innerHTML = "Update";
                deleteButton.innerHTML = "Delete";

                textInput0.type = "time";

                textInput0.value = this.events[i].time;
                textInput1.value = this.events[i].text;

                textInput0.id = "textInput" + i + "" + 0;
                textInput1.id = "textInput" + i + "" + 1;

                updateButton.id = "updateButton" + i;
                deleteButton.id = "deleteButton" + i;

                updateButton.onclick = function () {
                    calendar.updateEvent({ date: calendar.events[i].date, time: textInput0.value, text: textInput1.value }, calendar.events[i].id, momentDay);
                }

                deleteButton.onclick = function () {
                    calendar.deleteEvent(calendar.events[i].id, momentDay);
                }

                div.appendChild(label0);
                div.appendChild(textInput0);
                div.appendChild(label1);
                div.appendChild(textInput1);
                div.appendChild(buttonDiv);
            }
        }
    }

    this.deleteEvent = function (id, momentDay) {
        this.events = [];
        alarmTimes = [];
        let $this = this;
        
        let token = document.querySelector('meta[name="_csrf"]')['content'];
        let header_name = document.querySelector('meta[name="_csrf_header"]')['content'];
        
        axios({
            method: 'delete',
            url: 'http://localhost:8050/events/' + id,
            headers: {
                'X-CSRF-TOKEN': token 
            }
        })
        .then( () => axios.get('http://localhost:8050/events')
            .then(function (response) {
                $this.events = response['data'];
                $this.sortEvents($this.events);
                $this.loadDates();
                $this.loadEventsToEdit(momentDay);
            })
            .catch(function (error) {
                console.log(error);
            }))
        .catch(function (error) {
            $this.events = [];
            $this.loadDates();
            console.log(error);
        })
    }

    this.updateEvent = function (event, id, momentDay) {

        this.events = [];
        alarmTimes = [];

        let $this = this;
        
        let token = document.querySelector('meta[name="_csrf"]')['content'];
        let header_name = document.querySelector('meta[name="_csrf_header"]')['content'];
        
        axios({
            method: 'put',
            url: 'http://localhost:8050/events/' + id,
            headers: {
                'X-CSRF-TOKEN': token 
            },
            data: {
                date: event.date,
                time: event.time,
                text: event.text
            }
        }).then( () => $this.loadEvents() )
        .catch(function (error) {
            $this.events = [];
            $this.loadDates();
            
            console.log(error);
        }) 
    }

    this.sortEvents = function (events) {
        this.events.sort(function (a, b) {
            return moment.duration(a.time).asSeconds() - moment.duration(b.time).asSeconds();
        });
    }
    
    this.loadEvents = function () {
        let $this = this;
        axios.get('http://localhost:8050/events')
            .then(function (response) {
                $this.events = response['data'];
                $this.sortEvents($this.events);
                $this.loadDates();
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    this.loadDates = function () {
        if (this.month == moment().month() + 1 && this.year == moment().year()) {
            document.getElementById("reset").style.visibility = "hidden";
        } else {
            document.getElementById("reset").style.visibility = "visible";
        }

        //fills the calendar weeks array
        this.calculateWeeks();

        //gets the unordered list that contains the days
        let days = document.getElementsByClassName("days")[0];

        //gets the month and year and assigns the date to this element
        let currentMonth = document.getElementById("month");
        let currentYear = document.getElementById("year");

        let splitDate = this.formattedDate().split(" ");
        currentMonth.innerHTML = splitDate[0];
        currentYear.innerHTML = splitDate[1];

        //adds the calculated dates to the calendar
        for (let i = 0; i < this.weeks.length; i++) {
            for (let j = 0; j < this.weeks[i].length; j++) {
                //create a list item and a span to contain notes
                let li = document.createElement("li");
                let span = document.createElement("span");

                let todaysDate = moment();

                //makes a date string like 2018-6-15 with no time information
                let todaysUnixDate = "" + moment().year() + "-" + (moment().month() + 1) + "-" + moment().date();

                if (this.weeks[i][j].unix() == moment(todaysUnixDate, "YYYY-MM-DD").unix()) {
                    li.style.backgroundColor = "lightgreen";
                    span.innerHTML = "Today <br />";
                }

                if (moment(this.weeks[i][j]).isHoliday()) {
                    span.innerHTML = moment(this.weeks[i][j]).isHoliday() + "<br />";
                }

                li.innerHTML = this.weeks[i][j].format('D') + "<br />"; //example: innerHTML = 31
                span.value = this.weeks[i][j];
                span.style = "font-size: small";

                //adds the events to the date
                for (let i = 0; i < this.events.length; i++) {
                    if (span.value.format("MMMM DD YYYY") == moment(this.events[i].date).format("MMMM DD YYYY")) {
                        //getting the times for the alarm
                        if (moment(this.events[i].date).format("MMMM DD YYYY") == todaysDate.format("MMMM DD YYYY")) {
                            if (!alarmTimes.includes(this.events[i].time)) {
                                alarmTimes.push(this.events[i].time);
                            }
                        }
                        span.id = i;
                        span.innerHTML = span.innerHTML + moment(this.events[i].time, 'HH:mm').format('h:mm a') + ": " + this.events[i].text + "<br />";
                    }
                }

                //grays out the dates not in this month
                if (this.weeks[i][j].format('M') != this.month) {
                    li.setAttribute("style", "color: grey; font-style: italic;");
                }

                if (moment(this.weeks[i][j]).isHoliday()) {
                    li.style.backgroundColor = "lightblue";
                }

                li.onclick = this.clickedBox;
                li.appendChild(span);
                days.appendChild(li);
            }
        }

    }

    this.create = function (event) {
        let textInput = document.getElementById("textInput");
        let timeInput = document.getElementById("apptTime");
        let eventForm = document.getElementById("event-form");
    
        let token = document.querySelector('meta[name="_csrf"]')['content'];
        let header_name = document.querySelector('meta[name="_csrf_header"]')['content'];
        let $this = this;
        axios({
            method: 'post',
            url: 'http://localhost:8050/events',
            data: {
                date: eventForm.value,
                time: timeInput.value,
                text: textInput.value
            },
            headers: {
               'X-CSRF-TOKEN': token 
            }
       })
       .then(function (response) {
           $this.loadEvents();
           eventForm.classList.add("inactive");
           eventForm.classList.remove("active");
           textInput.value = "";
           timeInput.value = "";
       })
       .catch(function (error) {
           console.log(error);
       });

    }
  
    this.clickedBox = function (event) {
        let eventForm = document.getElementById("event-form");
        let editForm = document.getElementById("edit-form");

        editForm.classList.remove("active");
        editForm.classList.add("inactive");

        eventForm.classList.remove("inactive");
        eventForm.classList.add("active");
        //eventForm.style = "top: 75%; left: 50%";

        eventForm.style = "top: " + event.clientY + "; left: " + event.clientX;
        let p = eventForm.getElementsByTagName("p")[0];
        let span = event.target.getElementsByTagName("span")[0];
        if (span == undefined) {
            span = event.target;
        }
        document.getElementById("apptTime").select();

        p.innerHTML = span.value.format('MMMM DD YYYY');
        eventForm.value = span.value;
    }

    this.resetForm = function () {
        let eventForm = document.getElementById("event-form");

        let apptTime = eventForm.getElementsByTagName("input")[0];
        let textInput = eventForm.getElementsByTagName("input")[1];

        apptTime.value = "";
        textInput.value = "";

        eventForm.classList.remove("active");
        eventForm.classList.add("inactive");
    }

    this.closeBox = function () {
        this.resetForm();
    }

    this.closeEditBox = function () {
        let editForm = document.getElementById("edit-form");
        editForm.classList.remove("active");
        editForm.classList.add("inactive");
    }

    //adapted from https://github.com/vuejsdevelopers/vuejs-calendar
    this.calculateWeeks = function () {
        let days = [];
        this.weeks = [];

        //resets the ul that holds the days
        let daysUL = document.getElementsByClassName("days")[0];
        daysUL.innerHTML = '';

        let currentDay = moment(`${this.year}-${this.month}`, 'YYYY-M-D');

        do {
            days.push(currentDay);
            currentDay = moment(currentDay).add(1, 'days');
        } while ((currentDay.month() + 1) === this.month);

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
                this.weeks.push(week);
                week = [];
            }
        }
    }

    //adapted from https://github.com/vuejsdevelopers/vuejs-calendar
    this.formattedDate = function () {
        return moment(`${this.year}-${this.month}-1`, 'YYYY-M-D').format('MMMM YYYY');
    }


    this.incrementMonth = function () {
        if (this.month === 12) {
            this.month = 1;
            this.year += 1;
        } else {
            this.month += 1;
        }

        this.loadEvents();
    }

    this.decrementMonth = function () {
        if (this.month === 1) {
            this.month = 12;
            this.year -= 1;
        } else {
            this.month -= 1;
        }

        this.loadEvents();
    }

    this.incrementYear = function () {
        this.year++;

        this.loadEvents();
    }

    this.decrementYear = function () {
        this.year--;

        this.loadEvents();
    }
}