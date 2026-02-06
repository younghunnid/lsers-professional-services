
import React, { useState, useMemo, useRef, useEffect } from 'react';
// Fix: Added StatItem to imports to resolve typing issues in Site Content tab
import { Provider, User, ChatMessage, Review, SiteContent, StatItem, SiteStats } from '../types';
import ConfirmActionModal from './ConfirmActionModal';

interface AdminPanelProps {
  providers: Provider[];
  reviews: Review[];
  users: User[];
  chats: Record<string, ChatMessage[]>;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  onDelete: (id: number) => void;
  onEdit: (provider: Provider) => void;
  onAddProvider: () => void;
  onClose: () => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkStatusChange: (ids: number[], status: Provider['status']) => void;
}

type SortField = 'name' | 'category' | 'rating' | 'completedJobs' | 'status';
type SortOrder = 'asc' | 'desc';

const AdminPanel: React.FC<AdminPanelProps> = ({ providers, reviews, users, chats, siteContent, onUpdateSiteContent, onDelete, onEdit, onAddProvider, onClose, onBulkDelete, onBulkStatusChange }) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'chats' | 'content'>('providers');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedProviderIds, setSelectedProviderIds] = useState<Set<number>>(new Set());
  const [viewingChat, setViewingChat] = useState<{ user: User, provider: Provider, messages: ChatMessage[] } | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const [editableContent, setEditableContent] = useState<SiteContent>(siteContent);

  const providerRatings = useMemo(() => {
    const ratings: { [key: number]: { avg: number; count: number } } = {};
    providers.forEach(p => {
        const relevantReviews = reviews.filter(r => r.providerId === p.id);
        const count = relevantReviews.length;
        const avg = count > 0 ? relevantReviews.reduce((acc, r) => acc + r.rating, 0) / count : 0;
        ratings[p.id] = { avg, count };
    });
    return ratings;
  }, [providers, reviews]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProviders = useMemo(() => {
    return [...providers].sort((a, b) => {
      if (sortField === 'rating') {
        const ratingA = providerRatings[a.id]?.avg || 0;
        const ratingB = providerRatings[b.id]?.avg || 0;
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }

      const aValue = a[sortField as keyof Omit<Provider, 'rating'>];
      const bValue = b[sortField as keyof Omit<Provider, 'rating'>];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [providers, sortField, sortOrder, providerRatings]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const numSelected = selectedProviderIds.size;
      const numProviders = sortedProviders.length;
      selectAllCheckboxRef.current.checked = numSelected === numProviders && numProviders > 0;
      selectAllCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numProviders;
    }
  }, [selectedProviderIds, sortedProviders]);

  const handleSelectProvider = (id: number) => {
    const newSelection = new Set(selectedProviderIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedProviderIds(newSelection);
  };

  const handleSelectAll = () => {
    const isAllSelected = selectedProviderIds.size === sortedProviders.length && sortedProviders.length > 0;
    if (isAllSelected) {
      setSelectedProviderIds(new Set());
    } else {
      setSelectedProviderIds(new Set(sortedProviders.map(p => p.id)));
    }
  };
  
  const handleBulkDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const executeBulkDelete = () => {
    onBulkDelete(Array.from(selectedProviderIds));
    setSelectedProviderIds(new Set());
    setIsConfirmingDelete(false);
  };
  
  const handleBulkStatusChangeClick = (status: Provider['status']) => {
    onBulkStatusChange(Array.from(selectedProviderIds), status);
    setSelectedProviderIds(new Set());
  };

  const handleViewChat = (chatId: string) => {
    const match = chatId.match(/u(\d+)-p(\d+)/);
    if (!match) return;
    const userId = parseInt(match[1]);
    const providerId = parseInt(match[2]);
    const user = users.find(u => u.id === userId);
    const provider = providers.find(p => p.id === providerId);
    if (user && provider) {
      setViewingChat({ user, provider, messages: chats[chatId] });
    }
  };

  const updateContentField = (path: string, value: string) => {
    const keys = path.split('.');
    setEditableContent(prev => {
      const next = { ...prev };
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };
  
  const handleSaveContent = () => {
    onUpdateSiteContent(editableContent);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="ml-1 opacity-30 text-[10px]">⇅</span>;
    return <span className="ml-1 text-lsers-blue">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const StatusBadge = ({ status }: { status: Provider['status'] }) => {
    const baseClasses = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border";
    switch (status) {
      case 'active': return <span className={`${baseClasses} bg-emerald-100 text-emerald-800 border-emerald-200`}>Active</span>;
      case 'inactive': return <span className={`${baseClasses} bg-amber-100 text-amber-800 border-amber-200`}>Inactive</span>;
      case 'pending': return <span className={`${baseClasses} bg-slate-100 text-slate-800 border-slate-200`}>Pending</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <ConfirmActionModal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={executeBulkDelete}
        title={`Delete ${selectedProviderIds.size} Providers?`}
        confirmText="Yes, Delete"
      >
        Are you sure you want to permanently delete the selected provider(s)? This action cannot be undone.
      </ConfirmActionModal>

      {selectedProviderIds.size > 0 && activeTab === 'providers' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 bg-lsers-darkBlue text-white rounded-2xl shadow-2xl p-4 flex items-center gap-6 animate-fade-in border-2 border-slate-700">
          <span className="font-bold text-sm">{selectedProviderIds.size} selected</span>
          <div className="h-6 w-px bg-slate-600"></div>
          <button onClick={() => handleBulkStatusChangeClick('active')} className="text-sm font-bold text-emerald-400 hover:text-white transition-colors">Set Active</button>
          <button onClick={() => handleBulkStatusChangeClick('inactive')} className="text-sm font-bold text-amber-400 hover:text-white transition-colors">Deactivate</button>
          <button onClick={handleBulkDeleteClick} className="text-sm font-bold text-rose-400 hover:text-white transition-colors">Delete</button>
        </div>
      )}

      {viewingChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingChat(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[70vh]">
            <div className="p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg">Chat History</h3>
              <p className="text-sm text-slate-500">
                <span className="font-medium text-lsers-blue">{viewingChat.user.name}</span> &harr; <span className="font-medium text-emerald-600">{viewingChat.provider.name}</span>
              </p>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50 scrollbar-hide">
              {viewingChat.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-xl text-sm ${
                      msg.sender === 'user' ? 'bg-lsers-blue text-white' : 
                      msg.sender === 'provider' ? 'bg-white border border-slate-100' : 'bg-slate-200 text-slate-600 text-xs italic text-center w-full'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Console</h1>
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setActiveTab('providers')} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all ${activeTab === 'providers' ? 'bg-lsers-blue text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'}`}>Providers ({providers.length})</button>
            <button onClick={() => setActiveTab('chats')} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all ${activeTab === 'chats' ? 'bg-lsers-blue text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'}`}>Chats ({Object.keys(chats).length})</button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all ${activeTab === 'content' ? 'bg-lsers-blue text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'}`}>Site Content</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {activeTab === 'providers' && (
             <button onClick={onAddProvider} className="px-6 py-2.5 bg-lsers-blue text-white rounded-full font-black hover:bg-lsers-darkBlue transition-all text-xs shadow-lg shadow-lsers-blue/20">+ ADD PROVIDER</button>
           )}
           <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 rounded-full font-black text-xs hover:bg-slate-200 transition-all">CLOSE ADMIN</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        {activeTab === 'providers' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">
                    <input 
                      ref={selectAllCheckboxRef}
                      type="checkbox" 
                      className="h-4 w-4 rounded border-slate-300 text-lsers-blue focus:ring-lsers-blue" 
                      onChange={handleSelectAll} 
                    />
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer" onClick={() => handleSort('name')}>Provider <SortIcon field="name" /></th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer" onClick={() => handleSort('category')}>Category <SortIcon field="category" /></th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer" onClick={() => handleSort('rating')}>Rating <SortIcon field="rating" /></th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer" onClick={() => handleSort('completedJobs')}>Jobs <SortIcon field="completedJobs" /></th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer" onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedProviders.map(provider => {
                  const ratingInfo = providerRatings[provider.id] || { avg: 0, count: 0 };
                  return (
                  <tr key={provider.id} className={`transition-colors ${selectedProviderIds.has(provider.id) ? 'bg-lsers-blue/5' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-slate-300 text-lsers-blue focus:ring-lsers-blue"
                        checked={selectedProviderIds.has(provider.id)} 
                        onChange={() => handleSelectProvider(provider.id)} 
                      />
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-3">
                      <img src={provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=100&h=100&fit=crop&crop=face`} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt=""/>
                      <div><div className="font-bold text-slate-900">{provider.name}</div><div className="text-xs text-slate-500">{provider.phone}</div></div>
                    </div></td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-lsers-blue/5 text-lsers-blue rounded-lg text-[10px] font-black uppercase">{provider.category}</span></td>
                    <td className="px-6 py-4 font-black text-slate-700 text-xs">★ {ratingInfo.avg.toFixed(1)} <span className="text-slate-400 font-medium">({ratingInfo.count})</span></td>
                    <td className="px-6 py-4 font-black text-slate-600 text-xs">{provider.completedJobs}</td>
                    <td className="px-6 py-4"><StatusBadge status={provider.status} /></td>
                    <td className="px-6 py-4"><div className="flex gap-2">
                      <button onClick={() => onEdit(provider)} className="px-3 py-1 text-xs font-black text-lsers-blue hover:bg-lsers-blue/5 rounded-lg transition-colors">EDIT</button>
                      <button onClick={() => onDelete(provider.id)} className="px-3 py-1 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">DELETE</button>
                    </div></td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'chats' ? (
          <div className="divide-y divide-slate-100">
            {Object.keys(chats).length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                 <div className="text-5xl mb-4">💬</div>
                 <p className="text-slate-500 font-bold">No chat conversations have started yet.</p>
              </div>
            ) : Object.entries(chats).map(([chatId, messages]) => {
                const match = chatId.match(/u(\d+)-p(\d+)/);
                if (!match) return null;
                const userId = parseInt(match[1]);
                const providerId = parseInt(match[2]);
                const user = users.find(u => u.id === userId);
                const provider = providers.find(p => p.id === providerId);
                if (!Array.isArray(messages)) return null;
                const lastMessage = messages[messages.length - 1];
                if (!user || !provider) return null;

                return (
                  <div key={chatId} onClick={() => handleViewChat(chatId)} className="p-6 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-lsers-blue/10 rounded-2xl flex items-center justify-center text-lsers-blue font-black">{user.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-800">{user.name} &harr; {provider.name}</p>
                        <p className="text-sm text-slate-500 truncate max-w-md font-medium">{lastMessage ? `${lastMessage.sender === 'user' ? 'Client: ' : ''}${lastMessage.text}`: 'No messages'}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">{lastMessage && new Date(lastMessage.timestamp).toLocaleTimeString()}</p>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-widest">{messages.length} MSGS</span>
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <div className="p-10 space-y-12 overflow-y-auto max-h-[80vh] scrollbar-hide">
            {/* Stats Section */}
            <div>
                <h3 className="text-xs font-black text-lsers-blue uppercase tracking-[0.3em] mb-6">Welcome Screen Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    {/* Fix: Explicitly cast entries to handle unknown types in map */}
                    {(Object.entries(editableContent.stats) as [string, StatItem][]).map(([key, stat]) => (
                        <div key={key} className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{key} Entry</label>
                            <div className="flex gap-4">
                                <input 
                                    placeholder="Value (e.g. 2,500+)"
                                    value={stat.value} 
                                    onChange={e => updateContentField(`stats.${key}.value`, e.target.value)} 
                                    className="flex-1 px-5 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-bold" 
                                />
                                <input 
                                    placeholder="Label (e.g. Verified Pros)"
                                    value={stat.label} 
                                    onChange={e => updateContentField(`stats.${key}.label`, e.target.value)} 
                                    className="flex-[2] px-5 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-bold" 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Branding Section */}
            <div>
                <h3 className="text-xs font-black text-lsers-blue uppercase tracking-[0.3em] mb-6">Branding & Taglines</h3>
                <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Tagline</label>
                        <textarea 
                            value={editableContent.tagline} 
                            onChange={e => updateContentField('tagline', e.target.value)} 
                            className="w-full px-5 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-medium leading-relaxed" 
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {Object.entries(editableContent.socials).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{key} Text/Icon</label>
                            <input 
                                value={value} 
                                onChange={e => updateContentField(`socials.${key}`, e.target.value)} 
                                className="w-full px-5 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-bold" 
                            />
                        </div>
                       ))}
                    </div>
                </div>
            </div>

            {/* Footer Navigation Labels */}
            <div>
                <h3 className="text-xs font-black text-lsers-blue uppercase tracking-[0.3em] mb-6">Footer Navigation Labels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline">Explore Section</h4>
                        {['exploreTitle', 'howItWorks', 'serviceList', 'points', 'dashboard'].map(field => (
                             <div key={field} className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input 
                                    value={(editableContent.footerLabels as any)[field]} 
                                    onChange={e => updateContentField(`footerLabels.${field}`, e.target.value)} 
                                    className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-bold text-sm" 
                                />
                             </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline">Support Section</h4>
                        {['supportTitle', 'helpCenter', 'safety', 'tos', 'contact'].map(field => (
                             <div key={field} className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input 
                                    value={(editableContent.footerLabels as any)[field]} 
                                    onChange={e => updateContentField(`footerLabels.${field}`, e.target.value)} 
                                    className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-lsers-blue outline-none font-bold text-sm" 
                                />
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Meta */}
            <div>
                <h3 className="text-xs font-black text-lsers-blue uppercase tracking-[0.3em] mb-6">Legal & Meta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Copyright Year</label>
                        <input value={editableContent.copyrightYear} onChange={e => updateContentField('copyrightYear', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl border border-slate-200 outline-none font-bold" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">"Made In" Content</label>
                        <input value={editableContent.madeIn} onChange={e => updateContentField('madeIn', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl border border-slate-200 outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating Scope</label>
                        <input value={editableContent.operatingIn} onChange={e => updateContentField('operatingIn', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl border border-slate-200 outline-none font-bold" />
                    </div>
                </div>
            </div>

            <div className="pt-4 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4 flex justify-end gap-4 border-t border-slate-100">
                <button 
                  onClick={() => setEditableContent(siteContent)} 
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all uppercase tracking-widest"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleSaveContent} 
                  className="px-10 py-4 bg-lsers-blue text-white rounded-2xl font-black text-sm hover:bg-lsers-darkBlue transition-all shadow-xl shadow-lsers-blue/20 uppercase tracking-widest"
                >
                  Save Site Content
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
