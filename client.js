//All event listeners______________________________________________________________________________________________
fetch('http://localhost:8888/Orders.Customer')
.then(res=>res.json())
.then(arrOrderDis=>{
    displayOrder(arrOrderDis);

    //post to create update Customer Details
    document.getElementById('customerView').addEventListener('submit', handleUpdateCustomer);

    //post to create new Customer
    document.getElementById('addNewCustomer').addEventListener('submit', handleAddNewCustomer);

    //post to create new Order
    document.getElementById('productOrder').addEventListener('submit', handleAddNewOrder);

    //all of the delete buttons
    const arrBtns = document.querySelectorAll('.delBtn');
    for(const btn of arrBtns)
    {
        btn.addEventListener('click', handleDeleteOrder);
    }
});

//__________________________________________________________________________________________________________________

//Update Customer details___________________________________________________________________________________________

//Update Customer Details Handler
function handleUpdateCustomer(event)
{
    const updt = confirm("are you sure you want to UPDATE ");
    if(updt == true)
    {
        event.preventDefault();
        const fd = new FormData(document.getElementById('customerView'));
        fetch('http://localhost:8888/Customer',
        {
            method: 'PUT',
            body:fd
        });
    } else
    {
        alert('You Cancelled!');
        controller.abort();
    }
}

//__________________________________________________________________________________________________________________

//Delete Order summary details______________________________________________________________________________________

//Delete Buttons Event Handler
function handleDeleteOrder(event)
{
    //alert ('deleting');
    let CustomerId = event.currentTarget.value;
    confirm("are you sure you want to DELETE "+ CustomerId);
    fetch('http://localhost:8888/Orders.Customer/' + CustomerId,
    {
        method: 'DELETE',
    })
    .then(res=> res.text()) 
    .then(res=> console.log(res));
}

//___________________________________________________________________________________________________________________

//Add New Customer___________________________________________________________________________________________________

// Add New Customer Event Handler
function handleAddNewCustomer(event)  
{
    confirm("are you sure you want to Add New Customer ");
    event.preventDefault();
    const fd = new FormData(document.getElementById('addNewCustomer'));
    fetch ('http://localhost:8888/Customer',
    {
        method: 'POST',
        body: fd
    });
}

//______________________________________________________________________________________________________________________________

//Add New Order_________________________________________________________________________________________________________________

// Add New Order Event Handler
function handleAddNewOrder(event)  
{
    confirm("are you sure you want to Add New Order ");
    event.preventDefault();
    const fd = new FormData(document.getElementById('productOrder'));
    fetch ('http://localhost:8888/Orders',
    {
        method: 'POST',
        body: fd
    });
}

//______________________________________________________________________________________________________________________________

//Beginning of Table Showing Order Summary______________________________________________________________________________________
function displayOrder(jsonArr)
{
    //Get Order Gallery Div by id
    const orderGallery = document.getElementById('orderGallery');

    //Create Order Gallery Table
    const domTable = document.createElement('table');
    
    //Create Title Headers
    let domTitleRow = document.createElement('tr');

    //Create Order Gallery Table Header Rows(tr)
    let domHeaderRow = document.createElement('tr');

    //Create Order Gallery Table Headers(th) each header reps is 1 Column
    let domHeaderTitle = document.createElement('th');
    domHeaderTitle.innerText = 'ORDER GALLERY';

    let domHeaderColId = document.createElement('th');
    domHeaderColId.innerText = 'OrderNumber';

    let domHeaderColCN = document.createElement('th');
    domHeaderColCN.innerText = 'CustomerName';

    let domHeaderColOT = document.createElement('th');
    domHeaderColOT.innerText = 'OrderTotal';

    let domHeaderColDel = document.createElement('th');
    domHeaderColDel.innerText = 'Delete';

    //Add Created Header Rows to Table Headers
    domTitleRow.appendChild(domHeaderTitle);
    domHeaderRow.appendChild(domHeaderColId);
    domHeaderRow.appendChild(domHeaderColCN);
    domHeaderRow.appendChild(domHeaderColOT);
    domHeaderRow.appendChild(domHeaderColDel);
    domTable.appendChild(domTitleRow);
    domTable.appendChild(domHeaderRow);
    
    //Use a For loop to Create Order Gallery Body Rows(tr) and Data(td) or DataCells
    for(json of jsonArr)
    {
       //Create Body Row of Order Gallery 
        let domTR = document.createElement('tr');

        // Create Body Data of Order Gallery 
       let domTDID = document.createElement('td');
       domTDID.innerHTML = `<button onclick='tableFromJson()' value=${json.OrderNumber}>${json.OrderNumber}</button>`;

       let domTDCN = document.createElement('td');
       domTDCN.innerText = json.FirstName +" "+ json.LastName;

       let domTDOT = document.createElement('td');
       domTDOT.innerText = "$"+json.OrderTotal;

       let domTDdel = document.createElement('td');
       domTDdel.innerHTML = `<button class = 'delBtn' value=${json.CustomerId}><i class="fas fa-trash-alt"></i></button>`;
       
       //Add Created Table Data to Table Rows (Data is child of Row)
       domTR.appendChild(domTDID);
       domTR.appendChild(domTDCN);
       domTR.appendChild(domTDOT);
       domTR.appendChild(domTDdel);
        
       //Add Created Table Rows to Table (Row is child of Table)
       domTable.appendChild(domTR);
    }

    //Add Created Table to Order Gallery Div
    orderGallery.appendChild(domTable);
}

//End of Table Showing Order Summary___________________________________________________________________________________________________________

//Table that Displays Customer Details__________________________________________________________________________________________________________

let tableFromJson = () =>{
     
    // Create XMLHttpRequest object
    let oXHR = new XMLHttpRequest();

    // Initiate request.
    oXHR.onreadystatechange = reportStatus;
    oXHR.open("GET", "http://localhost:8888/OrdersCustomer/" + event.target.value, true);  // get json file.
    oXHR.send();
    
    function reportStatus() {
        if (oXHR.readyState == 4) {		// Check if request is complete.
    
            // Create an HTML table using response from server.
            createTableFromJSON(this.responseText);
        }
        
    }
    
    // Create an HTML table using the JSON data.
    function createTableFromJSON(jsonData) {
        let arrCustDisplay = [];
        arrCustDisplay = JSON.parse(jsonData); 	// Convert JSON to array.
        
        let col = [];
        for (let i = 0; i < arrCustDisplay.length; i++) {
            for (let key in arrCustDisplay[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        
        // Create a dynamic table.
        let table = document.createElement("table");

        // Create table header.
        let tr = table.insertRow(-1);                   // Table row.

        let ordNum = tr.insertCell(-1);
        ordNum.innerHTML = arrCustDisplay[0][col[0]];

        let ordDate = tr.insertCell(-1);
        ordDate.innerHTML = arrCustDisplay[0][col[1]];

        let custFName = tr.insertCell(-1);
        custFName.innerHTML = arrCustDisplay[0][col[2]];

        let custLName = tr.insertCell(-1);
        custLName.innerHTML = arrCustDisplay[0][col[3]];

        let custCity = tr.insertCell(-1);
        custCity.innerHTML = arrCustDisplay[0][col[4]];

        let cusCount = tr.insertCell(-1);
        cusCount.innerHTML = arrCustDisplay[0][col[5]];

        let cusPhone = tr.insertCell(-1);
        cusPhone.innerHTML = arrCustDisplay[0][col[6]];

        let email = tr.insertCell(-1);
        email.innerHTML = arrCustDisplay[0][col[7]];

        let cusId = tr.insertCell(-1);
        cusId.innerHTML = arrCustDisplay[0][col[8]];
      
        // Finally, add the dynamic table to a container.
        document.getElementById("ordNum").value = ordNum.innerHTML;
        document.getElementById("ordDate").value = ordDate.innerHTML;
        document.getElementById("custFName").value = custFName.innerHTML;
        document.getElementById("custLName").value = custLName.innerHTML;
        document.getElementById("custCity").value = custCity.innerHTML;
        document.getElementById("cusCount").value = cusCount.innerHTML;
        document.getElementById("cusPhone").value = cusPhone.innerHTML;
        document.getElementById("email").value = email.innerHTML;
        document.getElementById("cusId").value = cusId.innerHTML;
    };

}

//End of Table Displaying Customer Details_____________________________________________________________________________________________________________


//All event listeners______________________________________________________________________________________________
fetch('http://localhost:8888/SupplierProduct')
.then(res=>res.json())
.then(arrProDis=>{
    displayProduct(arrProDis);

    // //post to create update Customer Details
    // document.getElementById('customerView').addEventListener('submit', handleUpdateCustomer);

    // //post to create new Customer
    // document.getElementById('addNewCustomer').addEventListener('submit', handleAddNewCustomer);

    // //post to create new Order
    // document.getElementById('productOrder').addEventListener('submit', handleAddNewOrder);

    //all of the delete buttons
    // const arrBtns = document.querySelectorAll('.delBtn');
    // for(const btn of arrBtns)
    // {
    //     btn.addEventListener('click', handleDeleteOrder);
    // }
});


//Beginning of Table Showing Product Gallery______________________________________________________________________________________
function displayProduct(arrProDis)
{
    //Get Product Gallery Div by id
    const productGallery = document.getElementById('productGallery');

    //Create Product Gallery Table
    const domTable = document.createElement('table');
    
    //Create Title Headers
    let domTitleRow = document.createElement('tr');

    //Create Product Gallery Table Header Rows(tr)
    let domHeaderRow = document.createElement('tr');

    //Create Product Gallery Table Headers(th) each header reps is 1 Column
    let domHeaderTitle = document.createElement('th');
    domHeaderTitle.innerText = 'PRODUCT ORDER GALLERY';

    let domHeaderColON = document.createElement('th');
    domHeaderColON.innerText = 'OrderNumber';

    let domHeaderColCName = document.createElement('th');
    domHeaderColCName.innerText = 'CompanyName';

    let domHeaderColPName = document.createElement('th');
    domHeaderColPName.innerText = 'ProductName';

    let domHeaderColPkg = document.createElement('th');
    domHeaderColPkg.innerText = 'Package';

    let domHeaderColUPrice = document.createElement('th');
    domHeaderColUPrice.innerText = 'UnitPrice';

    //Add Created Header Rows to Table Headers
    domTitleRow.appendChild(domHeaderTitle);
    domHeaderRow.appendChild(domHeaderColON);
    domHeaderRow.appendChild(domHeaderColCName);
    domHeaderRow.appendChild(domHeaderColPName);
    domHeaderRow.appendChild(domHeaderColPkg);
    domHeaderRow.appendChild(domHeaderColUPrice);
    domTable.appendChild(domTitleRow);
    domTable.appendChild(domHeaderRow);

    domTable.setAttribute("border","1");
    
    //Use a For loop to Create Product Gallery Body Rows(tr) and Data(td) or DataCells
    for(json of arrProDis)
    {
       //Create Body Row of Product Gallery 
        let domTR = document.createElement('tr');

        // Create Body Data of Product Gallery 
       let domTDON = document.createElement('td');
       domTDON.innerHTML = json.OrderNumber;

        // Create Body Data of Product Gallery 
       let domTDCN = document.createElement('td');
       domTDCN.innerHTML = json.CompanyName;

       let domTDPN = document.createElement('td');
       domTDPN.innerText = json.ProductName;

       let domTDPK = document.createElement('td');
       domTDPK.innerText = json.Package;

       let domTDUP = document.createElement('td');
       domTDUP.innerText = '$'+json.UnitPrice;
       
       //Add Created Table Data to Table Rows (Data is child of Row)
       domTR.appendChild(domTDON);
       domTR.appendChild(domTDCN);
       domTR.appendChild(domTDPN);
       domTR.appendChild(domTDPK);
       domTR.appendChild(domTDUP);
        
       //Add Created Table Rows to Table (Row is child of Table)
       domTable.appendChild(domTR);
    }

    //Add Created Table to Product Gallery Div
    productGallery.appendChild(domTable);
}

//End of Table Showing Product Gallery___________________________________________________________________________________________________________


