"use client";

import { useState, useMemo } from "react";
import ListingCard from "@/app/components/listings/ListingCard";
import BookingModal from "@/app/components/modals/BookingModal";

interface ListingsClientProps {
  initialListings: any[];
}

export default function ListingsClient({ initialListings }: ListingsClientProps) {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const categories = useMemo(() => {
    const cats = new Set(initialListings.map(listing => listing.category).filter(Boolean));
    return Array.from(cats);
  }, [initialListings]);

  const filteredListings = useMemo(() => {
    return initialListings.filter((listing) => {
      // Location Filter
      const matchesLocation = locationFilter === "" || 
        listing.location?.toLowerCase().includes(locationFilter.toLowerCase()) || 
        listing.country?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        listing.title?.toLowerCase().includes(locationFilter.toLowerCase());

      // Category Filter
      const matchesCategory = categoryFilter === "" || listing.category === categoryFilter;

      // Price Filter
      const price = listing.price_per_night || listing.price || 0; // check price_per_night or price
      const matchesMinPrice = minPrice === "" || price >= minPrice;
      const matchesMaxPrice = maxPrice === "" || price <= maxPrice;

      return matchesLocation && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [initialListings, locationFilter, categoryFilter, minPrice, maxPrice]);

  const handleBook = (listing: any) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
          <input 
            type="text" 
            placeholder="Search location, city, or title..." 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        
        <div className="w-full md:flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto flex gap-4">
          <div className="flex-1 md:flex-none">
            <label className="block text-sm font-bold text-slate-700 mb-2">Min Price</label>
            <input 
              type="number" 
              placeholder="$ Min" 
              className="w-full md:w-28 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
            />
          </div>
          <div className="flex-1 md:flex-none">
            <label className="block text-sm font-bold text-slate-700 mb-2">Max Price</label>
            <input 
              type="number" 
              placeholder="$ Max" 
              className="w-full md:w-28 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg">No stays match your criteria. Try adjusting your filters!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              data={listing} 
              onAction={handleBook}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <BookingModal
          listing={selectedListing}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
