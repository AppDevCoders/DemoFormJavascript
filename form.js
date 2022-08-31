window.onload = () => {

    // data
    const categories = [
        {id: '1', text: 'Electronic' },
        {id: '2', text: 'Games' },
        {id: '3', text: 'Furniture' },
        {id: '4', text: 'Art' },
    ];
    let list = [];

    // form references
    let productName = document.querySelector('#productName');
    let productCategory = document.querySelector('#productCategory');
    let productCost = document.querySelector('#productCost');
    let productQuantity = document.querySelector('#productQuantity');
    let productActive = document.querySelector('#productActive');

    // form errors
    let productNameError = document.querySelector('#productNameError');
    let productCategoryError = document.querySelector('#productCategoryError');
    let productCostError = document.querySelector('#productCostError');
    let productQuantityError = document.querySelector('#productQuantityError');

    // table
    let listBody = document.querySelector('#listBody'); 

    // events
    document.querySelector('#btnClear').addEventListener('click', onClear);
    document.querySelector('#btnAdd').addEventListener('click', onAdd);
    document.querySelector('#btnStore').addEventListener('click', onStore);

    // ---- code ----

    // restore products from localStorage
    function loadProducts() {
        const data = window.localStorage.getItem('data');
        try {            
            list = data !== null ? JSON.parse(data) : [];
            if (list.length > 0) {
                updateTable();
            }
        } catch (error) {
            console.log(error);
        }
    }

    // save current products to localStorage
    function saveProducts() {
        window.localStorage.setItem('data', JSON.stringify(list));
    }

    // load combo with categories
    function loadCategory() {
        let elements = []; 
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.innerHTML = cat.text;
            elements.push(option);
        })
        productCategory.append(...elements);
    }

    // clear form and errors
    function onClear() {
        let prod = new Product();
        productName.value = prod.name;
        productCategory.value = prod.category;
        productCost.value = prod.cost;
        productQuantity.value = prod.quantity;
        productActive.checked = prod.active;

        productNameError.innerHTML = '';
        productCategoryError.innerHTML = '';
        productCostError.innerHTML = '';
        productQuantityError.innerHTML = '';
    }

    // add product to the table
    function onAdd() {
        console.log('add clicked..!');
        let prod = new Product();
        prod.id = Date.now(); // numeric date as dummy id
        prod.name = productName.value;
        prod.category = productCategory.value;
        prod.cost = productCost.value;
        prod.quantity = productQuantity.value;
        prod.active = productActive.checked;
        
        if (prod.isValid()) {
            // save product
            list.push(prod);    
            onClear();        
            updateTable();
        } else {
            let errors = prod.hasErrors();
            // console.log('Error: ' + JSON.stringify(errors));
            // alert('Error: ' + JSON.stringify(errors));
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

    // store products in localStorage
    function onStore() {
        console.log('Process clicked: ' + JSON.stringify(list));
        // alert('Process: ' + JSON.stringify(list));
        saveProducts();
    }

    // render rows in the table
    function updateTable() {
        listBody.innerHTML = ''; 
        let elements = [];
        list.forEach(prod => {
            let tr = document.createElement('tr');
            tr.classList.add('tr' + prod.id); // identify row
            let tdID = document.createElement('td');
            tdID.classList.add('d-none');
            tdID.innerHTML = prod.id;
            let tdName = document.createElement('td');
            tdName.innerHTML = prod.name;
            let tdCategory = document.createElement('td');
            tdCategory.innerHTML = lookupCategoryText(prod.category);
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
            tr.append(tdID, tdName, tdCategory, tdCost, tdQuantity, tdAction);
            elements.push(tr);
        })
        listBody.append(...elements);
    } 

    function lookupCategoryText(categoryID) {
        const found = categories.find(i => +i.id === +categoryID);
        return found !== null ? found.text : categoryID;
    }

    // delete product
    function onDelete(id) {
        console.log('delete:', id);
        list = list.filter(i => +i.id !== +id);
        updateTable();
    }

    // ---- run ----

    loadProducts(); // load from localStorage
    loadCategory(); // load categories combo
    onClear(); // clear form
}


class Product {
    constructor() {
        this.id = '';
        this.name = '';
        this.category = '';
        this.cost = 0;
        this.quantity = 0;
        this.active = true;
    }

    isValid() {
        let errorCount = Object.keys(this.hasErrors()).length;
        return errorCount === 0;
    }

    hasErrors() {
        let errors = {};     
        if (!this.name || this.name.length <= 2) {
            errors['name'] = 'name required';
        }   
        if (!this.category || this.name.length <= 1) {
            errors['category'] = 'Category required';
        } 
        if (!this.cost || this.cost <= 0) {
            errors['cost'] = 'Must be numeric/positive';
        }
        if (!this.quantity || this.quantity <= 0) {
            errors['quantity'] = 'Must be numeric/positive';
        }
        return errors;
    }
}