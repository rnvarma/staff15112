WEEKDIFF = 0;

HOURSIZE = 50;
CAL_SIZE = 24 * HOURSIZE;

EVENTDICT = {};

IMG_DICT = {
  "Excercise": "fa fa-heartbeat",
  "Caffeine": "fa fa-coffee",
  "PowerNap": "fa fa-power-off",
  "Productivity": "fa fa-bolt",
  "Relaxation": "fa fa-thumbs-up"
}

function print(x) {
  console.log(x);
}

function load_spinner() {
  var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };
  $(".shaded-region-loading").show();
  var target = document.getElementsByClassName("higher-level-div")[0]
  var spinner = new Spinner(opts).spin(target);
}

function formatted_time(mil_num) {
  if (mil_num < 12) return mil_num.toString() + " AM";
  else if (mil_num == 12) return mil_num.toString() + " PM";
  else return (mil_num % 12).toString() + " PM";
}

function get_icon_div(name) {
  var classname = "fa fa-moon-o";
  if(IMG_DICT.hasOwnProperty(name)) {
    classname = IMG_DICT[name]
  }
  var icon = $(document.createElement("i"))
  icon.addClass(classname + " suggestion-icon");
  return icon;
}

function getTime(h, m) {
  if (h < 12) ampm = "AM";
  else ampm = "PM";
  if (m == 0) {
    return h + " " + ampm;
  } else {
    return h + ":" + m + " " + ampm;
  }
}

function get_date_data(date) {
  var data = {}
  data["month"] = date.month() + 1;
  data["date"] = date.date();
  data["year"] = date.year();
  data["scaledT"] = date.hour() + (date.minutes()/60);
  data["time"] = getTime(date.hour(), date.minutes());
  data["full"] = date.clone();
  return data
}

function get_new_event(date) {
  var e = {};
  e["name"] = "New Event";
  e["start_date"] = get_date_data(date)
  date.add(1, 'hours')
  e["end_date"] = get_date_data(date)
  return e;
}

// an event needs
// - start_date (month, date, year, scaledT, time, full)
// - end_date   (month, date, year, scaledT, time, full)
// - name

function place_event(event) {
  var day = moment(event.start_date.month + "/" + event.start_date.date + "/" + event.start_date.year).day();
  var eventdiv = $(document.createElement("div"));
  var top = -(CAL_SIZE - event.start_date.scaledT * HOURSIZE);
  var left = day * $(".caltop-date").width();
  var width = $(".caltop-date").width();
  var height = (event.end_date.scaledT - event.start_date.scaledT) * HOURSIZE;
  eventdiv.addClass("calender-event");
  eventdiv.css("width", width);
  eventdiv.css("height", height);
  eventdiv.css("margin-top", top);
  eventdiv.css("margin-left", left);
  if (event.is_suggestion) {
    icon_div = get_icon_div(event.name);
    eventdiv.append(icon_div);
    if (icon_div.hasClass("fa-moon-o")) {
      eventdiv.addClass("NapThing");
    } else {
      icon_div.addClass(event.name);
      eventdiv.addClass(event.name + "-background");
    }
  } else {
    eventdiv.text(event.name);
    var time = event.start_date.time;
    var timeDiv = $(document.createElement("div"));
    timeDiv.addClass("eventTimeText");
    timeDiv.text(time);
    eventdiv.append(timeDiv);
  }
  $(".body-stuff").append(eventdiv);
}

function resize_heights() {
  var w_size = $(window).height() - 80;
  $(".sidebar").css("height", w_size - 50);
  $(".main-calender").css("height", w_size - 51);

  var cal_w = $(".main-calender").width();
  $(".topdates").css("width", cal_w - 75);
  $(".body-times").css("height", CAL_SIZE);
  $(".body-stuff").css("height", CAL_SIZE);
  $(".hourtime").css("height", HOURSIZE);
  $(".hourtime").css("padding-top", HOURSIZE - 11);
  $(".hourbox").css("height", HOURSIZE);
  $(".body-stuff").css("width", cal_w - 75);
  $(".body-calender").css("height", w_size - 100)
  $(".verticalcol").css("height", CAL_SIZE);
  var col_width = $(".caltop-date").width()
  $(".verticalcol").css("width", col_width);
  $(".verticalcol").css("margin-top", -CAL_SIZE);
  $(".verticalcol").each(function(i) {
    $(this).css("margin-left", col_width * i);
  })
  var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
  $(".calender-event").remove();
  place_event_list(EVENTDICT[date]);
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function click_handlers() {
  $(".prev-week-button").click(function() {
    var sunday = new Date();
    WEEKDIFF -= 1
    var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
    populate_top_dates(get_x_days_away(WEEKDIFF * 7));
    $(".calender-event").remove();
    place_event_list(EVENTDICT[date]);
  });

  $(".next-week-button").click(function() {
    var sunday = new Date();
    WEEKDIFF += 1
    var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
    populate_top_dates(get_x_days_away(WEEKDIFF * 7));
    $(".calender-event").remove();
    place_event_list(EVENTDICT[date]);
  });

  $(".today-button-div").click(function() {
    WEEKDIFF = 0;
    $(".calender-event").remove();
    populate_top_dates(get_nearest_prev_sunday());
    place_event_list(EVENTDICT[get_short_date(get_nearest_prev_sunday())]);
  });

  $(".body-stuff").dblclick(function(e) {
    var offset = $(this).offset();
    var x = (e.pageX - offset.left);
    var y = (e.pageY - offset.top);
    var col_width = $(".caltop-date").width()
    var day = Math.floor(x / col_width)
    var hour = Math.floor(y / HOURSIZE);
    var minute = Math.floor(((y % HOURSIZE) / HOURSIZE) * 60)
    var nearest_30 = Math.floor(minute / 30) * 30
    var date = get_x_days_away(WEEKDIFF * 7)
    date.add(day, 'days');
    date.hour(hour);
    date.minute(nearest_30);
    var new_event = get_new_event(date);
    process_events([new_event]);
    place_event(new_event);
  });

  $(".body-stuff").click(function() {
    $(".clickedEvent").removeClass("clickedEvent");
  })

  $(".body-stuff").on("click", ".calender-event", function(e) {
    e.stopPropagation();
    if ($("#wrapper").hasClass("toggled")) {
      $("#wrapper").removeClass("toggled");
      $("#menu-toggle").find(".arrow").addClass("glyphicon-chevron-left").removeClass("glyphicon-chevron-right")
      setTimeout(function() {
        resize_heights();
        clicked.addClass("clickedEvent");
      }, 1000);
    } else {
      $(".clickedEvent").removeClass("clickedEvent");
      $(this).addClass("clickedEvent");
    }
  });

  $(window).click(function(e) {
    if (e.target.id.slice(0,7) == "topdate") {
      if (e.target.className == "caltop-date selectable") {
        allNighterClickHandler($("#" + e.target.id));
        load_spinner();
      }
    };
  });
}

function get_short_date(sunday) {
  return (sunday.month()+1).toString() + "/" + sunday.date().toString();
}

function get_prev_day(day) {
  var next_day = moment(day)
  next_day.subtract(1, "days");
  return next_day;
}

function get_next_day(day) {
  var next_day = moment(day)
  next_day.add(1, "days");
  return next_day;
}

function get_x_days_away(x) {
  var sunday = get_nearest_prev_sunday();
  for (var i = 0; i < Math.abs(x); i++) {
    if (x < 0) {
      sunday = get_prev_day(sunday);
    } else {
      sunday = get_next_day(sunday);
    }
  }
  return sunday;  
}

function get_nearest_prev_sunday() {
  var today = new Date();
  var sunday = new moment();
  var day = today.getDay();
  sunday.subtract(day, "days");
  return sunday
}

function get_nearest_sunday_to_date(date) {
  var distance = date.day();
  date.subtract(distance, "days");
  var month = (date.month()+1).toString();
  var day = date.date().toString();
  return month + "/" + day
}

function get_days_of_week(sunday) {
  var nextday;
  nextday = moment(sunday);
  days = [sunday];
  for(var i = 1; i < 7; i++) {
    nextday = get_next_day(nextday)
    days.push(nextday)
  }
  return days;
}

function populate_top_dates(sunday) {
  var today = moment().format("dddd").slice(0,3) + " " + moment().format("MM/DD");
  var days = get_days_of_week(sunday);
  $(".isToday").removeClass("isToday")
  for (var i = 0; i < days.length; i++) {
    var date = days[i];
    var finaldate = date.format("dddd").slice(0,3) + " " + date.format("MM/DD");
    $("#topdate" + i.toString()).text(finaldate);
    $("#topdate" + i.toString()).attr("data-year", date.year());
    if (today == finaldate) {
      $("#topdate" + i.toString()).addClass("isToday");
    }
  }
}

function load_days() {
  var sunday = get_nearest_prev_sunday();
  populate_top_dates(sunday);
}

function process_events(raw_events) {
  for (var i = 0; i < raw_events.length; i++) {
    var eventData = raw_events[i]
    var bin = get_nearest_sunday_to_date(moment(eventData.start_date.full))
    if (EVENTDICT[bin]) {
      EVENTDICT[bin].push(eventData)
    } else {
      EVENTDICT[bin] = [eventData]
    }
  }
}

function place_event_list(event_list) {
  if (!event_list) return;
  for (var i = 0; i < event_list.length; i++) {
    place_event(event_list[i])
  }
}

function get_backend_events() {
  var username = $(".username-button").text();
  var url = "/1/get_events?username=" + username;
  $.ajax({
    type: 'GET',
    url: url,
    contentType: 'application/json',
    success: function (data) {
      process_events(data)
      var sunday = get_nearest_prev_sunday()
      var stringsunday = (sunday.month()+1).toString() + "/" + sunday.date().toString();
      var currevents = EVENTDICT[stringsunday];
      place_event_list(currevents);
    },
    error: function(a , b, c){
    },
    async: true
  });
}

$(document).ready(function() {
  // get_backend_events()
  resize_heights();
  click_handlers();
  load_days();
  $(".body-calender").scrollTo(300);

  $( window ).resize(function() {
    resize_heights();
  });
})


