// input data:
//  tasks = [{startDate: Date, endDate: Date, taskName: [taskNames], status: [taskStatus]}]
// taskStatus [SUCCEEDED, FAILED, RUNNING, KILLED]

var margin = {
    top : 20,
    right : 40,
    bottom : 100,
    left : 80
};

var taskNames = [ "Fashion", "Politics", "Geology", "Technology", "Disease", "Discovery", "People" ];
var taskStatus = {
    "VALID" : "bar",
    "RAW" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

var gantt;
var tasks = [];
var format = "%H:%M";
var timeDomainString = "decade";
var maxDate, minDate;

function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    tasks.push({
        "startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
        "endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
        "taskName" : taskName,
        "status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
function changeTimeDomain(timeDomainString) {
        this.timeDomainString = timeDomainString;
        switch (timeDomainString) {
            case "year": format = "%B %Y";
                gantt.timeDomain([ d3.time.month.offset(getEndDate(), -12), getEndDate() ]);
                break;
            case "decade": format = "%Y";
                gantt.timeDomain([ d3.time.year.offset(getEndDate(), -10), getEndDate() ]);
                break;
            case "century": format = "%Y";
                gantt.timeDomain([ d3.time.year.offset(getEndDate(), -100), getEndDate() ]);
                break;
            case "millenia": format = "%Y";
                gantt.timeDomain([ d3.time.year.offset(getEndDate(), -1000), getEndDate() ]);
                break;
            default:    format = "%H:%M"
        }
        gantt.tickFormat(format);
        gantt.redraw(tasks);
};
function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
};


d3.json("tasklist.json", function(data) {
    tasks = data
    tasks.forEach(function(d){ 
        d.startDate=new Date(d.startDateString)
        d.endDate=new Date(d.endDateString)
        if(d.endDate-d.startDate<0){
            console.log(d)
        }
        if(Object.prototype.toString.call(d.startDate) !== '[object Date]')
            console.log(d)
        if(Object.prototype.toString.call(d.endDate) !== '[object Date]')
            console.log(d)
    });


    tasks.sort(function(a, b) {    return a.endDate - b.endDate;  });
    maxDate = tasks[tasks.length - 1].endDate;

    tasks.sort(function(a, b) {    return a.startDate - b.startDate; });
    minDate = tasks[0].startDate;

    gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);

    gantt.margin(margin);

    gantt.timeDomainMode("fixed");
    changeTimeDomain(timeDomainString);

    gantt(tasks);
});