// Layout.jsx
import Nav from "../components/Nav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden">
      <div className="fixed bottom-[48px] left-0 w-full flex justify-center z-10">
        <Nav />
      </div>
      <Outlet />
    </div>
  );
}
