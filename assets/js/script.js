
var createMainDiv = function(data){
  var date = new Date(data.dt * 1000)
  var city =$("<h2>").text(data.name+"("+date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear()+")").addClass("cityName").css('display', 'inline-block');
  var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+".png").addClass("iconImage").css('display', 'inline-block');
  var list =$("<ul>").addClass("mainList")
  list.append($("<li>").text("Temp "+data.temp))

  $("#mainDisplay").append(city,image,list);
}

var displayData = function (data) {
    createMainDiv(data)
};

var getWeather = function () {
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=shimla&appid=1570abab448b8f7eb6d7d0a44bd3cbef";
    // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=1570abab448b8f7eb6d7d0a44bd3cbef"
  // var Url="https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=85a8d1f30e19c5a51796de9c2748d523"
  fetch(url).then(function (response) {
    return response.json().then(function (data) {
      displayData(data);
    });
  });
};
getWeather();
