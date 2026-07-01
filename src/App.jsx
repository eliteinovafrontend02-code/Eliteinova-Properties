import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/common/Header";
import HomePage from "./pages/HomePage";
import PostPropertyPage from "./pages/PostPropertyPage";
import CustomerPortalPage from "./pages/CustomerPortalPage";
import IndividualPage from "./pages/Individual/IndividualPage";
import BuyPage from "./pages/BuyPage";
import LeasePage from "./pages/LeasePage";
// import RentPage from "./pages/RentPage";
// import SellPage from "./pages/SellPage";
import ApartmentPage from "./pages/Apartment/ApartmentPage";
import CommercialPage from "./pages/Commercial/CommercialPage";
import LandPlotsPage from "./pages/LandAndPlots/LandAndPlotsPage";
// import HostelPage from "./pages/HostelPage";

// Import all house type pages
import IndependentHousePage from "./pages/Individual/IndependentHousePage";
import IndependentVillaPage from "./pages/Individual/IndependentVillaPage";
import ResidentialApartmentPage from "./pages/Individual/ResidentialApartmentPage";
import DuplexResidentialUnitPage from "./pages/Individual/DuplexResidentialUnitPage";
import RowHousePage from "./pages/Individual/RowHousePage";

// Import all apartment type pages
import RentalApartmentPage from './pages/Apartment/RentalApartmentPage';
import ServicedApartmentPage from './pages/Apartment/ServicedApartmentPage';
import LeaseApartmentPage from './pages/Apartment/LeaseApartmentPage';
import ResidentialApartmentsPage from './pages/Apartment/ResidentialApartmentsPage';
import GatedCommunityApartmentPage from './pages/Apartment/GatedCommunityApartmentPage';
import StudioApartmentPage from './pages/Apartment/StudioApartmentPage';
import DuplexApartmentPage from './pages/Apartment/DuplexApartmentPage';
import LuxuryApartmentPage from './pages/Apartment/LuxuryApartmentPage';
import CondominiumApartmentPage from './pages/Apartment/CondominiumApartmentPage';
import PentHouseApartmentPage from './pages/Apartment/PentHouseApartmentPage';

//Import all commercial type pages
import OfficeSpacePage from './pages/Commercial/OfficeSpacePage';
import RetailShopPage from './pages/Commercial/RetailShopPage';
import ShowroomPage from './pages/Commercial/ShowroomPage';
import CommercialLandPage from './pages/Commercial/CommercialLandPage';
import WareHousePage from './pages/Commercial/WareHousePage';
import IndustrialPropertyPage from './pages/Commercial/IndustrialPropertyPage';
import CoWorkingSpacePage from './pages/Commercial/CoWorkingSpacePage';
import BusinessCenterPage from './pages/Commercial/BusinessCenterPage';
import ShoppingMallSpacePage from './pages/Commercial/ShoppingMallSpacePage';
import CommercialComplexPage from './pages/Commercial/CommercialComplexPage';
import RestaurantPage from './pages/Commercial/RestaurantPage';
import HotelPage from './pages/Commercial/HotelPage';
import ClinicPage from './pages/Commercial/ClinicPage';
import EducationalPage from './pages/Commercial/EducationalPage';
import ITParkPage from './pages/Commercial/ITParkPage';
import MultiplexPage from './pages/Commercial/MultiplexPage';
import PertrolBunkPage from './pages/Commercial/PetrolBunkPage';
import ColdStoragePage from './pages/Commercial/ColdStoragePage';
import MixedUsePage from './pages/Commercial/MixedUsePage';
import AgriculturalPage from './pages/Commercial/AgriculturalPage';

// Import all land and plot type pages
import ResidentialLandPlotsPage from './pages/LandAndPlots/ResidentialLandPlotsPage';
import ResidentialPlotPage from './pages/LandAndPlots/ResidentialPlotPage';
import DTCPPlotPage from './pages/LandAndPlots/DTCPPlotPage';
import GatedCommunityPlotPage from './pages/LandAndPlots/GatedCommunityPlotPage';
import VillaPlotPage from './pages/LandAndPlots/VillaPlotPage';
import FarmHousePlotPage from './pages/LandAndPlots/FarmHousePlotPage';
import CommonPlotPage from './pages/LandAndPlots/CommonPlotPage';
import DuplexHousePlotPage from './pages/LandAndPlots/DuplexHousePlotPage';
import IndependentHousePlotPage from './pages/LandAndPlots/IndependentHousePlotPage';
import RowHousePlotPage from './pages/LandAndPlots/RowHousePlotPage';

import CommercialLandPlotsPage from './pages/LandAndPlots/CommercialLandPlotsPage';
import CommercialPlotPage from './pages/LandAndPlots/CommercialPlotPage';
import OfficeSpaceLandPage from './pages/LandAndPlots/OfficeSpaceLandPage';
import RetailShopPlotPage from './pages/LandAndPlots/RetailShopPlotPage';
import ShowroomPlotPage from './pages/LandAndPlots/ShowroomPlotPage';
import ShoppingComplexLandPage from './pages/LandAndPlots/ShoppingComplexLandPage';
import HotelResortLandPage from './pages/LandAndPlots/HotelResortLandPage';
import PetrolBunkPlotPage from './pages/LandAndPlots/PetrolBunkPlotPage';
import ITParkLandPage from './pages/LandAndPlots/ITParkLandPage';
import WarehouseLandPage from './pages/LandAndPlots/WarehouseLandPage';
import IndustrialCommercialPlotPage from './pages/LandAndPlots/IndustrialCommercialPlotPage';

import AgriculturalLandPlotsPage from './pages/LandAndPlots/AgriculturalLandPlotsPage';
import AgriculturalLandPage from './pages/LandAndPlots/AgriculturalLandPage';
import FarmLandPage from './pages/LandAndPlots/FarmLandPage';
import OrganicFarmingLandPage from './pages/LandAndPlots/OrganicFarmingLandPage';
import CoconutFarmLandPage from './pages/LandAndPlots/CoconutFarmLandPage';
import MangoGroveLandPage from './pages/LandAndPlots/MangoGroveLandPage';
import TeaCoffeeLandPage from './pages/LandAndPlots/TeaCoffeeLandPage';
import DairyFarmLandPage from './pages/LandAndPlots/DairyFarmLandPage.jsx';
import FisheriesAquacultureLandPage from './pages/LandAndPlots/FisheriesAquacultureLandPage';
import PoultryFarmLandPage from './pages/LandAndPlots/PoultryFarmLandPage';

// Import all form modals
import OwnerFormModal from "./components/Forms/OwnerFormModal";
import AgentFormModal from "./components/Forms/AgentFormModal";
import BuilderFormModal from "./components/Forms/BuilderFormModal";
import HostelFormModal from "./components/Forms/HostelFormModal";
import PropertyManagementFormModal from "./components/Forms/PropertyManagementFormModal";

function AppLayout() {
  const [openOwnerForm, setOpenOwnerForm] = useState(false);
  const [openAgentForm, setOpenAgentForm] = useState(false);
  const [openBuilderForm, setOpenBuilderForm] = useState(false);
  const [openHostelForm, setOpenHostelForm] = useState(false);
  const [openPropertyManagementForm, setOpenPropertyManagementForm] = useState(false);

  // Central control from Header
  const handlePostPropertyClick = (type) => {
    console.log("Form clicked:", type);
    
    if (type === "Owner") {
      setOpenOwnerForm(true);
    } else if (type === "Agent") {
      setOpenAgentForm(true);
    } else if (type === "Builder") {
      setOpenBuilderForm(true);
    } else if (type === "Hostel") {
      setOpenHostelForm(true);
    } else if (type === "Property Management") {
      setOpenPropertyManagementForm(true);
    }
  };

  return (
    <>
      {/* HEADER (fixed) */}
      <Header
        onMenuToggle={() => {}}
        onPostPropertyClick={handlePostPropertyClick}
      />

      {/* FORM MODALS */}
      {openOwnerForm && (
        <OwnerFormModal
          isOpen={openOwnerForm}
          onClose={() => setOpenOwnerForm(false)}
        />
      )}

      {openAgentForm && (
        <AgentFormModal
          isOpen={openAgentForm}
          onClose={() => setOpenAgentForm(false)}
        />
      )}

      {openBuilderForm && (
        <BuilderFormModal
          isOpen={openBuilderForm}
          onClose={() => setOpenBuilderForm(false)}
        />
      )}

      {openHostelForm && (
        <HostelFormModal
          isOpen={openHostelForm}
          onClose={() => setOpenHostelForm(false)}
        />
      )}

      {openPropertyManagementForm && (
        <PropertyManagementFormModal
          isOpen={openPropertyManagementForm}
          onClose={() => setOpenPropertyManagementForm(false)}
        />
      )}

      {/* MAIN CONTENT — compensate fixed header height */}
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer-portal" element={<CustomerPortalPage />} />
          
          {/* Customer Portal Routes */}
          <Route path="/individual" element={<IndividualPage />} />
          <Route path="/apartment" element={<ApartmentPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/land-plots" element={<LandPlotsPage />} />
          {/* <Route path="/rent" element={<RentPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/lease" element={<LeasePage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/land-plots" element={<LandPlotsPage />} />
          <Route path="/hostel" element={<HostelPage />} /> */}
          
          {/* Individual House Type Routes */}
          <Route path="/individual/independent-house" element={<IndependentHousePage />} />
          <Route path="/individual/independent-villa" element={<IndependentVillaPage />} />
          <Route path="/individual/residential-apartment" element={<ResidentialApartmentPage />} />
          <Route path="/individual/duplex-residential-unit" element={<DuplexResidentialUnitPage />} />
          <Route path="/individual/row-house" element={<RowHousePage />} />

          {/* Apartment House  Type Routes */}
          <Route path="/apartment/rental-apartment" element={<RentalApartmentPage />} />
          <Route path="/apartment/serviced-apartment" element={<ServicedApartmentPage />} />
          <Route path="/apartment/lease-apartment" element={<LeaseApartmentPage />} />
          <Route path="/apartment/residential-apartments" element={<ResidentialApartmentsPage />} />
          <Route path="/apartment/gated-community-apartment" element={<GatedCommunityApartmentPage/>} />
          <Route path="/apartment/studio-apartment" element={<StudioApartmentPage/>} />
          <Route path="/apartment/duplex-apartment" element={<DuplexApartmentPage/>} />
          <Route path="/apartment/luxury-apartment" element={<LuxuryApartmentPage/>} />
          <Route path="/apartment/condominium" element={<CondominiumApartmentPage/>} />
          <Route path="/apartment/penthouse-apartment" element={<PentHouseApartmentPage/>} />

          {/* Commercial Type Routes */}
          <Route path="/commercial/office-space" element={<OfficeSpacePage />} />
          <Route path="/commercial/retail-shop" element={<RetailShopPage />} />
          <Route path="/commercial/showroom" element={<ShowroomPage />} />
          <Route path="/commercial/commercial-land-plot" element={<CommercialLandPage />} />
          <Route path="/commercial/warehouse-godown" element={<WareHousePage />} />
          <Route path="/commercial/industrial-property-factory" element={<IndustrialPropertyPage />} />
          <Route path="/commercial/coworking-space" element={<CoWorkingSpacePage />} />
          <Route path="/commercial/business-center" element={<BusinessCenterPage />} />
          <Route path="/commercial/shopping-mall-space" element={<ShoppingMallSpacePage />} />
          <Route path="/commercial/commercial-complex" element={<CommercialComplexPage />} />
          <Route path="/commercial/restaurant-cafe-space" element={<RestaurantPage />} />
          <Route path="/commercial/hotel-lodge-resort-property" element={<HotelPage />} />
          <Route path="/commercial/clinic-hospital-space" element={<ClinicPage />} />
          <Route path="/commercial/educational-institution-property" element={<EducationalPage />} />
          <Route path="/commercial/it-park-tech-park-space" element={<ITParkPage />} />
          <Route path="/commercial/multiplex-entertainment-space" element={<MultiplexPage />} />
          <Route path="/commercial/petrol-bunk-fuel-station" element={<PertrolBunkPage />} />
          <Route path="/commercial/cold-storage-logistics-hub" element={<ColdStoragePage />} />
          <Route path="/commercial/mixed-use-commercial-property" element={<MixedUsePage/>} />
          <Route path="/commercial/agricultural-commercial-property" element={<AgriculturalPage/>} />

          {/* Land and Plots Type Routes */}
          <Route path="/land-plots/residential-land-plots" element={<ResidentialLandPlotsPage/>} />
          <Route path="/land-plots/residential-land-plots/residential-plot" element={<ResidentialPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/dtcp-cmda-approved-plot" element={<DTCPPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/gated-community-plot" element={<GatedCommunityPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/villa-plot" element={<VillaPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/farm-house-plot" element={<FarmHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/common-plot" element={<CommonPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/row-house-plot" element={<RowHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/duplex-house-plot" element={<DuplexHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/independent-house-plot" element={<IndependentHousePlotPage/>} />

          <Route path="/land-plots/commercial-land-plots" element={<CommercialLandPlotsPage/>} />
          <Route path="/land-plots/commercial-land-plots/commercial-plot" element={<CommercialPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/office-space-land" element={<OfficeSpaceLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/retail-shop-plot" element={<RetailShopPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/showroom-plot" element={<ShowroomPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/shopping-complex-land" element={<ShoppingComplexLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/hotel-resort-land" element={<HotelResortLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/petrol-bunk-plot" element={<PetrolBunkPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/it-park-land" element={<ITParkLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/warehouse-land" element={<WarehouseLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/industrial-commercial-plot" element={<IndustrialCommercialPlotPage/>} />

         <Route path="/land-plots/agricultural-land-plots" element={<AgriculturalLandPlotsPage/>} />
        <Route path="/land-plots/agricultural-land-plots/agricultural-land" element={<AgriculturalLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/farm-land" element={<FarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/organic-farming-land" element={<OrganicFarmingLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/coconut-farm-land" element={<CoconutFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/mango-grove-land" element={<MangoGroveLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/tea-coffee-estate" element={<TeaCoffeeLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/poultry-farm-land" element={<PoultryFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/dairy-farm-land" element={<DairyFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/fisheries-aquaculture-land" element={<FisheriesAquacultureLandPage/>} />
          

          <Route 
            path="/post-property" 
            element={<PostPropertyPage onPostPropertyClick={handlePostPropertyClick} />} 
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}