define(['app', 'directives/wx-list'], function (app) {
    app.controller('GridController', ['$scope', '$timeout', function ($scope, $timeout) {
        var gridSize = 15
        $scope.tools = [
            {"icon" : "th-list", "text": "list", "componentName":"wx-list", type: "tool"},
            {"icon" : "picture", "text": "image", type: "tool"},
            {"icon" : "map-marker", "text": "map", "componentName":"map", type: "tool"},
            {"icon" : "th-list", "text": "slider", type: "tool"},
            {"icon" : "text-width", "text": "Title", type: "tool"},
            {"icon" : "calendar", "text": "Calendar", type: "tool"}
        ];
        $scope.rows = []
        $scope.addRow = function(){
            var row = {type:'row', columns: [], isFull: false, isEmpty: true}
            $scope.rows.push(row)
            return row
            //if(componentName) {
            //    console.log(componentName)
            //    $scope.addColumn(row, componentName)
            //}
        }
        $scope.removeRow = function (row){
            //console.log($scope.rows, 'row in remove row')
            $scope.rows.splice($scope.rows.indexOf(row), 1)
            $scope.rows.forEach(function(row) {
                row.columns.forEach(function(col) {
                    col.rowIndex = $scope.rows.indexOf(row);
                })
            })
        }
        $scope.processPosition = function (e, ui){
            if (!$scope.droppableElement) return
            var offsetY = e.clientY - $scope.droppableElement.offset().top
            var offsetX = e.clientX - $scope.droppableElement.offset().left

            var heightpct = (offsetY/$scope.droppableElement.outerHeight()) * 100
            var widthpct = (offsetX/$scope.droppableElement.outerWidth()) * 100

            $scope.highlightBorder(heightpct, widthpct)

        }

        var added = false
        $scope.highlightBorder = function (heightpct, widthpct){
            $scope.droppable.dropPosition = null
            //if(heightpct < 15) {
            //    $scope.droppable.dropPosition = 'top'
            //}
            //else if (heightpct > 85) {
            //    $scope.droppable.dropPosition = 'bottom'
            //
            //}
            if (widthpct < 50 && !added) {
                $scope.droppable.dropPosition = 'left'
                //var row = $scope.rows[$scope.droppable.rowIndex]
                //var columnIndex = row.columns.indexOf($scope.droppable)
                //row.columns.splice(columnIndex, 1, {})
                //updateColumnSize([row])
                //added = true

            }
            else if (widthpct > 50 && !added) {
                $scope.droppable.dropPosition = 'right'
                //var row = $scope.rows[$scope.droppable.rowIndex]
                //var columnIndex = row.columns.indexOf($scope.droppable)
                //row.columns.splice(columnIndex + 1, 1, {})
                //updateColumnSize([row])
                //
                //added = true
            }
        }
        $scope.setDroppable = function (e, ui, $index, column) {
            if($scope.droppable){
                $scope.droppable.dropPosition = null
            }
            $scope.droppableElement = angular.element(e.target)
            $scope.droppable = column
            //console.log($scope.droppable.outerHeight(), $scope.droppable.outerWidth(), $scope.droppable.offset())

        }

        $scope.addColumn = function(row){
            console.log('add column fired')
            row.isEmpty = false;
            var column = {rowIndex: $scope.rows.indexOf(row), type:'column', components:[]}
            row.columns.push(column)
            var columnCount = row.columns.length
            if(columnCount >= gridSize){
                row.isFull = true;
            }
            updateColumnSize([row])
            if ($scope.rows[$scope.rows.length -1].columns.length > 0) $scope.addRow()
            return column
        }

        $scope.removeColumn = function(row, column){
            console.log('remove column fired')
            row.columns.splice(row.columns.indexOf(column), 1)
            var columnCount = row.columns.length
            row.isFull = false
            if(columnCount < 1){
                $scope.removeRow(row)
            }
            else updateColumnSize([row])
        }

        $scope.addComponent = function (column, componentName) {
            var component = {type:'component', name:componentName}
            column.components.push(component)
            return component
        }
        $scope.setDraggable = function (e, ui, index, draggable) {
            $scope.draggable = draggable
            $scope.draggableIndex = index

        }

        $scope.dropComponent = function (e, ui, row, column){
            console.log('drop component fired')
            if ($scope.draggable.type === 'tool') {
                if (!row) {
                    row = $scope.addRow()
                }
                else if (!column){
                    column = $scope.addColumn(row)
                }
                $scope.addComponent(column, ui.draggable.data("component"))
            }
            else if ($scope.draggable.type === 'column'){
                var sourceRow = $scope.rows[$scope.draggable.rowIndex]
                var sourceColumn = sourceRow.columns.splice($scope.draggableIndex,1).pop()
                sourceColumn.rowIndex = $scope.rows.indexOf(row)
                row.columns.push(sourceColumn)
                updateColumnSize([sourceRow, row])
                var columnCount = sourceRow.columns.length
                if(columnCount < 1){
                    $scope.removeRow(sourceRow)
                }
                if ($scope.rows[$scope.rows.length -1].columns.length > 0) $scope.addRow()
            }
            $scope.CleanupDragDrop()
        }

        //function indexOf (obj) {
        //    var idx = -1
        //    switch (obj.type) {
        //        case 'row':
        //            idx = $scope.rows.indexOf(obj)
        //            break
        //        case 'column':
        //            $scope.rows.forEach(function (row) {
        //                if (~row.columns.indexOf(obj)) idx = row.columns.indexOf(obj)
        //            })
        //            break
        //        case 'component':
        //            $scope.rows.forEach(function (row) {
        //                row.columns.forEach(function (column) {
        //                    if (~column.components.indexOf(obj)) idx = column.components.indexOf(obj)
        //                })
        //            })
        //            break
        //        case 'tool':
        //            idx = $scope.tools.indexOf(obj)
        //            break
        //    }
        //    return idx
        //}

        $scope.CleanupDragDrop = function(){
            if($scope.droppable) {
                $scope.droppable.dropPosition = null
            }
            $scope.droppableElement = null

        }
        $scope.onDropRow = function(e,  channel, sourceRowIndex, targetRowIndex) {
            //remove the row being dragged
            var sourceRow = $scope.rows.splice(sourceRowIndex,1)
            //add it to the index of the row it was dropped on
            $scope.rows.splice(targetRowIndex,0,sourceRow[0])

        }
        $scope.onDropColumn = function(e, ui, row, column, targetColumnIndex) {
            var sourceRow = $scope.rows[$scope.draggable.rowIndex]
            var sourceColumn = sourceRow.columns.splice($scope.draggableIndex,1)
            console.log($scope.draggableIndex, 'source col index', targetColumnIndex, 'target column index', column.rowIndex, 'target row index', $scope.draggable.rowIndex, 'source row index')
            var targetRow = $scope.rows[column.rowIndex]
            console.log($scope.droppable.dropPosition)

            switch($scope.droppable.dropPosition) {
                case 'left':
                    targetRow.columns.splice(targetColumnIndex, 0, sourceColumn[0])
                    console.log ('left true')
                    break;
                case 'right':
                    targetRow.columns.splice(targetColumnIndex + 1, 0, sourceColumn[0])
                    console.log('right true')
                    break;
                case 'top':
                    console.log('right true')

                    break;
                case 'bottom':
                    console.log('bottom true')
                    break;
            }
            if ($scope.draggable.rowIndex !== column.rowIndex) {

                console.log($scope.draggable.rowIndex, column.rowIndex, 'update fired')
                updateColumnSize([targetRow, sourceRow])
            }
            var columnCount = sourceRow.columns.length
            if(columnCount < 1){
                $scope.removeRow(sourceRow)
            }
            $scope.draggable.rowIndex = column.rowIndex
            $scope.CleanupDragDrop()
        }
        var updateColumnSize = function(rows) {
            rows.forEach(function(row){
                var columnCount = row.columns.length
                var colSize = (100/columnCount)
                row.columns.forEach(function (col) {
                    col.style = {width: colSize + '%'}
                    col.sizepct = colSize
                })

            })
        }

        var resizeLastXCoord = 0;
        var resizeLeftCol = null;
        var resizeRightCol = null;
        var resizeRightStartWidth = 0;
        var resizeRightStartPct = 0;
        var resizeLeftStartPct = 0;

        $scope.resizeActive = false;
        $scope.startResize = function (e, row, column) {
            //get X coordinate
            resizeLastXCoord = e.clientX;

            //grab left/right column data object
            resizeRightCol = column;
            resizeLeftCol = row.columns[row.columns.indexOf(column) - 1];

            //grab left and right column element
            var rightColEl = angular.element(e.target).parent();
            var leftColEl = rightColEl.prev();

            //grab width of of each column
            var rightColSize = Math.floor(rightColEl.outerWidth()) - 1
            var leftColSize = Math.floor(leftColEl.outerWidth());

            resizeRightStartPct = parseFloat(resizeRightCol.style.width)
            resizeLeftStartPct = parseFloat(resizeLeftCol.style.width)

            resizeRightStartWidth = rightColSize;

            //set width attribute on each column
            resizeRightCol.style = { width: rightColSize };
            resizeLeftCol.style = { width: leftColSize };

            //show resize cursor for entire row
            row.style = { cursor: 'ew-resize' };

            //flag active resize eent
            $scope.resizeActive = true;
        }
        $scope.processResize = function (e) {
            //if resizing has ended, return
            if (!$scope.resizeActive) return;

            //grab current x coordinate, subtract starting x coordinate
            var diff = e.clientX - resizeLastXCoord;

            //update current position
            resizeLastXCoord = e.clientX;

            //grab the final width setting on column
            var newWidth = resizeRightCol.style.width - diff;

            //grab the original width of column
            var oldWidth = resizeRightStartWidth;

            //limit how large a column can be dragged based on width of right and left column
            var maxLeftWidth = resizeLeftStartPct + (resizeRightStartPct - 1);
            var maxRightWidth = resizeRightStartPct + (resizeLeftStartPct - 1);
            var minRightWidth = 1
            var minLeftWidth = 1

            var widthChange = newWidth - oldWidth;
            //var pctChange = Math.abs(widthChange) / oldWidth;
            var pctChange = widthChange / oldWidth;

            var newRightWidth = resizeRightStartPct + (pctChange*resizeRightStartPct)
            var newLeftWidth = resizeLeftStartPct - (pctChange*resizeRightStartPct)

            //when min/max resize is met, cancel further resizing
            if (newRightWidth > maxRightWidth || newLeftWidth > maxLeftWidth) return

            newRightWidth += (resizeLeftStartPct + resizeRightStartPct) - (newLeftWidth + newRightWidth)

            resizeRightCol.sizepct = newRightWidth
            resizeLeftCol.sizepct = newLeftWidth

            //update width attributes of column
            resizeRightCol.style.width -= diff;
            resizeLeftCol.style.width += diff;
        }

        $scope.endResize = function (e, row) {

            if(!$scope.resizeActive) return
            resizeRightCol.style.width = resizeRightCol.sizepct + '%'
            resizeLeftCol.style.width = resizeLeftCol.sizepct + '%'

            //clear all values, disable resize session
            delete row.style.cursor;
            $scope.resizeActive = false;
        }
        var cancelTimer;
        $scope.abortResize = function (e, row) {
            if (!$scope.resizeActive) return;
            resizeRightCol.style.width = resizeRightStartPct +'%';
            resizeLeftCol.style.width = resizeLeftStartPct + '%';
            if (row.style) delete row.style.cursor;
            $scope.resizeActive = false;
        }
        $scope.startResizeAbort = function(e, row){
            cancelTimer = $timeout(function(){
                $scope.abortResize(e, row)
            }, 250)
        }
        $scope.interceptResizeAbort = function(e, row){
            $timeout.cancel(cancelTimer)
        }

        $scope.addRow();
    }]);
});