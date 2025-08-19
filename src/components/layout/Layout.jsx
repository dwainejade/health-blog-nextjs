// src/components/layout/Layout.jsx
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
