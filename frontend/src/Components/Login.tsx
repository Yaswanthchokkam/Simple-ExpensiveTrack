import React, { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
type handle={
    email:string,
    password:string
}
export default function Login(){
      const navigate=useNavigate();
    const[logindetails,setLoginDetails]=useState<handle>({
        email:'',
        password:''
    })
    const[message,setMessage]=useState({
        type:'',
        text:''
    })
   
    function handleInput(event:React.ChangeEvent<HTMLInputElement>){
        console.log(event.target.value)
        setLoginDetails((prev)=>{
            return({...prev,[event.target.name]:event.target.value})
        })
        // console.log(logindetails);
    }
    function SubmitForm(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        console.log(logindetails);
        fetch("http://localhost:8080/login",{
            method:"POST",
            body:JSON.stringify(logindetails),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((response)=>{
           
        console.log(response); 
        if(response.status==404){
            setMessage({type:"error",text:"Email is ivalid"})

        }
        else if(response.status==403){
            setMessage({type:"error",text:"Incorrect password"})
        }
        else if(response.status==200){
            setMessage({type:"success", text:"user loginned sucessfully"})
            setLoginDetails({
                email:'',
                password:''
            })
            setTimeout(()=>{
                setMessage({type:"invisible",text:"dummy"})
    
            },4000)
            return response.json()
        
        }
          
        })
        .then((data)=>{

            console.log(data);
            if(data!=null){
                console.log(data)
                localStorage.setItem('ExpenseToken',JSON.stringify(data));
                navigate('/expenses')
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <>
        <form className="forms" onSubmit={SubmitForm}>
            <div className="form loginbox">
            <input className="inp" type="email" placeholder="Enter ur email" name="email" value={logindetails.email} onChange={handleInput}  required />
            <input className="inp" type="password" placeholder="Enter ur password" name="password" value={logindetails.password} onChange={handleInput} required />
            <button className="btm">Login</button>
            <p className="reg">Don't have Account ? <Link className="link" to={'/register'}>Register here</Link></p>
            <p className={message.type}>{message.text}</p>
            </div>
        </form>
        </>
    )
}