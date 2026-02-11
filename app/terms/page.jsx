import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-primary-100">
              Last Updated: February 2026
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to Lookup.lk! These Terms and Conditions govern your use of our website and services. 
              By accessing or using Lookup.lk, you agree to be bound by these terms.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Please read these terms carefully before using our platform. If you do not agree with any part 
              of these terms, you must not use our services.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Definitions</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-3 text-gray-700">
                <li><strong>"Platform"</strong> refers to the Lookup.lk website and all related services</li>
                <li><strong>"User"</strong> refers to anyone who accesses or uses the Platform</li>
                <li><strong>"Business Account"</strong> refers to registered businesses posting offers and offers</li>
                <li><strong>"Content"</strong> refers to all text, images, offers, and information posted on the Platform</li>
                <li><strong>"We," "Us," "Our"</strong> refers to Lookup.lk and its operators</li>
              </ul>
            </div>
          </section>

          {/* Account Registration */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Account Registration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old and legally capable of entering into binding contracts to 
                  create an account. By registering, you represent that you meet these requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Account Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must provide accurate, current, and complete information during registration. You are 
                  responsible for maintaining the confidentiality of your account credentials and for all 
                  activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Account Approval</h3>
                <p className="text-gray-700 leading-relaxed">
                  All business registrations are subject to approval by our team. We reserve the right to 
                  reject any registration for any reason, including but not limited to duplicate accounts, 
                  fraudulent information, or violation of our policies.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Conduct</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                When using our Platform, you agree NOT to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Post false, misleading, or fraudulent offers or business information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Impersonate another person or business</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Scrape, crawl, or harvest data from the Platform without permission</li>
                <li>Interfere with or disrupt the Platform's operation</li>
                <li>Create multiple accounts for the same business</li>
              </ul>
            </div>
          </section>

          {/* Business Listings and Offers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Business Listings and Offers</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Content Ownership</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of all content you post on the Platform. By posting content, you grant 
                  Lookup.lk a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and 
                  distribute your content on the Platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Content Accuracy</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are solely responsible for the accuracy and legality of all offers, offers, and business 
                  information you post. You must ensure all offers are genuine, available as advertised, and 
                  comply with applicable laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Offer Expiration</h3>
                <p className="text-gray-700 leading-relaxed">
                  All offers must have a valid end date. Expired offers will be automatically hidden from public 
                  view. You are responsible for keeping your offers current and removing expired offers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Content Moderation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to review, edit, or remove any content that violates these terms or our 
                  policies, including but not limited to inappropriate, offensive, or misleading content.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Intellectual Property</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Platform Ownership</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Platform, including its design, code, logos, and trademarks, is owned by Lookup.lk and 
                  protected by intellectual property laws. You may not copy, modify, or distribute any part of 
                  the Platform without our written permission.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 User Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must own or have the necessary rights to all content you post. You represent that your 
                  content does not infringe on any third-party intellectual property rights.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Disclaimers and Limitations</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 No Warranty</h3>
                  <p className="leading-relaxed">
                    The Platform is provided "as is" without warranties of any kind. We do not guarantee that 
                    the Platform will be error-free, uninterrupted, or secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Third-Party Offers</h3>
                  <p className="leading-relaxed">
                    We are not responsible for the quality, accuracy, or fulfillment of offers posted by 
                    businesses. All transactions are between you and the business. We are not a party to these 
                    transactions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 User Disputes</h3>
                  <p className="leading-relaxed">
                    Any disputes between users and businesses must be resolved directly between the parties. 
                    Lookup.lk is not responsible for mediating or resolving such disputes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.4 Limitation of Liability</h3>
                  <p className="leading-relaxed">
                    To the maximum extent permitted by law, Lookup.lk shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising from your use of the Platform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Account Termination */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Account Suspension and Termination</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Our Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violation of these 
                  terms, fraudulent activity, abuse of the Platform, or any other reason we deem appropriate.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Your Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may delete your account at any time through your dashboard settings. Upon deletion, your 
                  public content will be removed, but we may retain certain information as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Effect of Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the Platform ceases immediately. Provisions regarding 
                  intellectual property, disclaimers, and limitations of liability survive termination.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may modify these Terms and Conditions at any time. We will notify users of significant changes 
              by posting a notice on the Platform or sending an email to registered users.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the Platform after changes are posted constitutes acceptance of the modified 
              terms. If you do not agree to the changes, you must stop using the Platform.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by the laws of Sri Lanka. Any disputes arising from these 
              terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of 
              Sri Lanka.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Contact Information</h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@lookup.lk</p>
                {/* <p><strong>Phone:</strong> +94 77 123 4567</p> */}
                <p><strong>Address:</strong> Lookup.lk, Colombo, Sri Lanka</p>
              </div>
            </div>
          </section>

          {/* Summary Box */}
          <div className="bg-white border-2 border-primary-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ You must be 18+ to create an account</li>
              <li>✓ You are responsible for the accuracy of your business information and offers</li>
              <li>✓ We reserve the right to review and remove inappropriate content</li>
              <li>✓ Lookup.lk is a platform connecting businesses and customers; we are not responsible for offer fulfillment</li>
              <li>✓ You retain ownership of your content but grant us a license to display it</li>
              <li>✓ We may suspend or terminate accounts that violate these terms</li>
              <li>✓ These terms are governed by the laws of Sri Lanka</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}