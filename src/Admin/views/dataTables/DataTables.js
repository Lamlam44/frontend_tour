import { Box, Flex } from "@chakra-ui/react";
import TourDetail from "./TourDetail";
import TourList from "./TourList";
import tourData from "./tourData.json";
import React from "react";

export default function DataTables() {
    const [selectedTour, setSelectedTour] = React.useState(tourData[0] || null);

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Flex spacing="20px" align="start">
                <TourDetail
                    tourData={selectedTour ? [selectedTour] : tourData}
                    selectedTour={selectedTour}
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
