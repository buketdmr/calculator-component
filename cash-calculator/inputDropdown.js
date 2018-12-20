angular.module('inputDropdown', []).directive('inputDropdown', [function() {
    var templateString =
    '<div class="input-dropdown">' +
    '<div class="placeholder2" ng-hide="PlaceholderVar" ng-click ="inputFocus()">' +  
    '<span class="selectedName"> {{rateAmount}}</span>'+
    '<span class="selectedCurCode">{{selectedCurCode}}</span> <span class="queryTime"> 14:50 </span> </div>' +
      '<input type="text"' +
             'name="{{inputName}}"' +
             'placeholder="{{inputPlaceholder}}"' +
             'autocomplete="off"' +
             'ng-model="inputValue"' +
             'class="{{inputClassName}}"' + 
             'ng-required="inputRequired"' +
             'ng-change="inputChange()"' +
             'ng-focus="inputFocus()"' +
             'ng-blur="inputBlur($event)"' +
             'input-dropdown-validator />' +
      '<div class="row" ng-show="dropdownVisible" >' +
        '<div class="col-country" > '+
          '<ul ng-show="dropdownVisible" >'+
                      '<li ng-repeat="item in dropdownItems"' +
                          'ng-click="selectItem(item)"' +
                          'ng-mouseenter="setActive($index)"' +
                          'ng-mousedown="dropdownPressed()"' +
                          'ng-class="{\'active\': activeItemIndex === $index}"' +
                          '>' +
                        '<span ng-if="item.readableName">{{item.readableName}}</span>' +
                        '<span ng-if="!item.readableName">{{item}}</span>' +
                      '</li>' +
          '</ul>' +
        '</div>'+
        '<div class="col-curr" > '+      
          '<ul>'+
            '<li ng-repeat="item in dropdownItems2"'+
                'ng-click="selectItem2(item)"' +
                 'ng-mouseenter="setActive2($index)"' +
                 'ng-mousedown="dropdownPressed()"' +
                  'ng-class="{\'active\': activeItemIndex2 === $index}"' +
                '>' +
            '<span> <img ng-src="{{item.flag}}"/> </span>'+ 
            '<span >  {{item.currCurrCode}}</span>' +
            '</li>'+
          '</ul>'+
      '</div>'+
      '<span >  {{myStyle}}</span>' +
    '</div>';
  
    return {
      restrict: 'E',
      scope: {
        defaultDropdownItems: '=',
        defaultDropdownItems2: '=',
        selectedItem: '=',
        allowCustomInput: '=',
        inputRequired: '=',
        inputName: '@',
        inputClassName: '@',
        inputPlaceholder: '@',
        filterListMethod: '&',
        itemSelectedMethod: '&',
        changeSelected: '&'
      },

      template: templateString,
      controller: function($scope) {
        this.getSelectedItem = function() {
          return $scope.selectedItem;
        };
        this.isRequired = function() {
          return $scope.inputRequired;
        };
        this.customInputAllowed = function() {
          return $scope.allowCustomInput;
        };
        this.getInput = function() {
          return $scope.inputValue;
        };
      },

      link: function(scope, element) {
        var pressedDropdown = false;
        var inputScope = element.find('input').isolateScope();
        // scope.activeItemIndex2 = -1;  default selection of first item
        scope.myStyle = '';
        scope.inputValue = '';
        scope.dropdownVisible = false;
       
        scope.dropdownItems2 = scope.defaultDropdownItems2 || [];
  
        scope.$watch('dropdownItems', function(newValue, oldValue) {
          if (!angular.equals(newValue, oldValue)) {
            // If new dropdownItems were retrieved, reset active one
            if (scope.allowCustomInput) {
              scope.setInputActive();
            }
            else {
              scope.setActive(0);
            }
          }
        });

        
        scope.$watch('dropdownItems2', function(newValue, oldValue) {

          if (!angular.equals(newValue, oldValue)) {
            if (scope.allowCustomInput) {
              scope.setInputActive();
            }
            else {
              scope.setActive(0);
            }
          }
        });

       var mySelectedItem = {};

  
        scope.$watch('selectedItem', function(newValue, oldValue) {
          inputScope.updateInputValidity();
          if (!angular.equals(newValue, oldValue)) {

            if (newValue) {
              // Update value in input field to match readableName of selected item
              if (typeof newValue === 'string') {
                scope.inputValue = newValue;
              }
              else {
                // TODO truncate for long country name
                scope.inputValue = newValue.name;
            }
          }

            else {
                //  Clear input field when editing it after making a selection
                 scope.inputValue = '';  
                 scope.dropdownItems = scope.defaultDropdownItems || []; 
            }
          }
        });


        scope.$watch('selectedItem2', function(newValue, oldValue) {
          inputScope.updateInputValidity();

          if (!angular.equals(newValue, oldValue)) {

            if (newValue) {
              // Update value in input field to match readableName of selected item
              if (typeof newValue === 'string') {
                scope.inputValue = newValue;
              }
              else {
                // TODO truncate for long contry name 
                scope.inputValue = newValue.currCurrCode;
                //  scope.dropdownItems = scope.defaultDropdownItems || [];
            }
          }

            else {
                //  Clear input field when editing it after making a selection
                scope.inputValue = '';  
                scope.dropdownItems =  []; 
            }
          }
        });
  
        scope.setInputActive = function() {
          scope.setActive(-1);
          //TODO: Add active/selected class to input field for styling
        };
  
        scope.setActive = function(itemIndex) {
          scope.activeItemIndex2 = -1;
          scope.activeItemIndex = itemIndex;
        };

        scope.setActive2 = function(itemIndex) {
          scope.activeItemIndex = -1;

          scope.activeItemIndex2 = itemIndex;
        };

        scope.inputChange = function() {

          hidePlaceholder();
          scope.selectedItem = null;

          scope.changeSelected ();

            if (mySelectedItem.selectedColumn == 2)
            {
              scope.selectedItem2  = null;
            }

          if (!scope.inputValue) {
            scope.dropdownItems = scope.defaultDropdownItems || [];
          //  scope.dropdownItems2 = scope.defaultDropdownItems2 || [];
            return;
          }

          else if (scope.allowCustomInput) {
            inputScope.updateInputValidity();
          }

          if  (scope.filterListMethod) {
            var promise = scope.filterListMethod({userInput: scope.inputValue});
            if (promise) {
                promise.then(function(dropdownItems) {
                scope.dropdownItems = dropdownItems;
              });
            }
          }
        };

        scope.inputFocus = function() {
          
          if (scope.allowCustomInput) {
            scope.setInputActive();
          }
          else {
            scope.setActive(0);
          }
            showDropdown();
        };
  
        scope.inputBlur = function(event) {
          if (pressedDropdown) {
            // Blur event is triggered before clickevent, that means a click on a dropdown item wont be triggered if we hide the dropdown list here.
            pressedDropdown = false;
            return;
          }
          hideDropdown();
        };
  
        scope.dropdownPressed = function() {
          pressedDropdown = true;
        };

        // For the country list
        scope.selectItem = function(item) {

          scope.selectedItem = item;
          scope.dropdownItems = [item];
          hideDropdown();
          
          if (scope.itemSelectedMethod) {

             mySelectedItem = { selectedCurCode: item.currCode, img: item.flag, selectedColumn: 1 }
             scope.rateAmount = scope.itemSelectedMethod({item: mySelectedItem});
             scope.selectedCurCode = item.currCode;
             showPlaceholder();
          }
        };

        // For the flag list
        scope.selectItem2 = function(item) {

          scope.selectedItem2 = item;
          scope.inputValue = item.currCurrCode;
          hideDropdown();
       
          if (scope.itemSelectedMethod) {

            mySelectedItem = { selectedCurCode: item.currCurrCode, img: item.flag, selectedColumn: 2  };
            scope.rateAmount = scope.itemSelectedMethod({item: mySelectedItem});
            scope.selectedCurCode = item.currCurrCode;
            showPlaceholder(); 

          };

        };

        var showDropdown = function () {
          scope.dropdownVisible = true;
        };
        var hideDropdown = function() {
          scope.dropdownVisible = false;
        };

        var hidePlaceholder = function(){
          scope.PlaceholderVar = true;
        };

        var showPlaceholder = function (){
          scope.PlaceholderVar = false;
        };

        var selectPreviousItem = function() {
          var prevIndex = scope.activeItemIndex - 1;
          if (prevIndex >= 0) {
              scope.setActive(prevIndex);
          }
          else if (scope.allowCustomInput) {
              scope.setInputActive();
          }
        };
  
        var selectNextItem = function() {
          var nextIndex = scope.activeItemIndex + 1;
          if (nextIndex < scope.dropdownItems.length) {
              scope.setActive(nextIndex);
          }
        };
  
        var selectActiveItem = function()  {
          if (scope.activeItemIndex >= 0 && scope.activeItemIndex < scope.dropdownItems.length) {
              scope.selectItem(scope.dropdownItems[scope.activeItemIndex]);
          }
          else if (scope.allowCustomInput && scope.activeItemIndex === -1) {
          }
        };

        element.bind("keydown keypress", function (event) {
          switch (event.which) {
            case 38: //up
              scope.$apply(selectPreviousItem);
              break;
            case 40: //down
              scope.$apply(selectNextItem);
              break;
            case 13: // return
              if (scope.dropdownVisible && scope.dropdownItems && scope.dropdownItems.length > 0 && scope.activeItemIndex !== -1) {
                // only preventDefault when there is a list so that we can submit form with return key after a selection is made
                event.preventDefault();
                scope.$apply(selectActiveItem);
              }
              break;
            case 9: // tab
              if (scope.dropdownVisible && scope.dropdownItems && scope.dropdownItems.length > 0 && scope.activeItemIndex !== -1) {              
                scope.$apply(selectActiveItem);
              }
              break;
          }
        });
      }
    }
  }]);
  
  angular.module('inputDropdown').directive('inputDropdownValidator', function() {
    return {
      require: ['^inputDropdown', 'ngModel'],
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs, ctrls) {
        var inputDropdownCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];
        var validatorName = 'itemSelectedValid';
  
        scope.updateInputValidity = function() {
           var selection = inputDropdownCtrl.getSelectedItem();
          var isValid = false;
  
          if (!inputDropdownCtrl.isRequired()) {
            // Input isn't required, so it's always valid
            isValid = true;
          }
          else if (inputDropdownCtrl.customInputAllowed() && inputDropdownCtrl.getInput()) {
            // Custom input is allowed so we just need to make sure the input field isn't empty
            isValid = true;
          }
          else if (selection) {
            // Input is required and custom input is not allowed, so only validate if an item is selected
            isValid = true;
          }
          ngModelCtrl.$setValidity(validatorName, isValid);
        };
      }
    };
  });
  