"use client";

import React, { useRef, useState, useEffect } from 'react';

// Dati di esempio (Iterati dal JSON)
const trendingData = [
  { id: 1, title: "Stranger Things", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVwkctHoZyXX6x_Wh9ZoVju5V4_FsQpH0O4FmVxA5gQak9__L6X8OV0HBUaKnNLEe1VsXAOZDZmReBW8xLKNTBlXHs4h-llwpiBovnFEX_9QTQYqjZ0Hai2pZSdzgoYilvYw.jpg?r=e8a" },
  { id: 2, title: "Fabrizio Corona", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcm630g42GPY6RP99C9hk8sLPBlgb1G5yzrzJCx4yiUNKn4EawOTP17P1H6dk6D1QNzC4ZcdO1Umf4EI6HG47r43n3jREOfsa6um_s1OYWZv9M5U92F-3h6X4u9r-0Bteoc9.jpg?r=a23" },
  { id: 3, title: "Bridgerton", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSOvPDjD9GaZKKis0IeXWR1Vxe1eNXbtsuUtK6lfaHDXyp5mHZ6F-0rq_dtQ8JX4g_y2oegwEt5icBR73zQhtkxLbgatgJd18U30tSt-8l-sjOO2ChMmiqDlYVSycH7BVt76.jpg?r=be3" },
  { id: 4, title: "Emily in Paris", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABRLhRTe60NM_EKxCL1Tvt1MvwSSE7UwQZl3NKmbFo1EJmc281PZktex15udt47PxEGG17TpBIaR3LucxUva1ZBNc7Va-6p7asSLi5sD4AUaY0mWwsONwDF-2vJ_W21qP2I3J.jpg?r=77e" },
  { id: 5, title: "The Rip", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTaVymYwG4BlIkHy6KXdO2IlrHYMJxEfqWHYvfbCOM14OV_sTwhZtDvHZBiGHeUYwsttfuKYvXVPehd-1YQbQeKFglJyB_36a4HK9X3yW6TJ2BtXl5_qO30KiF6Ktd5LaDCa.jpg?r=e55" },
  { id: 6, title: "Skyscraper Live", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSKM08km307cQIV7_Ejlqq3RPij-uIJH1GKD2zh89VvtqGPoqQkoIZR_uoqWVv11fZnLrhIwQ5jtHxi6WbIurnSGtwpnpSrvJwSQD-_AqvSEiL7G-DXeM705YSTqSmOErz5Q.jpg?r=067" },
  { id: 7, title: "Sicilia Express", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVmGauer8-9Zb0MG2hGe-JFO4H8lZ1coBulekoALUPnt6qSSQp21iK1fS1X3eUF98YElJcW8ijOgTaeB1EssvgaqW_9uOJiPc75YBUSDO0gppZiZCLio-uNA-N3VuULDnJ-Z.jpg?r=35e" },
  { id: 8, title: "KPop Demon Hunters", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXYdBAe3X5R0Lhv1g-jeMi3UePskTmxzdJIMOmTgOGNcPOxd6t12a0cC67mLL3YGEuhv-kVZCC8KVWaZxl7F3rJ5BPH2jta5Q6xfSzWnMyhevoNXvzKY4Losqv9_LvD7Cbq8.jpg?r=49b" },
  { id: 9, title: "Il Falsario", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABRJ_2isSBjRESrBaOVX0AthS36KKpjLRUn7_7M4yd_vriPcWUWsMa2LiVGfsx3qgxG54bM84Zu1eV-HH2uu6-buzD4-lYUIfl-UI2zPD2SR8KELh57pHTWjjUq6bu-FbpLVb.jpg?r=cb7" },
  { id: 10, title: "Io Sono La Fine Del Mondo", img: "https://occ-0-778-784.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABf59bLGImKS9btK0gd6vkbZFdY6vSUDgOnmjNWb_2_rT4yxzN2TIjo681DXFFG-eM3EvBnu2Bq9f9d2mNOJXJJQorvICqBghlxQ.jpg?r=184" },
];

const TrendingRow = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Controlla la visibilità delle frecce in base alla posizione dello scroll
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.clientWidth * 0.8 : scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-black font-sans">
      <div className="mx-auto max-w-[120rem]">
        
        {/* TITOLO ALLINEATO */}
        <h2 className="text-white text-[1.25rem] md:text-[1.5rem] font-bold mb-4">
          I titoli del momento
        </h2>

        <div className="relative group">
          
          {/* FRECCIA SINISTRA */}
          {canScrollLeft && (
            <button 
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bwo6la-btn rotate-180 arrow-button arrow-left"
              aria-label="Indietro"
              style={{ zIndex: 50 }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path fill="currentColor" fillRule="evenodd" d="m15.586 12-7.293 7.293 1.414 1.414 8-8a1 1 0 0 0 0-1.414l-8-8-1.414 1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          )}

          {/* FRECCIA DESTRA */}
          {canScrollRight && (
            <button 
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bwo6la-btn arrow-button arrow-right"
              aria-label="Avanti"
              style={{ zIndex: 50 }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path fill="currentColor" fillRule="evenodd" d="m15.586 12-7.293 7.293 1.414 1.414 8-8a1 1 0 0 0 0-1.414l-8-8-1.414 1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          )}

            {/* LISTA CONTENUTI */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="relative overflow-x-scroll scrollbar-hide no-scrollbar scroll-smooth overflow-hidden" 
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              <ul className="flex flex-row gap-2 md:gap-4 list-none p-0 m-0 pb-12">
              {trendingData.map((item) => (
                <li 
                  key={item.id}
                  className="flex-shrink-0 relative group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 z-10 w-[38%] md:w-[24%] lg:w-[18.18%]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  
                  {/* RANKING NUMBER - DAVANTI AL POSTER (z-30) */}
                  <div className="absolute left-[-1%] bottom-[-1%] z-30 pointer-events-none leading-none">
                    <span 
                      className="text-[4rem] md:text-[5rem] lg:text-[8rem] font-black tracking-tighter text-black rank-number"
                    >
                      {item.id}
                    </span>
                  </div>

                  {/* POSTER CONTAINER */}
                  <div className="ml-[20%] w-[80%] aspect-[2/3] overflow-hidden rounded-sm bg-[#232323] z-20 relative shadow-lg">
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                </li>
              ))}
            </ul>
            </div>

        </div>
      </div>

      <style jsx>{`
        /* Stile ispezionato originale */
        .bwo6la-btn {
          height: 7.5rem;
          width: 1.5rem;
          border-radius: 0.5rem;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0px;
          margin: 0px;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
          color: rgba(255, 255, 255, 0.7);
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .bwo6la-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .arrow-button {
          width: 4rem;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
          background-color: transparent !important;
        }

        .arrow-button:hover {
          background-color: transparent !important;
          color: white;
        }

        .arrow-left {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
        }

        .arrow-right {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
        }

        .rank-number {
          -webkit-text-stroke: 1px #fff; /* Bordo Bianco */
          font-family: "Netflix Sans", "Arial Black", sans-serif;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TrendingRow;