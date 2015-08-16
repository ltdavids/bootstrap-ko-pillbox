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
// Polyfills
(function () {
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };
    }
})();
(function () {
    ko.components.register('timeline-widget', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                $elem = $(componentInfo.element);

                function vm(params) {
                    var self = this;
                    // Data: value is either null, 'like', or 'dislike'
                    self.StartDate = params.StartDate;
                    self.EndDate = params.EndDate;
                    var start = moment(self.StartDate), end = moment(params.EndDate);
                    //var today = moment(new Date("03/01/2015"));
                    var today = moment(new Date());
                    var min = moment.min(today, start).startOf('month');
                    var max = moment.max(today, end).endOf('month');
                    var leadrange = Math.abs(min.diff(start));
                    var tailrange = Math.abs(max.diff(end));
                    var range = Math.abs(min.diff(max));
                    var monthrange = Math.abs(min.diff(max, 'months'));
                    self.todayLeft = (moment(today).diff(min) / range) * 100 + '%';
                    self.prjStart = (moment(start).diff(min) / range) * 100 + '%';
                    self.prjWidth = (moment(end).diff(start) / range) * 100 + '%';
                    self.monthMarkers = ko.observableArray();
                    self.markers = params.Markers.map(function (val) {
                        return {
                            date: val.DueDate,
                            StatusCssClass: val.StatusCssClass,
                            left: ko.computed(function () {
                                var offset = moment(val.DueDate).diff(min);
                                return (offset / range * 100) + '%';
                            })
                        }
                    });
                    var mm=[]
                    for (var i = 1; i < monthrange; ++i) {
                        var sm = moment(min).add(i, 'months').startOf('month');
                        var pos = (moment(sm).diff(min) / range) * 100 + '%';
                        mm.push({ label: moment(sm).format("M"), left: pos });
                    }
                    self.monthMarkers(mm);

                    // Behaviors
                };
                return new vm(params);
            }
        },
            template: { require: 'text!../timeline-widget.html' }

    });
})();
    (function () {

        var toMoney = function (num) {
            return '$' + (num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
        };

        var handler = function (element, valueAccessor, allBindings) {
            var $el = $(element);
            var method;

            // Gives us the real value if it is a computed observable or not
            var valueUnwrapped = ko.unwrap(valueAccessor());

            if ($el.is(':input')) {
                method = 'val';
            } else {
                method = 'text';
            }
            return $el[method](toMoney(valueUnwrapped));
        };

        ko.bindingHandlers.money = {
            update: handler
        };
    })();

    (function () {

        var toComma = function (num) {
            return  (num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
        };

        var handler = function (element, valueAccessor, allBindings) {
            var $el = $(element);
            var method;

            // Gives us the real value if it is a computed observable or not
            var valueUnwrapped = ko.unwrap(valueAccessor());

            if ($el.is(':input')) {
                method = 'val';
            } else {
                method = 'text';
            }
            return $el[method](toComma(valueUnwrapped));
        };

        ko.bindingHandlers.comma = {
          
            update: handler
        };
    })();

    (function () {

        var toPercent = function (num, decimals) {
            if (!decimals) {
            return  ((num*100).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')) + "%";

            }
            return  ((num*100).toFixed(decimals).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')) + "%";
        };

        var handler = function (element, valueAccessor, allBindings) {
            var $el = $(element);
            var method;
            var decimals = allBindings().decimals || 0;
            // Gives us the real value if it is a computed observable or not
            var valueUnwrapped = ko.unwrap(valueAccessor());

            if ($el.is(':input')) {
                method = 'val';
            } else {
                method = 'text';
            }
            return $el[method](toPercent(valueUnwrapped, decimals));
        };

        ko.bindingHandlers.percent = {
            update: handler
        };
    })();

    (function () {
        var handler = function (element, valueAccessor, allBindings) {
            var $el = $(element);
            var method, rslt, dt;

            // Gives us the real value if it is a computed observable or not
            var valueUnwrapped = ko.unwrap(valueAccessor());
            if (moment.isMoment(valueUnwrapped)) {
                dt = valueUnwrapped.local();
            } else {

                dt = moment(valueUnwrapped);
            }
            if ($el.is(':input')) {
                method = 'val';
                rslt = $el['val'](dt.isValid() ? dt.format('YYYY-MM-DD') : valueUnwrapped);
            } else {
                method = 'text';
                rslt = $el['text'](dt.isValid() ? dt.format('MM/DD/YYYY') : valueUnwrapped);
            }
            return rslt;
        };

        ko.bindingHandlers.shortDate = {
            update: handler
        };
    })();

    ko.bindingHandlers.htmlUpdate = {
        init: function  (element, valueAccessor, allBindingsAccessor){
            var value = ko.unwrap(valueAccessor());
            var $el = $(element);

            return $el["text"](value);
        },
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            if (!element.isContentEditable) {
                element.innerHTML = value;
            }
        }
    };

    ko.bindingHandlers.contentEditable = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.unwrap(valueAccessor()),
                htmlUpdate = allBindingsAccessor().htmlUpdate;

            $(element).on("input", function () {
                if (this.isContentEditable && ko.isWriteableObservable(htmlUpdate)) {
                    htmlUpdate(this.innerHTML);
                }
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());

            element.contentEditable = value;

            if (!element.isContentEditable) {
                $(element).trigger("input");
            }
        }
    };

    ko.bindingHandlers.runAfterForEach = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor();
            setTimeout(function (element, value) {
                if (typeof value != 'function' || ko.isObservable(value))
                    throw 'run must be used with a function';

                value(element);
            }, 0, element, value);
        }
    };

    ko.bindingHandlers['file'] = {
        init: function (element, valueAccessor, allBindings) {
            var fileContents, fileName, allowed, prohibited, reader;

            if ((typeof valueAccessor()) === "function") {
                fileContents = valueAccessor();
            } else {
                fileContents = valueAccessor()['data'];
                fileName = valueAccessor()['name'];

                allowed = valueAccessor()['allowed'];
                if ((typeof allowed) === 'string') {
                    allowed = [allowed];
                }

                prohibited = valueAccessor()['prohibited'];
                if ((typeof prohibited) === 'string') {
                    prohibited = [prohibited];
                }

                reader = (valueAccessor()['reader']);
            }

            reader || (reader = new FileReader());
            reader.onloadend = function () {
                fileContents(reader.result);
            }

            var handler = function () {
                var file = element.files[0];

                // Opening the file picker then canceling will trigger a 'change'
                // event without actually picking a file.
                if (file === undefined) {
                    fileContents(null)
                    return;
                }

                if (allowed) {
                    if (!allowed.some(function (type) { return type === file.type })) {
                        console.log("File " + file.name + " is not an allowed type, ignoring.")
                        fileContents(null)
                        return;
                    }
                }

                if (prohibited) {
                    if (prohibited.some(function (type) { return type === file.type })) {
                        console.log("File " + file.name + " is a prohibited type, ignoring.")
                        fileContents(null)
                        return;
                    }
                }

                reader.readAsDataURL(file); // A callback (above) will set fileContents
                if (typeof fileName === "function") {
                    fileName(file.name)
                }
            }

            ko.utils.registerEventHandler(element, 'change', handler);
        }
    };

    //ko.extenders.onChange = function (target, callback) {

    //        target.isDirty = ko.observable(false);
    //        target.onValueChangedCallback = callback;
    //        function validate(newValue) {
    //            target.onValueChangedCallback(newValue);
    //        }
    //        target.subscribe(validate);

    //    return target;
    //};
    ko.extenders.trackChangeExt1 = function (target, options) {
        // options = {notifyObservable:  <Form Level Observable> , externalCompare: external compare function };
        target.isDirty = ko.observable(false);
        target.originalValue = target();
        if (target.subscription) {
            target.subscription.dispose();
        }
        target.subscribe(
            function (newValue) {
                var rslt = false;
                if (options.externalCompare) {
                    rslt = options.externalCompare(newValue, target.originalValue);
                } else {

                    rslt = (newValue != target.originalValue);
                }
                target.isDirty(rslt);
                if (options.notifyObservable) {
                    options.notifyObservable.valueHasMutated();
                }
                // use != not !== so numbers will equate naturally
            }
         );

        return target;
    };


    ko.extenders.trackChangeExt = function (target, func) {

        target.isDirty = ko.observable(false);
        target.originalValue = target();
        target.subscribe(function (newValue) {
            target.isDirty(func(newValue, target.originalValue));
            // use != not !== so numbers will equate naturally

        });

        return target;
    };

    ko.extenders.trackChange = function (target, track) {
        if (track) {
            target.isDirty = ko.observable(false);
            target.originalValue = target();
            target.subscribe(function (newValue) {
                // use != not !== so numbers will equate naturally
                target.isDirty(newValue != target.originalValue);
            });
        }
        return target;
    };

    ko.extenders.validateRequired = function (target, overrideMessage) {
        //add some sub-observables to our observable
        target.isValid = ko.observable();
        target.validationMessage = ko.observable();

        //define a function to do validation
        function validate(newValue) {
            target.isValid(newValue ? true : false);
            target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
        }

        //initial validation
        validate(target());
        //validate whenever the value changes
        target.subscribe(validate);

        //return the original observable
        return target;
    };

    ko.extenders.brokenRule = function (target, options) {
        //add some sub-observables to our observable
        var messages = [];
        if (!target.isValid) {
            target.isValid = ko.observable();
        }
        if (!target.brokenRules) {
            target.brokenRules = ko.observableArray();
        }
        // add an array for all rule functions and add this one;
        if (!target.rules) {
            target.rules = [];
        }
        target.rules.push(options.func);

        //define a function to do validation
        function validate(newValue) {
            target.brokenRules.removeAll();
            for (i = 0; i < target.rules.length; ++i) {
                var msg = target.rules[i](target);
                if (msg) {
                    target.brokenRules.push({ text: msg });
                }
            }

            target.isValid(target.brokenRules().length === 0);


        }
        function notify(newValue) {
            if (options.notifyObservable) {
                options.notifyObservable(target);
                //}
            }
        }

        target.validate = validate;
        //initial validation
        validate(target());

        //remove any existing subscription so we 
        //have only a single subscription for all rules
        if (target.subscription) {
            target.subscription.dispose();
        }

        //validate whenever the value changes
        target.subscribe(notify);

        //return the original observable
        return target;
    };

    requiredRule = function (fieldName, notifyObservable) {
        return {
            func: function (target) {
                return (target() ? "" : fieldName + " is required");
            },
            notifyObservable: notifyObservable
        }
    };

    ko.extenders.Validate = function (target, isValidated) {
        //add some sub-observables to our observable
        if (!target.isValid) {
            target.isValid = ko.observable();
        }

    };

    ko.bindingHandlers.Loading = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor(), allBindings = allBindingsAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);

            if (valueUnwrapped == true)
                $(element).show(); // Make the element visible
            else
                $(element).hide();   // Make the element invisible
        }
    };

    ko.onDemandObservable = function (callback, target) {
        var _value = ko.observable();  //private observable

        var result = ko.dependentObservable({
            read: function () {
                //if it has not been loaded, execute the supplied function
                if (!result.loaded()) {
                    callback.call(target);
                }
                //always return the current value
                return _value();
            },
            write: function (newValue) {
                //indicate that the value is now loaded and set it
                result.loaded(true);
                _value(newValue);
            },
            deferEvaluation: true  //do not evaluate immediately when created
        });

        //expose the current state, which can be bound against
        result.loaded = ko.observable();
        //load it again
        result.refresh = function () {
            result.loaded(false);
        };

        return result;
    };
