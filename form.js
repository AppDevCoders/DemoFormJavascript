window.onload = () => {

    // app data
    const categories = [
        { id: "1", description: "Electronic" },
        { id: "2", description: "Games" },
        { id: "3", description: "Furniture" },
        { id: "4", description: "Art" },
        { id: "5", description: "Other" }
    ]
    let categoryLoopUp = {}; // look-up
    let list = [];

    // form refs
    let productName = document.querySelector('#productName');
    let productCategory = document.querySelector('#productCategory');
    let productCost = document.querySelector('#productCost');
    let productQuantity = document.querySelector('#productQuantity');
    let productActive = document.querySelector('#productActive');

    // form errors refs
    let productNameError = document.querySelector('#productNameError');
    let productCategoryError = document.querySelector('#productCategoryError');
    let productCostError = document.querySelector('#productCostError');
    let productQuantityError = document.querySelector('#productQuantityError');

    // table ref
    let listBody = document.querySelector('#listBody'); 

    // events
    document.querySelector('#btnClear').addEventListener('click', onFormClear);
    document.querySelector('#btnAdd').addEventListener('click', onAdd);
    document.querySelector('#btnStore').addEventListener('click', saveProducts);

    // ---- code ----

    // restore products from localStorage
    function restoreProducts() {
        const data = window.localStorage.getItem('data');
        try {            
            list = data !== null ? JSON.parse(data) : [];
            if (list.length > 0) {
                updateTable();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    // save products to localStorage
    function saveProducts() {
        window.localStorage.setItem('data', JSON.stringify(list));
    }

    // load combo with categories
    function loadCategory()  {
        let elements = []; 
        categories.forEach(cat => {
            // save for easy lookup
            categoryLoopUp[cat.id.toString()] = cat.description;
            // create option
            const option = document.createElement('option');
            option.value = cat.id;
            option.innerHTML = cat.description;            
            elements.push(option);            
        })
        productCategory.append(...elements);        
    }

    // clear form and errors
    function onFormClear(params) {
        const defaultParams = {values: true, errors: true};
        params = Object.assign(defaultParams, params);
        if (params.values) {
            const prod = new Product();
            productName.value = prod.name;
            productCategory.value = prod.category;
            productCost.value = prod.cost;
            productQuantity.value = prod.quantity;
            productActive.checked = prod.active;
        }
        if (params.errors) {
            productNameError.innerHTML = '';
            productCategoryError.innerHTML = '';
            productCostError.innerHTML = '';
            productQuantityError.innerHTML = '';
        }
    }

    // add product to the table
    function onAdd() {
        console.log('Add clicked..!');
    
        const prod = new Product();
        prod.id = Date.now(); // using numeric timestamp as dummy id
        prod.name = productName.value;
        prod.category = productCategory.value;
        prod.cost = productCost.value;
        prod.quantity = productQuantity.value;
        prod.active = productActive.checked;

        onFormClear({values: false, errors: true}); // clear errors only
        
        if (prod.isValid()) {
            // add product to the list
            list.push(prod);    
            onFormClear();        
            updateTable();
        } else {
            // show errors
            let errors = prod.hasErrors();
            if (errors['name']) {
                productNameError.innerHTML = errors['name'];
            }
            if (errors['category']) {
                productCategoryError.innerHTML = errors['category'];
            }
            if (errors['cost']) {
                productCostError.innerHTML = errors['cost'];
            }
            if (errors['quantity']) {
                productQuantityError.innerHTML = errors['quantity'];
            }
        }
    }

    // render rows in the table
    function updateTable() {
        listBody.innerHTML = ''; // clear rows
        let elements = [];
        list.forEach(prod => {
            let tr = buildProductTableRow(prod);
            elements.push(tr);
        })
        listBody.append(...elements); // add all rows 
    }       
    
    function buildProductTableRow(prod) {
        // Build a row (<tr>)
        let tr = document.createElement('tr');
        tr.classList.add('tr' + prod.id); // identify row
        let tdID = document.createElement('td');
        tdID.classList.add('d-none');
        tdID.innerHTML = prod.id;
        let tdName = document.createElement('td');
        tdName.innerHTML = prod.name;
        let tdCategory = document.createElement('td');
        tdCategory.innerHTML = categoryLoopUp[prod.category]; // look-up description
        let tdCost = document.createElement('td');
        tdCost.innerHTML = prod.cost;
        let tdQuantity = document.createElement('td');
        tdQuantity.innerHTML = prod.quantity;
        let tdAction = document.createElement('td');
        let btnDelete = document.createElement('button');
        btnDelete.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-product-delete');
        btnDelete.id = prod.id;       
        btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';    
        btnDelete.addEventListener('click', () => onDelete(prod.id)); 
        tdAction.appendChild(btnDelete);
        tr.append(tdID, tdName, tdCategory, tdCost, tdQuantity, tdAction); // add <td> to the <tr>
        return tr;
    }

    // delete product
    function onDelete(id) {
        console.log('delete clicked:', id);
        list = list.filter(i => +i.id !== +id);
        updateTable();
    }

    /*
    // look-up description
    function lookupCategoryDescription(categoryID) {
        const found = categories.find(i => +i.id === +categoryID);
        return found !== null ? found.description : categoryID;
    }
    */   

    // ---- run ----

    loadCategory(); // load categories combo from array
    onFormClear(); // clear form
    restoreProducts(); // load products from localStorage
}


class Product {
    constructor() {
        this.id = '';
        this.name = '';
        this.category = ''; // categoryId
        this.cost = 0;
        this.quantity = 0;
        this.active = true;
    }

    isValid() {
        const errorCounter = Object.keys(this.hasErrors()).length;
        return errorCounter === 0;
    }

    hasErrors() {
        let errors = {};    
        if (!this.name || this.name.trim().length === 0) {
            errors['name'] = 'Name required';
        }   
        if (!this.category || this.category.trim().length === 0) {
            errors['category'] = 'Category required';
        } 
        if (!this.cost || +this.cost <= 0) {
            errors['cost'] = 'Must be numeric/positive';
        }
        if (!this.quantity || +this.quantity <= 0) {
            errors['quantity'] = 'Must be numeric/positive';
        }
        return errors;
    }
}