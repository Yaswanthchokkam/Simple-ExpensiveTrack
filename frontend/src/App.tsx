// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/Register'
import Login from './Components/Login'
import Expenses from './Components/Expenses'
import { useState } from 'react'
import { UserContext } from './Contexts/userContext'
import Private from './Components/Private'
import { User } from './Contexts/userContext'
function App() {
 
  const storedUser = localStorage.getItem('ExpenseToken');
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
  return (
    <>
    <UserContext.Provider value={{user,setUser}}>
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      {/* <Route path='/expenses' element={<Expenses/>}/> */}
      <Route path='/expenses' element={<Private Component={Expenses}/>}/>
     </Routes>

    </BrowserRouter>
    </UserContext.Provider>
    </>
  )
}

export default App
