import React, { useState } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Badge,
    useColorModeValue,
    Flex,
    Text,
    Input,
    Select,
} from '@chakra-ui/react';
import Card from '../../Admin/components/card/Card';

export default function TourManagement() {
    const textColor = useColorModeValue('white'); // Define a single variable for text color
    const borderColor = useColorModeValue('whiteAlpha.100');

    const [tours] = useState([
        {
            id: 'T001',
            name: 'Phú Quốc Paradise Beach',
            price: '3,990,000đ',
            status: 'Active',
            bookings: 145,
        },
        {
            id: 'T002',
            name: 'Đà Lạt Dream Escape',
            price: '2,590,000đ',
            status: 'Active',
            bookings: 132,
        },
        {
            id: 'T003',
            name: 'Hạ Long Bay Cruise',
            price: '4,990,000đ',
            status: 'Inactive',
            bookings: 98,
        },
    ]);

    return (
        <Box marginTop={100}>
            <Card>
                <Flex justify='space-between' align='center' mb='20px'>
                    <Text fontSize='xl' fontWeight='bold' color={textColor}>
                        Tour Management
                    </Text>
                    <Button colorScheme='blue'>Add New Tour</Button>
                </Flex>
                <Box mt='20px'>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th color={textColor}>ID</Th>
                                <Th color={textColor}>Name</Th>
                                <Th color={textColor}>Price</Th>
                                <Th color={textColor}>Status</Th>
                                <Th color={textColor}>Bookings</Th>
                                <Th color={textColor}>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tours.map((tour) => (
                                <Tr key={tour.id}>
                                    <Td color={textColor}>{tour.id}</Td>
                                    <Td color={textColor}>{tour.name}</Td>
                                    <Td color={textColor}>{tour.price}</Td>
                                    <Td color={textColor}>
                                        <Badge colorScheme={tour.status === 'Active' ? 'green' : 'red'}>
                                            {tour.status}
                                        </Badge>
                                    </Td>
                                    <Td color={textColor}>{tour.bookings}</Td>
                                    <Td color={textColor}>
                                        <Button size='sm' colorScheme='yellow' mr='2'>Edit</Button>
                                        <Button size='sm' colorScheme='red'>Delete</Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}