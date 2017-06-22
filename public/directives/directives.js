// Double click directive (mobile and desktop)
ydyApp.directive('mobileDblclick',
    function () {

        const DblClickInterval = 300; //milliseconds

        var firstClickTime;
        var waitingSecondClick = false;

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('touchstart click', function (e) {
                    console.log('touching');

                    if (!waitingSecondClick) {
                        firstClickTime = (new Date()).getTime();
                        waitingSecondClick = true;

                        setTimeout(function () {
                            waitingSecondClick = false;
                        }, DblClickInterval);
                    }
                    else {
                        waitingSecondClick = false;

                        var time = (new Date()).getTime();
                        if (time - firstClickTime < DblClickInterval) {
                            scope.$apply(attrs.mobileDblclick);
                        }
                    }
                });
            }
        };
    });