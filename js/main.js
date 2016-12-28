// all of the exchage rates are shown as myanmar kyats.
// exchange rate for japan yen is wrong. TODO: need to fix that
// use wiremonkey to check the internet connection.

let $placeholder = $('#placeholder');
let $errorPlaceholder = $('#error-placeholder');
let $loadingContainer = $('#loading-container');
let $goToOption = $('#go-to-option');
const filterRate = ['USD', 'JPY', 'GBP', 'SGD', 'THB', 'EUR', 'MYR', 'KRW'];
$placeholder.hide();

// api url
const url = 'http://forex.cbm.gov.mm/api/latest';

function fetchApiAndRender() {
  $loadingContainer.show();
  $errorPlaceholder.hide();
  $.ajax({
    url: url,
    success: function(res) {
      if(res.rates && Object.keys(res.rates).length > 0) {
        $placeholder.empty();
        $placeholder.show();
        const {rates} = res;
        $placeholder.append(`<tr><th>Currency</th><th>Rate</th></tr>`);
        Object.keys(rates)
          .filter(key => filterRate.indexOf(key) > -1 )
          .map(key => {
            $placeholder.append(`<tr><td><img src="images/${key.toLowerCase()}.png" alt="${key}"/> ${key}</td><td>${rates[key]}</td></tr>`)
          });
        $loadingContainer.hide();
      } else {
        $errorPlaceholder.html('<p>Oops something goes wrong. Contact application developer.</p>');
        $errorPlaceholder.show();
        $loadingContainer.hide();
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      // there is an error in fetching data from currency api. Try later .
      // if you saw any bugs contact application developer.
      $loadingContainer.hide();
      $errorPlaceholder.show();
      if(!WireMonkey.checkConnection()) {
        $errorPlaceholder.html('Oops there is no Internet connection.Try checking network cabel, modem and router');
      }
    }
  });
}

function disconnected() {
  $placeholder.hide();
  $errorPlaceholder.show();
  $loadingContainer.hide();
  $errorPlaceholder.html('Oops there is no Internet connection.Try checking network cabel, modem and router');
}

if(WireMonkey.checkConnection()) {
  fetchApiAndRender();
} else {
  disconnected();
}

// open the chrome options tab when the button is clicked
function openOptionsTab() {
  chrome.tabs.getSelected(
    function(n) {
      chrome.tabs.create(
        {index:n.index+1,url:"options.html"}
      )
    }
  )
}
$goToOption.on('click', function(){openOptionsTab()});

WireMonkey.init();
WireMonkey.on('connected', function(){
  console.log('Your connection is alived.');
  fetchApiAndRender();
});
WireMonkey.on('disconnected', function(){
  disconnected();
  console.log('You are disconnected from internet.');
});
