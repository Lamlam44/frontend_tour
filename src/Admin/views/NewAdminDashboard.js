import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AdminLayout from '../layouts/AdminLayout';
import theme from '../theme';

export default function NewAdminDashboard() {
    return (
        <ChakraProvider theme={theme}>
            <AdminLayout />
        </ChakraProvider>
    );
}
