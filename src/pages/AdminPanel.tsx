import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Briefcase, 
  Phone, 
  MessageSquare, 
  Image as ImageIcon,
  Calendar,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Upload,
  X
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageUrlInput } from '../components/ImageUpload';

interface AdminAuth {
  isAuthenticated: boolean;
  email: string;
}

interface ProfileData {
  fullName: string;
  shortBio: string;
  longBio: string;
  location: string;
  roles: string[];
  phone: string;
  email: string;
  whatsapp: string;
  profilePhoto: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  pricing: string;
  features: string[];
  isActive: boolean;
}

interface ContactLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  isVisible: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'coming-soon' | 'in-development' | 'planning';
  timeline: string;
  isVisible: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  isActive: boolean;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AdminAuth>({ isAuthenticated: false, email: '' });
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'contacts' | 'portfolio' | 'roadmap' | 'announcements'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Your Full Name',
    shortBio: 'Professional Forex Trader & Creative Designer',
    longBio: 'I\'m a passionate forex trader with over 5 years of experience...',
    location: 'Your City, Country',
    roles: ['Forex Trader', 'Graphic Designer', 'Web Designer', 'Digital Marketer'],
    phone: '+1234567890',
    email: 'your.email@example.com',
    whatsapp: '+1234567890',
    profilePhoto: ''
  });

  // Services data
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Forex Trading Signals',
      description: 'Professional forex signals with detailed analysis',
      pricing: 'Contact for pricing',
      features: ['Daily analysis', 'Entry/exit points', 'Risk management'],
      isActive: true
    }
  ]);

  // Contact links
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([
    { id: '1', platform: 'WhatsApp', url: 'https://wa.me/1234567890', isActive: true },
    { id: '2', platform: 'Instagram', url: 'https://instagram.com/username', isActive: true },
    { id: '3', platform: 'YouTube', url: 'https://youtube.com/@username', isActive: true },
    { id: '4', platform: 'Telegram', url: 'https://t.me/username', isActive: true }
  ]);

  // Portfolio items
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'Brand Identity Design',
      category: 'Graphic Design',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Complete brand identity package',
      isVisible: true
    }
  ]);

  // Roadmap items
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([
    {
      id: '1',
      title: 'Trading Course Launch',
      description: 'Comprehensive forex trading course',
      status: 'coming-soon',
      timeline: 'Q2 2024',
      isVisible: true
    }
  ]);

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to My Brand Hub',
      message: 'Explore my services and get in touch for collaborations!',
      type: 'info',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin-auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }

    // Load all data from localStorage
    const savedProfile = localStorage.getItem('admin-profile');
    if (savedProfile) setProfileData(JSON.parse(savedProfile));

    const savedServices = localStorage.getItem('admin-services');
    if (savedServices) setServices(JSON.parse(savedServices));

    const savedContacts = localStorage.getItem('admin-contacts');
    if (savedContacts) setContactLinks(JSON.parse(savedContacts));

    const savedPortfolio = localStorage.getItem('admin-portfolio');
    if (savedPortfolio) setPortfolioItems(JSON.parse(savedPortfolio));

    const savedRoadmap = localStorage.getItem('admin-roadmap');
    if (savedRoadmap) setRoadmapItems(JSON.parse(savedRoadmap));

    const savedAnnouncements = localStorage.getItem('admin-announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
  }, []);

  // Save data to localStorage
  const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    // Simple authentication (in production, use proper backend auth)
    if (loginForm.email === 'admin@example.com' && loginForm.password === 'admin123') {
      const authData = { isAuthenticated: true, email: loginForm.email };
      setAuth(authData);
      saveData('admin-auth', authData);
    } else {
      setLoginError('Invalid credentials. Use admin@example.com / admin123');
    }

    setLoading(false);
  };

  // Logout handler
  const handleLogout = () => {
    setAuth({ isAuthenticated: false, email: '' });
    localStorage.removeItem('admin-auth');
    navigate('/');
  };

  // Save profile
  const saveProfile = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    saveData('admin-profile', profileData);
    setSaving(false);
  };

  // Service management
  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: 'New Service',
      description: 'Service description',
      pricing: 'Contact for pricing',
      features: ['Feature 1'],
      isActive: true
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveData('admin-services', updatedServices);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    );
    setServices(updatedServices);
    saveData('admin-services', updatedServices);
  };

  const deleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveData('admin-services', updatedServices);
  };

  // Contact management
  const addContactLink = () => {
    const newContact: ContactLink = {
      id: Date.now().toString(),
      platform: 'New Platform',
      url: 'https://example.com',
      isActive: true
    };
    const updatedContacts = [...contactLinks, newContact];
    setContactLinks(updatedContacts);
    saveData('admin-contacts', updatedContacts);
  };

  const updateContactLink = (id: string, updates: Partial<ContactLink>) => {
    const updatedContacts = contactLinks.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    );
    setContactLinks(updatedContacts);
    saveData('admin-contacts', updatedContacts);
  };

  const deleteContactLink = (id: string) => {
    const updatedContacts = contactLinks.filter(contact => contact.id !== id);
    setContactLinks(updatedContacts);
    saveData('admin-contacts', updatedContacts);
  };

  // Portfolio management
  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: 'New Project',
      category: 'Design',
      image: '',
      description: 'Project description',
      isVisible: true
    };
    const updatedPortfolio = [...portfolioItems, newItem];
    setPortfolioItems(updatedPortfolio);
    saveData('admin-portfolio', updatedPortfolio);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    const updatedPortfolio = portfolioItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setPortfolioItems(updatedPortfolio);
    saveData('admin-portfolio', updatedPortfolio);
  };

  const deletePortfolioItem = (id: string) => {
    const updatedPortfolio = portfolioItems.filter(item => item.id !== id);
    setPortfolioItems(updatedPortfolio);
    saveData('admin-portfolio', updatedPortfolio);
  };

  // Roadmap management
  const addRoadmapItem = () => {
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      title: 'New Feature',
      description: 'Feature description',
      status: 'planning',
      timeline: 'Q1 2024',
      isVisible: true
    };
    const updatedRoadmap = [...roadmapItems, newItem];
    setRoadmapItems(updatedRoadmap);
    saveData('admin-roadmap', updatedRoadmap);
  };

  const updateRoadmapItem = (id: string, updates: Partial<RoadmapItem>) => {
    const updatedRoadmap = roadmapItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setRoadmapItems(updatedRoadmap);
    saveData('admin-roadmap', updatedRoadmap);
  };

  const deleteRoadmapItem = (id: string) => {
    const updatedRoadmap = roadmapItems.filter(item => item.id !== id);
    setRoadmapItems(updatedRoadmap);
    saveData('admin-roadmap', updatedRoadmap);
  };

  // Announcement management
  const addAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: 'New Announcement',
      message: 'Announcement message',
      type: 'info',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    saveData('admin-announcements', updatedAnnouncements);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    const updatedAnnouncements = announcements.map(announcement => 
      announcement.id === id ? { ...announcement, ...updates } : announcement
    );
    setAnnouncements(updatedAnnouncements);
    saveData('admin-announcements', updatedAnnouncements);
  };

  const deleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    setAnnouncements(updatedAnnouncements);
    saveData('admin-announcements', updatedAnnouncements);
  };

  // Login form
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Lock className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Panel Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Sign in to manage your personal brand content
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {loginError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" color="border-white" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Demo credentials: admin@example.com / admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Profile tab
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profile Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Photo URL
            </label>
            <ImageUrlInput
              value={profileData.profilePhoto}
              onChange={(url) => setProfileData(prev => ({ ...prev, profilePhoto: url }))}
              onRemove={() => setProfileData(prev => ({ ...prev, profilePhoto: '' }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Bio
            </label>
            <input
              type="text"
              value={profileData.shortBio}
              onChange={(e) => setProfileData(prev => ({ ...prev, shortBio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Bio
            </label>
            <textarea
              rows={4}
              value={profileData.longBio}
              onChange={(e) => setProfileData(prev => ({ ...prev, longBio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Roles (comma separated)
            </label>
            <input
              type="text"
              value={profileData.roles.join(', ')}
              onChange={(e) => setProfileData(prev => ({ ...prev, roles: e.target.value.split(', ').filter(r => r.trim()) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                value={profileData.whatsapp}
                onChange={(e) => setProfileData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <LoadingSpinner size="sm" color="border-white" className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );

  // Services tab
  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Services
        </h3>
        <button
          onClick={addService}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateService(service.id, { isActive: !service.isActive })}
                  className={`p-1 rounded ${service.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`text-sm ${service.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {service.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() => deleteService(service.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(service.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-semibold"
                placeholder="Service title"
              />
              
              <textarea
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Service description"
                rows={2}
              />
              
              <input
                type="text"
                value={service.pricing}
                onChange={(e) => updateService(service.id, { pricing: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Pricing"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  value={service.features.join('\n')}
                  onChange={(e) => updateService(service.id, { features: e.target.value.split('\n').filter(f => f.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Contact links tab
  const renderContactsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Contact Links
        </h3>
        <button
          onClick={addContactLink}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>
      
      <div className="space-y-4">
        {contactLinks.map((contact) => (
          <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateContactLink(contact.id, { isActive: !contact.isActive })}
                  className={`p-1 rounded ${contact.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {contact.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`text-sm ${contact.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {contact.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() => deleteContactLink(contact.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={contact.platform}
                onChange={(e) => updateContactLink(contact.id, { platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Platform name"
              />
              
              <input
                type="url"
                value={contact.url}
                onChange={(e) => updateContactLink(contact.id, { url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Portfolio tab
  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Portfolio
        </h3>
        <button
          onClick={addPortfolioItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>
      
      <div className="space-y-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updatePortfolioItem(item.id, { isVisible: !item.isVisible })}
                  className={`p-1 rounded ${item.isVisible ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`text-sm ${item.isVisible ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() => deletePortfolioItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updatePortfolioItem(item.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Project title"
                />
                
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updatePortfolioItem(item.id, { category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Category"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Image
                </label>
                <ImageUrlInput
                  value={item.image}
                  onChange={(url) => updatePortfolioItem(item.id, { image: url })}
                  onRemove={() => updatePortfolioItem(item.id, { image: '' })}
                />
              </div>
              
              <textarea
                value={item.description}
                onChange={(e) => updatePortfolioItem(item.id, { description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Project description"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Roadmap tab
  const renderRoadmapTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Roadmap
        </h3>
        <button
          onClick={addRoadmapItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </button>
      </div>
      
      <div className="space-y-4">
        {roadmapItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateRoadmapItem(item.id, { isVisible: !item.isVisible })}
                  className={`p-1 rounded ${item.isVisible ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`text-sm ${item.isVisible ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() => deleteRoadmapItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateRoadmapItem(item.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-semibold"
                placeholder="Feature title"
              />
              
              <textarea
                value={item.description}
                onChange={(e) => updateRoadmapItem(item.id, { description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Feature description"
                rows={2}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={item.status}
                  onChange={(e) => updateRoadmapItem(item.id, { status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="in-development">In Development</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
                
                <input
                  type="text"
                  value={item.timeline}
                  onChange={(e) => updateRoadmapItem(item.id, { timeline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Q1 2024"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Announcements tab
  const renderAnnouncementsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Announcements
        </h3>
        <button
          onClick={addAnnouncement}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </button>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateAnnouncement(announcement.id, { isActive: !announcement.isActive })}
                  className={`p-1 rounded ${announcement.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {announcement.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`text-sm ${announcement.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {announcement.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() => deleteAnnouncement(announcement.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => updateAnnouncement(announcement.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-semibold"
                placeholder="Announcement title"
              />
              
              <textarea
                value={announcement.message}
                onChange={(e) => updateAnnouncement(announcement.id, { message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Announcement message"
                rows={3}
              />
              
              <select
                value={announcement.type}
                onChange={(e) => updateAnnouncement(announcement.id, { type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-montserrat font-bold">Admin Panel</h1>
                <p className="text-purple-100 font-open-sans">
                  Manage your personal brand content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-purple-100">
                {auth.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'services', label: 'Services', icon: Briefcase },
              { id: 'contacts', label: 'Contacts', icon: Phone },
              { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
              { id: 'roadmap', label: 'Roadmap', icon: Calendar },
              { id: 'announcements', label: 'Announcements', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium font-montserrat transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'contacts' && renderContactsTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'roadmap' && renderRoadmapTab()}
          {activeTab === 'announcements' && renderAnnouncementsTab()}
        </div>
      </div>
    </div>
  );
};