import { Box, Flex, Spinner, Center, useToast } from "@chakra-ui/react";
import TourDetail from "./TourDetail";
import TourList from "./TourList";
import React, { useState, useEffect } from "react";
import { getTours } from "../../../services/api";

export default function DataTables() {
    const [tourData, setTourData] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const loadTours = async () => {
        try {
            setLoading(true);
            const data = await getTours();
            setTourData(data);
            if (data.length > 0 && !selectedTour) {
                setSelectedTour(data[0]);
            }
        } catch (error) {
            console.error("Error loading tours:", error);
            toast({
                title: "Error loading tours",
                description: error.message || "Failed to fetch tours from server",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTours();
    }, []);

    if (loading) {
        return (
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <Center h="50vh">
                    <Spinner size="xl" color="blue.500" />
                </Center>
            </Box>
        );
    }

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Flex spacing="20px" align="start">
                <TourDetail
                    tourData={selectedTour ? [selectedTour] : tourData}
                    selectedTour={selectedTour}
                    onTourUpdate={loadTours}
                />
                <Box w="25%" ml="20px">
                    <TourList
                        tourData={tourData}
                        onTourSelect={setSelectedTour}
                        selectedTour={selectedTour}
                    />
                </Box>
            </Flex>
        </Box>
    );
}
