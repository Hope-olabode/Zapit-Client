// Layout.jsx
import Nav from "../components/Nav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full min-h-[100dvh] relative lg:w-auto scrollbar-hide">
      <div className="fixed bottom-[48px] left-0 w-full flex justify-center z-10 lg:h-full lg:bottom-[-50%] lg:left-[40px] lg:justify-normal lg:translate-y-[-50%] lg:py-[56px] lg:w-auto">
        <Nav />
      </div>
      <Outlet />
    </div>
  );
}
