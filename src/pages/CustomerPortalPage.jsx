import React from "react";
import { useNavigate } from "react-router-dom";
import customerPortalBanner from "../assets/customerPortalBanner.jpg";

const CustomerPortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section
        className="w-full py-12 md:py-20 px-4 flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${customerPortalBanner})`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg">
            Customer Portal
          </h1>
          <p className="text-white text-center text-base md:text-xl max-w-2xl px-4 drop-shadow-md">
            Find your dream property with us - No brokerage, No hassle
          </p>
        </div>
      </section>

      {/* Three Buttons Section */}
      <section className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <button
            onClick={() => navigate("/individual")}
            className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
            Individual
          </button>

          <button
            onClick={() => navigate("/buy")}
            className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
           Apartment 
          </button>

          <button
            onClick={() => navigate("/lease")}
            className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
            Commercial
          </button>
          <button
            onClick={() => navigate("/lease")}
            className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
            Hostel
          </button>
          <button
            onClick={() => navigate("/lease")}
            className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
            Land & Plots
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4 pb-8 md:pb-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
            Why Choose Eliteinova Properties?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">1</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Zero Brokerage</h3>
              <p className="text-gray-600 text-sm">
                No hidden charges or commission fees
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">2</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Verified Properties</h3>
              <p className="text-gray-600 text-sm">
                All properties are verified and genuine
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">3</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Easy Process</h3>
              <p className="text-gray-600 text-sm">
                Simple and hassle-free property search
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerPortalPage;