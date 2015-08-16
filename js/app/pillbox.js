/*!
 * bootstrap-ko-pillbox v0.0.1 for Bootstrap 3
 * Copyright 2015 Leo Davidson
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/ltdavids/bootstrap-ko-pillbox
 */

define(["knockout", "jquery"], function (ko, $) {
    function PillBoxFactory(params, componentInfo) {
        var CHARS = new Array("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "", "", "", "", "", "", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "", "", "", "", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "+", "", "-", ".", "/", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ";", "=", ",", "-", ".", "/", "`", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "[", "\\", "]", "\"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ")", "!", "@", "#", "$", "%", "^", "&", "*", "(", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ":", "+", "<", "_", ">", "?", "~", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "{", "|", "}", "\"");
        $elem = $(componentInfo.element);
        var template = componentInfo.templateNodes;
        var itemTemplate = params.itemTemplate;
        var optionsText = params.optionsText !== undefined ? params.optionsText : '';
        var optionsPopOver = params.optionsPopOver !== undefined ? params.optionsPopOver : '';
        $elem.find(".selected-options").prepend('<li class="placeholder" data-bind="visible:placeHolderVisible"><span  data-bind="text:placeHolder"></span></li>');
        $elem.find(".selected-options").append('<li class="padder" >&nbsp;<span class="caret" data-bind="visible:placeHolderVisible"></span></li>');
        $elem.find(".selected-options").append('<li class="dummy" ><input class="" type="text"  /></li>');

      
        if (itemTemplate) {
            var _template = $('#' + itemTemplate)[0];
            if (!_template) {
                throw ("Invalid template");
            }
            var _html = $('#' + itemTemplate)[0].innerHTML;
            $elem.find(".options>li").append(_html);
        } else {
            $elem.find(".options>li").append('<a><div data-bind="text:' + optionsText + '"></div></a>');
        }
        if (params.typeAhead !== undefined ? params.typeAhead : false) {
            $elem.find(".dropdown-menu").prepend('<li class="search"><input class="form-control" type="text"  /></li>');
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
            if (node.selectionStart) {
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
            self.element = elem;
            self.toggle = self.element.find(".dropdown-toggle");
            self.cancelKey = false;
            self.suppressKeyUp = false;
            self.inKeyBoardMode = false;
            self.input = self.element.find(".search>input")[0];
            self.showPillbox = ko.observable(params.showPillbox !== undefined ? params.showPillbox : true);
            self.optionsText = params.optionsText !== undefined ? params.optionsText : '';
            self.optionsPopOver = params.optionsPopOver !== undefined ? params.optionsPopOver : '';
            self.selectedOptions = params.selectedOptions;
            self.caret = ko.observable(0);
            self.inFocus = ko.observable(false);
            self.selStart = -1;
            self.inputEnabled = params.typeAhead !== undefined ? params.typeAhead : false;
            self.showSelected = params.showSelected !== undefined ? params.showSelected : false;
            self.scrollbar = params.scrollbar !== undefined ? params.scrollbar : true;
            self.optionValues = params.optionValues;
            self.searchText = ko.computed(function () {
                if (self.input) {
                    return $(self.input).val().substring(0, self.caret()).toUpperCase();
                }
            });
            self.hintText = ko.observable("");
            self.displayText = ko.observable("");
            //remainingOptions contains all non selected options

            self.remainingOptions = ko.observableArray(ko.unwrap(params.optionValues).slice(0)
                .map(function (val) {
                    val.selected = ko.observable(false);
                    val.highlight = ko.observable(false);
                    return val;
                }));

            self.remainingOptions.sort(function (a, b) {
                return (a[self.optionsText] < b[self.optionsText]) ? -1 : (a[self.optionsText] > b[self.optionsText]) ? 1 : 0;
            });
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
            //self.dropheight = ko.observable(0);
            self.dropheight = ko.computed(function () {
                if (!self.dropdownRows()) {
                    return;
                }

                return self.dropdownRows() * self.itemHeight() + "px";
            });
            self.setOptions = function (options) {
                
                self.rows(options.rows ? options.rows : undefined);
                
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
                        self.placeHolder(value);
                        break;
                    case "TYPEAHEAD":
                        self.typeAhead(value);
                        break;
                    case "SHOWSELECTED":
                        self.showSelected = value;
                        break;
                    case "SHOWPILLBOX":
                        self.showPillbox( value);
                        break;
                }
              
            };

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
            };

            self.placeHolder = ko.observable(params.placeHolder ? params.placeHolder : "Choose");

            self.placeHolderVisible = ko.computed(function () {
                return self.selectedOptions().length == 0 || (!self.showPillbox());
            });
            self.extendSelect = function (data, e) {
                if (self.selStart == -1) {
                    self.selStart = self.options.indexOf(data);
                    self.selectItem(data, e);
                } else {
                    var _idx = self.options.indexOf(data);
                    var _st = Math.min(_idx, self.selStart), _end = Math.max(_idx, self.selStart);
                    for (var i = _st; i <= _end; i++) {
                        self.selectItem(self.options()[i], e);
                    }
                }

            }
            self.clearSelections = function () {
                for (var i = 0; i < self.options().length; i++) {
                    if (self.options()[i].selected)
                        self.removeItem(self.options()[i]);
                }
            }
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
                
                if (!data.selected()) {
                   self.selectItem(data,e);

                } else {
                    self.removeItem(data, e);
                }
                self.clearAll();
                swallow(e);
               
             
            }
            self.searchText.subscribe(function (newvalue) {
                if (newvalue.length == 0) {
                    self.lastSingle = '';
                }
            });

            self.filter = function (val) {
                if (!self.inputEnabled) {
                    self.options(self.remainingOptions());
                    return;
                }
                var _options = self.remainingOptions();
                if (self.filtering) return;
                var _search = self.searchText();
                if (_search) {
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
            };

            self.clearHintText = function () {
                self.hintText('');
                var pos = getCaret(self.input);
                var s = $(self.input).val().substring(0, pos);
                $(self.input).val(s);
            };
            self.clearHighlights = function () {
                $.each(self.options(), function (key, val) { val.highlight(false); });
            }
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
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');

                }
                if (e.which == 9) {

                    self.clearAll();
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');
                }
            };

            function handleInputKeyDown(e) {
                console.debug("handleInputKeyDown");
                self.cancelKey = false;
                if (e.keyCode == 40) {
                    self.inKeyBoardMode = true;
                    self.highlightNextItem();
                    return false;
                } else if (e.keyCode == 38) {
                    self.highlightPrevItem();
                    self.cancelKey = true;
                    return false;
                }


                var shift = window.shiftKey ? 256 : 0;
                var _char = CHARS[shift + e.keyCode];
                self.caret(getCaret(e.target));
                var pos = self.caret();

                if (self.options().length == 1) {

                    if (e.which == 13 || e.which == 9) {
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
                if (!self.element.find('.pillbox').hasClass('open')) {
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');

                }
            };
            function closeDropDown() {
                if (self.element.find('.pillbox').hasClass('open')) {
                    self.toggle.trigger('focus');
                    return self.toggle.trigger('click');
                }
            };
            function handleDummyKeyDown(e) {
                console.debug("handleDummyKeyDown");
                if (self.inKeyBoardMode) { return;}
                if (e.keyCode == 40 || e.keyCode == 32) {

                    self.inKeyBoardMode = true;
                    self.suppressKeyUp = true;
                    self.cancelKey = true;
                    openDropDown();
                    self.clearAll();
                    swallow(e);
                    return false;
                }
            }
            function onBodyKeyDown(e){
                console.debug("onBodyKeyDown");
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
            }
            function addFocusClues() {
                    self.inFocus(true);
                 self.element.addClass("focus");
            }
            function removeFocusClues() {
                self.inFocus(false);
                self.element.removeClass("focus");
                self.element.find(".dummy>input").show();
            };
            self.clearPopovers = function () {
            }
            self.showPopOver = function (data, e) {
                $e = $(e.target).closest('li');
                self.element.find(".options li").not($e).popover('hide');
                $e.popover('show');
                if (self.optionsPopOver) {

                }
            }
            self.hoverItem = function (data, e) {
                console.debug('hover ' + e.type);
                self.clearHighlights();
                data.highlight(true);
                self.showPopOver(data, e);
                swallow(e);
           };
           self.onMouseWheel = function (e) {
               $c = self.element.find(".options");
               $e = $c.find('li:first-child');
               var detent = $e.height();
               var max = detent * $c.find('li').length;
               var scrolltop = $c.scrollTop();
               console.debug("deltaMode:" + e.originalEvent.deltaMode);
               console.debug("deltaY:" + e.originalEvent.deltaY);
               console.debug("wheelDeltaY:" + e.originalEvent.wheelDeltaY);
               if (e.originalEvent.deltaY < 0) {
                   scrolltop = Math.max(scrolltop - detent, 0);
               } else {
                   scrolltop = Math.min(scrolltop + detent, max - $c.height());
               }
               console.debug("scrolltop: " + scrolltop);
               $c.scrollTop(scrolltop);
               //$c.animate({
               //    scrollTop: scrolltop
               //}, 100);
               return false;
           }
           self.selectAll = function () {
               $.each(self.options(), function (key, val) {
                   self.selectItem(val);
               })
           };
           self.deselectAll = function () {
               $.each(self.options(), function (key, val) {
                   self.removeItem(val);
               })
           };

           self.init = function () {
               self.element.data('pillbox', self);
                //self.sort(self.options());
                if (self.inputEnabled) {
                    self.element.find(".search>input").on('keydown', handleInputKeyDown)
                        .on('keypress', handleInputKeyPress)
                        .on('keyup', handleInputKeyUp)
                        .on('click', function (e) {
                            swallow(e);
                    });
                }
                if (self.optionsPopOver) {

                    $.each(self.element.find(".options li"), function (key, val) {
                        var d = ko.dataFor(val);
                        $(val).popover({ content: d[optionsPopOver] })
                    });
                }

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
                    var $e = self.element.find('.pillbox');
                    $e.removeClass('dropup');
                   // $('.dummy>input').off('keydown', handleDropDownKeyDown);
                    self.clearAll();
                    self.clearHighlights();
                    self.inKeyBoardMode = false;
                    self.selStart = -1;
                    self.element.find(".dummy>input").focus();
                    //$("body").off('keydown', onBodyKeyDown);

                });
                self.toggle.parent().on('shown.bs.dropdown', function (e) {
                    if (self.dropdownRows()) {
                        var h = $(self.element.find('.options li')[0]).outerHeight();
                        self.itemHeight(h);
                    };
                    self.clearHighlights();
                        $e = $(e.target);
                    if (self.inputEnabled) {
                        $e.find(".search>input")[0].focus();
                    } else {
                       // $e.find(".dummy>input")[0].focus();
                       // $e.find(".dummy>input").on('keydown', handleDropDownKeyDown);
                    }
                    //$("body").on('keydown', onBodyKeyDown);
                });
                self.toggle.parent().on('show.bs.dropdown', function (e) {

                    var $e = self.element.find('.pillbox');
                    $e.removeClass('dropup');
                    var offset = self.element.offset();
                    var scrolltop = $(window).scrollTop();
                    var ddht = self.element.find(".dropdown-menu").outerHeight();
                    var bottom = offset.top + self.element.outerHeight() + ddht;
                    var top = offset.top - ddht;
               
                    if (scrolltop + $(window).height() < bottom && top > scrolltop) {
                        $e.addClass('dropup');
                    }

                });
                if (!self.scrollbar) {
                    self.element.find(".options").addClass("no-scroll")
                }
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