// src/pages/About.jsx

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6">
            About Cycles & Stages
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            Your trusted source for evidence-based health and wellness content,
            designed to empower you on your journey to better living.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center font-light leading-relaxed">
            <strong>Medical Disclaimer:</strong> The content on HealthHub is for
            informational purposes only and is not intended as medical advice,
            diagnosis, or treatment. Always consult with qualified healthcare
            professionals before making significant changes to your health
            routine or if you have medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
