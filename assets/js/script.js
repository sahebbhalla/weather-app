var historySearch = [];

var searchButton = $("#search"); //Search button selector
var tempCityHolder = "";
//Set color for UV index List depending on Uv Index
var setHumidColor = function (data) {
  $(".mainList").css("list-style", "none");
  if (Number(data) < 3) {
    $(".indexValue").css("background-color", "green");
  } else if (Number(data) < 5) {
    $(".indexValue").css("background-color", "orange");
  } else if (Number(data) < 7) {
    $(".indexValue").css("background-color", "red");
  } else if (Number(data) < 10) {
    $(".indexValue").css("background-color", "yellow");
  } else {
    $(".indexValue").css("background-color", "purple");
  }
};
var createMainDiv = function (data) {
  //Create MainDiv
  var date = new Date(data.current.dt * 1000); //Convert Unix date
  var city = $("<h2>") //set city and Date
    .text(
      tempCityHolder +
        " (" +
        date.getMonth() +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        ")"
    )
    .addClass("cityName")
    .css("display", "inline-block");
  var image = $("<img>") //set Image Icon
    .attr(
      "src",
      "http://openweathermap.org/img/wn/" +
        data.current.weather[0].icon +
        ".png"
    )
    .addClass("iconImage")
    .css("display", "inline-block");
  var list = $("<ul>").addClass("mainList"); //Ul set calss

  list.append(
    //temp item
    $("<li>").text(
      "Temp: " + Number(data.current.temp - 273.15).toFixed(1) + " C"
    )
  );
  list.append(
    //Wind Item
    $("<li>").text("Wind: " + Number(data.current.wind_speed) + " MPH")
  );
  list.append(
    //Humidity Item
    $("<li>").text("Humidity: " + Number(data.current.humidity) + "%")
  );
  list.append(
    //UvIndex Item
    $("<li>")
      .attr("id", "uvIndex")
      .text("UV Index ")
      .append(
        $("<button>")
          .addClass("indexValue btn")
          .text(Number(data.current.uvi).toFixed(1))
      )
  );
  $("#mainDisplay").append(city, image, list); //Append every element to UL
  setHumidColor(Number(data.current.uvi)); //Set Color
};

var createDayForcast = function (
  data //day Forcast for next 5 days
) {
  var secondary = $("#secondaryDisplay");
  secondary.append($("<h1>").text("5-Day Forecast:"));
  for (var i = 0; i < data.daily.length; i++) {
    var date = new Date(data.daily[i].dt * 1000);
    var list = $("<ul>").addClass("dailyList");
    list.append(
      //temp item
      $("<li>").text(
        "Temp: " + Number(data.daily[i].temp.day - 273.15).toFixed(1) + " C"
      )
    );
    list.append(
      //Wind Item
      $("<li>").text("Wind: " + Number(data.daily[i].wind_speed) + " MPH")
    );
    list.append(
      //Humidity Item
      $("<li>").text("Humidity: " + Number(data.daily[i].humidity) + "%")
    );
    secondary.append(
      $("<div>")
        .addClass("card dayWeather col-sm-2")
        .append(
          $("<h4>").text(
              " (" +
              date.getMonth() +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear() +
              ")"
          ),
          $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              data.daily[i].weather[0].icon +
              ".png"
          ).addClass("IconImage"),list
          
        )
    );
  }
};
var displayData = function (
  data //Render method
) {
  $("#mainDisplay").html("")
  $("#secondaryDisplay").html("");
  createMainDiv(data); //Display current weather
  createDayForcast(data); //displayNext  5 day weather
};
var getGeoCode = function (address) {
  //Set LAt and long from google API
  var Url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    address +
    "&key=AIzaSyCXj93E80QFMSeJNrWWSLyCBn8BdyL9JGY";

  fetch(Url).then(function (response) {
    return response.json().then(function (data) {
      getWeather(
        //Open weather API
        data.results[0].geometry.location.lat, //lat
        data.results[0].geometry.location.lng //long
      );
    });
  });
};

var saveHistory= function(){
  localStorage.setItem("historySearch",JSON.stringify(historySearch));
}
var createHistoryButton = function(name){
  $("#history").append($("<button>").addClass("btn btn-primary historyButton").text(name).css("width","100%"))
}
var searchAction = function () {
  //search action method
  if ($("#cityInput").val() !== "") {
    tempCityHolder = $("#cityInput").val();
    getGeoCode(tempCityHolder); //get Geo code from Google API
    createHistoryButton(tempCityHolder)
    historySearch.push(tempCityHolder);
    saveHistory();
    $("#cityInput").val(" "); //set the input to empty string
  } else {
    alert("Please enter a valid address");
  }
};
var getWeather = function (lat, long) {
  //OpenWeather API
  var url =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&appid=7db3669243ac203e0995a90c5dfd0558";
  fetch(url).then(function (response) {
    return response.json().then(function (data) {
      displayData(data); //After all the API call, initiate this method
    });
  });
};
var loadHistory = function(){
  if(localStorage.getItem("historySearch")!==null){
    historySearch=JSON.parse(localStorage.getItem("historySearch"));
    for(var i = 0 ;i<historySearch.length;i++)
    {
      createHistoryButton(historySearch[i]);
    }
  }
}
loadHistory()
var historyAction = function(event){
 tempCityHolder=event.target.innerText;
 getGeoCode(String(tempCityHolder)); //get Geo code from Google API

}
$(".historyButton").on("click",historyAction)
searchButton.on("click", searchAction);//Search button action

