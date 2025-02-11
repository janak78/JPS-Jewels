import React from 'react'
import "./Termsofuse.css";

const Termsofuse = () => {
  return (
    <div className="terms-container">
      <h2 className="section-title">Payment Terms</h2>
      <ul className="terms-list">
        <li>Currency and Pricing All prices are quoted in USD. Payments must be made in advance, and prices do not include any applicable duties, taxes, or bank charges.</li>
        <li>Order Confirmation Upon confirmation of your order, full payment is required within 7 working days. This ensures timely processing and shipping of your items.</li>
        <li>Late Payments In the event that payment is not received within the stipulated 7-day period, a late fee of 12% per annum will be applied to the outstanding balance.</li>
        <li>Payment Verification For all payments made via wire transfer, please ensure to forward a copy of the transaction confirmation to our accounts department.</li>
        <li>Bank Charges The full payment amount specified in the Proforma Invoice must be credited to our bank account. Any bank charges incurred during the transaction must be covered by the buyer.</li>
      </ul>

      <h2 className="section-title">Shipment Policy</h2>
      <ul className="terms-list">
        <li>Payment Confirmation Shipment will only occur after confirmation of advance payment.</li>
        <li>Shipping Method We will ship using reputable carriers such as Malca-Amit, Brinks, BVC Express, UPS, or FedEx.</li>
        <li>Insurance Comprehensive door-to-door insurance coverage will be provided.</li>
        <li>International Restrictions JPS Jewels reserves the right to refuse shipments to certain international destinations.</li>
        <li>Shipping Charges A handling fee of USD 150 applies to invoices below USD 10,000; free shipping for orders above USD 10,000.</li>
        <li>Price Changes Prices may change without notice until an order is confirmed.</li>
        <li>Delivery Costs The buyer is responsible for import duties and taxes.</li>
      </ul>

      <h2 className="section-title">Additional Information</h2>
      <ul className="terms-list">
        <li>Customer Support Contact our team for order, payment, or shipment assistance.</li>
        <li>Changes to Terms JPS Jewels reserves the right to modify these terms without prior notice.</li>
        <li>Governing Law These terms are governed by the laws of [Your Jurisdiction].</li>
      </ul>
    </div>
  )
}

export default Termsofuse
