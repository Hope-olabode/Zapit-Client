import Nav from "../components/Nav";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div className="w-full h-[100vh] relative">
      <div className="absolute w-full flex justify-center bottom-[48px] z-10">
        <Nav />
      </div>
      <Outlet />
    </div>
  );
}
