import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
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
              At Lookup.lk, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By using Lookup.lk, you agree to the collection and use of information in accordance with this 
              policy. If you do not agree with this policy, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you register for an account, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Name and email address</li>
                  <li>Business name and contact information</li>
                  <li>Phone number and WhatsApp number</li>
                  <li>Business address and location</li>
                  <li>Website URL and social media profiles</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Business Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  For business accounts, we collect information about your business including company name, 
                  description, category, logos, banners, and deal/offer details you post on our platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 Usage Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  We automatically collect certain information when you use our platform, including IP address, 
                  browser type, device information, pages visited, and time spent on pages.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.4 Cookies and Tracking</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our platform and store 
                  certain information to improve your user experience.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To provide and maintain our service</li>
                <li>To process your registration and create your account</li>
                <li>To display your business information and deals to users</li>
                <li>To send you administrative communications and updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To monitor and analyze usage patterns and trends</li>
                <li>To detect, prevent, and address technical issues or fraud</li>
                <li>To improve our platform and develop new features</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Information Sharing and Disclosure</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Public Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  Business profiles, deals, and offers you post are publicly visible to all users of Lookup.lk. 
                  This includes your business name, description, contact information, and any images you upload.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share your information with third-party service providers who perform services on our 
                  behalf, such as hosting, data analysis, email delivery, and customer service. These providers 
                  are bound by confidentiality agreements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information if required by law or in response to valid requests by public 
                  authorities, or to protect our rights, privacy, safety, or property.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  If Lookup.lk is involved in a merger, acquisition, or sale of assets, your information may be 
                  transferred. We will provide notice before your information is transferred and becomes subject 
                  to a different privacy policy.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Data Security</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Encrypted data transmission using SSL/TLS</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While 
                we strive to protect your information, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Your Rights and Choices</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> You can request access to your personal information</li>
                <li><strong>Correction:</strong> You can update or correct your information through your dashboard</li>
                <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
                <li><strong>Opt-out:</strong> You can opt-out of marketing communications at any time</li>
                <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
                <li><strong>Withdrawal:</strong> You can withdraw consent for data processing where applicable</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@lookup.lk.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in 
              this Privacy Policy, unless a longer retention period is required by law. When you delete your 
              account, we will delete or anonymize your personal information within a reasonable timeframe, 
              except where we are required to retain it for legal or business purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under the age of 18. We do not knowingly collect personal 
              information from children under 18. If you are a parent or guardian and believe your child has 
              provided us with personal information, please contact us, and we will delete such information.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Third-Party Links and Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform may contain links to third-party websites, applications, or services. We are not 
              responsible for the privacy practices of these third parties. We encourage you to read the privacy 
              policies of any third-party sites you visit.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of Sri Lanka. 
              By using our services, you consent to the transfer of your information to countries that may have 
              different data protection laws than your jurisdiction.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@lookup.lk</p>
                {/* <p><strong>Phone:</strong> +94 77 123 4567</p> */}
                <p><strong>Address:</strong> Lookup.lk, Colombo, Sri Lanka</p>
              </div>
            </div>
          </section>

          {/* Summary Box */}
          <div className="bg-white border-2 border-primary-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Policy Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ We collect information necessary to provide our services</li>
              <li>✓ Your business information is publicly visible on our platform</li>
              <li>✓ We use industry-standard security measures to protect your data</li>
              <li>✓ You have rights to access, correct, and delete your information</li>
              <li>✓ We do not sell your personal information to third parties</li>
              <li>✓ You can opt-out of marketing communications anytime</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}