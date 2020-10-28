$(document).ready(() => {
    // RENDER TABLE
    (function () {
        $('#table-body').empty();
        if (localStorage.length !== 0) {
            for (let key in localStorage) {
                if (typeof(localStorage[key]) === 'string') {
                    let product = JSON.parse(localStorage.getItem(key));
                    $(`<tr class="item-row item-row_active"><td data-name="${product.name}"><span class="product-name button yellow-button">${product.name}</span></td><td>${product.count}</td><td>${product.price}</td><td><button id="done-button" class="mr-3 done-button button yellow-button">DONE</button><button id="delete-button" class="delete-button button yellow-button">DELETE</button></td></tr>`)
                    .appendTo('#table-body');
                };
            };
        };
    })();

    // SAVE OR CHANGE PRODUCT IN LOCAL STORAGE
    function addDataToLocalStorage() {
        let productName = $('#name').val();
        let count = $('#count').val();
        let price = $('#price').val();
        let product = { name:  productName, count: +count, price: +price};
        localStorage.setItem(productName, JSON.stringify(product));
    };
    
    //SUBMIT FORM WITH NEW PRODUCT
    $('#add-new-button').on('click', () => {
        $('#add-product-form')[0].reset();
        $('#product-modal-box').addClass('modal-box_active');
        
        //hide when we add new product
        $('#save-changes').hide();
        //show when we add new product
        $('#save').show();
    });

    $('#cancel').on('click', (e) => {
        e.preventDefault();
        $('#product-modal-box').removeClass('modal-box_active');
    });

    $('#save').on('click', function() {
        sessionStorage.clear();
        addDataToLocalStorage();
    });

    //SHOW PRODUCT INFORMATION
    $('#table-body').on('click', '.product-name', (e) => {
        e.preventDefault();
        $('#save-changes').show();
        $('#save').hide();
        $('#product-modal-box').addClass('modal-box_active');
           
        let currentRow = e.currentTarget.closest('tr');
        let currentName = $(currentRow).children()[0].firstChild.innerHTML;
        $('#name').val(currentName);
        $('#count').val($(currentRow).children()[1].innerHTML);
        $('#price').val($(currentRow).children()[2].innerHTML);
       
        sessionStorage.clear();
        sessionStorage.setItem('currentName', currentName);
    });
    
    //EDIT PRODUCT
    $('#save-changes').on('click', () => {
        let replacedItem = sessionStorage.getItem('currentName');
        localStorage.removeItem(replacedItem);
        addDataToLocalStorage();
    });

    //DELETE PRODUCT
    $('#table-body').on('click', '#delete-button', (e) => {
        e.preventDefault();
        $('#delete-modal-box').addClass('modal-box_active');
        let currentRow = e.target.closest('tr');
        let currentName = $(currentRow).children()[0].firstChild.innerHTML;
        $('.current-item').remove();
        $('.delete-title').after(`<p style="text-align:center" class="current-item">Do you want to delete ${currentName}?</p>`);      
    });

    $('#yes-delete').on('click', (e) => {
        let currentStr = $(e.target).closest('#delete-product-form').children()[1].innerHTML.slice(22, -1);
        for (let key in localStorage) {
            if (typeof localStorage[key] === 'string') {
                let product = JSON.parse(localStorage.getItem(key));
                if (currentStr === product.name) {
                    localStorage.removeItem(key);
                };
            };
        };
        $('#delete-modal-box').removeClass('modal-box_active');
    });

    $('#no-delete').on('click', (e) => {
        e.preventDefault();
        $('#delete-modal-box').removeClass('modal-box_active');
    });

    //FILTER PRODUCTS
    $('#search-button').on('click', function(e) {
        e.preventDefault();
        let searchValue = $('#search-product').val().toUpperCase();

        $('.item-row').hide()
        Array.from($('.item-row')).forEach(item => {
            if ($(item).children()[0].innerText.toUpperCase().includes(searchValue)) {
                $(item).show();
            };
        });
    });
    
    //SORTING PRODUCTS
    $('.sort-button').on('click', function(e) {
        // change arrow
        if ($(e.currentTarget).hasClass('sort-button_active')) {
            var currentArrow = $(e.currentTarget).siblings();
            $(currentArrow).hasClass('fa-arrow-alt-circle-down') ? (
                $(currentArrow).removeClass('fa-arrow-alt-circle-down'),
                $(currentArrow).addClass('fa-arrow-alt-circle-up')
            ) : (
                $(currentArrow).removeClass('fa-arrow-alt-circle-up'),
                $(currentArrow).addClass('fa-arrow-alt-circle-down')
            )
        }
        else {
            $('i').remove();
            arrOfSortButtons = Array.from($('.sort-button'));
            arrOfSortButtons.forEach(item => {
                $(item).removeClass('sort-button_active');
            })
            $(e.currentTarget).after('<i class="fas fa-arrow-alt-circle-down"></i>');
            $(e.currentTarget).addClass('sort-button_active');
        }

        //make array from items in local storage
        let arrOfItems = [];
        for (let key in localStorage) {
            if (typeof(localStorage[key]) === 'string') {
                let currentItem = JSON.parse(localStorage.getItem(key));
                arrOfItems.push(currentItem);
            };
        };

        //bubble sorting
        function bubbleSorting(sortParam, orderBy) {
            var swapped;
            do {
                swapped = false;
                if (orderBy === 'DESC') {
                    for (let i=0; i<arrOfItems.length-1;i++) {
                        if (arrOfItems[i][sortParam] < arrOfItems[i+1][sortParam]) {
                            var temp = arrOfItems[i];
                            arrOfItems[i] = arrOfItems[i+1];
                            arrOfItems[i+1] = temp;
                            swapped = true;
                        }
                    }
                }
                if (orderBy === 'ASC') {
                    for (let i=0; i<arrOfItems.length-1;i++) {
                        if (arrOfItems[i][sortParam] > arrOfItems[i+1][sortParam]) {
                            var temp = arrOfItems[i];
                            arrOfItems[i] = arrOfItems[i+1];
                            arrOfItems[i+1] = temp;
                            swapped = true;
                        }
                    }
                }         
            } while (swapped)
        };

        //show sorted table
        function showSortTable(sortParam, num) {
            let arrOfRows = Array.from($('.item-row'));
            $('#table-body').empty();
            for (let i=0;i<arrOfItems.length;i++) {
                arrOfRows.forEach(item => {
                    if (arrOfItems[i][sortParam] == $(item).children()[num].innerText) {
                        $(item).appendTo('#table-body');
                    }
                });
            }; 
        };

        if (e.target.id === 'sort-by-name') {
            if ($(currentArrow).hasClass('fa-arrow-alt-circle-up')) {
                arrOfItems.sort(function (a, b) {
                    if (a.name > b.name) {
                        return -1;
                    };
                    if (a.name < b.name) {
                        return 1;
                    };
                    return 0;
                });
            } else {
                arrOfItems.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                });
            }
            showSortTable('name', 0)
        } else if (e.target.id === 'sort-by-count') {
            if ($(currentArrow).hasClass('fa-arrow-alt-circle-up')) {
                bubbleSorting('count', 'DESC');
                showSortTable('count', 1);
            } else {
                bubbleSorting('count', 'ASC');
                showSortTable('count', 1);
            }   
        } else {
            if ($(currentArrow).hasClass('fa-arrow-alt-circle-up')) {
                bubbleSorting('price', 'DESC');
                showSortTable('price', 2);
            }
            else {
                bubbleSorting('price', 'ASC');
                showSortTable('price', 2);
            }
        }                     
    });
    
    $('#table-body').on('click', '.done-button', (e) => {
        let currentRow = $(e.currentTarget).closest('tr');
        if ($(currentRow).hasClass('item-row_active')) {
            $(currentRow).children().css({
                'opacity' : '0.2'
            })
            $(e.currentTarget).text('UNDONE');
            $(currentRow).removeClass('item-row_active');
        }
        else {
            $(currentRow).children().css({
                'opacity' : '1'
            })
            $(e.currentTarget).text('DONE');
            $(currentRow).addClass('item-row_active');
        };
    });
});