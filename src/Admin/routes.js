import React from "react";
import { Icon, layout } from "@chakra-ui/react";
import {
  MdHome,
  MdTableChart,
  MdEventNote,
  MdLocalOffer,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "./views/dashboard/MainDashboard";
import DataTables from "./views/dataTables/DataTables";
import TourManagement from "./views/TourManagement";
import PromotionSettingPage from "./views/PromotionSettingPage";
import InvoiceSettingPage from "./views/InvoiceSettingPage";

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
];

export default routes;
