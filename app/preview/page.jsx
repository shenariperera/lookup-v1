'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import DealCard from '@/components/deals/DealCard';
import CompanyCard from '@/components/companies/CompanyCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/layout/HeroCarousel';

export default function ComponentPreview() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Component Preview</h1>

        {/* Header & Footer Info */}
        <Card className="mb-8 bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Header & Footer</h2>
          <p className="text-gray-700 mb-4">
            The Header and Footer are now visible on this page! Scroll to the top to see the sticky header with navigation, 
            and scroll to the bottom to see the footer with links and social media.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Header features:</strong> Logo, navigation links, Login/Register buttons, mobile menu</p>
            <p><strong>Footer features:</strong> Brand info, quick links, business links, legal links, social media, copyright</p>
          </div>
        </Card>

        {/* Hero Carousel Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hero Carousel</h2>
          <p className="text-gray-600 mb-6">
            Full-width hero section with text on left and auto-rotating image carousel on right. Perfect for homepage featured offers!
          </p>
        </Card>

        {/* Live Hero Example */}
        <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <HeroCarousel 
            slides={[
              {
                title: "Discover Amazing Deals Across Sri Lanka",
                description: "Browse thousands of exclusive offers from top businesses. Save money on restaurants, shopping, services, and more!",
                primaryButtonText: "Browse All Deals",
                primaryButtonLink: "/deals",
                secondaryButtonText: "Register Your Business",
                secondaryButtonLink: "/auth/register",
                image: null // Will show placeholder
              },
              {
                title: "50% Off All Electronics",
                description: "Limited time offer! Get massive discounts on laptops, phones, tablets and accessories from trusted retailers.",
                primaryButtonText: "Shop Electronics",
                primaryButtonLink: "/deals/electronics",
                secondaryButtonText: "View All Categories",
                secondaryButtonLink: "/categories",
                image: null
              },
              {
                title: "Free Delivery on Orders Over Rs. 5000",
                description: "Shop from your favorite stores and get free home delivery. Valid for all participating merchants across Colombo.",
                primaryButtonText: "Start Shopping",
                primaryButtonLink: "/deals",
                image: null
              }
            ]}
          />
        </div>

        {/* Buttons Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
          
          <div className="space-y-6">
            {/* Primary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Primary</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Secondary</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Outline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Outline</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </div>

            {/* Danger */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Danger</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="danger">Delete</Button>
                <Button variant="danger" disabled>Disabled</Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Full Width</h3>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>

            {/* Interactive */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Interactive</h3>
              <Button 
                variant="primary" 
                onClick={() => alert('Button clicked!')}
              >
                Click Me!
              </Button>
            </div>
          </div>
        </Card>

        {/* Badges Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges</h2>
          
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="featured">⭐ Featured</Badge>
                <Badge variant="hot">🔥 Hot Deal</Badge>
                <Badge variant="success">✓ Active</Badge>
                <Badge variant="warning">⚠ Pending</Badge>
                <Badge variant="error">✕ Expired</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="featured" size="small">Small</Badge>
                <Badge variant="featured" size="default">Default</Badge>
                <Badge variant="featured" size="large">Large</Badge>
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Common Use Cases</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="featured">⭐ Featured Deal</Badge>
                <Badge variant="hot">🔥 50% OFF</Badge>
                <Badge variant="success">New</Badge>
                <Badge variant="default">Electronics</Badge>
                <Badge variant="default">Food & Drink</Badge>
                <Badge variant="warning">Ends Soon</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Search Input Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Input</h2>
          
          <div className="space-y-6">
            {/* Default Search */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Default Search Bar</h3>
              <SearchInput 
                placeholder="Search for deals, companies, categories..."
                onSearch={(query) => alert(`Searching for: ${query}`)}
              />
            </div>

            {/* Compact Search */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Compact Search (for header)</h3>
              <SearchInput 
                placeholder="Search..."
                onSearch={(query) => alert(`Searching for: ${query}`)}
              />
            </div>

            {/* Custom Placeholder */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Placeholder</h3>
              <SearchInput 
                placeholder="Hotel, Burger, Solar, MBA, Offers, etc"
                onSearch={(query) => alert(`Searching for: ${query}`)}
              />
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
          
          <div className="space-y-6">
            {/* Default Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Default Card with Hover</h3>
              <Card>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Card Title</h4>
                <p className="text-gray-600">This is a default card with padding and hover effect. Try hovering over it!</p>
              </Card>
            </div>

            {/* No Hover */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Card without Hover</h3>
              <Card hover={false}>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Static Card</h4>
                <p className="text-gray-600">This card has no hover effect.</p>
              </Card>
            </div>

            {/* Different Padding */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Padding Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="small">
                  <p className="text-sm text-gray-600">Small padding</p>
                </Card>
                <Card padding="default">
                  <p className="text-sm text-gray-600">Default padding</p>
                </Card>
                <Card padding="large">
                  <p className="text-sm text-gray-600">Large padding</p>
                </Card>
              </div>
            </div>

            {/* Deal Card Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Example: Deal Card</h3>
              <Card>
                <div className="flex gap-3 mb-3">
                  <Badge variant="featured">⭐ Featured</Badge>
                  <Badge variant="hot">🔥 Hot Deal</Badge>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">50% Off All Pizza</h4>
                <p className="text-gray-600 mb-4">Get half price on any large pizza. Valid until end of month.</p>
                <div className="flex gap-3">
                  <Button variant="primary">View Deal</Button>
                  <Button variant="secondary">Save</Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* DealCard Component */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deal Cards (Final Design)</h2>
          <p className="text-gray-600 mb-6">
            Clean, simple cards with yellow "View Offer" button - just like the competitor!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Deal 1 */}
            <DealCard
              title="Enjoy Up to 11.67% p.a. on AMF Fixed Deposits!"
              companyName="Associated Motor Finance"
              href="/deals/amf-fixed-deposits"
            />

            {/* Deal 2 */}
            <DealCard
              title="Free Frame and Buy 1 Get 1 FREE Sunglasses!!"
              companyName="Choice.lk - Eyewear"
              href="/deals/sunglasses-bogo"
            />

            {/* Deal 3 */}
            <DealCard
              title="Education dreams made possible with Commercial Bank"
              companyName="Commercial Bank of Ceylon PLC"
              href="/deals/education-loan"
            />

            {/* Deal 4 */}
            <DealCard
              title="50% Off All Pizza - Limited Time Only"
              companyName="Pizza Palace"
              href="/deals/pizza-sale"
            />

            {/* Deal 5 */}
            <DealCard
              title="Buy 1 Get 1 Free - All Burgers"
              companyName="Burger King LK"
              href="/deals/burger-bogo"
            />

            {/* Deal 6 */}
            <DealCard
              title="Free Delivery on Orders Over Rs. 5000"
              companyName="SuperMart Online"
              href="/deals/free-delivery"
            />

            {/* Deal 7 */}
            <DealCard
              title="25% Off All Spa Treatments This Month"
              companyName="Serenity Spa"
              href="/deals/spa-discount"
            />

            {/* Deal 8 */}
            <DealCard
              title="2 for 1 Movie Tickets - Weekdays Only"
              companyName="Cinema City"
              href="/deals/movie-promo"
            />
          </div>
        </Card>

        {/* CompanyCard Component */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Cards (Horizontal Design)</h2>
          <p className="text-gray-600 mb-6">
            Horizontal cards with square image on left, perfect for company listings with descriptions.
          </p>
          
          <div className="space-y-4">
            {/* Company 1 - With full details */}
            <CompanyCard
              name="Interactive Design Studio"
              category="Professional Service"
              address="#32, Vidyala Mawatha, Mawilmada, Kandy"
              description="Interactive Design Studio provides innovative designs such as logo designs, flyer designs, visiting cards, greeting cards, magazine designs, annual reports etc. video editing, video production and more professional services."
              href="/companies/interactive-design-studio"
            />

            {/* Company 2 - With address */}
            <CompanyCard
              name="M Abdulally"
              category="Company or Organization"
              address="81 Old Moor St, Colombo, Sri Lanka"
              description="Leading supplier of quality products and services. Trusted by businesses across Sri Lanka for over 50 years."
              href="/companies/m-abdulally"
            />

            {/* Company 3 - Without address */}
            <CompanyCard
              name="Tech Solutions LK"
              category="IT & Technology"
              description="Leading provider of enterprise software solutions and IT consulting services. We help businesses transform digitally with cutting-edge technology."
              href="/companies/tech-solutions"
            />

            {/* Company 4 - Short description */}
            <CompanyCard
              name="Green Leaf Restaurant"
              category="Food & Beverage"
              address="123 Galle Road, Colombo 03"
              description="Authentic Sri Lankan cuisine with a modern twist."
              href="/companies/green-leaf"
            />

            {/* Company 5 - Minimal info */}
            <CompanyCard
              name="Fashion Hub"
              category="Retail & Shopping"
              address="Liberty Plaza, Colombo 07"
              href="/companies/fashion-hub"
            />
          </div>
        </Card>

        {/* Usage Example */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
          
          <div className="space-y-6">
            {/* DealCard Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">DealCard</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`<DealCard
  title="Free Frame and Buy 1 Get 1 FREE Sunglasses!!"
  companyName="Choice.lk - Eyewear"
  companyLogo="/logos/choice-eyewear.png" // optional
  image="/deals/sunglasses-promo.jpg" // optional
  href="/deals/sunglasses-bogo"
/>`}
                </pre>
              </div>
            </div>

            {/* CompanyCard Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">CompanyCard</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`<CompanyCard
  name="Interactive Design Studio"
  category="Professional Service"
  image="/images/companies/design-studio.jpg" // optional
  logo="/logos/design-studio.png" // optional small logo
  address="#32, Vidyala Mawatha, Kandy" // optional
  description="Brief description..." // optional, 3 lines max
  href="/companies/interactive-design-studio"
/>`}
                </pre>
              </div>
            </div>

            {/* HeroCarousel Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">HeroCarousel</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`<HeroCarousel 
  slides={[
    {
      title: "Discover Amazing Deals",
      description: "Browse thousands of exclusive offers...",
      primaryButtonText: "Browse Deals",
      primaryButtonLink: "/deals",
      secondaryButtonText: "Register", // optional
      secondaryButtonLink: "/auth/register", // optional
      image: "/banners/hero-1.jpg" // optional
    },
    {
      title: "50% Off Electronics",
      description: "Limited time offer...",
      primaryButtonText: "Shop Now",
      primaryButtonLink: "/deals/electronics"
    }
  ]}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
    
    <Footer />
    </>
  );
}