import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
interface ExpenseData {
  _id: string;
  itemId: number;
  itemName: string;
  Amount: number;
  Category: string;
  expenseDate: string;
  userId: string;
}
const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  if (!apiUrl) {
    throw new Error("API URL is not defined in env variable");
  }

  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [loggeddetails, setLoggedDetails] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({
    itemId: "",
    itemName: "",
    Amount: 0,
    Category: "",
  });
  const [view, setView] = useState<'form' | 'report'>('report');
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("ExpenseToken");
    if (storedUserId) {
      const userobj = JSON.parse(storedUserId);
      setLoggedDetails(userobj.id);
      setToken(userobj.token);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [loggeddetails, view]);

  const fetchExpenses = () => {
    if (loggeddetails) {
      fetch(`${apiUrl}/getreport/${loggeddetails}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            setExpenseData(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddOrUpdateExpense = () => {
    const payload = {
      ...newExpense,
      userId: loggeddetails,
      expenseDate: new Date().toLocaleDateString("en-GB"),
    };

    const url = isEditing
      ? `${apiUrl}/updateexpense/${editId}`
      : `${apiUrl}/addexpenses`;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(() => {
        setMessage(isEditing ? "Expense updated successfully" : "Expense added successfully");
        fetchExpenses();
        setNewExpense({ itemId: "", itemName: "", Amount: 0, Category: "" });
        setView("report");
        setIsEditing(false);
        setEditId(null);
      })
      .catch((err) => {
        console.log(err);
        setMessage(isEditing ? "Failed to update expense" : "Failed to add expense");
      });
  };

  const handleEdit = (id: string) => {
    const expenseToEdit = expenseData.find(exp => exp._id === id);
    if (expenseToEdit) {
      setNewExpense({
        itemId: expenseToEdit.itemId.toString(),
        itemName: expenseToEdit.itemName,
        Amount: expenseToEdit.Amount,
        Category: expenseToEdit.Category,
      });
      setIsEditing(true);
      setEditId(id);
      setView("form");
    }
  };

  const handleDelete = (id: string) => {
    fetch(`${apiUrl}/expense/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    })
      .then(() => {
        setMessage("Expense deleted successfully");
        setExpenseData((prevData) => prevData.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.log(err);
        setMessage("Failed to delete expense");
      });
  };

  const handleHomePageClick = () => {
    localStorage.removeItem("ExpenseToken"); 
    navigate('/'); 
  };

  return (
    <>
      <h1>Personal Expense Manager</h1>
      <div className="expense-btm">
        <button onClick={() => setView('form')} className="addExpenses">Add Expenses</button>
        <button onClick={() => setView('report')} className="expenseReport">Expense Report</button>
        <button className="addExpenses home" onClick={handleHomePageClick}>
          Home Page
        </button>
      </div>
      {message && <p className="success">{message}</p>}

      {view === 'form' && (
        <>
          <h2 className="addexpense-heading">{isEditing ? "Edit Expense" : "Add New Expense"}</h2>
          <div className="add-inp">
            <input
              className="add-input"
              type="number"
              name="itemId"
              placeholder="Item ID"
              value={newExpense.itemId}
              onChange={handleInputChange}
            />
            <input
              className="add-input"
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={newExpense.itemName}
              onChange={handleInputChange}
            />
            <input
              className="add-input"
              type="number"
              name="Amount"
              placeholder="Amount"
              value={newExpense.Amount}
              onChange={handleInputChange}
            />
            <input
              className="add-input"
              type="text"
              name="Category"
              placeholder="Category"
              value={newExpense.Category}
              onChange={handleInputChange}
            />
            <button className="btm-addexpense" onClick={handleAddOrUpdateExpense}>
              {isEditing ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </>
      )}

      {view === 'report' && (
        <>
          {expenseData.length > 0 ? (
            <div className="reports">
              <table className="report">
                <thead className="reportheadings">
                  <tr className="reportsheadings">
                    <th className="reporthaeding">Item ID</th>
                    <th className="reporthaeding">Item Name</th>
                    <th className="reporthaeding">Amount</th>
                    <th className="reporthaeding">Expense Date</th>
                    <th className="reporthaeding">Category</th>
                    <th className="reporthaeding">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((data) => (
                    <tr key={data._id}>
                      <td>
                        <input className="input" type="text" name="itemId" value={data.itemId} readOnly />
                      </td>
                      <td >
                        <input className="input" type="text" name="itemName" value={data.itemName} readOnly />
                      </td>
                      <td>
                        <input className="input" type="text" name="Amount" value={data.Amount} readOnly />
                      </td>
                      <td>
                        <input className="input" type="text" name="expenseDate" value={data.expenseDate} readOnly />
                      </td>
                      <td>
                        <input className="input" type="text" name="Category" value={data.Category} readOnly />
                      </td>
                      <td className="action">
                        <button className="edit" onClick={() => handleEdit(data._id)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(data._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="response">No expenses found. Please Add Your Expenses</p>
          )}
        </>
      )}
    </>
  );
};

export default Expenses;
