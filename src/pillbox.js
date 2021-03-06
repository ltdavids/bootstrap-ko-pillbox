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
        var optionsPopOver = params.optionsPopOver !== undefined ? params.optionsPopOver : '';
        $elem.find(".selected-options").prepend('<li class="placeholder" data-bind="visible:placeHolderVisible"><span  data-bind="text:placeHolder"></span></li>');
        $elem.find(".selected-options").append('<li class="padder" >&nbsp;<span class="caret" data-bind="visible:placeHolderVisible"></span></li>');
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

        function vm(params, elem) {
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
            self.showPillbox = ko.observable(params.showPillbox !== undefined ? params.showPillbox : true);
            self.optionsText = params.optionsText !== undefined ? params.optionsText : '';
            self.popover = ko.observable(params.popover !== undefined ? params.popover : '');
            self.popoverTemplate = params.popoverTemplate !== undefined ? params.popoverTemplate : '';
            self.selectedOptions = params.selectedOptions? params.selectedOptions: ko.observableArray();
            //remainingOptions contains all non selected options
            self.remainingOptions = ko.observableArray();
            self.caret = ko.observable(0);
            self.inFocus = ko.observable(false);
            self.selStart = -1;
            self.showSelected = params.showSelected !== undefined ? params.showSelected : false;
            self.scrollbar = ko.observable();
            self.scrollbar.subscribe(function (newvalue) {
                if (self.scrollbar()) {
                    self.element.find(".options").addClass("no-scroll");
                } else{
                    self.element.find(".options").removeClass("no-scroll");
                }
            });
            
            self.optionValues = params.optionValues;

            self.searchText = function () {
                if (self.input) {
                    return $(self.input).val().substring(0, self.caret()).toUpperCase();
                }
            };
            self.hintText = ko.observable("");
            self.displayText = ko.observable("");

                       
            //options contains a filtered copy of options;
            self.options = ko.observableArray(ko.unwrap(self.remainingOptions).slice(0));
            self.options.sort(function (a, b) {
                return (a[self.optionsText] < b[self.optionsText]) ? -1 : (a[self.optionsText] > b[self.optionsText]) ? 1 : 0;
            });
            self.filtering = false;
            self.lastSingle = '';
            self.rows = ko.observable(params.rows);
            self.itemHeight = ko.observable(12);
            self.dropdownRows = ko.observable(params.dropdownRows);
            self.height = ko.computed(function () {
                if (!self.rows()) {
                    return;
                }
                var bHeight = self.element.find('.btn').height() + 6;
                var ht = self.rows() * bHeight ;
                return ht.toFixed(0) + "px";
            });

            self.dropheight = ko.computed(function () {
                if (!self.dropdownRows()) {
                    return;
                }
                return self.dropdownRows() * self.itemHeight()-4 + "px";
            });

            self.popoverContent = function (d) {
                if (self.popover())
                    if (self.popover().popoverTemplate) {
                        var _html = "";
                        if (typeof self.popover().popoverTemplate === 'function') {
                            _html = self.popover().popoverTemplate();
                        }
                        else {

                            var _template = $('#' + self.popover().popoverTemplate)[0];
                            if (!_template) {
                                throw ("Invalid template");
                            }
                            _html = $('#' + self.popover().popoverTemplate)[0].innerHTML;
                        }

                    }
                return (_html);
            };

            self.resetPopovers = function () {
                self.element.find(".options li").popover('destroy');
                if (self.popover()) {
                    var _placement = $(window).width() > 400 ? 'right auto' : 'bottom auto';
                    self.element.find(".options li").popover({ html: true, placement: _placement, content: self.popoverContent() });
                }
            };

            self.option = function (name, value) {
                switch (name.toUpperCase()) {
                    case "ROWS":
                        self.rows(parseInt(value));
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

            self.removeItem = function (data, e) {
                data.selected(false);
                self.selectedOptions.remove(data);
                if (!self.showSelected) {
                    self.remainingOptions.push(data);
                }
                self.clearAll();
                swallow(e);
            };

            self.placeHolder = ko.observable(params.placeHolder ? params.placeHolder : "Choose");

            self.placeHolderVisible = ko.computed(function () {
                return self.selectedOptions().length == 0 || (!self.showPillbox());
            });
 
            self.selectItem = function (data, e) {
                if (!data.selected()) {
                    data.selected(true);
                    if (!self.showSelected) {
                        self.remainingOptions.remove(data);
                    }
                    self.selectedOptions.push(data);
                }
            };

            self.handleClick = function (data,e) {

                self.showPopOver(data, e);
                if (!data.selected()) {
                   self.selectItem(data,e);
                } else {
                    self.removeItem(data, e);
                }
                self.clearAll();
                swallow(e);
               
             
            }

            self.filter = function (val) {
                if (!self.typeAhead()) {
                    self.options(self.remainingOptions());

                    self.options.valueHasMutated();
                    self.options.notifySubscribers();
                  
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

                    if (_options.length == 1) {
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
                        self.clearHintText();
                    }
                    self.sort(_options);
                }
               

                self.sort(_options);
                self.options(_options);
                self.options.valueHasMutated();
                self.options.notifySubscribers();
            };

            self.clearSelections = function () {
                self.options.removeAll();
                self.remainingOptions(ko.unwrap(params.optionValues).slice(0)
                .map(function (val) {
                    val.selected = ko.observable(false);
                    val.highlight = ko.observable(false);
                    return val;
                }));
                self.remainingOptions.sort(function (a, b) {
                    return (a[self.optionsText] < b[self.optionsText]) ? -1 : (a[self.optionsText] > b[self.optionsText]) ? 1 : 0;
                });
                self.selectedOptions.removeAll();
                self.filter();
                self.resetPopovers();
            };

            self.clearSelections();

            self.clearHintText = function () {
                self.hintText('');
                var pos = getCaret(self.input);
                var s = $(self.input).val().substring(0, pos);
                $(self.input).val(s);
            };

            self.clearHighlights = function () {
                $.each(self.options(), function (key, val) { val.highlight(false); });
            };

            self.highlightNextItem = function () {
                var _next = 0;
                for (i = 0; i < self.options().length; i++) {
                    if (self.options()[i].highlight()) {
                        self.options()[i].highlight(false);
                        _next = i + 1;
                        break;
                    }
                }
                _next = _next > self.options().length - 1 ? 0 : _next;
                self.options()[_next].highlight(true);
                self.scrollTo();
            };

            self.highlightPrevItem = function () {
                var _next = self.options().length - 1;
                for (i = self.options().length - 1; i >= 0; i--) {
                    if (self.options()[i].highlight()) {
                        self.options()[i].highlight(false);
                        _next = i - 1;
                        break;
                    }
                }
                _next = _next < 0 ? self.options().length - 1 : _next;
                self.options()[_next].highlight(true);

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
                    for (i = 0; i < self.options().length; i++) {
                        if (self.options()[i].highlight()) {
                            self.selectItem(self.options()[i]);
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

                if (self.options().length == 1) {

                    if (e.which == 13 || e.which == 9) {
                        self.clearAll();
                        self.selectItem(self.options()[0]);
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
                    $.each(self.options(), function (key, val) {
                        if (val.highlight()) {
                            self.selectItem(val);
                            return false;
                        }
                    });
                    self.clearAll();
                    closeDropDown();
                    return;
                }
                else if (e.which == 32 && self.inKeyBoardMode) {
                    for (i = 0; i < self.options().length; i++) {
                        if (self.options()[i].highlight()) {
                            self.selectItem(self.options()[i]);
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
                    for (i = 0; i < self.options().length; i++) {
                        if (self.options()[i].highlight()) {
                            self.selectItem(self.options()[i]);
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
                self.inFocus(true);
                self.element.addClass("focus");
            };

            function removeFocusClues() {
                self.inFocus(false);
                self.element.removeClass("focus");
                self.element.find(".dummy>input").show();
            };

            self.showPopOver = function (data, e) {
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

            self.hoverItem = function (data, e) {
                self.clearHighlights();
                data.highlight(true);
                self.showPopOver(data, e);
                swallow(e);
            };
            
            self.onMouseWheel = function (e) {
                if (!self.dropdownRows()) {
                    return;
                }
                if ($(e.target).closest('.popover').length > 0)
                    return false;

                var factor = self.optionTemplate ? 30 : 20;
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
               $.each(self.options(), function (key, val) {
                   self.selectItem(val);
               })
           };

           self.deselectAll = function () {
               self.clearSelections();
           };

           self.init = function () {
               self.element.data('pillbox', self);
               self.scrollbar(params.scrollbar !== undefined ? params.scrollbar : false);
                //self.sort(self.options());
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
               self.resetPopovers();
                //if (self.popover()) {
                //    self.element.find(".options li").popover({ html: true, placement:'right auto', content: self.popoverContent() });
                //    //$.each(self.element.find(".options li"), function (key, val) {
                //    //    $(val).popover({ html: true, placement:'right auto', content: self.popoverContent() });
                //    //});
                //}

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
                    self.clearHighlights();
                    self.inKeyBoardMode = false;
                    self.selStart = -1;
                    self.element.find(".dummy>input").focus();

                });
                self.toggle.parent().on('shown.bs.dropdown', function (e) {
                    if (self.dropdownRows()) {
                        var h = $(self.element.find('.options li')[0]).outerHeight();
                        self.itemHeight(h);
                        self.itemHeight.valueHasMutated();
                    };
                    self.clearHighlights();
                        $e = $(e.target);
                    if (self.typeAhead()) {
                        $e.find(".search>input")[0].focus();
                    } 
                });
                self.toggle.parent().on('show.bs.dropdown', function (e) {
                    if (self.element.attr('disabled')){

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
               
                self.element.find(".options").on("wheel", self.onMouseWheel);
            };

        };
        var obj = new vm(params, $elem);
        var ph = componentInfo.templateNodes[0];
        if (ph) {
            var s = $.trim(ph.nodeValue)
        obj.placeHolder(s ? s : obj.placeHolder());
        }
        $elem.data('pillbox', self);
        return obj;
    }

    return { createViewModel: PillBoxFactory };
});