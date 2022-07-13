import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout() {
    return (
        <div className="container section pt-0">
          <Navbar />
          <Outlet />
        </div>
      );
}