

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Footer Left */}
          <div>
            <a href="#" className="text-2xl font-bold text-orange-600 hover:text-orange-400 transition">
              E-<span className="text-white">commerch</span>
            </a>
            <p className="mt-2 text-gray-400 text-sm">
              Your go-to place for stunning, high-quality website templates. Build your website quickly and professionally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Templates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Contact</a></li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">More Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-300 transition">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="mt-4 flex space-x-4">

              <a href="#" className="text-gray-400 hover:text-gray-300 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zM12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-300 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-14 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 6h-4v-4h4v4zm0-6h-4V9h4v3z" />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-300 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 15l-3 3-3-3h2v-4h2v4h2zM12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8S4 12.41 4 8s3.59-8 8-8zM12 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </a>

            </div>

            <p className="mt-4 text-gray-400 text-sm">
              Email: support@templatesee.com
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
          <p>© 2025 TemplateSee. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}


export default Footer