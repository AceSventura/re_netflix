import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Profiles from "@/components/account/Profiles";

export default function ProfilesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
      <Navbar />
      
      <main className="grow w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          <aside className="w-full md:w-60 shrink-0">
            <Sidebar />
          </aside>

          <Profiles />

        </div>
      </main>

      <Footer />
    </div>
  );
}