import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-transparent text-[#e5e5e5] font-sans overflow-hidden">
      <Sidebar />
      {/* On mobile, add top padding for the fixed top bar */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0 mt-[60px] md:mt-0">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;