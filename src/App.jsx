
import { Route, Routes } from "react-router-dom";
import Logs from "./pages/Logs.jsx";
import Nav from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Layout from "./pages/Layout.jsx";
import Fake from "./pages/fake.jsx";

import Loader from "./components/Loader.jsx";
import Report from "./pages/Report.jsx";
import Location from "./pages/Location.jsx";

import { Context } from "./context/Context.jsx";
import Camera from "./components/Camera.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/Logs" element={<Logs />} />
          <Route path="/location" element={<Location />} />
          <Route path="/report" element={<Report />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/c" element={<Camera />}/>
        <Route path="/f" element={<Fake />}/>
        <Route path="*" element={<Loader />} />   
      </Routes>
    </>
  );
}
