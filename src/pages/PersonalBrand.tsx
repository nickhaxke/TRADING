import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  MessageCircle,
  Instagram,
  Youtube,
  Send,
  Star,
  TrendingUp,
  Palette,
  Monitor,
  Zap,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Heart,
  LogIn
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  pricing: string;
  features: string[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const PersonalBrand: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'portfolio' | 'contact' | 'roadmap'>('home');

  // Personal Information
  const personalInfo = {
    fullName: "Your Full Name",
    shortBio: "Professional Forex Trader & Creative Designer",
    longBio: "I'm a passionate forex trader with over 5 years of experience in the financial markets, specializing in technical analysis and risk management. Alongside trading, I'm a creative professional offering graphic design, web design, and digital marketing services. My mission is to help individuals achieve financial freedom through trading education and provide businesses with compelling visual identities.",
    location: "Your City, Country",
    roles: ["Forex Trader", "Graphic Designer", "Web Designer", "Digital Marketer"],
    phone: "+1234567890",
    email: "your.email@example.com",
    whatsapp: "+1234567890"
  };

  // Services
  const services: Service[] = [
    {
      id: "forex-signals",
      title: "Forex Trading Signals",
      description: "Professional forex signals with detailed analysis and risk management",
      icon: TrendingUp,
      pricing: "Contact for pricing",
      features: ["Daily market analysis", "Entry/exit points", "Risk management", "24/7 support"]
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Creative branding, logos, posters, and marketing materials",
      icon: Palette,
      pricing: "Starting from $50",
      features: ["Logo design", "Brand identity", "Marketing materials", "Social media graphics"]
    },
    {
      id: "web-design",
      title: "Web Design & Development",
      description: "Modern, responsive websites and web applications",
      icon: Monitor,
      pricing: "Starting from $500",
      features: ["Responsive design", "Modern UI/UX", "SEO optimization", "Mobile-first approach"]
    },
    {
      id: "social-media",
      title: "Social Media Management",
      description: "Complete social media strategy and content creation",
      icon: MessageCircle,
      pricing: "Starting from $300/month",
      features: ["Content creation", "Strategy planning", "Analytics reporting", "Community management"]
    }
  ];

  // Social Media Links
  const socialLinks: SocialLink[] = [
    { platform: "WhatsApp", url: `https://wa.me/${personalInfo.whatsapp}`, icon: MessageCircle, color: "text-green-600" },
    { platform: "Instagram", url: "https://instagram.com/yourusername", icon: Instagram, color: "text-pink-600" },
    { platform: "YouTube", url: "https://youtube.com/@yourusername", icon: Youtube, color: "text-red-600" },
    { platform: "Telegram", url: "https://t.me/yourusername", icon: Send, color: "text-blue-600" }
  ];

  // Portfolio Items
  const portfolioItems: PortfolioItem[] = [
    {
      id: "1",
      title: "Brand Identity Design",
      category: "Graphic Design",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Complete brand identity package for tech startup"
    },
    {
      id: "2",
      title: "Trading Dashboard",
      category: "Web Design",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Modern trading dashboard with real-time data"
    },
    {
      id: "3",
      title: "Social Media Campaign",
      category: "Marketing",
      image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Successful social media campaign increasing engagement by 300%"
    }
  ];

  // Future Plans
  const roadmapItems = [
    {
      title: "Trading Course Launch",
      description: "Comprehensive forex trading course for beginners to advanced traders",
      status: "coming-soon",
      timeline: "Q2 2024"
    },
    {
      title: "AI Trading Bot",
      description: "Automated trading system with machine learning algorithms",
      status: "in-development",
      timeline: "Q3 2024"
    },
    {
      title: "Premium Signal Service",
      description: "VIP trading signals with higher accuracy and exclusive analysis",
      status: "planning",
      timeline: "Q4 2024"
    },
    {
      title: "Mentorship Program",
      description: "One-on-one trading mentorship and business coaching",
      status: "coming-soon",
      timeline: "Q1 2025"
    }
  ];

  const renderHomeTab = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-16 w-16 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
            {personalInfo.fullName}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-open-sans">
            {personalInfo.shortBio}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400 font-open-sans">{personalInfo.location}</span>
          </div>
        </div>
      </div>

      {/* What I Do */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          What I Do
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 font-open-sans leading-relaxed">
          Welcome to my digital hub! This app serves as your gateway to my professional services and expertise. 
          Whether you're looking for trading insights, creative design solutions, or digital marketing strategies, 
          you'll find everything you need right here.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {personalInfo.roles.map((role, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300 font-open-sans">{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Services */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          Available Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.slice(0, 4).map((service) => (
            <div key={service.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <service.icon className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white font-montserrat">
                  {service.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          🚀 Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-open-sans">
          Exciting new features and services are in development! Stay tuned for:
        </p>
        <div className="space-y-2">
          {roadmapItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300 font-open-sans">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-open-sans">
          Let's discuss how I can help you achieve your goals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/${personalInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp Me
          </a>
          <button
            onClick={() => setActiveTab('contact')}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View All Contacts
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
          About {personalInfo.fullName}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          My Story
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-open-sans">
          {personalInfo.longBio}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          What I Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalInfo.roles.map((role, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white font-open-sans">{role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          Location
        </h2>
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400 font-open-sans">{personalInfo.location}</span>
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
          My Services
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-open-sans">
          Professional services tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">
                  {service.title}
                </h3>
                <p className="text-blue-600 font-semibold font-open-sans">{service.pricing}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-open-sans">
              {service.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white font-montserrat">
                What's Included:
              </h4>
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-open-sans">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <a
                href={`https://wa.me/${personalInfo.whatsapp}?text=Hi! I'm interested in ${service.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact for {service.title}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
          My Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-open-sans">
          Showcasing my best work and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">
                  {item.title}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-medium">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-open-sans">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
          Get In Touch
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-open-sans">
          Ready to work together? Let's connect!
        </p>
      </div>

      {/* Direct Contact */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          Direct Contact
        </h2>
        <div className="space-y-4">
          <a
            href={`tel:${personalInfo.phone}`}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white font-montserrat">Phone</p>
              <p className="text-gray-600 dark:text-gray-400 font-open-sans">{personalInfo.phone}</p>
            </div>
          </a>

          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white font-montserrat">Email</p>
              <p className="text-gray-600 dark:text-gray-400 font-open-sans">{personalInfo.email}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-montserrat">
          Follow Me
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <social.icon className={`h-5 w-5 ${social.color}`} />
              <span className="font-medium text-gray-900 dark:text-white font-open-sans">
                {social.platform}
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </a>
          ))}
        </div>
      </div>

      {/* Quick WhatsApp */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
            Quick WhatsApp
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-open-sans">
            Get instant responses on WhatsApp
          </p>
          <a
            href={`https://wa.me/${personalInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Start WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );

  const renderRoadmapTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
          🚀 Coming Soon
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-open-sans">
          Exciting features and services in development
        </p>
      </div>

      <div className="space-y-4">
        {roadmapItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${
                item.status === 'coming-soon' ? 'bg-green-100 dark:bg-green-900/20' :
                item.status === 'in-development' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                {item.status === 'coming-soon' ? (
                  <Zap className="h-5 w-5 text-green-600" />
                ) : item.status === 'in-development' ? (
                  <Clock className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Calendar className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-montserrat">
                    {item.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'coming-soon' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    item.status === 'in-development' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {item.timeline}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-open-sans">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
            Stay Updated
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-open-sans">
            Want to be the first to know when these features launch?
          </p>
          <a
            href={`https://wa.me/${personalInfo.whatsapp}?text=Hi! I'd like to join the waitlist for upcoming features`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Join Waitlist
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-montserrat font-bold">Personal Brand Hub</h1>
                <p className="text-blue-100 font-open-sans">
                  Your gateway to professional services and expertise
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:block">Trading Login</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'home', label: 'Home', icon: User },
              { id: 'about', label: 'About', icon: User },
              { id: 'services', label: 'Services', icon: Briefcase },
              { id: 'portfolio', label: 'Portfolio', icon: Star },
              { id: 'contact', label: 'Contact', icon: Phone },
              { id: 'roadmap', label: 'Roadmap', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center space-x-2 py-4 px-4 text-sm font-medium font-montserrat transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'contact' && renderContactTab()}
          {activeTab === 'roadmap' && renderRoadmapTab()}
        </div>
      </div>
    </div>
  );
};