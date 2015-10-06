var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseFeed = function(data,quantity){
  var items = [];
  for(var i = 0; i < quantity; i++){
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase()+title.substring(1);
    
    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-')+1, time.indexOf(':')+3);
    
    // Add to menu items array
    items.push({
      title:title,
      subtitle:time
    });
  }
  
  // Finally return whole array
  return items;
};


// Show splash creen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0,0),
  size: new Vector2(144, 168),
  text: 'Downloading...',
  font: 'GOTHIC_28_BOLD',
  color:'red',
  textOverflow: 'wrap',
  textAlign: 'center',
  backgroundColor:'black'
});

// Prepare the accelerometer
Accel.init();

// Make request to openweathermap.org
ajax(
  {
    url:'http://api.openweathermap.org/data/2.5/forecast?q=Belem',
    type:'json'
  },
  function(data){ 
    // Create an array of Menu items
    var menuItems = parseFeed(data,10);
    
    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Current Forecast',
        items: menuItems
      }]
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();    
    
    // Add an action for SELECT
    resultsMenu.on('select', function(e){
      // Get the forecast 
      var forecast = data.list[e.itemIndex];
      
      // Assemble body string
      var content = data.list[e.itemIndex].weather[0].description;
      
      // Capitalize first letter
      content = content.charAt(0).toUpperCase() + content.substring(1);
      
      // Add temperature, pressure, etc
      content += '\nTemperature: ' + Math.round(forecast.main.temp - 273.15) + '°C' +
        '\nPressure: ' + Math.round(forecast.main.pressure)  + 'mbar' +
        '\nWind: ' + Math.round(forecast.wind.speed) + 'mph, ' +
        Math.round(forecast.wind.deg) + 'º';
      
      // Create the card for detailed view
      var detailCard = new UI.Card({
        title: 'Details',
        subtitle:e.item.subtitle,
        body:content
      });
      
      detailCard.show();
    });

    //Check the items are extracted OK
    for(var i = 0; i < menuItems.length; i++){
      console.log(menuItems[i].title + '|' + menuItems[i].subtitle);
    }
    
  },
  function(error){
    console.log('Download failed: ' + error);
  }
);

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();