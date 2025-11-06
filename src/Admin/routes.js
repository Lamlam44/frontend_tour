import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
    MdBarChart,
    MdHome,
    MdTableChart,
    MdEventNote,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from './views/dashboard/MainDashboard';
import DataTables from './views/dataTables/DataTables';
import TourManagement from './views/TourManagement';

const routes = [
    {
        name: 'Dashboard',
        layout: '/admin',
        path: '/dashboard',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
    },
    {
        name: 'Tours Details',
        layout: '/admin',
        icon: <Icon as={MdTableChart} width="20px" height="20px" color="inherit" />,
        path: '/tours',
        component: <DataTables />,
    },
    {
        name: 'Tour Management',
        layout: '/admin',
        icon: <Icon as={MdEventNote} width="20px" height="20px" color="inherit" />,
        path: '/tour-management',
        component: <TourManagement />,
    },
];

export default routes;