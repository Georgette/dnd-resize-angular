define(['app'], function (app) {
    app.directive('attrToggle', function () {
        return {
            link: function ($scope, $element, $attrs) {
                $scope.$watch(
                    function () {
                        return $element.attr('attr-toggle');
                    },
                    function (newVal) {
                        var attr = $element.attr('data-attr-name');

                        if (!eval(newVal)) {
                            $element.removeAttr(attr);
                        }
                        else {
                            $element.attr(attr, true);
                        }
                    }
                );
            }
        };
    });
});