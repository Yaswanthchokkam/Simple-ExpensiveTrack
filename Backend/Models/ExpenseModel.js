const mongoose=require('mongoose')
const expenseSchema=mongoose.Schema({
    itemId:{
        type:String,
        required:true
    },
    itemName:{
        type:String,
        required:true
    },
    Amount:{
        type:Number,
        required:true
    },
    expenseDate:{
        type:String,
         default:new Date().toLocaleDateString(),
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    Category:{
        type:String,
        required:true
    }
},{timestamps:true})
const expenseModel=mongoose.model('expenses',expenseSchema)
module.exports=expenseModel;