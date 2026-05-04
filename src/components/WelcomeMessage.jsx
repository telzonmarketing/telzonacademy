import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const WelcomeMessage = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      const { data } = await supabase.from('hiring_companies').select('*');
      if (data && data.length > 0) {
        // We triple the data to ensure there is never a visual "jump" when the loop restarts
        setLogos([...data, ...data, ...data]); 
      }
    };
    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <div className="py-20 bg-transparent overflow-hidden border-y border-white/5">
      <h3 className="text-center text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-12">
        Our Students Work At
      </h3>
      
      <div className="slider-container relative w-full overflow-hidden">
        {/* The 'animate-smooth-scroll' class handles the liquid motion */}
        <div className="logo-track animate-smooth-scroll flex items-center gap-24 w-fit">
          {logos.map((logo, idx) => (
            <div key={idx} className="flex-shrink-0">
              <img 
                src={logo.logo_url} 
                alt={logo.company_name} 
                className="h-10 w-auto filter brightness-0 invert opacity-40 hover:opacity-100 transition-opacity duration-500"
                style={{ willChange: 'transform' }} // Prepares GPU for smoother motion
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .logo-track {
          display: flex;
          /* Slower duration (50s) creates a more premium, effortless feel */
          animation: liquid-scroll 50s linear infinite;
        }

        @keyframes liquid-scroll {
          0% {
            /* Using translate3d forces the browser to use the Graphics Card (GPU) to stop lag */
            transform: translate3d(0, 0, 0);
          }
          100% {
            /* We move to -33.33% because we tripled the logo array */
            transform: translate3d(-33.333%, 0, 0);
          }
        }

        /* Stops stuttering when user hovers */
        .slider-container:hover .logo-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default WelcomeMessage;