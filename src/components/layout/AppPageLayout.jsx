import Navbar from "../Navbar";
import Footer from "../Footer";

export default function AppPageLayout({
  showProfile = false,
  mainClassName = "p-4 md:p-8",
  children,
}) {
  return (
    <div className="bg-slate-50 h-[100svh] flex flex-col">
      <Navbar showProfile={showProfile} />
      <main className={`flex-1 min-h-0 overflow-y-auto ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
