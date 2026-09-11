import { useState, useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";
// The UI package is consumed at runtime because it is not a buildable library.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Header, Sidebar } from "@hsms/ui";
import { Country } from "./pages/Country";
import { State } from "./pages/State";
import { Profile } from "./pages/Profile";
import { City } from "./pages/City";
import { Branch } from "./pages/Branch";
import { Company } from "./pages/Company";
import { Departments } from "./pages/DepartmentMaster";
import {CreateCompany }from "./pages/CreateCompany";
import{CreateBranch }from "./pages/CreateBranch";
import { UserLogoutService } from "./services/UserLogin.service";
import{UserMaster} from "./pages/UserMaster";
import {User} from "./pages/User";
import {Doctor} from "./pages/Doctor";
import{ DoctorForm} from "./pages/DoctorForm";
import{DoctorEditForm} from "./pages/DoctorEditForm";
import{Patient} from "./pages/Patient";
import { CreatePatient } from "./pages/CreatePatient";
import PatientDetails from "./pages/PatientDetails"; // your view component
import { Appointment } from "./pages/Appointment";
import{ ModernDashboard } from "./pages/ModernDashboard";
import{LogoutPage} from "./pages/LogoutPage";
const { Content } = Layout;

export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    userId:number;
    name: string;
    email: string;
    role: string;
    logomin:string;
    logoMax:string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
   

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const fakeUser = {
        userId:1,
        name: "Naresh Kumaar",
        email: "naresh@example.com",
        role: "Super Admin",
        logomin:"https://pampana.bsite.net/Content/images/logo.png",
        logoMax:"https://pampana.bsite.net/Content/images/logo1.png"

      };

      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
    }

    if(!token)
    {
       navigate("/", {
      replace: true,
    });
    }


  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  const toggle = () => setCollapsed(!collapsed);

  const handleProfile = () => {
    navigate("/profile");
  };

 const handleLogout = async () => {
  try {
    // Call logout API with JWT
    const response = await UserLogoutService.logout();

    console.log("Logout successful:", response);
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    // Remove JWT
    localStorage.removeItem("token");

    // Remove user
    localStorage.removeItem("user");

    // Clear user state
    setUser(null);

    // Go to login page
    navigate("/", {
      replace: true,
    });
  }
};

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} roles={user.role} 
      logmin={user.logomin} logomax={user.logoMax}
      />

      <Layout>
        <Header
          collapsed={collapsed}
          toggle={toggle}
          onProfileClick={handleProfile}
          onLogout={handleLogout}
          username={user.name}
        />
   
        <Content style={{ margin: 16, padding: 24, background: "#fff" }}>
          <Routes>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path="/country" element={<Country />} />
            <Route path="/state" element={<State />} />
            <Route path="/city" element={<City />} />           
            <Route path="/branch" element={<Branch />} />
            <Route path="/company" element={<Company/>}/>
            <Route path="/profile" element={<Profile />} />
          <Route path="/company/add" element={<CreateCompany />} />
           <Route path="/Department" element={<Departments/>} />
           <Route path="/branch/add" element={<CreateBranch companyId={0} />} />
           <Route path="/users/add" element={<UserMaster />} />
           <Route path="/User" element={<User />} />
           <Route path="/doctor" element={<Doctor/>}/>
           <Route
             path="/doctor/add"
             element={
               <DoctorForm
                 onCancel={() => navigate("/doctor")}
                 onSuccess={() => navigate("/doctor")}
               />
             }
           />
           <Route path="doctors/:id/edit" element={<DoctorEditForm />} />
           <Route path="/patient" element={<Patient />} />
           <Route path="/patient/add" element={<CreatePatient />} />
           <Route path="/patient/:patientId" element={<PatientDetails />} />
           <Route path="/appointments" element={<Appointment />} />
           <Route path="/dashboard" element={<ModernDashboard />} />
           <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;