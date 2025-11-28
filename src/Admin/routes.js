import React from "react";
import { Icon, layout } from "@chakra-ui/react";
import {
  MdHome,
  MdTableChart,
  MdEventNote,
  MdLocalOffer,
  MdHotel,
  MdPerson,
  MdPersonPin,
  MdPlace,
  MdDirectionsCar,MdAccountCircle,MdPeopleAlt
} from "react-icons/md";

// Admin Imports
import MainDashboard from "./views/dashboard/MainDashboard";
import DataTables from "./views/dataTables/DataTables";
import TourManagement from "./views/TourManagement";
import PromotionSettingPage from "./views/PromotionSettingPage";
import AccommodationManagementPage from "./views/AccommodationManagementPage";
import CustomerManagementPage from "./views/CustomerManagementPage";
import TourGuideManagementPage from "./views/TourGuideManagementPage";
import TouristDestinationManagementPage from "./views/TouristDestinationManagementPage";
import TravelVehicleManagementPage from "./views/TravelVehicleManagementPage";
import InvoiceSettingPage from "./views/InvoiceSettingPage";
import AccountManagementPage from "./views/AccountManagementPage";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: "Tours Details",
    layout: "/admin",
    path: "/tours",
    icon: <Icon as={MdTableChart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: "Tour Management",
    layout: "/admin",
    path: "/tour-management",
    icon: <Icon as={MdEventNote} width="20px" height="20px" color="inherit" />,
    component: <TourManagement />,
  },
  {
    name: "Accommodation Management",
    layout: "/admin",
    path: "/accommodation-management",
    icon: <Icon as={MdHotel} width="20px" height="20px" color="inherit" />,
    component: <AccommodationManagementPage />,
  },
  {
    name: "Customer Management",
    layout: "/admin",
    path: "/customer-management",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <CustomerManagementPage />,
  },
  {
    name: "Tour Guide Management",
    layout: "/admin",
    path: "/tour-guide-management",
    icon: <Icon as={MdPersonPin} width="20px" height="20px" color="inherit" />,
    component: <TourGuideManagementPage />,
  },
  {
    name: "Tourist Destination Management",
    layout: "/admin",
    path: "/tourist-destination-management",
    icon: <Icon as={MdPlace} width="20px" height="20px" color="inherit" />,
    component: <TouristDestinationManagementPage />,
  },
  {
    name: "Travel Vehicle Management",
    layout: "/admin",
    path: "/travel-vehicle-management",
    icon: <Icon as={MdDirectionsCar} width="20px" height="20px" color="inherit" />,
    component: <TravelVehicleManagementPage />,
  },
  {
    name: "Promotion Settings",
    layout: "/admin",
    path: "/promotion-settings",
    icon: <Icon as={MdLocalOffer} width="20px" height="20px" color="inherit" />,
    component: <PromotionSettingPage />,
  },
  {
    name: "Invoice Settings",
    layout: "/admin",
    path: "/invoice-settings",
    icon: <Icon as={MdEventNote} width="20px" height="20px" color="inherit" />,
    component: <InvoiceSettingPage />,
  },
  {
    name:"Account Management",
    layout:"/admin",
    path:"/account-management",
    icon: <Icon as={MdAccountCircle} width="20px" height="20px" color="inherit" />,
    component: <AccountManagementPage />,
  }
];

export default routes;
