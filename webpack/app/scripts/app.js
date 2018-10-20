// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import INeedAHeroArtifact from '../../build/contracts/INeedAHero.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const INeedAHero = contract(INeedAHeroArtifact)

let account;
var HeroContract;
var a;

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    INeedAHero.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      account = accs[0];
      INeedAHero.deployed().then(function (instance) {
        HeroContract = instance;
      });
    })
  },

  needHelp: function () {
    navigator.geolocation.getCurrentPosition(function(pos){
        var lat = pos["coords"].latitude*1e7;
        var lon = pos["coords"].latitude*1e7;
        var accuracy = pos["coords"].accuracy;
        HeroContract.needHelp(account, lat, lon, accuracy, {from:account, gas:1000000});
      },
      function(err){
        console.log(err);
      },
      {enableHighAccuracy: true}
    );
  },

  beHero: function () {

    HeroContract.Alert().watch(function(error, result) {
      var lat = parseInt(result["args"]["_lat"])/1e7;
      var lon = parseInt(result["args"]["_lon"])/1e7;
      var id = result["args"]["_id"];
        console.log(result["args"]);
    });

    // var gpsLon = document.getElementById('gpsLon')
    // var gpsLat = document.getElementById('gpsLat')
    //
    // HeroContract.getGps(account, {from:account}).then(function (gps){
    //   console.log(parseInt(gps[0]));
    //   gpsLat.innerHTML = parseInt(gps[0])*1./1e7;
    //   gpsLon.innerHTML = parseInt(gps[1])*1./1e7;
    // });
  },

  // HeroContract.Alert().watch({}, '', function(error, result) {
  //     console.log(result);
  // });
}

window.App = App

window.addEventListener('load', function () {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  App.start()
})
