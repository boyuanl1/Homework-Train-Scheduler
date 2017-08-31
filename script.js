
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBxqB2uD_UlOf5cRbLfvtVerUzS2suyq6o",
    authDomain: "train-scheduler-e26fd.firebaseapp.com",
    databaseURL: "https://train-scheduler-e26fd.firebaseio.com",
    projectId: "train-scheduler-e26fd",
    storageBucket: "",
    messagingSenderId: "456051670362"
  };
  firebase.initializeApp(config);
var database = firebase.database();

$("#add-employee-btn").on("click", function(event) {
  event.preventDefault();
  //user input
  var empName = $("#employee-name-input").val().trim();
  var empRole = $("#role-input").val().trim();
  var empStart = $("#start-input").val().trim();
  var empRate = $("#rate-input").val().trim();

  var newEmp = {
    name: empName,
    role: empRole,
    start: empStart,
    rate: empRate
  };
  // Uploads employee data to the database
  database.ref().push(newEmp);

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});
// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var empName = childSnapshot.val().name;
  var empRole = childSnapshot.val().role;
  var firstTime = childSnapshot.val().start;
  var tFrequency = childSnapshot.val().rate; 

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  // Add each train's data into the table
  $("#employee-table > tbody").append("<tr><td>" + empName + "</td><td>" + empRole + "</td><td>" +
		  tFrequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
