
import React from 'react';
import { ViewState, User, SiteContent } from '../types';

interface FooterProps {
  onNavigate: (v: ViewState) => void;
  currentUser: User | null;
  onEditMyProfile: () => void;
  onShowInfo: (info: { title: string; content: React.ReactNode }) => void;
  content: SiteContent;
}

const HowItWorksContent = () => (
  <div className="space-y-6 text-slate-600 dark:text-slate-300">
    <div>
      <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">For Customers:</h4>
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>Find:</strong> Browse categories or use our AI search to find the perfect professional or marketplace item.</li>
        <li><strong>Connect:</strong> View profiles, read reviews, and connect directly with providers via in-app chat or WhatsApp.</li>
        <li><strong>Book:</strong> Schedule a service directly with the provider. All bookings are agreements between you and the professional.</li>
      </ol>
    </div>
    <div>
      <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">For Providers:</h4>
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>Register:</strong> Sign up and create a detailed profile showcasing your skills and experience.</li>
        <li><strong>Get Verified:</strong> Our team reviews your application to ensure trust and safety on the platform.</li>
        <li><strong>Connect & Earn:</strong> Receive booking requests from clients, manage your schedule, and grow your business.</li>
      </ol>
    </div>
  </div>
);

const PointsContent = () => (
    <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>Earn rewards every time you use LSERS PRO! Our points system is simple:</p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Earn 25 Points</strong> for every booking you successfully complete through the platform.</li>
            <li>Redeem your points for discounts on future services (coming soon!).</li>
            <li>Check your current point balance in the user menu when you're logged in.</li>
        </ul>
        <p>It's our way of saying thank you for being a part of our community!</p>
    </div>
);

const SafetyGuideContent = () => (
    <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Your Safety is Our Priority</h4>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Verified Professionals:</strong> We review provider applications to ensure they meet our standards. Look for the "Verified" badge.</li>
            <li><strong>Secure Communication:</strong> Use our in-app chat to communicate. Never share personal financial information.</li>
            <li><strong>Review Ratings:</strong> Check past reviews and ratings from other customers before booking a service.</li>
            <li><strong>Clear Agreements:</strong> Agree on the scope of work and payment terms with the provider before they begin.</li>
            <li><strong>Report Concerns:</strong> If you have any safety concerns, please contact our support team immediately.</li>
        </ul>
    </div>
);

const TosContent = () => (
     <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">Summary of Terms</h4>
        <p>By using LSERS Professional Services, you agree to our full Terms of Service. Here are some key points:</p>
        <ul className="list-disc list-inside space-y-2">
            <li>LSERS is a platform to connect users. We are not a party to any agreement made between a customer and a provider.</li>
            <li>You must be at least 18 years old to use our services.</li>
            <li>You agree to provide accurate and honest information in your profile and communications.</li>
            <li>Harassment, spam, or any illegal activity is strictly prohibited and will result in an account ban.</li>
            <li>We reserve the right to modify our services and terms at any time.</li>
        </ul>
        <p>This is a summary. For the full legal terms, please consult the official Terms of Service document (link to be provided).</p>
    </div>
);


const Footer: React.FC<FooterProps> = ({ onNavigate, currentUser, onEditMyProfile, onShowInfo, content }) => {
  const handleProviderDashboardClick = () => {
    if (currentUser?.providerId) {
      onEditMyProfile();
    } else {
      onNavigate('provider');
    }
  };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-lsers-chat'));
  };

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-lsers-blue rounded-xl flex items-center justify-center text-white font-black text-2xl skew-x-[-5deg]">L</div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">LSERS <span className="text-lsers-gold not-italic">PRO</span></span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed font-medium">
              {content.tagline}
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-lsers-blue hover:text-white transition-all cursor-pointer font-black text-xs">{content.socials.facebook}</div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-lsers-blue hover:text-white transition-all cursor-pointer font-black text-xs">{content.socials.instagram}</div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-lsers-blue hover:text-white transition-all cursor-pointer font-black text-xs">{content.socials.twitter}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-lsers-gold">{content.footerLabels.exploreTitle}</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><button onClick={() => onShowInfo({ title: content.footerLabels.howItWorks, content: <HowItWorksContent /> })} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.howItWorks}</button></li>
              <li><button onClick={() => onNavigate('customer')} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.serviceList}</button></li>
              <li><button onClick={() => onShowInfo({ title: content.footerLabels.points, content: <PointsContent /> })} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.points}</button></li>
              <li><button onClick={handleProviderDashboardClick} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.dashboard}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-lsers-gold">{content.footerLabels.supportTitle}</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><button onClick={openChat} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.helpCenter}</button></li>
              <li><button onClick={() => onShowInfo({ title: content.footerLabels.safety, content: <SafetyGuideContent /> })} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.safety}</button></li>
              <li><button onClick={() => onShowInfo({ title: content.footerLabels.tos, content: <TosContent /> })} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.tos}</button></li>
              <li><button onClick={openChat} className="hover:text-lsers-gold transition-colors text-left">{content.footerLabels.contact}</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <p>© {content.copyrightYear} LSERS Professional Services. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span>{content.madeIn}</span>
            <span>{content.operatingIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
