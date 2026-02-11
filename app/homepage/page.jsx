'use client';

import HeroCarousel from "@/components/layout/HeroCarousel";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import OfferCard from "@/components/offers/OfferCard";
import CompanyCard from "@/components/companies/CompanyCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Homepage(){
  return (
    <>
        <Header />
        <HeroCarousel
        slides={[
            {
            title: "Discover Amazing Offers Across Sri Lanka",
            description: "Browse thousands of exclusive offers from top businesses. Save money on restaurants, shopping, services, and more!",
            primaryButtonText: "Browse All Offers",
            primaryButtonLink: "/offers",
            secondaryButtonText: "Register Your Business",
            secondaryButtonLink: "/auth/register",
            image: null // Will show placeholder
            },
            {
            title: "50% Off All Electronics",
            description: "Limited time offer! Get massive discounts on laptops, phones, tablets and accessories from trusted retailers.",
            primaryButtonText: "Shop Electronics",
            primaryButtonLink: "/offers/electronics",
            secondaryButtonText: "View All Categories",
            secondaryButtonLink: "/categories",
            image: null
            },
            {
            title: "Free Delivery on Orders Over Rs. 5000",
            description: "Shop from your favorite stores and get free home delivery. Valid for all participating merchants across Colombo.",
            primaryButtonText: "Start Shopping",
            primaryButtonLink: "/offers",
            image: null
            }
        ]}
        />
        <Footer />
    </>
  );
}