﻿/*!
 * bootstrap-ko-pillbox v0.0.1 for Bootstrap 3
 * Copyright 2015 Leo Davidson
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/ltdavids/bootstrap-ko-pillbox
 */
/*! https://mths.be/startswith v0.2.0 by @mathias */
if (!String.prototype.startsWith) {
    (function () {
        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
        var defineProperty = (function () {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) { }
            return result;
        }());
        var toString = {}.toString;
        var startsWith = function (search) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            if (search && toString.call(search) == '[object RegExp]') {
                throw TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;
            // `ToInteger`
            var pos = position ? Number(position) : 0;
            if (pos != pos) { // better `isNaN`
                pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);
            // Avoid the `indexOf` call if no match is possible
            if (searchLength + start > stringLength) {
                return false;
            }
            var index = -1;
            while (++index < searchLength) {
                if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                    return false;
                }
            }
            return true;
        };
        if (defineProperty) {
            defineProperty(String.prototype, 'startsWith', {
                'value': startsWith,
                'configurable': true,
                'writable': true
            });
        } else {
            String.prototype.startsWith = startsWith;
        }
    }());
}


define(["knockout", "jquery"], function (ko, $) {
    $.fn.selectRange = function (start, end) {
        if (!end) end = start;
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };



    function PillBoxFactory(params, componentInfo) {
        var CHARS = new Array("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "", "", "", "", "", "", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "", "", "", "", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "+", "", "-", ".", "/", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ";", "=", ",", "-", ".", "/", "`", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "[", "\\", "]", "\"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ")", "!", "@", "#", "$", "%", "^", "&", "*", "(", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ":", "+", "<", "_", ">", "?", "~", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "{", "|", "}", "\"");
        $elem = $(componentInfo.element);
        var optionTemplate = params.optionTemplate;
        var optionsText = params.optionsText !== undefined ? params.optionsText : '';
       
        $elem.find(".selected-options").prepend('<li class="placeholder"></li>');
        $elem.find(".selected-options").append('<li class="padder" >&nbsp;<span class="caret" ></span></li>');
        $elem.find(".selected-options").append('<li class="dummy" ><input class="" type="text"  /></li>');

      
        if (optionTemplate) {
            var _html = "";
            if (typeof optionTemplate === 'function') {
                _html = optionTemplate();
            }
            else{

                var _template = $('#' + optionTemplate)[0];
                if (!_template) {
                    throw ("Invalid template");
                }
                _html = $('#' + optionTemplate)[0].innerHTML;
            }
            $elem.find(".options>li").append(_html);
            
        } else {
            $elem.find(".options>li").append('<a><div data-bind="text:' + optionsText + '"></div></a>');
        }


        function swallow(e) {
            if (!e)
                e = window.event;
            //IE9 & Other Browsers
            if (e.stopPropagation) {
                e.stopPropagation();
            }
                //IE8 and Lower
            else {
                e.cancelBubble = true;
            }
        };

        function getCaret(node) {
            if (node.value.length == 0) {
                return 0;
            } else if (node.selectionStart) {
                return node.selectionStart;
            } else if (!document.selection) {
                return 0;
            }

            var c = "\001",
                sel = document.selection.createRange(),
                dul = sel.duplicate(),
                len = 0;

            dul.moveToElementText(node);
            sel.text = c;
            len = dul.text.indexOf(c);
            sel.moveStart('character', -1);
            sel.text = "";
            return len;
        };

        function vm(params, elem, componentInfo) {
            var self = this;
            self.id = elem[0].id;
            self.element = elem;
            self.toggle = self.element.find(".dropdown-toggle");
            self.typeAhead = ko.observable();
            self.cancelKey = false;
            self.suppressKeyUp = false;
            self.inKeyBoardMode = false;
            self.pillbox = self.element.find('.pillbox');
            self.typeAhead(params.typeAhead !== undefined ? params.typeAhead : false);
            self.optionTemplate = params.optionTemplate;
            self.placeHolder = ko.observable();
            self.dropdownRows = ko.observable();
            self.showPillbox = ko.observable();
            self.pillboxRows = ko.observable();
            self.multiple = ko.observable();
            self.autoClose = ko.observable();
            self.optionsText = params.optionsText !== undefined ? params.optionsText : '';
            self.popover = ko.observable(params.popover !== undefined ? params.popover : '');
            //self.popoverTemplate = params.popoverTemplate !== undefined ? params.popoverTemplate : '';
            self.selectedOptions = params.selectedOptions? params.selectedOptions: ko.observableArray();
            //remainingOptions contains all non selected options
            self.remainingOptions = ko.observableArray();
            self.availableOptions = ko.observableArray();
            self.caret = ko.observable(0);
            self.showSelected = ko.observable(0);
            self.selStart = -1;
            self.showSelected = params.showSelected !== undefined ? params.showSelected : false;
            self.scrollbar = ko.observable();
            self.scrollbar.subscribe(function (newvalue) {
                if (self.scrollbar()) {
                    self.element.find(".options").addClass("no-scroll");
                    //self.element.find(".pillbox").addClass("no-scroll");
                    self.element.find(".selections").addClass("no-scroll");
                } else{
                    self.element.find(".options").removeClass("no-scroll");
                    //self.element.find(".pillbox").removeClass("no-scroll");
                    self.element.find(".selections").removeClass("no-scroll");
                }
            });
            
            self.optionValues = ko.isObservable(params.optionValues) ? params.optionValues : ko.observableArray(params.optionValues) ;

            self.searchText = function () {
                if (self.input) {
                    return $(self.input).val().substring(0, self.caret()).toUpperCase();
                }
            };

            self.hintText = ko.observable("");
            self.displayText = ko.observable("");

            self.filtering = false;
            self.lastSingle = '';
            self.itemHeight = ko.observable(12);

            self.hasSearchResults = function () {
                return self.availableOptions().length < self.remainingOptions().length && self.availableOptions().length > 0;
            };

            function disabled() {
                return self.element.attr('disabled') !== undefined;
            };

            function setPillBoxHeight() {
                if (self.pillboxRows() && self.selectedOptions().length>0) {
                    var bHeight = self.element.find('.btn').height() + 6;
                    var ht = self.pillboxRows() * bHeight ;
                    self.element.find('.selections').css('max-height',ht.toFixed(0) + "px");
                } else {
                    self.element.find('.selections').css('max-height','');
                }

            };

            function setDropdownHeight() {
                if (self.dropdownRows()) {
                    self.element.find('.options').css('max-height', self.dropdownRows() * self.itemHeight() - 4 + "px");
                } else {
                    self.element.find('.options').css('max-height', '');
                }
                
            };

            function setPillVisibility() {
                window.setTimeout(function () {
                    if (self.showPillbox() && self.multiple()) {
                    self.element.find('li.selected-option').show();
                    setPillBoxHeight();
                } else{
                    self.element.find('.selected-options').css('visibility', 'visible');
                    self.element.find('li.selected-option').hide();
                }}, 0);
               
            };

            function setPlaceHolderText() {
                var _emptyValText = self.placeHolder() ? self.placeHolder() : "Choose";
                if (!self.multiple()) {
                    self.element.find(".selected-options li.placeholder").text(self.selectedOptions().length > 0 ? self.selectedOptions()[0][optionsText] : _emptyValText);
                } else if (self.placeHolder()) {
                    self.element.find(".selected-options li.placeholder").text(self.placeHolder() ? self.placeHolder() : "Choose");
                }
            };

            function setPlaceHolder() {
                setPlaceHolderText()
                setPillVisibility();
                if (self.selectedOptions().length == 0 || !self.showPillbox()) {
                    self.element.find(".selected-options li.placeholder").show();
                    self.element.find(".selected-options li.padder .caret").show();
                }else if(self.multiple()){

                    self.element.find(".selected-options li.placeholder").hide();
                    self.element.find(".selected-options li.padder .caret").hide();
                }
                return ;
            };

            function resetPopovers() {
                $items = self.element.find(".options li");
                $items.popover('hide');
                if (self.popover()) {
                    var _placement = $(window).width() > 400 ? 'right auto' : 'bottom auto';
                    $items.popover({ html: true, placement: _placement, content: self.popoverContent() });
                }
            };

            self.placeHolderVisible = ko.computed(function () {              
                return self.selectedOptions().length == 0 || !self.showPillbox() && self.multiple();
            });

            self.placeHolder.subscribe(setPlaceHolderText);
            self.selectedOptions.subscribe(setPlaceHolder);
            self.showPillbox.subscribe(setPlaceHolder);
            self.itemHeight.subscribe(setDropdownHeight);
            self.pillboxRows.subscribe(setPillBoxHeight);
            self.dropdownRows.subscribe( setDropdownHeight);
            self.optionValues.subscribe(function (newvalue) {
                self.availableOptions.removeAll();
                var ar = ko.unwrap(self.optionValues).slice(0);
                $.each(ar, function (key, val) {
                    val.selected = ko.observable(false);
                    val.highlight = ko.observable(false);
                });
                self.remainingOptions(ar);
            
                var ar2 = ko.unwrap(self.selectedOptions).slice(0);
                self.selectedOptions.removeAll();
               self.filter();
                $.each(ar2, function (key, val) {
               
                        var item = self.remainingOptions().filter(function (v) {
                            return v[optionsText] === val[optionsText];
                        })[0];
                        selectItem(val);
                  
                });
            });

            self.popoverContent = function (d) {
                if (self.popover())
                    if (self.popover().template) {
                        var _html = "";
                        if (typeof self.popover().template === 'function') {
                            _html = self.popover().template();
                        }
                        else {

                            var _template = $('#' + self.popover().template)[0];
                            if (!_template) {
                                throw ("Invalid template");
                            }
                            _html = $('#' + self.popover().template)[0].innerHTML;
                        }

                    }
                return (_html);
            };


            self.option = function (name, value) {
                switch (name.toUpperCase()) {
                    case "PILLBOXROWS":
                        self.pillboxRows(parseInt(value));
                        break;
                    case "DROPDOWNROWS":
                        self.dropdownRows(parseInt(value));
                        break;
                    case "PLACEHOLDER":
                        if (value !== undefined) {
                            self.placeHolder(value);
                        }
                        return self.placeHolder();
                        break;
                    case "TYPEAHEAD":
                        if (value !== undefined) {
                            self.typeAhead(value);
                        }
                            return self.typeAhead();
                      
                            break;
                        case "SCROLLBAR":
                            if (value !== undefined) {
                                self.scrollbar(value);
                            }
                            return self.scrollbar();

                            break;
                    case "SHOWSELECTED":
                        if (value !== undefined) {
                            self.showSelected = value;
                            self.filter();
                        }
                        return self.showSelected;
                        break;
                    case "SHOWPILLBOX":
                        if (value !== undefined) {
                            self.showPillbox(value);
                        }
                        return self.showPillbox();
                    
                        break;
                    case "MULTIPLE":
                        if (value !== undefined) {
                            self.multiple(value);
                            self.clearSelections();
                            setPlaceHolder();
                        }
                        return self.multiple();

                        break;
                    case "AUTOCLOSE":
                        if (value !== undefined) {
                            self.autoClose(value);
                        }
                        return self.autoClose();

                        break;
                    case "DISABLED":
                        if (value !== undefined) {
                            if (value) {
                            self.element.attr('disabled', 'disabled');
                            self.element.find(".dummy>input").hide();

                            } else if(value === false){
                            self.element.removeAttr('disabled');
                            self.element.find(".dummy>input").show();

                            }
                        }
                        return disabled();

                        break;
                    case "POPOVER":
                        if (!value) {
                            self.element.find(".options li").popover('destroy');
                            self.popover(value);
                        } else {
                            self.popover(value);
                            self.element.find(".options li").popover({ html: true, placement: 'right auto', content: self.popoverContent() });
                        }
                        break;
                }
              
            };

            self.typeAhead.subscribe(function (newvalue) {
                if (newvalue && !(self.element.find(".dropdown-menu").find(".search").length>0)) {
                    self.element.find(".dropdown-menu").prepend('<li class="search"><input class="form-control" type="text"  /></li>');

                    self.input = self.element.find(".search>input")[0];
                    self.element.find(".search>input").on('keydown', handleInputKeyDown)
                        .on('keypress', handleInputKeyPress)
                        .on('keyup', handleInputKeyUp)
                        .on('click', function (e) {
                            swallow(e);
                        });
                }
            });

            self.sort = function (array) {
                array.sort(function (a, b) {
                    return (a[self.optionsText] < b[self.optionsText]) ? -1 : (a[self.optionsText] > b[self.optionsText]) ? 1 : 0;
                });
            };

            function removeItem(data, e) {
                if (!disabled()) {

                    var data = data ? data : ko.dataFor(e.target);
                    data.selected(false);
                    self.selectedOptions.remove(data);
                    if (!self.showSelected) {
                        self.remainingOptions.push(data);
                    }
                    self.clearAll();
                }
                swallow(e);
            };

            function selectItem(data, e) {
                if (!data.selected()) {
                    if (!self.multiple()) {
                        self.clearSelections();
                        self.element.find('.selected-options').css('visibility','hidden');
                    }
                    data.selected(true);
                    if (!self.showSelected) {
                        self.availableOptions.remove(data);
                    }
                    self.selectedOptions.push(data);
                    if (self.autoClose() && !self.multiple())
                        closeDropDown();
                    //setPlaceHolder();
                }
            };

            function onRemovePillClick(e) {
                var data = data ? data : ko.dataFor(e.target);
                removeItem(data, e);
            };

            self.onOptionClick = function (e) {
                var data = ko.dataFor(e.target);
                showPopOver(data, e);
                if (!data.selected()) {
                    selectItem(data, e);
                } else {
                    removeItem( data, e);
                }
                swallow(e);


            };

            self.filter = function (val) {
                if (!self.typeAhead()) {
                    self.availableOptions(self.remainingOptions());

                    self.availableOptions.valueHasMutated();
                    self.availableOptions.notifySubscribers();
                  
                    return;
                }
                var _options = self.remainingOptions();
                if (self.filtering) return;
                var _search = self.searchText();
                if (_search)
                {
                    _options = self.remainingOptions().filter(function (val) {
                        return val[self.optionsText].toUpperCase().startsWith(_search.toUpperCase());
                    });

                    if (_options.length < self.remainingOptions().length && _options.length>0) {
                        self.hintText(_options[0][self.optionsText].substring(self.searchText().length));
                        if (self.lastSingle !== _options[0]) {
                            self.lastSingle = _options[0];
                            self.filtering = true;
                            $(self.input).val(_options[0][self.optionsText]);
                            $(self.input).selectRange(_search.length);
                            self.filtering = false;
                        }
                    } else if (self.lastSingle) {
                        var x = 0;
                        self.lastSingle = '';
                        clearHintText();
                    }
                }
               

                self.sort(_options);
                self.availableOptions(_options);
                self.availableOptions.valueHasMutated();
                self.availableOptions.notifySubscribers();
                resetPopovers();
            };

            self.clearSelections = function () {
                self.availableOptions.removeAll();
                var ar = ko.unwrap(self.optionValues).slice(0);
                $.each(ar, function (key, val) {
                    val.selected = ko.observable(false);
                    val.highlight = ko.observable(false);
                });
                self.remainingOptions(ar);
                //self.remainingOptions(ko.unwrap(self.optionValues).slice(0)
                //.map(function (val) {
                //    return val;
                //}));
                self.remainingOptions.sort(function (a, b) {
                    return (a[self.optionsText] < b[self.optionsText]) ? -1 : (a[self.optionsText] > b[self.optionsText]) ? 1 : 0;
                });
                self.selectedOptions.removeAll();
                self.filter();
                //resetPopovers();
            };

            self.clearSelections();

            function clearHintText() {
                self.hintText('');
                var pos = getCaret(self.input);
                var s = $(self.input).val().substring(0, pos);
                $(self.input).val(s);
            };

            function clearHighlights() {
                $.each(self.availableOptions(), function (key, val) {
                    val.highlight(false);
                });
            };

            self.highlightNextItem = function () {
                var _next = 0;
                for (i = 0; i < self.availableOptions().length; i++) {
                    if (self.availableOptions()[i].highlight()) {
                        self.availableOptions()[i].highlight(false);
                        _next = i + 1;
                        break;
                    }
                }
                _next = _next > self.availableOptions().length - 1 ? 0 : _next;
                self.availableOptions()[_next].highlight(true);
                self.scrollTo();
            };

            self.highlightPrevItem = function () {
                var _next = self.availableOptions().length - 1;
                for (i = self.availableOptions().length - 1; i >= 0; i--) {
                    if (self.availableOptions()[i].highlight()) {
                        self.availableOptions()[i].highlight(false);
                        _next = i - 1;
                        break;
                    }
                }
                _next = _next < 0 ? self.availableOptions().length - 1 : _next;
                self.availableOptions()[_next].highlight(true);

                self.scrollTo();
            };

            self.scrollTo = function () {
                window.setTimeout(function () {
                    $e = self.element.find('.highlight');
                    $c = self.element.find('.options');
                    var scroll;
                    var eoffset = $e.offset();
                    var coffset = $c.offset();
                    var scrolltop = $c.scrollTop();
                    var ctop = coffset.top - scrolltop;
                   var etop = eoffset.top - scrolltop;
                   var ebottom = etop + $e.height();

                   var cbottom = ctop + $c.height();
                   if (ebottom > cbottom) {
                   scroll = scrolltop + ebottom-cbottom;

                   } else if(etop < ctop) {
                   scroll = scrolltop + etop - ctop;

                   }
                    if (scroll !== undefined) {
                        $c.animate({
                            scrollTop: scroll
                        },100);
                    }

                });
            };
         
            self.clearAll = function () {

                self.hintText('');
                $(self.input).val('');
                self.caret(0);
                self.filter();
            };

            function handleDropDownKeyDown(e) {
                self.cancelKey = false;
                if (e.keyCode == 40) {
                    self.inKeyBoardMode = true;
                    self.highlightNextItem();
                    return false;
                } else if (e.keyCode == 38) {
                    self.highlightPrevItem();
                    self.cancelKey = true;
                    return false;
                } else if (e.which == 32 && self.inKeyBoardMode) {
                    for (i = 0; i < self.availableOptions().length; i++) {
                        if (self.availableOptions()[i].highlight()) {
                            selectItem(self.availableOptions()[i]);
                            self.cancelKey = true;
                            break;
                        }
                    }
                } else if (e.which == 27) {

                    self.clearAll();
                    closeDropDown();

                }
                if (e.which == 9) {

                    self.clearAll();
                    closeDropDown();
                }
            };

            function handleInputKeyDown(e) {
                self.cancelKey = false;
                if (e.keyCode == 40) {
                    self.inKeyBoardMode = true;
                    self.highlightNextItem();
                    return false;
                } else if (e.keyCode == 38) {
                    self.highlightPrevItem();
                    self.cancelKey = true;
                    return false;
                }else if (e.keyCode == 34) {
             
                    return false;
                }


                var shift = window.shiftKey ? 256 : 0;
                var _char = CHARS[shift + e.keyCode];
                self.caret(getCaret(e.target));
                var pos = self.caret();

                if (self.hasSearchResults()) {

                    if (e.which == 13 || e.which == 9) {
                        selectItem(self.availableOptions()[0]);
                        self.clearAll();
                        self.cancelKey = true;
                    } else if (e.which == 27) {
                        self.clearAll();
                       return closeDropDown();

                    } else if (e.which == 8) {
                        var s = $(self.input).val().substring(0, pos - 1).toUpperCase();
                        if (!s) {
                            self.clearAll();
                            return false;
                        }
                        if (s === self.searchText().substring(0, pos - 1).toUpperCase()) {
                            self.cancelKey = true;
                            $(self.input).selectRange(pos - 1);
                            self.caret(pos - 1);
                        }
                    }
                    else if (24 <= e.which && e.which <= 222) {
                        var _next = $(self.input).val().substring(pos, pos + 1).toUpperCase();
                        var _this = _char;
                        if (shift + e.which >= 65 && shift + e.which <= 90) {
                            _this = _this.toUpperCase();
                        }
                        if (_this === _next) {
                            $(self.input).selectRange(pos + 1);
                            self.cancelKey = true;
                        }
                    }
                }
                else if (e.which == 27) {

                    self.clearAll();
                    closeDropDown();
                    return;

                }
                else if (e.which == 9 || e.which == 13) {
                    $.each(self.availableOptions(), function (key, val) {
                        if (val.highlight()) {
                            selectItem(val);
                            return false;
                        }
                    });
                    self.clearAll();
                    closeDropDown();
                    return;
                }
                else if (e.which == 32 && self.inKeyBoardMode) {
                    for (i = 0; i < self.availableOptions().length; i++) {
                        if (self.availableOptions()[i].highlight()) {
                            selectItem(self.availableOptions()[i]);
                            self.cancelKey = true;
                            break;
                        }
                    }
                }
                if (self.cancelKey) {
                    return false;
                }
            };

            function handleInputKeyPress(e) {

                if (self.cancelKey) {
                    return false;
                }
            };

            function handleInputKeyUp(e) {
                if (!self.suppressKeyUp) {
                    var pos = getCaret(e.target);
                    self.caret(pos);

                    self.filter();
                } else {
                    self.suppressKeyUp = false;
                }
            };

            function openDropDown() {
                if (!self.pillbox.hasClass('open')) {
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');

                }
            };

            function closeDropDown() {
                if (self.pillbox.hasClass('open')) {
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');
                }
            };

            function handleDummyKeyDown(e) {
                if (self.inKeyBoardMode) { return; }
                if (e.keyCode == 40 || e.keyCode == 32) {

                    self.inKeyBoardMode = true;
                    self.suppressKeyUp = true;
                    self.cancelKey = true;
                    openDropDown();
                    self.clearAll();
                    swallow(e);
                    return false;
                }
            };

            function onBodyKeyDown(e) {
                self.cancelKey = false;
                if (e.keyCode == 40) {
                    openDropDown();
                    self.inKeyBoardMode = true;
                    self.highlightNextItem();
                    return false;
                } else if (e.keyCode == 38) {
                    self.highlightPrevItem();
                    self.cancelKey = true;
                    return false;
                } else if (e.which == 32 && self.inKeyBoardMode) {
                    for (i = 0; i < self.availableOptions().length; i++) {
                        if (self.availableOptions()[i].highlight()) {
                            selectItem(self.availableOptions()[i]);
                            self.cancelKey = true;
                            break;
                        }
                    }
                } else if (e.which == 27) {

                    self.clearAll();
                    closeDropDown();

                }
                if (e.which == 9) {

                    self.clearAll();
                    closeDropDown();
                }
            };

            function addFocusClues() {
                self.element.addClass("focus");
                self.element.find('.selections').addClass("focus");
            };

            function removeFocusClues() {
                self.element.removeClass("focus");
                self.element.find('.selections').removeClass("focus");
                self.element.find(".dummy>input").show();
            };

            function showPopOver(data, e) {
                if (!self.popover()) {
                    return false;
                }
                $e = $(e.target).closest('li');
                if ($e.next('div.popover').length > 0) {
                    // popover already shown
                    return;
                }
                self.element.find(".options li").not($e).popover('hide');
                $e.popover('show');
                var po = $e.next('div.popover')[0];

                if (ko.dataFor(po) === data) {
                    ko.cleanNode(po);
                }
                if (!(ko.dataFor(po) === data)) {
                    ko.applyBindings(data, $e.next()[0]);

                }
                if (self.optionsPopOver) {

                }
            };

            function onOptionHover( e) {
                var data = ko.dataFor(e.target);
                clearHighlights();
                data.highlight(true);
                showPopOver(data, e);
                swallow(e);
            };
            
            function onMouseWheel(e) {
                $e = $(e.target);
                $p = $e.parents('.options');
                $p = $p.length > 0 ? $p : $e.parents('.selections');
                $p = $p.length > 0 ? $p : $e;
                var isOptions = $p.hasClass('options');
                if ((!self.dropdownRows() && isOptions) || (!self.pillboxRows() && !isOptions)) {
                    return;
                }

                if ($(e.target).closest('.popover').length > 0)
                    return false;
                var factor = isOptions?(self.optionTemplate ? 30 : 20):10;
                if (!isOptions) {
                    var bHeight = self.element.find('.btn').height() + 6;
                    $p.scrollTop($p.scrollTop() + (e.originalEvent.deltaY > 0 ? bHeight : bHeight * -1));
                    return false;
                }
                //var factor = self.optionTemplate ? 30 : 20;
                $c = self.element.find(".options");
                var _overall = 0;
                var scrolltop = 0;
                $('.options>li').each(function (idx, val) {
                    _overall += $(val).outerHeight();
                });

                if (e.originalEvent.deltaY < 0) {
                     scrolltop = $c.scrollTop()-factor;

                     scrolltop = Math.max(scrolltop, 0);
                } else {
                     scrolltop = $c.scrollTop()+factor;

                     scrolltop = Math.min(scrolltop, _overall - $c.height());

                }
             
                $c.scrollTop(scrolltop);
                return false;
            };
     
            self.selectAll = function () {
                for (i = self.availableOptions().length-1; i >= 0; i--) {
                    selectItem(self.availableOptions()[i]);

                }
           };

           self.deselectAll = function () {
               self.clearSelections();
           };

           self.init = function () {
               self.element.data('pillbox', self);

               self.pillboxRows(params.pillboxRows);
               self.placeHolder(params.placeHolder ? params.placeHolder : "Choose");
               var ph = componentInfo.templateNodes[0];
               if (ph) {
                   var s = $.trim(ph.nodeValue)
                   self.placeHolder(s ? s : self.placeHolder());
               }
               self.dropdownRows(params.dropdownRows);
               self.scrollbar(params.scrollbar !== undefined ? params.scrollbar : false);
               self.multiple(params.multiple !== undefined ? params.multiple : false);
               self.autoClose(params.autoClose !== undefined ? params.autoClose : false);
               self.showPillbox(params.showPillbox !== undefined ? params.showPillbox : true);
               if (self.typeAhead()) {
                   self.element.find(".dropdown-menu").prepend('<li class="search"><input class="form-control" type="text"  /></li>');
                   self.input = self.element.find(".search>input")[0];
                        self.element.find(".search>input").on('keydown', handleInputKeyDown)
                            .on('keypress', handleInputKeyPress)
                            .on('keyup', handleInputKeyUp)
                            .on('click', function (e) {
                                swallow(e);
                        });
                   
               }
               resetPopovers();
       

                self.element.find(".dummy>input").on('focus', function (e) {
                    addFocusClues();
                    $("body").off('keydown', onBodyKeyDown);
                    $("body").on('keydown', onBodyKeyDown);
                }).on('blur', function () {
                    removeFocusClues();
                    $("body").off('keydown', onBodyKeyDown);
                });

                self.toggle.on('click', function (e) {
                    self.element.find(".dummy>input").focus();
                });
                self.toggle.parent().on('hide.bs.dropdown', function (e) {

                    self.element.find(".options li").popover('hide');
                    self.pillbox.removeClass('dropup');
                    self.clearAll();
                    clearHighlights();
                    self.inKeyBoardMode = false;
                    self.selStart = -1;
                    self.element.find(".dummy>input").focus();

                });
                self.toggle.parent().on('shown.bs.dropdown', function (e) {
                        var h = $(self.element.find('.options li')[0]).outerHeight();
                        self.itemHeight(h);
                    if (self.dropdownRows()) {
                        self.itemHeight.valueHasMutated();
                        self.itemHeight.notifySubscribers();
                    }
                    clearHighlights();
                        $e = $(e.target);
                    if (self.typeAhead()) {
                        $e.find(".search>input")[0].focus();
                    } 
                });
                self.toggle.parent().on('show.bs.dropdown', function (e) {
                    if (disabled()) {

                        return false;
                    }
                    self.element.find(".options").scrollTop(0);
                    self.pillbox.removeClass('dropup');
                    var offset = self.element.offset();
                    var scrolltop = $(window).scrollTop();
                    var ddht = self.element.find(".dropdown-menu").outerHeight();
                    var bottom = offset.top + self.element.outerHeight() + ddht;
                    var top = offset.top - ddht;
               
                    if (scrolltop + $(window).height() < bottom && top > scrolltop) {
                        self.pillbox.addClass('dropup');
                    }

                });

                self.element.find(".selections").on("wheel", onMouseWheel);
                self.element.find(".options").on("wheel", onMouseWheel);
                self.element.find(".options")
                    .on("mouseover", "li", onOptionHover)
                    .on("click", "li", self.onOptionClick);
                self.element.find(".selected-options").on("click", ".btn>a.remover", onRemovePillClick);
           };

           return {
               selectAll: self.selectAll,
               deselectAll: self.deselectAll,
               init: self.init,
               option: self.option,
               availableOptions: self.availableOptions,
               optionValues: self.optionValues,
               selectedOptions: self.selectedOptions
           }

        };


        var obj = new vm(params, $elem, componentInfo);
        $elem.data('pillbox', self);
        return obj;
    }

    return { createViewModel: PillBoxFactory };
});