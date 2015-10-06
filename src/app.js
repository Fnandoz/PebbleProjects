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