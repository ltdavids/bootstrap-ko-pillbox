requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',
        jqueryui: '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
        knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min',
        bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min',
        moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min',
        text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'
    }
});

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

function projectSetUpVm(data) {

    var instance = this;

    instance.SelectedMovies = ko.observableArray();
    instance.Movies = [{
        id: 1, text: "Spiderman 2", description: "This is a short description of the movie", img: "images/movie1.jpg", cast: "Tobey Maguire, Kirsten Dunst, James Franco",
        director: "Sam Raimi", rating: 7.3, year: 2004
    },
                              {
                                  id: 2, text: "The Hunger Games Catching Fire", description: "Katniss Everdeen and Peeta Mellark become targets of the Capitol after their victory in the 74th Hunger Games sparks a rebellion in the Districts of Panem.", img: "images/movie6.jpg", cast: "Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth",
                                  director: "Francis Lawrence", rating: 7.7, year: 2013
                              },
                              {
                                  id: 11, text: "The Hunger Games",
                                  description: "Katniss Everdeen voluntarily takes her younger sister's place in the Hunger Games, a televised fight to the death in which two teenagers from each of the twelve Districts of Panem are chosen at random to compete.", img: "images/movie4.jpg", cast: "Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth ",
                                  director: "Gary Ross", rating: 7.3, year: 2012
                              },
                              {
                                  id: 9, text: "Iron Man", description: "After being held captive in an Afghan cave, an industrialist creates a unique weaponized suit of armor to fight evil.", img: "images/movie5.jpg", cast: "Robert Downey Jr., Gwyneth Paltrow, Terrence Howard ",
                                  director: "Jon Favreau", rating: 7.9, year: 2008
                              },
                              {
                                  id: 12, text: "The Matrix", description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", img: "images/movie7.jpg", cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
                                  director: "The Wachowski Brothers", rating: 8.7, year: 1999
                              },
                              {
                                  id: 10, text: "Hancock", description: "Hancock is a superhero whose ill considered behavior regularly causes damage in the millions. He changes when one person he saves helps him improve his public image.", img: "images/movie8.jpg", cast: "Will Smith, Charlize Theron, Jason Bateman",
                                  director: "Peter Berg", rating: 6.4, year: 2008
                              },
                              {
                                  id: 3, text: "Man of Steel", description: "Clark Kent, one of the last of an extinguished race disguised as an unremarkable human, is forced to reveal his identity when Earth is invaded by an army of survivors who threaten to bring the planet to the brink of destruction.", img: "images/movie9.jpg", cast: " Henry Cavill, Amy Adams, Michael Shannon",
                                  director: "Zack Snyder", rating: 7.2, year: 2013
                              },
                              {
                                  id: 4, text: "The Mummy Returns", description: "The mummified body of Imhotep is shipped to a museum in London, where he once again wakes and begins his campaign of rage and terror.", img: "images/movie10.jpg", cast: "Brendan Fraser, Rachel Weisz, John Hannah",
                                  director: "Stephen Sommers", rating: 6.3, year: 2001
                              },
                              {
                                  id: 5, text: "X-Men Origins: Wolverine", description: "A look at Wolverine's early life, in particular his time with the government squad Team X and the impact it will have on his later years.", img: "images/movie11.jpg", cast: "Kathleen Barr, Michael Dobson, Brian Drummond",
                                  director: "Gavin Hood", rating: 6.7, year: 2009
                              },
                              {
                                  id: 6, text: "The Last Samuri", description: "An American military advisor embraces the Samurai culture he was hired to destroy after he is captured in battle.", img: "images/movie12.jpg", cast: "Tom Cruise, Ken Watanabe, Billy Connolly",
                                  director: "Edward Zwick", rating: 7.7, year: 2003
                              },
                              {
                                  id: 7, text: "Lord of the Rings: The Fellowship of the Ring", description: "A meek hobbit of the Shire and eight companions set out on a journey to Mount Doom to destroy the One Ring and the dark lord Sauron.", img: "images/movie13.jpg", cast: "Elijah Wood, Ian McKellen, Orlando Bloom",
                                  director: "Peter Jackson", rating: 8.8, year: 2001
                              },
                              {
                                  id: 8, text: "Gravity", description: "A medical engineer and an astronaut work together to survive after a catastrophe destroys their shuttle and leaves them adrift in orbit.", img: "images/movie14.jpg", cast: "Sandra Bullock, George Clooney, Ed Harris",
                                  director: "Alfonso Cuarón", rating: 7.9, year: 2013
                              }
    ];

    instance.setRows = function (data, e) {
        $e = $(e.target);
        var v = $e.text();
        var pb = $e.closest('.sample').find('pillbox').data('pillbox');

        pb.option('rows', v);
    };

    instance.setHeight = function (data, e) {
        $e = $(e.target);
        var v = $e.text();
        var pb = $e.closest('.sample').find('pillbox').data('pillbox');
        pb.option('dropdownRows', v);

    };

    instance.selectAll = function (data, e) {
        var obj = $('#pb6').data('pillbox');
        obj.selectAll();
    };

    instance.deselectAll = function (data, e) {
        var obj = $('#pb6').data('pillbox');
        obj.deselectAll();
    };
    instance.setOptionTemplate = function () {
        var obj = $('#pb2').data('pillbox');
        obj.optionTemplate = '';

    }
    instance.template = function () {
        var rslt = '<div class="row" style="width:285px;">' +
            '<div class="col-xs-4"> <img data-bind="attr:{src:img}" style="width:100%;" /></div>' +
            '<div class="col-xs-8" style="padding-left:0">' +
                '<div data-bind=" text:text" style="font-weight:bold"></div>' +
                '<div class="cast" style="color:#000;font-size:11px; line-height:11px" data-bind="text:cast"></div>' +
                '<div class="item-description" style="color:#808080;font-size:10px; line-height:9px; margin-top:8px;" data-bind="text:description"></div>' +
            '</div>' +
        '</div>';
        return rslt;
    }
    instance.visible = ko.observable(false);
    instance.ownerBoxVisible = ko.observable(false);
};
function param(name, value) {
    var self = this;
    self.name = name;
    self.value = value;
    self.visible = ko.observable();
    self.html = ko.computed(function () {
        var rslt = "";
        '</span><span id="pillboxRows" class="param" data-bind="visible:pillboxRowsSet" style="display:none"><br />        <span class="param-text">pillboxRows:<span class="hljs-tag" data-bind="text:pillboxHeight"></span>,</span></span>'
    });
};


function paramvm() {
    var self = this;
    self.params = ko.observableArray();
    self.html = ko.computed(function () {
        var rslt = "";

    });
};
require(["moment"], function (moment) {

    window.moment = moment;
    require(["knockout", "jquery"
    ], function (ko, $) {
        window.ko = ko;
        window.$ = jQuery;
        require([
    "bootstrap", "jqueryui"], function () {



        ko.components.register('pillbox', {
            viewModel: { require: 'pillbox' },
            template: { require: 'text!../../src/pillbox.html' }

        });
        function v() {
            var self = this;
            self.dropdownRowsSet = ko.observable(true);
            self.pillboxRowsSet = ko.observable(true);
            self.popoverSet = ko.observable(true);
            self.dropdownHeight = ko.observable(4);
            self.pillboxHeight = ko.observable(3);
            self.typeAheadSet = ko.observable(true);
            self.hidePillBoxSet = ko.observable(false);
            self.scrollbarSet = ko.observable(true);
            self.showSelectedSet = ko.observable(true);
            self.vm1 = new projectSetUpVm();
            self.vm2 = new projectSetUpVm();
            self.params = ko.observableArray();
            self.allparams = [];
            self.allparams["typeAhead"] = new param("typeAhead", true);
            self.allparams["showSelected"] = new param("showSelected", true);
            self.allparams["optionTemplate"] = new param("optionTemplate", "'class-template'");
            self.allparams["dropdownRows"] = new param("dropdownRows", 4);
            self.allparams["pillboxRows"] = new param("pillboxRows", 3);
            self.allparams["popover"] = new param("popover", '{ template: \'popover-template\' }');
            self.allparams["scrollbar"] = new param("scrollbar", false);
            self.allparams["hidePillBox"] = new param("hidePillBox", true);
            self.params.push(self.allparams["typeAhead"]);
            self.params.push(self.allparams["showSelected"]);
            self.params.push(self.allparams["optionTemplate"]);
            self.params.push(self.allparams["dropdownRows"]);
            self.params.push(self.allparams["pillboxRows"]);
            self.params.push(self.allparams["popover"]);
            self.params.push(self.allparams["scrollbar"]);
            //self.params.push(self.allparams["hidePillBox"]);
            self.resetparam = function (name,value) {
                if (value) {
                    self.params.push(self.allparams[name]);
                } else {
                    self.params.remove(self.allparams[name]);
                }
            }
            self.pillboxHeight.subscribe(function () {
         
                self.pillboxRowsSet(self.pillboxHeight() > 0);

                self.setPillboxRows();

            });
            self.dropdownHeight.subscribe(function () {
                self.dropdownRowsSet(self.dropdownHeight() > 0);
                self.setRows();
            });

            self.showTemplate = function (data, e) {
                if (self.vm1.visible()) {
                    self.vm1.visible(false);
                    self.vm2.visible(true);

                } else {
                    self.vm1.visible(true);
                    self.vm2.visible(false);
                }
                self.resetparam("optionTemplate", self.vm2.visible());
                if (self.vm2.visible()) {

                    highlightProperty("optionTemplate");
                }

            };

            self.comma = function (data) {
                var i = self.params.indexOf(data);
                if (i < self.params().length - 1)
                    return ",";

            };

            self.toggleDropdownHeight = function (data, e) {
              
                self.dropdownRowsSet(!self.dropdownRowsSet());
                self.resetparam("dropdownRows", self.dropdownRowsSet());
                self.setRows();
                if (self.dropdownRowsSet()) {

                    highlightProperty("dropdownRows");
                }
            };
            var prevanimation = '';
            function highlightProperty(id) {
                
             
                    $("#" + id).addClass("syntax-change");
                return;
                if (prevanimation) {
                    //$("#" + prevanimation).addClass()
                    $("#" + prevanimation).clearQueue("fx").finish(true,true);
                    $("#" + prevanimation).removeClass("syntax-change");
                }
                    prevanimation = id;
                    for (i = 0; i < 1; ++i) {
                        $("#" + id).addClass("syntax-change", 200, "linear")
                        .removeClass("syntax-change", 1000, "linear")
                }

              
            }
            self.togglePillboxHeight = function (data, e) {
             
                self.pillboxRowsSet(!self.pillboxRowsSet());
                self.resetparam("pillboxRows", self.pillboxRowsSet());
                self.setPillboxRows();
                if (self.pillboxRowsSet())
                highlightProperty("pillboxRows");
            };
            self.setRows = function (data, e) {
                $('#pb1').data('pillbox').option('dropdownRows', self.dropdownRowsSet() ? self.dropdownHeight():0);
                $('#pb2').data('pillbox').option('dropdownRows', self.dropdownRowsSet() ? self.dropdownHeight():0);
               // self.dropdownRowsSet(!self.dropdownRowsSet());
            };

            self.setPillboxRows = function (data, e) {
                $('#pb1').data('pillbox').option('pillBoxRows', self.pillboxRowsSet() ? self.pillboxHeight(): 0  );
                $('#pb2').data('pillbox').option('pillBoxRows', self.pillboxRowsSet() ? self.pillboxHeight() : 0);
               // self.pillboxRowsSet(!self.pillboxRowsSet());
            };
            self.setTypeAhead = function (data, e) {
                $('#pb1').data('pillbox').option('typeahead', !$('#pb1').data('pillbox').option('typeahead'));
                $('#pb2').data('pillbox').option('typeahead', !$('#pb2').data('pillbox').option('typeahead'));
                self.typeAheadSet(!self.typeAheadSet());
                self.resetparam("typeAhead", self.typeAheadSet());
                if(self.typeAheadSet())
                    highlightProperty("typeAhead");

            };

            self.setHidePillbox = function (data, e) {
                $('#pb1').data('pillbox').option('showpillbox', !$('#pb1').data('pillbox').option('showpillbox'));
                $('#pb2').data('pillbox').option('showpillbox', !$('#pb2').data('pillbox').option('showpillbox'));

                self.hidePillBoxSet(!self.hidePillBoxSet());
                self.resetparam("hidePillBox", self.hidePillBoxSet());
                self.vm1.ownerBoxVisible(self.hidePillBoxSet());
                self.vm2.ownerBoxVisible(self.hidePillBoxSet());

                if (self.hidePillBoxSet())
                    highlightProperty("hidePillBox");
            };


            self.setScrollbar = function (data, e) {
                $('#pb1').data('pillbox').option('scrollbar', !$('#pb1').data('pillbox').option('scrollbar'));
                $('#pb2').data('pillbox').option('scrollbar', !$('#pb2').data('pillbox').option('scrollbar'));
                self.scrollbarSet(!self.scrollbarSet());
                self.resetparam("scrollbar", self.scrollbarSet());
                if (self.scrollbarSet())
                    highlightProperty("scrollbar");
            };

            self.setShowSelected = function (data, e) {
                $('#pb1').data('pillbox').deselectAll();
                $('#pb2').data('pillbox').deselectAll();
                $('#pb1').data('pillbox').option('showSelected', !$('#pb1').data('pillbox').option('showSelected'));
                $('#pb2').data('pillbox').option('showSelected', !$('#pb2').data('pillbox').option('showSelected'));
                self.showSelectedSet(!self.showSelectedSet());
                self.resetparam("showSelected", self.showSelectedSet());
                if (self.showSelectedSet())
                    highlightProperty("showSelected");
            };
            self.setPopoverTemplate = function () {
                $('#pb1').data('pillbox').option('popover', self.popoverSet() ? '' : {
                    template: 'popover-template'
                });
                $('#pb2').data('pillbox').option('popover', self.popoverSet() ? '' : {
                    template: 'popover-template'
                });
                self.popoverSet(!self.popoverSet());
                self.resetparam("popover", self.popoverSet());
                if (self.popoverSet())
                    highlightProperty("popover");

            };
            self.deselectAll = function () {
                $('#pb1').data('pillbox').deselectAll();
                $('#pb2').data('pillbox').deselectAll();

            };
            self.selectAll = function () {
                $('#pb1').data('pillbox').selectAll();
                $('#pb2').data('pillbox').selectAll();

            };
            $('#pillbox-options .btn').hover(function (e) {
                $e = $(e.target);
                var b = $e.closest('.btn')[0];
                nm = $e.closest('.btn').attr('data-option-name')  ;
                if (e.type === "mouseenter") {
                    $("#" + nm).addClass("syntax-change");
                } else {
                    $("#" + nm).removeClass("syntax-change");

                }
                swallow(e);
            });

            $(".input-group-addon").hover(function (e) {
                $e = $(e.target).closest('.input-group');
                if (e.type === 'mouseleave') 

                $e.removeClass('hover');
                 else
                $e.addClass('hover');
            });
            self.vm2.visible(true);
        }
        var obj = new v();
        ko.applyBindings(obj);

    });
    })
})
