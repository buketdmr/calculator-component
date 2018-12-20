
var inputApp = angular.module('inputDropdownStart', ['inputDropdown']);


inputApp.controller('InputDropdownController', [
  '$scope',
  '$q',
  function($scope, $q) {
    var self = this;

    self.objectMessage = '';          
    self.countryObject = null; 
    self.defaultDropdownObjects = [];
    self.defaultDropdownObjects2 = [];
    var myRate  = 0;


  // TODO External JSON files will be use 
   CountryObjArr = [
      { "name" :   "Australia" , "currCode" : "AUD", "currName":"Dollar", "flag": "img/au.svg"},
      { "name" :   "United Arab Emirates" , "currCode" : "AED", "currName":"Dirham", "flag": "img/ae.svg"},
      { "name" :   "China" , "currCode" : "CNY", "currName":"Yuan", "flag": "img/eu.svg"},
      { "name" :   "Sweden" , "currCode" : "SEK", "currName":"", "flag": "img/eu.svg"},
      { "name" :   "Switzerland" , "currCode" : "CHF", "currName":"Franc", "flag": "img/eu.svg"},
      { "name" :   "France" , "currCode" : "EUR", "currName":"Euro", "flag":  "img/eu.svg"},
      { "name" :   "Germany" , "currCode" : "EUR", "currName":"Euro", "flag": "img/eu.svg"},
      { "name" :   "South Korea" , "currCode" : "KRW", "currName":"Won", "flag": "img/eu.svg"},
      { "name" :   "New Zeland" , "currCode" : "NZD", "currName":"Dollar", "flag": "img/eu.svg"},
      { "name" :   "Turkey" , "currCode" : "TRY", "currName":"Lira", "flag": "img/eu.svg"},
      { "name" :   "Trinidad" , "currCode" : "TTD", "currName":"Dollar", "flag": "img/eu.svg"},
      { "name" :   "United States" , "currCode" : "USD", "currName":"Dollar", "flag": "img/us.svg"},
      { "name" :   "Vietnam" , "currCode" : "VND", "currName":"Dong", "flag": "img/eu.svg"},
      { "name" :   "South Africa" , "currCode" : "ZAR", "currName":"Rand", "flag": "img/eu.svg"}
  ]; 

  CurrencyObjArr = [
    { "code" :   "EUR" , "flag": "img/eu.svg"},
    { "code" :   "USD", "flag": "img/us.svg"},
    { "code" :   "AUD", "flag": "img/au.svg"},
    { "code" :   "AED", "flag": "img/ae.svg"},
    { "code" :   "EUR" , "flag": "img/eu.svg"},
    { "code" :   "USD", "flag": "img/us.svg"},
    { "code" :   "AUD", "flag": "img/au.svg"},
    { "code" :   "AED", "flag": "img/ae.svg"},
    { "code" :   "EUR" , "flag": "img/eu.svg"},
    { "code" :   "USD", "flag": "img/us.svg"},
    { "code" :   "AUD", "flag": "img/au.svg"},
    { "code" :   "AED", "flag": "img/ae.svg"},
]; 


  var exchangeRates = { "GBP" : {
    "AUD": 1.7670890476942,
    "CAD": 1.6903092767977,
    "CHF": 1.2737653429567,
    "DKK": 8.403699524829,
    "EUR": 1.1260910539567,
    "HKD": 9.9987053060055,
    "HUF": 362.98568781335,
    "ILS": 4.7734414653555,
    "JPY": 144.10904032443,
    "NOK": 10.970578254105,
    "NZD": 1.885779373506,
    "PLN": 4.8341852691457,
    "SEK": 11.602186360196,
    "SGD": 1.7569238126737,
    "TRY": 6.753710699169,
    "USD": 1.2779856595222,
    "ZAR": 17.713936462467
 }    
};

    for ( var  myitem in CountryObjArr ) {
      self.defaultDropdownObjects.push(new Country(myitem, CountryObjArr[myitem].name, CountryObjArr[myitem].currCode, CountryObjArr[myitem].currName, CountryObjArr[myitem].flag));
    };


    for ( var  myitem2 in CurrencyObjArr ) {
      self.defaultDropdownObjects2.push(new Currency2(myitem2, CurrencyObjArr[myitem2].code, CurrencyObjArr[myitem2].flag)); 
    };

    self.filterObjectList = function(userInput) {

      var filter = $q.defer();
      var normalisedInput = userInput.toLowerCase();
      var filteredArray = self.defaultDropdownObjects.filter(function(country) {
      var countryList = country.name.split(" ");
        
        //TODO  Loop is better solution for this
        // var matchCountrySecondName = country.name.toLowerCase().indexOf(normalisedInput) === 0;

        var matchCountryName = countryList[0].toLowerCase().indexOf(normalisedInput) === 0;
        var matchCountrySecondName = false;
        var matchCountrySecondName2 = false;

        if (countryList.length > 2){
        var matchCountrySecondName = countryList[1].toLowerCase().indexOf(normalisedInput) === 0;
        var matchCountrySecondName2 = countryList[2].toLowerCase().indexOf(normalisedInput) === 0;

        } else if (countryList.length > 1) {
          var matchCountrySecondName = countryList[1].toLowerCase().indexOf(normalisedInput) === 0;
        }

        var matchCurrencyName = country.currencyName.toLowerCase().indexOf(normalisedInput) === 0;
        var matchCountryCode = country.currCode.toLowerCase().indexOf(normalisedInput) === 0;
        return matchCountryName || matchCountryCode || matchCountrySecondName || matchCountrySecondName2 ||  matchCurrencyName;

      });

      filter.resolve(filteredArray);
      return filter.promise;

    };

    this.changeSelected =  function (){
      $scope.myStyle ='';
      $scope.outAmnt = null;
    }

      self.itemObjectSelected = function(item) {
    
      $scope.myStyle = {'background-image':'url('+ item.img + ')' , 'background-size': '30% 30%' };
      myRate = exchangeRates.GBP[item.selectedCurCode].toFixed(2);
      var rateAmount2 = '1 GBP = ' + myRate + ' ';
      $scope.myRate = myRate;

      if ($scope.gbpAmnt>0) {
        $scope.outAmnt =  $scope.gbpAmnt * myRate; 
      }
      return rateAmount2;
    };


    $scope.outAmount = function(){
    $scope.gbpAmnt =  $scope.outAmnt / myRate; 
    
  }

    $scope.gbpAmount = function(){
    $scope.outAmnt =  $scope.gbpAmnt * myRate; 

    }
  } 
]);

// Country object used in dropdown
var Country = function(id, countryName, Code, currName, countryFlag) {
  this.id = id;
  this.name = countryName;
  this.currCode = Code;
  this.currencyName = currName;
  this.readableName =  countryName + '    -    ' + Code ;
  this.flag = countryFlag;

};

var Currency2 = function(id, CurrName, countryFlag) {
  this.id = id;
  this.currCurrCode = CurrName;
  this.flag = countryFlag;
};