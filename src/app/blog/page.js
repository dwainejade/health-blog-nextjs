// You'll need to create these files in your app directory:

// src/app/blog/page.js (Blog listing page - optional if you want /blog route)
import BlogList from "@/components/blog/BlogList";

export const metadata = {
  title: "All Articles | Health Blog",
  description:
    "Browse all our articles. Find expert advice on nutrition, fitness, mental health, and more.",
};

export default function BlogPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <BlogList />
    </div>
  );
}
