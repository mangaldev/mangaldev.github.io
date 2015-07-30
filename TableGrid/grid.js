-
var grid = function(data, element, options) {
    var self = this;
    if (!Array.isArray(data)) {
        return new TypeError('Array is required to bind grid')
    }

    //this is default options for thr grid
    var defaultOptions = {
            headerCellClass: 'grid-header-cell',
            headeClass: 'grid-header',
            rowClass: 'grid-row',
            cellClass: 'grid-cell',
            footerClass: 'grid-footer',
            conatinerClass: 'container',
            gridClass: 'grid',
            pageNumber: 1,
            pageSize: 3,
            isPaging: true,
            formatting: {},
            sortBy: 'paymentId',
            sortOrder: true,
            filters: [],
            filterBy: null,
            filterText: '',
            sorting: [],
            totalPages: function() {
                return Math.ceil(data.length / this.pageSize)
            }
        }
        // we have created this to use in filters, so that we can get orignal data back
    var dataBackup = data.slice()
        // extending the option with default options
    options = options ? util.extend(defaultOptions, options) : defaultOptions;
    var rows = []; //will have collection of rows
    var columns = [] // will have collection of columns
        //this function will give us the wodth of columns
    var columnWidth = function() {
            return (100 / (columns.length + 1)) + '%';
        }
        // this method will initialize grid
    function init() {
            columns = getColumns()
            if (columns.length == 0) {
                throw new TypeError('there are no columns')
            }
            bindData()
        }
        //this will return data  after all filters and sorting
    function getFinalData() {
            var finalData = {}
            finalData = paginatedData()
            return finalData;
        }
        // this function will return the data in its privitive form, we havent test for boolean as it was not required here
    function typedData(val) {
            // check if val is number
            if (!isNaN(val)) {
                return Number(val)
            }
            //check if val is date
            if (util.isDate(val)) {
                return new Date(val)
            }
            return val;
        }
        // this function will sort the data 
    function sortData() {
            if (!options.sortBy || !options.sortOrder) {
                return
            }
            // function to compare data
            function compare(a, b) {
                if (typedData(a[options.sortBy]) < typedData(b[options.sortBy])) {
                    return -1;
                }
                if (typedData(a[options.sortBy]) > typedData(b[options.sortBy])) {
                    return 1;
                }
                return 0;
            }
            data = data.sort(compare)
        }
        // returns all column of object
    function getColumns() {
            return Object.getOwnPropertyNames(data[0])
        }
        // this function renders grid
    function bindData() {
            element.innerHTML = '';
            filteData()
            sortData()
            element.appendChild(renderGrid())
            if (options.filterBy) {
                document.getElementById(options.filterBy).focus();
                document.getElementById(options.filterBy).setSelectionRange(options.filterText.length, options.filterText.length);
            }
        }
        // it will return grid element
    function renderGrid() {
            var gridContainer = newDiv();
            gridContainer.appendChild(renderHeader())
            gridContainer.appendChild(renderBody())
            gridContainer.appendChild(renderfooter())
            return gridContainer
        }
        // this function is responsible for binding sorting
    function applySorting(elem, col) {

            elem.onclick = function() {
                if (options.sortBy == col) {
                    options.sortOrder = !options.sortOrder
                    data = data.reverse();
                    bindData()
                } else {
                    options.sortBy = col;
                    options.sortOrder = true;
                    bindData()
                }
            }
            return elem;
        }
        //this function is  responsible for loading next page
    function nextPage() {
            options.pageNumber = options.pageNumber + 1;
            bindData()
        }
        //this function is  responsible for loading previous page
    function previousPage() {
            options.pageNumber = options.pageNumber - 1;
            bindData()
        }
        // this function will return footer
    function renderfooter() {
            var footer = newDiv();
            footer.className = options.footerClass;
            var leftButton = document.createElement('Button');
            leftButton.innerHTML = '<';
            leftButton.onclick = previousPage;
            var rightButton = document.createElement('Button');
            rightButton.innerHTML = '>';
            rightButton.onclick = nextPage;
            var currentPage = document.createElement('span');
            currentPage.innerHTML = options.pageNumber + ' of ' + options.totalPages();
            if (options.pageNumber > 1) {
                footer.appendChild(leftButton)
            }
            footer.appendChild(currentPage)
            if (options.pageNumber < options.totalPages()) {
                footer.appendChild(rightButton)
            }
            return footer;
        }
        // this function  will return grid body
    function renderBody() {
            var body = newDiv();
            var rows = getFinalData();
            //for eaach row
            for (row in rows) {
                var cRow = addRow();
                //for each property
                for (var i = 0; i < columns.length; i++) {
                    var cell = addColumn();
                    cell.innerHTML = rows[row][columns[i]];
                    if (options.formatting.hasOwnProperty(columns[i])) {
                        cell = options.formatting[columns[i]](cell);
                    }

                    cRow.appendChild(cell)

                }
                body.appendChild(cRow);
            }
            return body;
        }
        //bind filters to grid,i have added support for only one filter, we can extent it using array
    function bindFilter(elem, col) {
            elem.onkeyup = function() {
                if ((91 > event.keyCode && event.keyCode > 47) || event.keyCode == 8) {
                    options.filterText = event.target.value;
                    options.filterBy = col;
                    bindData()
                }
            }
            return elem
        }
        // it filters data based on single filter, it can be extended using array
    function filteData() {
            if (options.filterBy && options.filterText.length > 0) {
                data = dataBackup.slice()
                data = data.filter(function(obj) {
                    if (obj[options.filterBy].indexOf(options.filterText)) {
                        return false;
                    }
                    return true;
                })
            } else {
                data = dataBackup.slice()
            }
        }
        //this fuctions returns header
    function renderHeader() {
            var header = addHeader();
            for (var i = 0; i < columns.length; i++) {
                var hcell = addHeaderCell();
                if (options.filters.indexOf(columns[i]) > -1) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.setAttribute('placeholder', columns[i]);
                    input.setAttribute('id', columns[i])
                    input = bindFilter(input, columns[i])
                    if (columns[i] == options.filterBy) {
                        input.setAttribute('value', options.filterText)
                        input.onfocus = "this.value = this.value;"

                    }
                    hcell.appendChild(input)

                } else {
                    hcell.innerHTML = columns[i];
                }
                if (options.sorting.indexOf(columns[i]) > -1) {
                    hcell = applySorting(hcell, columns[i])
                }
                header.appendChild(hcell)
            }
            return header;
        }
        // this function will return data for current page
    function paginatedData() {
            var start = ((options.pageNumber - 1) * options.pageSize);
            var end = start + options.pageSize;
            return data.slice(start, end);
        }
        //this function will return new row
    function addRow() {
            var newCell = newDiv();
            newCell.className = options.rowClass;
            return newCell;
        }
        //this function will return new column
    function addColumn() {
            var newCol = newDiv();
            newCol.className = options.cellClass;
            newCol.style.width = columnWidth()
            return newCol;
        }
        //this function will return new header
    function addHeader() {
            var newHeader = newDiv();
            newHeader.className = options.headeClass;
            return newHeader;
        }
        //this function will return new cell
    function addHeaderCell() {
            var newHeaderCell = newDiv();
            newHeaderCell.className = options.headerCellClass;
            newHeaderCell.style.width = columnWidth()
            return newHeaderCell;
        }
        //this function will return new dv
    function newDiv() {
        return document.createElement("div");
    }

    return {
        Init: init
    }

}