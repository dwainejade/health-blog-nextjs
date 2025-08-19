// src/components/layout/Footer.js
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-medium text-gray-900 mb-4 block"
            >
              HealthHub
            </Link>
            <p className="text-sm text-gray-600 font-light max-w-sm leading-relaxed">
              Evidence-based health content from researchers and practitioners
              around the world.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/write"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Write
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">
                Topics
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/topics/nutrition"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Nutrition
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics/exercise"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Exercise
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics/mental-health"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Mental Health
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics/wellness"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Wellness
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-gray-500">
            © {currentYear} HealthHub. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="https://github.com/your-username/health-blog-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
