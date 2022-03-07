const express = require('express');
const Database = require ('better-sqlite3');
const cors = require('cors'); //npm install cors

const app = express();

app.options('*', cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const db = new Database('MERNfactory.db');

const multer = require('multer');
const { request } = require('express');
const upload = multer();

//Post New orders to the database
app.post('/Orders',upload.none(),(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "INSERT INTO Orders(Id, OrderDate, OrderNumber, CustomerId, TotalAmount) VALUES(?,?,?,?,?)";
    const statement = db.prepare(sql);
    console.log(req.body.Id);
    const result = statement.run([req.body.Id,req.body.OrderDate,req.body.OrderNumber,req.body.CustomerId,req.body.TotalAmount]);
    res.end();
});

//Update Customer records in the Database
app.put('/Customer',upload.none(),(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "UPDATE Customer SET FirstName=?, LastName=?, City=?, Country=?, Phone=?, email=? WHERE CustomerId="+ req.body.CustomerId;
    console.log(sql);
    const statement = db.prepare(sql);
    const resultd = statement.run([req.body.FirstName,req.body.LastName,req.body.City,req.body.Country,req.body.Phone,req.body.email]);
    console.log(resultd);
    res.end();
});

//Post new Customer Details into Database
app.post('/Customer',upload.none(),(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "INSERT INTO Customer(CustomerId, FirstName, LastName, City, Country, Phone, email) VALUES(?,?,?,?,?,?,?)";
    const statement = db.prepare(sql);
    console.log(req.body.CustomerId);
    const resultc = statement.run([req.body.CustomerId,req.body.FirstName,req.body.LastName,req.body.City,req.body.Country,req.body.Phone,req.body.email]);
    res.end();
});

//Get Customer Details To Display in Update form
app.get('/OrdersCustomer/:id',(req,res)=>{ 
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "SELECT OrderNumber, OrderDate, FirstName, LastName, City, Country, Phone, email, Customer.CustomerId FROM Customer JOIN Orders ON Orders.CustomerId = Customer.CustomerId GROUP BY OrderNumber HAVING OrderNumber=" +req.params.id;
    const statement = db.prepare(sql);

    const arrOutput = [];
    for (const order of statement.iterate()) 
    {
        arrOutput.push(order);
    }
    res.end(JSON.stringify(arrOutput));
});

//Get Customer and Order Details from Database
app.get('/Orders.Customer',(req,res)=>{ 
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "SELECT OrderNumber, Customer.FirstName, Customer.LastName, TotalAmount AS 'OrderTotal', Customer.CustomerId FROM Orders JOIN Customer ON Orders.CustomerId = Customer.CustomerId GROUP BY OrderNumber ORDER BY OrderTotal DESC";
    const statement = db.prepare(sql);

    const arrOutput = [];
    for (const order of statement.iterate()) 
    {
        arrOutput.push(order);
    }
    res.end(JSON.stringify(arrOutput));
});

//Get Product and Company Details from Database
app.get('/SupplierProduct',(req,res)=>{ 
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = "SELECT OrderNumber, CompanyName, ProductName, Package, Product.UnitPrice FROM ((Orders JOIN OrderItem ON Orders.Id=OrderItem.OrderId) JOIN Product ON Product.Id=OrderItem.ProductId) JOIN Supplier ON Product.SupplierId = Supplier.Id GROUP BY OrderNumber ORDER BY OrderNumber DESC";
    const statement = db.prepare(sql);

    const arrProd = [];
    for (const supply of statement.iterate()) 
    {
        arrProd.push(supply);
    }
    res.end(JSON.stringify(arrProd));
});


//DELETE => DELETE Customer and Order details from Order and customer Tables
app.delete('/Orders.Customer/:id',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    const sql = "DELETE FROM Orders WHERE CustomerId=?"
    const sql2 = "DELETE FROM Customer WHERE CustomerId=?" 
    const statement = db.prepare(sql);
    const statement2 = db.prepare(sql2);
    let result = statement.run([req.params.id]) + statement2.run([req.params.id]);
    console.dir(result);
    console.log('delete', req.params.id);
    res.end();
});

app.listen(8888);