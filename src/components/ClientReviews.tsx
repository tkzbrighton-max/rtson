import React from 'react';
import { Award, Quote, CheckCircle2 } from 'lucide-react';

export const ClientReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Pastor Samuel O.',
      role: 'Grace Revival Church',
      category: 'Church Flyer Design',
      rating: 5,
      comment: 'The 3D text and minister photo retouching for our 3-day praise conference was breathtaking! Delivered in less than 18 hours. Highly recommended!',
      verified: true
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'Eclipse VIP Club & Events',
      category: 'Event Poster Design',
      rating: 5,
      comment: 'Best graphic designer for nightlife flyers. The high contrast lighting brought so much crowd to our DJ festival. The motion graphic flyer was a huge hit!',
      verified: true
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      role: 'Aura Real Estate Group',
      category: 'Simple Flyer & Branding',
      rating: 5,
      comment: 'Transparent pricing with zero guesswork. We ordered a simple business flyer package and got 300 DPI print files plus social media stories same day.',
      verified: true
    },
    {
      id: 4,
      name: 'David K.',
      role: 'Podcast & Content Creator',
      category: 'Social Media Pack',
      rating: 5,
      comment: 'The 3-slide matching Instagram carousel design doubled my engagement. The editable source files made it super easy to customize future episodes!',
      verified: true
    }
  ];

  return (
    <section id="client-reviews-section" className="py-16 bg-gradient-to-b from-[#050c18] via-[#081832] to-[#050c18] border-t border-[#1e3a8a]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#091a38] to-[#0a2348] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold mb-3 shadow-md shadow-black/40">
            <span>Client Reviews</span>
            <span className="w-2 h-2 rounded-full bg-[#d4f15d] inline-block"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Loved By Pastors, Promoters & Business Owners
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Active Target: Delivering 1,000 custom flyers, posters, and brand graphics with 100% satisfaction SLA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061226] border border-[#1e3a8a]/40 flex flex-col justify-between space-y-4 hover:border-[#d4f15d]/60 transition-all shadow-lg"
            >
              <div className="space-y-3">
                {/* Verified Rating Badges & Category Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Award key={i} className="w-3.5 h-3.5 fill-[#d4f15d] text-[#d4f15d]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#050c18] text-[#d4f15d] border border-[#1e3a8a]/40">
                    {rev.category}
                  </span>
                </div>

                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e3a8a]/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <span className="text-[10px] text-slate-400">{rev.role}</span>
                </div>
                {rev.verified && (
                  <span className="text-[10px] text-[#d4f15d] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#d4f15d]" /> Verified
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
