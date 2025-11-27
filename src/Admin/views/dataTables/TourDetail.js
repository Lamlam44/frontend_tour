

import {
    Box,
    Flex,
    Image,
    Text,
    Badge,
    VStack,
    HStack,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';

// Custom components
import Card from '../../components/card/Card.js';

export default function TourDetail(props) {
    const { tourData } = props;
    const textColor = useColorModeValue('white');
    const textColorSecondary = useColorModeValue('white');
    

    // Use all tours from the data
    const tours = tourData && tourData.length > 0 ? tourData : [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'green';
            case 'Fully Booked':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <VStack
            spacing="20px"
            align="stretch"
            w="75%"
            position="relative"
            left="0"
            h="100vh"
            maxH="100vh"
            overflowY="auto"
            pr="10px"
        >
            {tours.map((tour, index) => (
                <Card
                    key={tour.tourId || index}
                    flexDirection="column"
                    w="100%"
                    px="0px"
                    overflowX={{ sm: 'scroll', lg: 'hidden' }}
                >
                    <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                        <Text
                            color={textColor}
                            fontSize="18px"
                            fontWeight="700"
                            lineHeight="100%"
                        >
                            {tour.tourName || tour.title}
                        </Text>
                        <Badge
                            colorScheme={getStatusColor(tour.tourStatus)}
                            variant="solid"
                            px="10px"
                            py="4px"
                            borderRadius="6px"
                            fontSize="xs"
                        >
                            {tour.tourStatus}
                        </Badge>
                    </Flex>

                    <Box p="25px" pt="0">
                        <VStack spacing="20px" align="stretch">
                            {/* Tour Image */}
                            <Box borderRadius="15px" overflow="hidden">
                                <Image
                                    src={tour.tourImage || tour.img}
                                    alt={tour.tourName || tour.title}
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                />
                            </Box>

                            {/* Tour Description */}
                            <Text
                                color={textColorSecondary}
                                fontSize="sm"
                                lineHeight="1.6"
                            >
                                {tour.tourDescription}
                            </Text>

                            <Divider />

                            {/* Tour Details Grid */}
                            <VStack spacing="12px" align="stretch">
                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="sm" fontWeight="600">
                                        Tour ID:
                                    </Text>
                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                        {tour.tourId}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="lg" fontWeight="600">
                                        Price:
                                    </Text>
                                    <Text color={textColor} fontSize="lg" fontWeight="700">
                                        {tour.tourPrice ? formatPrice(tour.tourPrice) : tour.price}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="sm" fontWeight="600">
                                        Duration:
                                    </Text>
                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                        {tour.duration}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="sm" fontWeight="600">
                                        Remaining Slots:
                                    </Text>
                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                        {tour.tourRemainingSlots}
                                    </Text>
                                </HStack>
                            </VStack>

                            <Divider />

                            {/* Tour Dates */}
                            <VStack spacing="10px" align="stretch">
                                <Text color={textColor} fontSize="md" fontWeight="700">
                                    Tour Schedule
                                </Text>

                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="sm" fontWeight="600">
                                        Start Date:
                                    </Text>
                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                        {tour.tourStartDate ? formatDate(tour.tourStartDate) : 'TBD'}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text color={textColorSecondary} fontSize="sm" fontWeight="600">
                                        End Date:
                                    </Text>
                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                        {tour.tourEndDate ? formatDate(tour.tourEndDate) : 'TBD'}
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                </Card>
            ))}
        </VStack>
    );
}
