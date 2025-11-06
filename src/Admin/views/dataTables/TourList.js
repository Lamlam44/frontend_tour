/* eslint-disable */

import {
    Box,
    Flex,
    Image,
    Text,
    VStack,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from '../../components/card/Card';
import Menu from '../../components/menu/MainMenu';

export default function TourList(props) {
    const { tourData, onTourSelect, selectedTour } = props;
    const textColor = useColorModeValue('white');
    const textColorSecondary = useColorModeValue('white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const hoverBg = useColorModeValue('gray.700');
    const selectedBg = useColorModeValue('blue.900');
    const selectedBorderColor = useColorModeValue('blue.200', 'blue.500');

    // Use all tours from the data
    const tours = tourData && tourData.length > 0 ? tourData : [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Card
            flexDirection="column"
            w="100%"
            px="0px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
            h="100vh" // Set full viewport height
            maxH="100vh" // Ensure it doesn't exceed viewport height
        >
            <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                <Text
                    color={textColor}
                    fontSize="22px"
                    fontWeight="700"
                    lineHeight="100%"
                >
                    Tour List
                </Text>
                <Menu />
            </Flex>

            <Box
                p="10px"
                overflowY="auto" // Enable vertical scrolling
                flex="1" // Take up remaining space
                h="calc(100vh - 200px)" // Adjust height accounting for header and padding
            >
                <VStack spacing="8px" align="stretch">
                    {tours.map((tour, index) => {
                        const isSelected = selectedTour && selectedTour.tourId === tour.tourId;

                        return (
                            <Box
                                key={tour.tourId || index}
                                p="15px"
                                borderRadius="12px"
                                border="1px solid"
                                borderColor={isSelected ? selectedBorderColor : borderColor}
                                bg={isSelected ? selectedBg : 'transparent'}
                                _hover={{
                                    bg: isSelected ? selectedBg : hoverBg,
                                    cursor: 'pointer',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease'
                                }}
                                transition="all 0.2s ease"
                                onClick={() => onTourSelect && onTourSelect(tour)}
                            >
                                <HStack spacing="15px" align="center">
                                    {/* Minimal Tour Image (1/8 of original size) */}
                                    <Box
                                        flexShrink={0}
                                        borderRadius="8px"
                                        overflow="hidden"
                                        w="75px" // 1/8 of 600px (approximate original width)
                                        h="50px" // 1/8 of 400px (approximate original height)
                                    >
                                        <Image
                                            src={tour.tourImage || tour.img}
                                            alt={tour.tourName || tour.title}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                        />
                                    </Box>

                                    {/* Tour Information */}
                                    <VStack align="start" spacing="4px" flex="1">
                                        <Text
                                            color={textColor}
                                            fontSize="md"
                                            fontWeight="600"
                                            lineHeight="1.2"
                                        >
                                            {tour.tourName || tour.title}
                                        </Text>                                        <Text
                                            color={textColorSecondary}
                                            fontSize="sm"
                                            fontWeight="500"
                                        >
                                            {tour.tourPrice ? formatPrice(tour.tourPrice) : tour.price}
                                        </Text>
                                    </VStack>

                                    {/* Optional: Tour ID for reference */}
                                    <Text
                                        color={textColorSecondary}
                                        fontSize="xs"
                                        fontWeight="500"
                                        flexShrink={0}
                                    >
                                        {tour.tourId}
                                    </Text>
                                </HStack>
                            </Box>
                        );
                    })}
                </VStack>
            </Box>
        </Card>
    );
}
