import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./privacypolicy.css";

const Privacypolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div className="policy-container">
        <h3 className="policy-title">Objectives:</h3>
        <ul className="policy-list">
          <li>
            Time Efficiency: This policy aims to save valuable time for both
            parties, enabling us to focus on more productive endeavors.
          </li>
          <li>
            Trust Building: It fosters a reliable relationship through a smooth
            and effective buying and selling process.
          </li>
          <li>
            Peace of Mind: Our approach allows both parties to complete
            transactions with confidence and peace rather than stress and
            anxiety.
          </li>
          <li>
            Long-term Relationships: This policy encourages the maintenance of a
            positive and lasting partnership.
          </li>
        </ul>

        <h3 className="policy-title">Benefits to Our Customers:</h3>
        <ul className="policy-list">
          <li>
            Quality Assurance: You will have access to the right quality
            products at fair prices whenever you need them.
          </li>
          <li>
            Consistent Support: The policy promotes consistency, continuity,
            collaboration, and reliability.
          </li>
          <li>
            Transparent Dealings: Fair and open business practices contribute to
            sustainable growth for both parties.
          </li>
          <li>
            Calm Working Environment: By adopting this policy, we aim to create
            a relaxed atmosphere that conserves energy and leads to a more
            productive relationship.
          </li>
        </ul>

        <h3 className="policy-title">Remarks:</h3>
        <ul className="policy-list">
          <li>
            Fixed Pricing: Our product prices are set based on quality and
            competitive market analysis.
          </li>
          <li>
            Mutual Benefit: This policy ensures a “WIN-WIN” scenario for
            everyone involved.
          </li>
          <li>
            Product Adjustments: We will review and update our products as
            necessary.
          </li>
          <li>
            Advance Payment: All listed prices are contingent upon advance
            payment.
          </li>
          <li>
            Error Rectification: We reserve the right to correct any pricing
            errors due to system issues or data entry mistakes.
          </li>
          <li>
            Price Changes: Prices may change without prior notice until an order
            is confirmed.
          </li>
          <li>
            Feedback: Your insights and opinions regarding this policy are
            highly valued and appreciated.
          </li>
          <li>
            Cooperation Needed: Your support is crucial for the successful
            implementation of our “Fair & Fixed Price Policy.”
          </li>
        </ul>
      </div>
      <div className="privacy-policy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p>
          At JPS Jewels, we are dedicated to safeguarding the personal
          information you provide us. This information is collected when you
          register on
          <a href="https://www.jpsjewels.com" className="privacy-link">
            {" "}
            www.jpsjewels.com
          </a>{" "}
          to access our online inventory of exquisite jewels.
        </p>
        <p>
          Your privacy is of utmost importance to us, and this policy aims to
          assure you that we are committed to protecting the security and
          confidentiality of your personal data. However, we cannot be held
          responsible for any personal information you share with third-party
          applications or websites accessed through our services. We encourage
          you to review the privacy policies of any third-party services you
          use.
        </p>

        <h2 className="privacy-title">Collection of Personal Information</h2>
        <p>
          While using our website or products, you may be asked to provide
          personal identification information, including your name, address,
          date of birth, email address, and phone number. By providing this
          information, you consent to its use as described in this policy. You
          may withdraw your consent at any time by emailing us at
          <a href="mailto:info@jpsjewels.com" className="privacy-link">
            {" "}
            info@jpsjewels.com
          </a>
          . Upon receiving your request, we will return or delete your personal
          information within five days.
        </p>
        <p>
          Additionally, we may record cookie data, the pages you visit, and your
          IP address, which may be collected by us or third parties.
        </p>

        <h2 className="privacy-title">Use of Personal Information</h2>
        <p>
          We utilize your personal information to process service requests,
          provide access to exclusive sections of our website, send newsletters,
          enhance your website experience, and improve our offerings.
          Occasionally, we may conduct market research and send you information
          regarding services and promotions that may interest you. If you prefer
          not to receive such information, please email us to opt out.
        </p>

        <h2 className="privacy-title">Security</h2>
        <p>
          We take the protection of your data seriously. We implement various
          security measures, including SSL technology, to safeguard your
          personal information and data transmission. However, please note that
          no method of transmission over the internet or electronic storage is
          entirely secure, and we cannot guarantee absolute protection against
          breaches.
        </p>
        <p className="important-note">
          Important Note: JPS Jewels reserves the right to amend this Privacy
          Policy at any time without prior notice.
        </p>

        <h2 className="privacy-title">Policy Changes</h2>
        <p>
          Any updates to this policy will be published on our website. We
          recommend checking our site regularly to stay informed about any
          changes to our privacy practices.
        </p>
        <p>
          Your account information is secured in a protected area of our
          website, necessitating the entry of your unique username and password
          each time you access your account. To further protect your privacy,
          please keep your login details confidential.
        </p>

        <p className="footer-text">
          Copyright 2022 JPS Jewels. All Rights Reserved.
        </p>
        <p className="footer-links">
          <p
            className="privacy-link-policy mr-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/privacypolicy");
            }}
          >
            Privacy Policy
          </p>{" "}
          |
          <p
            className="privacy-link-policy mx-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/termsofuse");
            }}
          >
            {" "}
            Terms of Use
          </p>{" "}
          |
          <p
            className="privacy-link-policy mx-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/contactus");
            }}
          >
            {" "}
            Contact Us
          </p>
        </p>
      </div>
    </>
  );
};

export default Privacypolicy;
