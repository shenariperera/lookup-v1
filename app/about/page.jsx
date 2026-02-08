import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Lookup.lk
            </h1>
            <p className="text-xl text-primary-100">
              Sri Lanka's Premier Business Directory & Deals Platform
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At Lookup.lk, we're on a mission to connect Sri Lankan consumers with the best local businesses 
              and help them discover amazing deals that save money. We believe every business deserves a platform 
              to showcase their offerings, and every customer deserves access to the best deals in town.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're looking for restaurants, shopping, services, or entertainment, Lookup.lk is your 
              trusted companion for discovering what Sri Lanka has to offer.
            </p>
          </section>

          {/* What We Do Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Customers</h3>
                <p className="text-gray-700 leading-relaxed">
                  Browse thousands of exclusive deals and offers from verified businesses across Sri Lanka. 
                  Save money on dining, shopping, services, entertainment, and more. Our platform makes it 
                  easy to discover new businesses and find the best deals in your area.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Businesses</h3>
                <p className="text-gray-700 leading-relaxed">
                  Register your business for free and reach thousands of potential customers. Post unlimited 
                  deals and offers to attract new clients and grow your business. Our platform provides an 
                  easy-to-use dashboard to manage your profile and track your deals.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Lookup.lk?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-primary-500 text-2xl mb-3">✓</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free Listings</h3>
                <p className="text-gray-600">
                  No hidden fees. Register your business and post deals completely free.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-primary-500 text-2xl mb-3">✓</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Businesses</h3>
                <p className="text-gray-600">
                  All businesses are reviewed and approved to ensure quality and authenticity.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-primary-500 text-2xl mb-3">✓</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Simple, intuitive interface makes finding deals and managing listings effortless.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-primary-500 text-2xl mb-3">✓</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Focus</h3>
                <p className="text-gray-600">
                  Dedicated to supporting and promoting Sri Lankan businesses and communities.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Lookup.lk was born from a simple idea: make it easier for Sri Lankans to discover great local 
              businesses and amazing deals. We noticed that many fantastic businesses struggled to reach new 
              customers, while consumers spent hours searching for the best offers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we're proud to serve as a bridge between businesses and customers, helping both save time 
              and money while supporting the local economy. Join us in our journey to make Sri Lanka's business 
              landscape more accessible and rewarding for everyone.
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-700 mb-6">
              Whether you're a business owner or a deal hunter, join Lookup.lk today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/register" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md inline-block"
              >
                Register Your Business
              </a>
              <a 
                href="/deals" 
                className="bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Browse Deals
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}