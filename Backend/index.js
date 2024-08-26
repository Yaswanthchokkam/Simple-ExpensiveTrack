const express=require('express');
const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
// validate
let namepattern=/^[A-z][a-z]+$/
let passwordpattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/;
// /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/;


// database connection
mongoose.connect("mongodb://localhost:27017/ExpensiveTrack")
.then(()=>{
    console.log("database connected successfully")
})
.catch((err)=>{
    console.log(err)
})
// import models
const userModel=require('./Models/userModel');
const expenseModel=require('./Models/ExpenseModel');
const verifyToken = require('./verifyToken');

// ------
 const app=express();
 app.use(express.json());
 app.use(cors());
//  end points register user
app.post('/register',(req,res)=>{
    let user=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        if(!err){
            if (namepattern.test(user.name)) {
                console.log("correct");
            } else {
                console.log('error');
                return res.status(400).send({ message: "Name should contain only letters" });
            }
            if(passwordpattern.test(user.password)){
            bcrypt.hash(user.password,salt,async(err,hpass)=>{
                if(!err){
                    user.password=hpass;
                    try{
                        const existuser=await userModel.findOne({email:user.email})
                        if(existuser){
                            return res.status(400).send({message:"Already email exist"})
                        }
                        else{
                        let doc=await userModel.create(user)
                        res.status(201).send({message:"user registerd sucessfully"});
                        }
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send({message:"Some Problem while registering"})
                    }
                }
            })
           }
           else{
            console.log('error');
            return res.status(400).send({ message: "Password should contain atleast one occurence of a digit, a lowercase letter, an uppercase letter, and a special character (@#$%^&-+=()) and be 8-20 characters long."  });
           }
        }
    })
})

// endpoint for login
app.post('/login',async (req,res)=>{
    let userCred=req.body;
    try{
        const user=await userModel.findOne({email:userCred.email})
        if(user!=null){
            bcrypt.compare(userCred.password,user.password,(err,sucess)=>{
                if(sucess==true){
                    jwt.sign({email:userCred.email},"Nani",(err,token)=>{
                        if(!err){
                            res.status(200).send({message:"Login sucess",token:token,name:user.name,id:user._id})
                        }
                       
                    })
                }
                else{
                    res.status(403).send({message:"Incorrect password"});
                }
            })
        }
        else{
            res.status(404).send({message:"user not found enter valid email"});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem"})
    }
})

// end point getall expenses
app.get('/expenses', async (req,res)=>{
    try{
        let expenses=await expenseModel.find()
        if(expenses!=null){
            res.status(200).send(expenses);
        }
        else{
            res.status(403).send({message:"No expenses found please add the expenses"})
        }
       
    }
    catch(err){
        res.status(500).send({message:"Some problem while gettin data"})
    }
})

// endpoint for add expenses
app.post('/addexpenses', async (req, res) => {
    let expense = req.body;
    try {
      if (!expense.userId) {
        return res.status(400).send({ message: "User ID is required" });
      }
      
      // Create the expense with userId
      let addExpense = await expenseModel.create(expense);
      res.status(201).send({ message: "Successfully added", data: addExpense });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Some problem while creating expense" });
    }
  });
//   get expense based on id
app.get('/getreport/:id',verifyToken, async (req, res) => {
    let userId = req.params.id;
    try {
      let report = await expenseModel.find({ userId }).populate('userId');
      res.status(200).send(report);
    } catch (err) {
      res.status(403).send({ message: "Problem while getting data" });
    }
  });
  // Endpoint to delete an expense
app.delete('/expense/:id',verifyToken, async (req, res) => {
    const expenseId = req.params.id;
    try {
        const deleteExpense = await expenseModel.findByIdAndDelete(expenseId);
        if (deleteExpense) {
            res.status(200).send({ message: "Successfully deleted" });
        } else {
            res.status(404).send({ message: "Expense not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Problem deleting the expense" });
    }
});

// Endpoint to update an expense
app.put('/updateexpense/:id',verifyToken, async (req, res) => {
    const expenseId = req.params.id;
    const newData = req.body;
    try {
        const updatedExpense = await expenseModel.findByIdAndUpdate(expenseId, newData, { new: true });
        if (updatedExpense) {
            res.status(200).send({ message: "Successfully updated", updatedExpense });
        } else {
            res.status(404).send({ message: "Expense not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Problem updating the expense" });
    }
});
  
 app.listen(8080,()=>{
    console.log("server running up and down");
 })