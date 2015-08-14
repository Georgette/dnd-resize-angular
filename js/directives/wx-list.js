define(['app'], function (app) {
    app.directive('wxList', function () {
        return {
            //this directive will be an angular element, tied to the page template
            restrict: 'EC',
            scope: {
                config:'='
            },
            link: function(scope, el, attrs){
                //console.log(scope, attrs)
            },
            controller: function($scope) {
                if(!$scope.config) {
                    $scope.config = {
                        title: 'Table Title',
                        massaction: 'true',
                        labels: [{title: 'column1'}, {title: 'column2'}, {title: 'column3'}],
                        records: [
                            {columns: [{coldata: 'column1 row1 data'}, {coldata: 'column2 row1 data'}, {coldata: 'column3 row1 data'}]},
                            {columns: [{coldata: 'column1 row2 data'}, {coldata: 'column2 row2 data'}, {coldata: 'column3 row2 data'}]},
                            {columns: [{coldata: 'column1 row3 data'}, {coldata: 'column2 row3 data'}, {coldata: 'column3 row3 data'}]}
                        ]
                    }
                }
            },
            templateUrl: 'js/directives/wx-list.html'
        }
    });
});