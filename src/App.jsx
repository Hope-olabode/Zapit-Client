
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
import Survey from "./pages/Survey.jsx";
import NewSurvey from "./pages/NewSurvey.jsx";
import UpdateSurvey from "./pages/UpdateSurvey.jsx"
import ViewLocation from "./pages/ViewLocation.jsx"
import ViewDay from "./pages/ViewDay.jsx"
import Chat from "./pages/Chat.jsx"
import Line from "./pages/Line.jsx"

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/logs" element={<Logs />} />
          <Route path="/location" element={<Location />} />
          <Route path="/report" element={<Report />} />
          <Route path="/surveys" element={<Survey />} caseSensitive />
          
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/c" element={<Camera />}/>
        <Route path="/f" element={<Fake />}/>
        <Route path="*" element={<Loader />} />
        <Route path="/survey/edit" element={<NewSurvey />} caseSensitive />
        <Route path="/survey/new" element={<NewSurvey />} caseSensitive />
        <Route path="/survey/update" element={<UpdateSurvey />} caseSensitive />
        
        
        <Route path="/location/view" element={<ViewLocation />} caseSensitive />
          <Route path="/location/view/day" element={<ViewDay />} caseSensitive />
          <Route path="/chat" element={<Chat />} caseSensitive />
          <Route path="/line" element={<Line />} caseSensitive />

      </Routes>
    </>
  );
}
