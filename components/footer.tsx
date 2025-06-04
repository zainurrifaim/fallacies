export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-950 mb-4">About This Tool</h3>
            <p className="text-neutral-700 text-sm leading-relaxed">
              An AI-powered tool designed to help identify logical fallacies in arguments and reasoning. Perfect for
              students, educators, and anyone interested in critical thinking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-950 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-700 hover:text-neutral-950 transition-colors">
                  Logical Fallacy Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-700 hover:text-neutral-950 transition-colors">
                  Critical Thinking Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-700 hover:text-neutral-950 transition-colors">
                  Academic Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-950 mb-4">Contact</h3>
            <p className="text-neutral-700 text-sm">Questions or feedback? We'd love to hear from you.</p>
            <a
              href="mailto:contact@fallacychecker.com"
              className="text-neutral-700 hover:text-neutral-950 transition-colors text-sm"
            >
              zainurrifaim@thursinaiibs.sch.id
            </a>
          </div>
        </div>

        <div className="border-t border-neutral-300 mt-8 pt-6 text-center">
          <p className="text-neutral-700 text-sm">© 2025 Logical Fallacy Checker. Built for better reasoning.</p>
        </div>
      </div>
    </footer>
  )
}