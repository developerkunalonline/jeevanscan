import { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    role: "doctor",
    registration: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      let base_url = "http://127.0.0.1:3456/"
      if(formData.role =='patient'){
        base_url = base_url+"patient-signup"
        
      }else{
        formData["reg_no"] = formData.phone;
        base_url = base_url+"admin-signup"
      }
      console.log(formData)
      const response = await axios.post(base_url, formData);
      console.log("Login Successful:", response.data);
      alert(`Login Successful ${response.data.response.name} `);
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              {formData.role === "patient" ? "Phone Number" : "Registration Number"}
            </label>
            <input
              type={formData.role === "patient" ? "tel" : "text"}
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              placeholder={
                formData.role === "patient" ? "Enter your phone number" : "Enter your registration number"
              }
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
