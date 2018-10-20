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

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    INeedAHero.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      account = accs[0]
    })
  },

  setGps: function () {

    const lon = parseInt(document.getElementById('lon').value*10^6)
    const lat = parseInt(document.getElementById('lat').value*10^6)

    INeedAHero.deployed().then(function (instance) {
      instance.setGps(account, lat, lon, {from:account});
    });
  },

  getGps: function () {

    var gpsLon = document.getElementById('gpsLon')
    var gpsLat = document.getElementById('gpsLat')

    INeedAHero.deployed().then(function (instance) {
      instance.getGps(account, {from:account}).then(function (lon, lat){
        gpsLon.innerHtml = lon*1./10^6;
        gpsLon.innerHtml = lat*1./10^6;
      });
    });
  }
},



window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})
