import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ role: "patient", identifier: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({ role, identifier: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let base_url = "http://127.0.0.1:3456/"
      if(formData.role =='patient'){
        base_url = base_url+"patient-login"
        
      }else{
        formData["reg_no"] = formData.phone;
        base_url = base_url+"admin-login"
      }
      console.log(formData)
      const response = await axios.post(base_url, formData);
      console.log("Login Successful:", response.data);
      alert(`Login Successful ${response.data.response.name} `);
      //const navigate = useNavigate();
      //navigate('/');
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">{formData.role === "doctor" ? "Registration Number" : "Phone Number"}</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={formData.role === "doctor" ? "Enter your registration number" : "Enter your phone number"}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
