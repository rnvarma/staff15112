WEEKDIFF = 0;

HOURSIZE = 50;
CAL_SIZE = 24 * HOURSIZE;

CURR_EDIT = null;

EVENTDICT = {};
EVENTKEYS = {};

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
  if (h < 12){
    ampm = "AM";
  } else {
    ampm = "PM";
    if (h > 12) h = h % 12;
  }
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
// - id

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
  eventdiv.attr("data-id", event.id);
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
    var locationDiv = $(document.createElement("div"));
    locationDiv.addClass("eventTimeText")
    locationDiv.text(event.location);
    eventdiv.append(locationDiv);

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
  });

  var rightnow = moment(Date())
  var scaledT = rightnow.hour() + (rightnow.minute()/60);
  $(".currtime-line").css("margin-top", -(CAL_SIZE - scaledT * HOURSIZE));
  var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
  $(".calender-event").remove();
  place_event_list(EVENTDICT[date]);
}

function reset_time_inputs() {
  $(".time-area").replaceWith(
    '<div class="time-area">' + 
      '<span class="black-text">From</span> <input data-field="start_time" id="edit-start-time" placeholder="Start Time" type="text" class="input-small">' +
      '<span class="black-text">To</span> <input data-field="end_time" id="edit-end-time" placeholder="End Time" type="text" class="input-small">' +
    '</div>');
}

function clear_edit_event() {
  $("#edit-name").val("");
  $("#edit-location").val("");
  $("#edit-description").val("");
  $("#edit-date").val("");
  $("#edit-event-type").val("");
  $("#edit-reminder-time").val("");
  $("#edit-repeat-interval").val("");
  $("#edit-end-repeat").val("");
  $("#edit-num-volunteers").val("");
  reset_time_inputs();
}

function load_edit_event(id) {
  var data = EVENTKEYS[id];
  var date = data["start_date"]["month"] + "/" + data["start_date"]["date"] + "/" + data["start_date"]["year"];
  clear_edit_event()
  $("#edit-name").val(data.name);
  $("#edit-location").val(data.location);
  $("#edit-description").val(data.description);
  $("#edit-date").val(date);
  $("#edit-start-time").timepicker({defaultTime: data["start_date"]["time"], template:false, showInputs:false, minuteStep: 15});
  $("#edit-end-time").timepicker({defaultTime: data["end_date"]["time"], template:false, showInputs:false, minuteStep: 15});
  $("#edit-event-type").val(data.event_type);
  $("#volunteer-area").text(data.attendees)
  editInputChangleHandler();
  // $("#edit-reminder-time").val("");
  // $("#edit-repeat-interval").val("");
  // $("#edit-end-repeat").val("");
  $("#edit-num-volunteers").val(data.num_volunteers_needed);
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

function editEventClickHandler() {
  $("#edit-event-button").click(function() {
    var event_data = EVENTKEYS[CURR_EDIT];
    var data = {
      "name": $("#edit-name").val(),
      "location": $("#edit-location").val(),
      "description": $("#edit-description").val(),
      "date": $("#edit-date").val(),
      "start_date": event_data["start_date"]["full"],
      "end_date": event_data["end_date"]["full"],
      "event_type": $("#edit-event-type").val(),
      "reminder_time": $("#edit-reminder-time").val(),
      "repeat_interval": $("#edit-repeat-interval").val(),
      "end_repeat": $("#edit-end-repeat").val(),
      "num_volunteers_needed": $("#edit-num-volunteers").val(),
      "id": CURR_EDIT
    }
    var csrftoken = getCookie('csrftoken');
    $.ajax({
      type: 'POST',
      url: '/1/editevent',
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.withCredentials = true;
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      },
      success: function (event_data) {},
      error: function(a , b, c){},
      async: true
    });
  })
}

function editInputChangleHandler() {
  function get_hour_minute(s) {
    hour = parseInt(s.substring(0, s.indexOf(":")))
    minute = parseInt(s.substring(s.indexOf(":") + 1, s.indexOf(" ")));
    timeday = s.substring(s.indexOf(" ") + 1, s.length);
    if (timeday == "PM" && hour != 12) {
      hour = hour + 12
    } else if (timeday == "AM" && hour == 12) {
      hour = 0
    }
    return [hour, minute]
  }
  $("input").change(function() {
    var field = $(this).attr("data-field");
    var new_val = $(this).val();
    var event_data = EVENTKEYS[CURR_EDIT];
    if (field.indexOf("time") < 0)  { 
      event_data[field] = new_val;
    } else {
      time = get_hour_minute(new_val);
      if (field == "start_time") {
        var old_time = event_data["start_date"]["full"]
        old_time = moment(old_time);
        old_time.set('hour', time[0]);
        old_time.set('minute', time[1]);
        event_data["start_date"] = get_date_data(old_time)
      } else {
        var old_time = event_data["end_date"]["full"]
        old_time = moment(old_time);
        old_time.set('hour', time[0]);
        old_time.set('minute', time[1]);
        event_data["end_date"] = get_date_data(old_time)
      }
    }
    $('.calender-event[data-id="' + CURR_EDIT + '"]').remove()
    place_event(event_data);
  });
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
    var data = new_event;
    console.log(data);
    var csrftoken = getCookie('csrftoken');
    $.ajax({
      type: 'POST',
      url: '/1/addevent',
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.withCredentials = true;
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      },
      success: function (event_data) {
        console.log(event_data);
        process_events([event_data]);
        place_event(event_data);
      },
      error: function(a , b, c){
      },
      async: true
    });
  });

  $(".body-stuff").click(function() {
    $(".clickedEvent").removeClass("clickedEvent");
    $(".edit-event").hide();
  })

  editEventClickHandler();

  $("#delete-event-button").click(function() {
    data = {id: CURR_EDIT}
    var csrftoken = getCookie('csrftoken');
    $.ajax({
      type: 'POST',
      url: '/1/deleteevent',
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.withCredentials = true;
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      },
      success: function (event_data) {
        $('.calender-event[data-id="' + CURR_EDIT + '"]').remove()
        delete EVENTKEYS[CURR_EDIT]
        var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
        var events = EVENTDICT[date]
        for (var i = 0; i < events.length; i++) {
          event = events[i]
          if (event.id == parseInt(CURR_EDIT)) {
            print("got here wooo");
            events.splice(events.indexOf(event), 1);
            return;
          }
        }
      },
      error: function(a , b, c){
      },
      async: true
    });
  });

  $("#show-all-button").click(function() {
    var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
    $(".calender-event").remove();
    place_event_list(EVENTDICT[date]);
  });

  $(".show-type-btn").click(function() {
    console.log("wooo");
    var date = get_short_date(get_x_days_away(WEEKDIFF * 7));
    $(".calender-event").remove();
    var events = EVENTDICT[date];
    var type = $(this).attr("data-type");
    for (var i = 0; i < events.length; i++) {
      if (events[i].event_type == type) {
        place_event(events[i]);
      }
    }
  })

  $("select").change(function() {
    event_data = EVENTKEYS[CURR_EDIT];
    if ($(this).attr("date-field") == "event_type")
      event_data.event_type = $(this).val();
  });

  $("textarea").change(function() {
    event_data = EVENTKEYS[CURR_EDIT];
    event_data.description = $(this).val();
  })

  $(".body-stuff").on("click", ".calender-event", function(e) {
    e.stopPropagation();
    if ($("#wrapper").hasClass("toggled")) {
      $("#wrapper").removeClass("toggled");
      $("#menu-toggle").find(".arrow").addClass("glyphicon-chevron-left").removeClass("glyphicon-chevron-right")
      setTimeout(function() {
        resize_heights();
      }, 1000);
    } else {
      $(".clickedEvent").removeClass("clickedEvent");
      $(this).addClass("clickedEvent");
      var id = $(this).attr("data-id");
      CURR_EDIT = id;
      load_edit_event(id);
      $(".edit-event").show();
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
    EVENTKEYS[eventData.id] = eventData;
  }
}

function place_event_list(event_list) {
  if (!event_list) return;
  for (var i = 0; i < event_list.length; i++) {
    place_event(event_list[i])
  }
}

function get_backend_events() {
  var url = "/1/getevents";
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
  get_backend_events();

  $( window ).resize(function() {
    resize_heights();
  });
})


