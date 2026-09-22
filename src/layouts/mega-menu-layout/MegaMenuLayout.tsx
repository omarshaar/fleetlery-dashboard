import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";

/**
 * MegaMenuLayout - Layout with advanced header and navigation system
 * 
 * Features:
 * - Main header with search, notifications, and user menu
 * - Navigation bar with dropdown menus
 * - Fully responsive design
 * - RTL/LTR support
 * - Dark/Light theme support
 */
const MegaMenuLayout = () => {
  return (
    <div className="h-screen w-screen overflow-auto">
      {/* Header Section */}
      <Header />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Main Content Area */}
      <main className="mx-auto" style={{height: "calc(100vh - var(--header-height) - var(--page-padding) - 45px)"}}>
        <Outlet />
      </main>
    </div>
  );
};

export default memo(MegaMenuLayout);
