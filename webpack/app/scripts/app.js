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

  setGps: function () {

    const lon = parseInt(document.getElementById('lon').value*1e6)
    const lat = parseInt(document.getElementById('lat').value*1e6)

    HeroContract.setGps(account, lat, lon, {from:account, gas:1000000});
  },

  getGps: function () {

    var gpsLon = document.getElementById('gpsLon')
    var gpsLat = document.getElementById('gpsLat')

    HeroContract.getGps(account, {from:account}).then(function (gps){
      console.log(parseInt(gps[0]));
      gpsLat.innerHTML = parseInt(gps[0])*1./1e6;
      gpsLon.innerHTML = parseInt(gps[1])*1./1e6;
    });
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
