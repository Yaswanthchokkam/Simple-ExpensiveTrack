import React, { FormEvent, useState } from "react"
import { Link } from "react-router-dom"

type handle={
    name:string,
    email:string,
    password:string
}
export default function Register(){
    const[userdata,setUserData]=useState<handle>({
        name:'',
        email:'',
        password:'',
    })
    const[message,setMessage]=useState({
        type:'',
        text:''
    })

    function eventhandle(event:React.ChangeEvent<HTMLInputElement>){
       
          setUserData((prev)=>{
            // return({...prev,[event.target.name]:event.target.name==="password"?Number(event.target.value):event.target.value})
            return({...prev,[event.target.name]:event.target.value})
        })
    }
    function formSubmit(event:React.FormEvent<HTMLFormElement>){
          event.preventDefault();
          console.log(userdata);
          fetch("http://localhost:8080/register",{
            method:"POST",
            body:JSON.stringify(userdata),
        
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((response)=>{
            // console.log(response.formData);
            if(response.status==400){
               return response.json().then((data)=>{
                 console.log(data.message);
                 setMessage({type:"error" ,text:data.message})
               })
            }
            else if (response.status === 201) {
                setMessage({ type: "success", text: "User registered successfully" });
                setUserData({
                    name:'',
                    email:'',
                    password:''
                })
                setTimeout(()=>{
                    setMessage({type:"invisible",text:"dummy"})
                },3000)
                return response.json()
            }
        })
        .then((data)=>{
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return(
        <>
        <form className="forms" onSubmit={formSubmit}>
          <div className="form" >
             <input className="inp" type="name" placeholder="Enter User Name"name="name"  value={userdata.name}onChange={eventhandle} required/>
             <input className="inp" type="email" placeholder="Enter ur Email"name="email" value={userdata.email} onChange={eventhandle} required/>
             <input className="inp" type="password" placeholder="Enter ur password" name="password" value={userdata.password} onChange={eventhandle} required />
             <button className="btm" type="submit"> Register</button>
             <p className="reg">Already Registerd ? <Link className="link" to={'/'}>Login</Link></p>
             <p className={message.type}>{message.text}</p>
          </div>
          </form>
        </>
    )
}