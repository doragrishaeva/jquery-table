$(document).ready(() => {

    $.get( "http://localhost:3000/products", function(res) {
        renderTable(res);
        deleteProduct(res);
        showProduct(res);
        editProduct(res);
        filterProducts(res);
        sortProducts(res);
    });

    //RENDER TABLE
    //1.make table body empty
    //2.append <tr> (with its data for each item) to table body 
    const renderTable = (res) => {
        $('#tableBody').empty();
            let productList = [];
            for(let i = 0; i < res.length; i++){   
                productList.push(res[i]); 
                $(`<tr><td data-id="${[i]}" data-name="${productList[i].name}"><p>${productList[i].name}</p></td><td><p>${productList[i].price}</p></td><td><button type="submit" id="edit-button" class="btn mr-3"><p>EDIT</p></button><button type="submit" id="delete-button" class="btn"><p>DELETE</p></button></td></tr>`)
                .appendTo('#tableBody');
            };
    };

    //ADD NEW PRODUCT
    //1.show 'add-product' modal box
    //2.if 'cancel' was clicked, modal box has to close
    //3.if form was submitted, POST request has to send and modal box close
    $('#add-new-button').on('click', () => {
        $('#add-product-form')[0].reset();
        $('#product-modal-box').addClass('modal-box_active');
        
        //show only when edit product
        $('#save-changes').hide();

        //show when we add new product
        $('#save').show();
    })

    $('#cancel').on('click', (e) => {
        e.preventDefault();
        $('#product-modal-box').removeClass('modal-box_active');
    });

    $('#save').on('click', function(data) {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/products",
            contentType: 'application/json',
            data: JSON.stringify( { "name": $('#name').val(), "email": $('#email').val(), "count": $('#count').val(), "price": $('#price').val(), "delivery": $('#delivery').val() } ),
            success: function() {
                $('#product-modal-box').removeClass('modal-box_active');
            }
        });
        return false;
    });  

    //SHOW PRODUCT INFORMATION
    //1.show modal-box with information about product
    //2.send item name to local storage to identify current row, if we will be going to edit product information
    const showProduct = (res) => {
        $('#tableBody').on('click', '#edit-button', (e) => {
            e.preventDefault();
            $('#save-changes').show();
            $('#save').hide();
            $('#product-modal-box').addClass('modal-box_active');
           
            for (var i=0; i < res.length; i++) {
                if (e.target.parentNode.parentNode.parentNode.firstChild === $('#tableBody').children()[i].firstChild) {
                    $('#name').val(res[i].name);
                    $('#email').val(res[i].email);
                    $('#count').val(res[i].count);
                    $('#price').val(res[i].price);
                    $('#delivery').val(res[i].delivery);
                };
            };

            //send item name to local storage   
            var itemName = $(e.target.parentNode.parentNode.parentNode.firstChild).attr('data-name');
            localStorage.setItem('item-name', itemName);
        });
    };
    
    //EDIT PRODUCT
    //1.compare item name from local storage (equal to name of product) with each name from JSON elements, when it's equal, PUT request updates data (from input values)
    //2.if 'cancel' was clicked, modal box has to close (without updating data)
    const editProduct = (res) => {
        $('#save-changes').on('click', (e) => {
            e.preventDefault();
                for(var i = 0; i < res.length; i++){ 
                    if (localStorage.getItem('item-name') == (res[i].name)) {
                        $.ajax({
                            type: "PUT",
                            url: `http://localhost:3000/products/${res[i].id}`,
                            contentType: 'application/json',
                            data: JSON.stringify( { "name": $('#name').val(), "email": $('#email').val(), "count": $('#count').val(), "price": $('#price').val(), "delivery": $('#delivery').val() } ),
                            success: function() {
                                $('#product-modal-box').removeClass('modal-box_active');
                            }
                        });
                    };
                };
        });

        $('#cancel').on('click', () => {
            $('#product-modal-box').removeClass('modal-box_active');
        });      
    };

    
    //DELETE PRODUCT
    //1.show 'delete' modal box and save item name to local storage so we could identify current product
    //2.if 'no' was clicked, modal box has to close
    //3.if 'yes' was clicked, DELETE request removes data about current product from JSON
    const deleteProduct = (res) => {
        $('#tableBody').on('click', '#delete-button', (e) => {
            e.preventDefault();
            $('#delete-modal-box').addClass('modal-box_active');
            var itemName = $(e.target.parentNode.parentNode.parentNode.firstChild).attr('data-name');
            localStorage.setItem('item-name', itemName);
        });

        $('#yes-delete').on('click', (e) => {
            e.preventDefault();
                for(var i = 0; i < res.length; i++){ 
                    if (localStorage.getItem('item-name') == (res[i].name)) {
                        $.ajax({
                            type: "DELETE",
                            url: `http://localhost:3000/products/${res[i].id}`,
                            contentType: 'application/json',
                            data: JSON.stringify( { "name": $('#name').val(), "email": $('#email').val(), "count": $('#count').val(), "price": $('#price').val(), "delivery": $('#delivery').val() } ),
                            success: function() {
                                $('#delete-modal-box').removeClass('modal-box_active')
                            }
                        });
                    };
                };
        });

        $('#no-delete').on('click', (e) => {
            e.preventDefault();
            $('#delete-modal-box').removeClass('modal-box_active');
        });
    };

    //FILTER PRODUCTS
    //1.check each product name if it includes 'filter' input value
    //2.show rows only included 'filter' input value
    //3.if value is empty, filter resets
    const filterProducts = (res) => {
        $('#search-button').on('click', function(e) {
            e.preventDefault();
            renderTable(res);
            var searchValue = $('#search-product').val().toLowerCase();
            for (var i=0;i<res.length;i++) {
                var $name = res[i].name;
                if (!$name.toLowerCase().includes(searchValue)) {
                    $('tr:contains('+$name+')').css('display','none');
                };
            };
            if (searchValue.length < 1) {
                renderTable(res)
            };
        });
    };

    //SORTING PRODUCTS
    //1.sort products by their names
    const sortProducts = (res) => {
        $('.button-sort_from-low').on('click', function(e) {
            $('.button-sort').removeClass('button-sort_active');
            $(e.currentTarget).addClass('button-sort_active');
            res.sort(function (a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
            
            renderTable(res);
        });

        $('.button-sort_from-high').on('click', function(e) {
            $('.button-sort').siblings().removeClass('button-sort_active');
            $(e.currentTarget).addClass('button-sort_active');
            res.sort(function (a, b) {
                if (a.name > b.name) {
                    return -1;
                };
                if (a.name < b.name) {
                    return 1;
                };
                return 0;
            });
            
            renderTable(res);
        });
    };
});

