
import React, { useState } from 'react';
import { Provider, PortfolioItem, FavoriteItem, Review, User } from '../types';
import StarRating from './StarRating';

interface ProviderProfileModalProps {
  provider: Provider;
  reviews: Review[];
  currentUser: User | null;
  favorites: FavoriteItem[];
  onClose: () => void;
  onBook: (p: Provider) => void;
  onStartInAppChat: (p: Provider) => void;
  onToggleFavorite: (type: 'provider', id: number) => void;
  onAddReview: (providerId: number, rating: number, comment: string) => void;
}

const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({ provider, reviews, currentUser, favorites, onClose, onBook, onStartInAppChat, onToggleFavorite, onAddReview }) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  
  const isFavorited = favorites.some(fav => fav.type === 'provider' && fav.id === provider.id);
  const userHasReviewed = currentUser && reviews.some(r => r.authorId === currentUser.id);

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating > 0 && newComment.trim() !== '') {
      onAddReview(provider.id, newRating, newComment);
      setNewRating(0);
      setNewComment('');
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = (provider.whatsapp || provider.phone).replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${provider.name}, I found your profile on LSERS Professional Services and I'm interested in your services. Are you available?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  
  const photoSrc = provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=300&h=300&fit=crop&crop=face`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl h-[92vh] rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col">
        {/* Header / Hero Section */}
        <div className="relative h-72 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800" />
          
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 z-20 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-md transition-all border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
             <img 
              src={provider.portfolio?.[0]?.photo || `https://images.unsplash.com/photo-1581092160607-ee22621ddbb3?w=1200&h=400&fit=crop`}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          
          <div className="absolute -bottom-1 w-full h-24 bg-gradient-to-t from-white to-transparent z-0" />

          <div className="absolute bottom-0 left-12 flex items-end gap-8 z-10 translate-y-4">
            <div className="relative">
              <img 
                src={photoSrc}
                className="w-44 h-44 rounded-[3rem] border-8 border-white shadow-2xl object-cover"
                alt={provider.name}
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="mb-10 pb-2">
              <h2 className="text-5xl font-black text-white drop-shadow-xl tracking-tight">{provider.name}</h2>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                  {provider.category.replace('-', ' ')}
                </span>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1.5 rounded-full text-sm font-black shadow-lg">
                    <span>★</span> {averageRating.toFixed(1)} <span className="opacity-60 text-xs">({reviews.length})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-grow overflow-y-auto p-12 pt-20 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Bio Section */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px flex-grow bg-gray-100"></span>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">The Professional</h3>
                  <span className="h-px flex-grow bg-gray-100"></span>
                </div>
                <p className="text-gray-600 leading-relaxed text-xl font-medium italic">"{provider.bio}"</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-xl font-black text-indigo-900">{provider.experience}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 text-center">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Jobs Done</p>
                    <p className="text-xl font-black text-emerald-900">{provider.completedJobs}</p>
                  </div>
                  <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100/50 text-center">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Response</p>
                    <p className="text-xl font-black text-purple-900">{provider.responseTime}</p>
                  </div>
                  <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50 text-center">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Rate</p>
                    <p className="text-xl font-black text-rose-900">${provider.priceValue}/hr</p>
                  </div>
                </div>
              </section>

              {/* Reviews Section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="h-px flex-grow bg-gray-100"></span>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Reviews & Ratings</h3>
                  <span className="h-px flex-grow bg-gray-100"></span>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-8">
                    {reviews.map(review => (
                      <div key={review.id} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 text-lg font-bold flex items-center justify-center flex-shrink-0">
                          {review.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-1">
                            <p className="font-bold text-gray-900">{review.authorName}</p>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic py-8">This provider doesn't have any reviews yet.</p>
                )}

                {/* Review Form */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  {currentUser && !userHasReviewed ? (
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <h4 className="font-bold text-gray-800 mb-4">Leave a Review</h4>
                      <div className="space-y-4">
                        <StarRating rating={newRating} onRatingChange={setNewRating} isInteractive />
                        <textarea 
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          rows={3}
                          placeholder="Share your experience..."
                          className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                          required
                        />
                        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                          Submit Review
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                      {userHasReviewed ? "You have already reviewed this provider." : "Please log in to leave a review."}
                    </p>
                  )}
                </div>
              </section>

            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-0 space-y-8">
                
                {/* Contact/Booking Card */}
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 space-y-6 relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/5 rounded-full transition-transform group-hover:scale-150" />
                  
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-black text-gray-900">Direct Contact</h4>
                    <button 
                        onClick={() => onToggleFavorite('provider', provider.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                        aria-label="Toggle Favorite"
                    >
                        <svg className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'text-rose-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
                        </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => onBook(provider)}
                      className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      Book Session
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <h5 className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Start a Conversation
                      </h5>
                      <button 
                        onClick={() => onStartInAppChat(provider)}
                        className="w-full py-4 bg-gray-800 text-white rounded-[1.5rem] font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        Chat in App
                      </button>
                      <button 
                        onClick={handleWhatsAppContact}
                        className="w-full py-4 bg-emerald-500 text-white rounded-[1.5rem] font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Contact Provider
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Service Fee</p>
                      <p className="text-emerald-500 font-black text-sm">$0.00</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Free booking through LSERS PRO network.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileModal;
