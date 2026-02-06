
import React, { useState } from 'react';
import { SERVICE_CATEGORIES } from '../constants';

interface RegistrationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12">
      <div className="flex flex-col items-center text-center space-y-6">
        <button onClick={onBack} className="self-start text-indigo-600 font-bold hover:underline transition-all">← Back to Home</button>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Join LSERS PROFESSIONAL SERVICES Provider Network</h1>
        <p className="text-xl text-gray-600 max-w-2xl">Grow through trust, skill, and opportunity - Start earning by offering your services</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-4">
          <div className="text-4xl">💰</div>
          <h3 className="text-xl font-bold text-gray-900">Fair Earnings</h3>
          <p className="text-gray-500 text-sm">Set your own rates with transparent fees and secure payments</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-4">
          <div className="text-4xl">🤝</div>
          <h3 className="text-xl font-bold text-gray-900">Trust & Safety</h3>
          <p className="text-gray-500 text-sm">Verified users, honest reviews, and professional standards</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-4">
          <div className="text-4xl">🌍</div>
          <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
          <p className="text-gray-500 text-sm">Based in Liberia, operating globally for local and online services</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-12 text-white">
          <h2 className="text-4xl font-extrabold mb-4">Provider Registration</h2>
          <p className="text-indigo-50 opacity-90">Fill out the form below to begin your journey with us.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          {/* Section 1: Personal Details */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">1. Personal & Contact Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name *</label>
                  <input required type="text" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone Number *</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="e.g. +231..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Location/Area *</label>
                  <input required type="text" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="e.g. Monrovia" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">2. Service & Experience</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Primary Service *</label>
                <select required className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900">
                  <option value="">Select Category</option>
                  {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Years of Experience *</label>
                  <select required className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900">
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5+">5+ Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Hourly Rate (USD) *</label>
                  <input required type="number" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Service Description *</label>
                <textarea required rows={4} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="Describe your services, specialties, and what makes you unique..."></textarea>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase">Availability *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['Weekdays', 'Weekends', 'Evenings', 'Emergency'].map(time => (
                    <label key={time} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-indigo-50 transition-colors">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 3: Credentials & Agreement */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
             <h3 className="text-xl font-bold text-gray-900 mb-6">3. Credentials & Final Agreement</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Certifications & Licenses</label>
                  <input type="text" className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="List your professional certifications (optional)" />
                </div>
                <div className="p-6 bg-indigo-100 rounded-2xl border border-indigo-200">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input required type="checkbox" className="mt-1 w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-indigo-800 leading-relaxed">
                      I agree to LSERS PROFESSIONAL SERVICES' Terms of Service and Community Guidelines. I understand the platform fees and commission structure, and I will maintain honesty and professionalism in all transactions. *
                    </span>
                  </label>
                </div>
             </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onBack}
              className="flex-1 py-5 bg-white text-gray-600 border border-gray-200 rounded-3xl font-bold text-xl hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-indigo-600">Who can join LSERS PROFESSIONAL SERVICES?</h4>
            <p className="text-gray-600">You must be 18+ years old, provide accurate information, and maintain honesty and professionalism in all transactions.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-indigo-600">How do payments work?</h4>
            <p className="text-gray-600">Payments can be handled through LSERS PROFESSIONAL SERVICES platform or directly by agreement. LSERS PROFESSIONAL SERVICES may charge service fees per transaction.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-indigo-600">What about disputes?</h4>
            <p className="text-gray-600">LSERS PROFESSIONAL SERVICES provides support to help resolve issues fairly. We encourage respectful communication between all parties.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-indigo-600">How long does approval take?</h4>
            <p className="text-gray-600">Applications are reviewed within 24-48 hours. We verify identity for security and maintain platform safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
