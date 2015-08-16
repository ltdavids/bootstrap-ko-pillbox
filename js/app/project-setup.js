(function () {

    ko.components.register('pillbox', {

        viewModel: { require: 'app/pillbox' },
        template: { require: 'text!../../pill-box.html' }

    });
})();

function projectSetUpVm(data) {

    var instance = this;
 

    instance.ExpenseType = ko.observable();
    instance.SelectedExpenseTypes = ko.observableArray();
    instance.ExpenseTypes = ko.observableArray([{ id:1, text: "Advance" },
                                { id: 2, text: "Airfare" },
                                { id: 11, text: "Taxi/Shuttle" },
                                { id: 9, text: "Mileage" },
                                { id: 12, text: "Rental Car" },
                                { id: 10, text: "Hotel" },
                                { id:3 ,  text: "Meals" },
                                { id:4 ,  text: "Postage/Shipping" },
                                { id:5 ,  text: "Seminar/Conference Registration" },
                                { id:6 ,  text: "Supplies/ Materials" },
                                { id:7 ,  text: "Online Fees" },
                                { id:8 ,  text: "Copying/Printing" }
    ]);

    
    instance.SelectedWorkItemClasses = ko.observableArray();
    instance.WorkItemClasses = ko.observableArray([{ id: 1, text: "Class1", description:"This is a shprt description of the class" },
                              { id: 2, text: "Class2", description: "This is a shprt description of the class" },
                              { id: 11, text: "Class3", description: "This is a shprt description of the class" },
                              { id: 9, text: "Mileage", description: "This is a shprt description of the class" },
                              { id: 12, text: "Rental Car", description: "This is a shprt description of the class" },
                              { id: 10, text: "Hotel", description: "This is a shprt description of the class" },
                              { id: 3, text: "Meals", description: "This is a shprt description of the class" },
                              { id: 4, text: "Postage/Shipping", description: "This is a shprt description of the class" },
                              { id: 5, text: "Seminar", description: "This is a shprt description of the class" },
                              { id: 6, text: "Supplies/ Materials", description: "This is a shprt description of the class" },
                              { id: 7, text: "Online Fees", description: "This is a shprt description of the class" },
                              { id: 8, text: "Copying/Printing", description: "This is a shprt description of the class" }
    ]);
};
