// Import all images from assets
import villa1_logo from "../../../assets/Villa/villa1_logo.png";
import villa1_1 from "../../../assets/Villa/villa1_1.png";
import villa1_2 from "../../../assets/Villa/villa1_2.png";
import villa1_3 from "../../../assets/Villa/villa1_3.png";
import villa1_4 from "../../../assets/Villa/villa1_4.png";
import villa1_5 from "../../../assets/Villa/villa1_5.png";

import villa2_1 from "../../../assets/Villa/villa2_1.png";
import villa2_2 from "../../../assets/Villa/villa2_2.png";

import villa3_1 from "../../../assets/Villa/villa3_1.png";
import villa3_2 from "../../../assets/Villa/villa3_2.png";
import villa3_3 from "../../../assets/Villa/villa3_3.png";
import villa3_4 from "../../../assets/Villa/villa3_4.png";
import villa3_5 from "../../../assets/Villa/villa3_5.png";

import villa4_1 from "../../../assets/Villa/villa4_1.png";
import villa4_2 from "../../../assets/Villa/villa4_2.png";
import villa4_3 from "../../../assets/Villa/villa4_3.png";
import villa4_4 from "../../../assets/Villa/villa4_4.png";
import villa4_5 from "../../../assets/Villa/villa4_5.png";

import villa5_1 from "../../../assets/Villa/villa5_1.png";
import villa5_2 from "../../../assets/Villa/villa5_2.png";
import villa5_3 from "../../../assets/Villa/villa5_3.png";
import villa5_4 from "../../../assets/Villa/villa5_4.png";
import villa5_5 from "../../../assets/Villa/villa5_5.png";

import villa6_1 from "../../../assets/Villa/villa6_1.png";
import villa6_2 from "../../../assets/Villa/villa6_2.png";
import villa6_3 from "../../../assets/Villa/villa6_3.png";
import villa6_4 from "../../../assets/Villa/villa6_4.png";
import villa6_5 from "../../../assets/Villa/villa6_5.png";

import villa7_1 from "../../../assets/Villa/villa7_1.png";
import villa7_2 from "../../../assets/Villa/villa7_2.png";
import villa7_3 from "../../../assets/Villa/villa7_3.png";
import villa7_4 from "../../../assets/Villa/villa7_4.png";
import villa7_5 from "../../../assets/Villa/villa7_5.png";

import villa8_1 from "../../../assets/Villa/villa8_1.png";
import villa8_2 from "../../../assets/Villa/villa8_2.png";
import villa8_3 from "../../../assets/Villa/villa8_3.png";
import villa8_4 from "../../../assets/Villa/villa8_4.png";
import villa8_5 from "../../../assets/Villa/villa8_5.png";

import villa9_1 from "../../../assets/Villa/villa9_1.png";
import villa9_2 from "../../../assets/Villa/villa9_2.png";
import villa9_3 from "../../../assets/Villa/villa9_3.png";
import villa9_4 from "../../../assets/Villa/villa9_4.png";

import villa10_1 from "../../../assets/Villa/villa10_1.png";
import villa10_2 from "../../../assets/Villa/villa10_2.png";
import villa10_3 from "../../../assets/Villa/villa10_3.png";

export const DairyFarmLandData = [
  // BUY - Luxury Villa (Posted by OWNER)
  {
    id: 1,
    tag: "BUY",
    status: "NEW",
    price: "₹15.0 Crores",
    sqftPrice: "₹7,500 per sqft",
    totalSqft: "20,000 sqft Area",
    builtUp: "18,500 sqft (Built Up area)",
    location: "Ashok Nagar, Chennai-600091, Tamil Nadu",
    highlights: "Fully Furnished | 5+ BHK | Ready to Move | Luxury Villa",
    postedBy: "Priya Sharma",
    postedAs: "Owner",
    logo: villa1_logo,
    images: [villa1_1, villa1_2, villa1_3, villa1_4, villa1_5, villa1_2, villa1_3, villa1_4, villa1_5],
    agentDetails: "📍 Direct owner - No brokerage | 12+ years of property ownership | Can share original documents",
    contactEmail: "priya.sharma@example.com",
    contactPhone: "+91 98765 43210",
    experience: "12+ years in real estate",
    achievements: "Successfully sold 50+ luxury properties"
  },
  
  // RENT - Sea View Villa (Posted by OWNER)
  {
    id: 2,
    tag: "RENT",
    status: "RE-SALE",
    price: "₹1.5 Lakh/month",
    sqftPrice: "₹40 per sqft",
    totalSqft: "3,750 sqft Area",
    builtUp: "3,500 sqft (Built Up area)",
    location: "Besant Nagar, Chennai-600090, Tamil Nadu",
    highlights: "Fully Furnished | 3 BHK | Sea View | Beach Villa",
    postedBy: "Anaya Dev",
    postedAs: "Owner",
    logo: "", // No logo for this one
    images: [villa4_1, villa4_2, villa4_3, villa4_4, villa4_5],
    agentDetails: "👨‍💼 Property owner directly renting out | Verified documents | Family-friendly neighborhood",
    contactEmail: "anaya.dev@example.com",
    contactPhone: "+91 99887 66554",
    experience: "5+ properties owned",
    achievements: "100% tenant satisfaction"
  },
  
  // SELL - Premium Villa (Posted by SELLER)
  {
    id: 3,
    tag: "SELL",
    status: "RE-SALE",
    price: "₹2.8 Crores",
    sqftPrice: "₹5,600 per sqft",
    totalSqft: "5,000 sqft Area",
    builtUp: "4,500 sqft (Built Up area)",
    location: "Ekkaduthangal, Chennai-600032, Tamil Nadu",
    highlights: "Unfurnished | 4 BHK | Gym | Spacious Villa",
    postedBy: "Manickam",
    postedAs: "Seller",
    logo: "",
    images: [villa9_1, villa9_2, villa9_3, villa9_4],
    agentDetails: "💰 Urgent sale | Price negotiable | Clear title | All legal documents ready",
    contactEmail: "manickam@example.com",
    contactPhone: "+91 94444 33221",
    experience: "First time seller",
    achievements: "Property maintained for 10 years"
  },
  
  // LEASE - Corporate Villa (Posted by LESSOR/OWNER)
  {
    id: 4,
    tag: "LEASE",
    status: "NEW",
    price: "₹50.0 Lakhs",
    sqftPrice: "For 3 Years",
    totalSqft: "2,500 sqft Area",
    builtUp: "2,300 sqft (Built Up area)",
    location: "Velachery, Chennai-600042, Tamil Nadu",
    highlights: "Unfurnished | 3 BHK | Near IT Park | Corporate Villa",
    postedBy: "Suresh",
    postedAs: "Lessor",
    logo: "",
    images: [villa7_1, villa7_2, villa7_3, villa7_4, villa7_5],
    agentDetails: "📄 Long-term lease available | Corporate lease preferred | Maintenance included",
    contactEmail: "suresh.lease@example.com",
    contactPhone: "+91 98765 12345",
    experience: "Corporate leasing specialist",
    achievements: "50+ corporate clients"
  },
  
  // BUY - Premium Resale (Posted by REAL ESTATE AGENT)
  {
    id: 5,
    tag: "BUY",
    status: "RE-SALE",
    price: "₹8.5 Crores",
    sqftPrice: "₹12,000 per sqft",
    totalSqft: "7,000 sqft Area",
    builtUp: "6,200 sqft (Built Up area)",
    location: "Adyar, Chennai-600020, Tamil Nadu",
    highlights: "Semi-Furnished | 4 BHK | Private Pool | Premium Villa",
    postedBy: "Agni Realtors",
    postedAs: "Agent",
    logo: "",
    images: [villa2_1, villa2_2],
    agentDetails: "🏆 Top-rated real estate agency | 1000+ successful deals | Free consultation | RERA certified",
    contactEmail: "contact@agnirealtors.com",
    contactPhone: "+91 44 1234 5678",
    experience: "15+ years in real estate",
    achievements: "1000+ successful deals | RERA certified"
  },
  
  // RENT - Budget Villa (Posted by OWNER)
  {
    id: 6,
    tag: "RENT",
    status: "NEW",
    price: "₹45,000/month",
    sqftPrice: "₹25 per sqft",
    totalSqft: "1,800 sqft Area",
    builtUp: "1,650 sqft (Built Up area)",
    location: "Anna Nagar, Chennai-600040, Tamil Nadu",
    highlights: "Semi-Furnished | 2 BHK | Close to Metro | Budget Villa",
    postedBy: "Rajesh V",
    postedAs: "Owner",
    logo: "",
    images: [villa5_1, villa5_2, villa5_3, villa5_4, villa5_5],
    agentDetails: "🏠 Direct owner | No brokerage fee | Family preferred | Semi-furnished as shown",
    contactEmail: "rajesh.v@example.com",
    contactPhone: "+91 98888 77766",
    experience: "Individual owner",
    achievements: "Well-maintained property"
  },
  
  // SELL - Affordable Villa (Posted by SELLER)
  {
    id: 7,
    tag: "SELL",
    status: "NEW",
    price: "₹1.2 Crores",
    sqftPrice: "₹4,800 per sqft",
    totalSqft: "2,500 sqft Area",
    builtUp: "2,200 sqft (Built Up area)",
    location: "Madipakkam, Chennai-600091, Tamil Nadu",
    highlights: "Semi-Furnished | 3 BHK | 2nd Floor | Affordable Villa",
    postedBy: "Deepak",
    postedAs: "Seller",
    logo: "",
    images: [villa10_1, villa10_2, villa10_3],
    agentDetails: "💰 Best price in locality | Immediate possession | Bank loan approved | Clear title deed",
    contactEmail: "deepak.sell@example.com",
    contactPhone: "+91 97777 66554",
    experience: "First time seller",
    achievements: "Brand new construction"
  },
  
  // LEASE - Compact Villa (Posted by OWNER)
  {
    id: 8,
    tag: "LEASE",
    status: "RE-SALE",
    price: "₹35.0 Lakhs",
    sqftPrice: "For 2 Years",
    totalSqft: "1,500 sqft Area",
    builtUp: "1,400 sqft (Built Up area)",
    location: "Nungambakkam, Chennai-600034, Tamil Nadu",
    highlights: "Semi-Furnished | 2 BHK | Gated Community | Compact Villa",
    postedBy: "Redlay",
    postedAs: "Owner",
    logo: "",
    images: [villa8_1, villa8_2, villa8_3, villa8_4, villa8_5],
    agentDetails: "🔑 Owner leasing directly | Flexible terms | Maintenance included | CCTV secured",
    contactEmail: "redlay.lease@example.com",
    contactPhone: "+91 96666 55443",
    experience: "Experienced lessor",
    achievements: "Fully secured property"
  },
  
  // BUY - Modern Villa (Posted by BUILDER/DEVELOPER)
  {
    id: 9,
    tag: "BUY",
    status: "NEW",
    price: "₹4.2 Crores",
    sqftPrice: "₹6,000 per sqft",
    totalSqft: "7,000 sqft Area",
    builtUp: "5,500 sqft (Built Up area)",
    location: "OMR, Thoraipakkam, Chennai-600097, Tamil Nadu",
    highlights: "Unfurnished | 3 BHK | Garden Facing | Modern Villa",
    postedBy: "Siva Kumar",
    postedAs: "Builder",
    logo: "",
    images: [villa3_1, villa3_2, villa3_3, villa3_4, villa3_5],
    agentDetails: "🏗️ Direct from builder | No middlemen | Possession within 6 months | Premium amenities",
    contactEmail: "siva.builders@example.com",
    contactPhone: "+91 95555 44332",
    experience: "20+ years in construction",
    achievements: "50+ projects completed"
  },
  
  // RENT - Heritage Villa (Posted by AGENT)
  {
    id: 10,
    tag: "RENT",
    status: "RE-SALE",
    price: "₹85,000/month",
    sqftPrice: "₹30 per sqft",
    totalSqft: "2,800 sqft Area",
    builtUp: "2,600 sqft (Built Up area)",
    location: "Mylapore, Chennai-600004, Tamil Nadu",
    highlights: "Semi-Furnished | 3 BHK | Traditional Style | Heritage Villa",
    postedBy: "Priya Realty",
    postedAs: "Agent",
    logo: "",
    images: [villa6_1, villa6_2, villa6_3, villa6_4, villa6_5],
    agentDetails: "🏛️ Heritage property specialist | Verified agent | Best Condominium deals in Mylapore",
    contactEmail: "priya.realty@example.com",
    contactPhone: "+91 44 9876 5432",
    experience: "10+ years in heritage properties",
    achievements: "Best Heritage Agent Award 2023"
  }
];