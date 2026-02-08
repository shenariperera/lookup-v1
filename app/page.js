'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/layout/HeroCarousel';
import DealCard from '@/components/deals/DealCard';
import CompanyCard from '@/components/companies/CompanyCard';

// --- Dummy Data ---

const heroSlides = [
  {
    title: "Discover Amazing Promos Across Sri Lanka",
    description: "Browse thousands of exclusive offers from top businesses. Save money on restaurants, shopping, services, and more!",
    primaryButtonText: "Browse All Promos",
    primaryButtonLink: "/deals",
    secondaryButtonText: "Register Your Business",
    secondaryButtonLink: "/auth/register",
    image: null,
  },
  {
    title: "Up to 50% Off Electronics",
    description: "Limited time offer! Get massive discounts on laptops, phones, tablets and accessories from trusted retailers across the island.",
    primaryButtonText: "Shop Electronics",
    primaryButtonLink: "/deals/category/electronics",
    secondaryButtonText: "View All Categories",
    secondaryButtonLink: "/deals",
    image: null,
  },
  {
    title: "Free Delivery on Orders Over Rs. 5,000",
    description: "Shop from your favorite stores and get free home delivery. Valid for all participating merchants across Colombo and beyond.",
    primaryButtonText: "Start Shopping",
    primaryButtonLink: "/deals",
    image: null,
  },
];

const featuredPromos = [
  { title: "Enjoy Up to 11.67% p.a. on Fixed Deposits!", companyName: "Associated Motor Finance", href: "/deals/amf-fixed-deposits" },
  { title: "Free Frame + Buy 1 Get 1 FREE Sunglasses", companyName: "Choice.lk - Eyewear", href: "/deals/sunglasses-bogo" },
  { title: "Education Loans Made Easy", companyName: "Commercial Bank of Ceylon", href: "/deals/education-loan" },
  { title: "50% Off All Pizza - Limited Time Only", companyName: "Pizza Palace", href: "/deals/pizza-sale" },
  { title: "Buy 1 Get 1 Free - All Burgers", companyName: "Burger King LK", href: "/deals/burger-bogo" },
  { title: "25% Off All Spa Treatments This Month", companyName: "Serenity Spa", href: "/deals/spa-discount" },
  { title: "2 for 1 Movie Tickets - Weekdays Only", companyName: "Cinema City", href: "/deals/movie-promo" },
  { title: "Free Delivery on Orders Over Rs. 5,000", companyName: "SuperMart Online", href: "/deals/free-delivery" },
  { title: "Buy 1 Get 1 Free - All Burgers", companyName: "Burger King LK", href: "/deals/burger-bogo2" },
  { title: "25% Off All Spa Treatments This Month", companyName: "Serenity Spa", href: "/deals/spa-discount2" },
  { title: "2 for 1 Movie Tickets - Weekdays Only", companyName: "Cinema City", href: "/deals/movie-promo2" },
  { title: "50% Off All Pizza - Limited Time Only", companyName: "Pizza Palace", href: "/deals/pizza-sale2" },
];

const categories = [
  { name: "Food & Drink",       slug: "food-and-drink",      icon: "🍔" },
  { name: "Shopping",           slug: "shopping",            icon: "🛍️" },
  { name: "Electronics",        slug: "electronics",         icon: "💻" },
  { name: "Beauty & Wellness",  slug: "beauty-and-wellness", icon: "💆" },
  { name: "Travel & Stay",      slug: "travel-and-stay",     icon: "✈️" },
  { name: "Education",          slug: "education",           icon: "📚" },
  { name: "Automotive",         slug: "automotive",          icon: "🚗" },
  { name: "Finance",            slug: "finance",             icon: "💳" },
];

const recentCompanies = [
  { name: "Interactive Design Studio", category: "Professional Service", address: "#32, Vidyala Mawatha, Mawilmada, Kandy", description: "Innovative designs including logo designs, flyer designs, visiting cards, greeting cards, magazine designs, annual reports, video editing and more.", href: "/companies/interactive-design-studio" },
  { name: "Commercial Bank of Ceylon", category: "Finance", address: "No. 21, Bristol Street, Colombo 00200", description: "Sri Lanka's leading commercial bank offering a wide range of banking products and financial services to individuals and corporates.", href: "/companies/commercial-bank" },
  { name: "Tech Solutions LK", category: "IT & Technology", description: "Leading provider of enterprise software solutions and IT consulting services. Helping businesses transform digitally with cutting-edge technology.", href: "/companies/tech-solutions" },
  { name: "Green Leaf Restaurant", category: "Food & Beverage", address: "123 Galle Road, Colombo 03", description: "Authentic Sri Lankan cuisine with a modern twist. Fresh ingredients sourced daily from local farms across the island.", href: "/companies/green-leaf" },
];

// --- Page ---

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* Browse by Category */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/deals/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-all text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Promos */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Promotions</h2>
            <Link href="/deals" className="text-primary-500 hover:text-primary-600 font-semibold text-md transition-colors">
              View All Promotions →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {featuredPromos.map((promo) => (
              <DealCard key={promo.href} title={promo.title} companyName={promo.companyName} href={promo.href} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Companies */}
      {/* <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Companies</h2>
            <Link href="/companies" className="text-primary-500 hover:text-primary-600 font-semibold text-md transition-colors">
              View All Companies →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentCompanies.map((company) => (
              <CompanyCard
                key={company.href}
                name={company.name}
                category={company.category}
                address={company.address}
                description={company.description}
                href={company.href}
              />
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </>
  );
}