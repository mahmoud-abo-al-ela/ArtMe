import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Layout = ({ children, setIsAuthenticated }) => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header setIsAuthenticated={setIsAuthenticated} />
          <main className="p-6 overflow-auto flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
