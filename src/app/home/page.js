// src/app/page.js (Update your existing home page)
import BlogList from "@/components/blog/BlogList";

export const metadata = {
  title: "Home | Health Blog - Wellness & Lifestyle",
  description:
    "Discover evidence-based health and wellness articles. Expert insights on nutrition, fitness, mental health, and lifestyle optimization.",
  keywords:
    "health blog, wellness articles, nutrition tips, fitness advice, mental health",
};

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <BlogList />
    </div>
  );
}
