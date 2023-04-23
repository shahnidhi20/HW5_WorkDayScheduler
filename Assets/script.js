// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var scehdulerDivEL = $(".container-fluid");
var events = [];
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage? --> Done
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time? --> Done
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?  --> Done
  //
  // TODO: Add code to display the current date in the header of the page. --> Done

  var today = dayjs();
  $("#currentDay").text(today.format("dddd, MMMM D"));

  // business hours is from 9 to 6
  var startBusinessHour = dayjs().hour(9).hour();
  var endBusinessHour = dayjs().hour(17).hour();

  console.log(startBusinessHour);
  console.log(endBusinessHour);

  //Build UI based on the for loop
  for (
    let hourIndex = startBusinessHour;
    hourIndex <= endBusinessHour;
    hourIndex++
  ) {
    var hourRowEl = $("<div>")
      .attr("id", "hour-" + hourIndex)
      .addClass("row time-block");

    var hourDisplayEl = $("<div>").addClass(
      "col-2 col-md-1 hour test-center py-3"
    );

    hourDisplayEl.text(dayjs().hour(hourIndex).format("h A"));

    var eventDisplayEl = $("<textarea>")
      .attr("rows", "3")
      .addClass("col-8 col-md-10 description");

    var btnSaveEL = $("<button>")
      .attr("aria-label", "save")
      .addClass("btn saveBtn col-2 col-md-1");

    var fontICoEL = $("<i>")
      .attr("aria-hidden", "true")
      .addClass("fas fa-save");
    btnSaveEL.attr("data-hour", hourIndex);
    btnSaveEL.append(fontICoEL);

    //logic to show present, Past, Future
    //if its current hour then show it in Red
    var currentHour = dayjs().hour();
    if (currentHour === hourIndex) {
      hourRowEl.addClass("present");
    } else if (currentHour > hourIndex) {
      hourRowEl.addClass("past");
      eventDisplayEl.attr("readonly", "readonly");
    } else {
      hourRowEl.addClass("future");
    }

    hourRowEl.append(hourDisplayEl, eventDisplayEl, btnSaveEL);

    scehdulerDivEL.append(hourRowEl);
  }

  //get the text of the Text Area and save it in localstorage alongwith the row ID.
  function handleSaveEvents(event) {
    var btnClicked = $(event.target);
    //Find the element textAread.
    var txtAreaEvent = btnClicked.siblings(".description");
    var eventDescp = txtAreaEvent[0].value;
    //Find the element div displaying the hour.
    var hourDiv = btnClicked.siblings(".hour");
    var hourValue = hourDiv[0].textContent;
    //Find the parent element
    var parentId = btnClicked.parent("div").attr("id");

    var event = {
      day: today,
      eventDesc: eventDescp,
      hour: hourValue,
      Id: parentId,
    };

    events.push(event);
    console.log(events);

    let eventStr = JSON.stringify(events);
    //Save the events and day in to the localStorage
    localStorage.setItem("events", eventStr);
    localStorage.setItem("eventDay", today);
  }

  //Btn Save Click
  scehdulerDivEL.on("click", ".saveBtn", handleSaveEvents);

  // Load the events and show them at the appropriate Hour.
  function loadEvents() {
    //if its a new day then remove the evnets from the storage
    var todayDay = dayjs().format("D");
    var localEventsStoredDay = localStorage.getItem("events");
    if (today.format("D") !== todayDay) {
      //if day is different then remove the events scheduled for yesterday
      localStorage.removeItem("events");
      console.log("Day is different");
    } else {
      console.log("Day is same");
    }
    var eventsSchedule = JSON.parse(localStorage.getItem("events"));

    if (eventsSchedule !== null) {
      events = eventsSchedule;
      for (let index = 0; index < eventsSchedule.length; index++) {
        const event = eventsSchedule[index];

        //get the div row by parent id
        var rowDiv = $("#" + event.Id);
        var txtAreaEvent = rowDiv.children(".description");
        txtAreaEvent[0].value = event.eventDesc;
      }
    } else {
      console.log("No Events Scheduled");
    }
  }

  loadEvents();
});
