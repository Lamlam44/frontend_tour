import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Navbar from '../components/navbar/Navbar.js';
import Sidebar from '../components/sidebar/AdminSidebar';
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from '../routes.js';

export default function AdminLayout(props) {
    const { ...rest } = props;
    const location = useLocation();
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const getRoute = () => {
        return window.location.pathname !== '/admin/full-screen-maps';
    };

    const getActiveRoute = (routes) => {
        let activeRoute = 'Admin Dashboard';
        for (let i = 0; i < routes.length; i++) {
            if (location.pathname.includes(routes[i].layout + routes[i].path)) {
                return routes[i].name;
            }
        }
        return activeRoute;
    };

    const getRoutes = (routes) => {
        return routes.map((route, key) => {
            if (route.layout === '/admin') {
                return (
                    <Route path={`${route.path}`} element={route.component} key={key} />
                );
            }
            return null;
        });
    };

    return (
        <Box>
            <Sidebar routes={routes} />
            <Box
                bg='navy.900' // Set the background color of the admin dashboard
                float='right'
                minHeight='100vh'
                height='100%'
                overflow='auto'
                position='relative'
                maxHeight='100%'
                w={{ base: '100%', xl: 'calc( 100% - 300px )' }}
                maxWidth={{ base: '100%', xl: 'calc( 100% - 300px )' }}
                transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
                transitionDuration='.2s, .2s, .35s'
                transitionProperty='top, bottom, width'
                transitionTimingFunction='linear, linear, ease'>
                <Portal>
                    <Box>
                        <Navbar
                            brandText={getActiveRoute(routes)}
                        />
                    </Box>
                </Portal>

                {getRoute() ? (
                    <Box
                        mx='auto'
                        p={{ base: '20px', md: '30px' }}
                        pe='20px'
                        minH='100vh'
                        pt='50px'>
                        <Routes>
                            {getRoutes(routes)}
                            <Route path='/' element={<Navigate to='/admin/dashboard' replace />} />
                        </Routes>
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
}
