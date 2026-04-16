import React from "react";
import Home from "./home/home";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import Contact from "./Components/Contact";
import Signup from "./Components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";  
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminOrders from "./Components/AdminOrders"; 

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/course"
            element={authUser ? <Courses /> : <Navigate to="/signup" />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;