import Header from '@/components/Header';
import EnhancedStylistApp from '@/components/EnhancedStylistApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="flex min-h-screen flex-col items-center pt-28 p-4 pb-16">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Fashion Stylist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload images of your clothing items and get personalized style recommendations
            </p>
          </div>

          <EnhancedStylistApp />

          <div className="mt-20">
            <section className="mb-16" id="how-it-works">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
                  <p className="text-gray-600">Upload images of your clothing items, accessories, or existing outfits</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Our AI analyzes your items for style, color, patterns, and fashion potential</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                  <p className="text-gray-600">Receive personalized outfit ideas, color combinations, and styling tips</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AI Stylist. All images are processed in-memory and not stored.</p>
          <p className="mt-2">
            <a href="#privacy" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors">Privacy</a>
            <a href="#terms" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors">Terms</a>
            <a href="#contact" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors">Contact</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
