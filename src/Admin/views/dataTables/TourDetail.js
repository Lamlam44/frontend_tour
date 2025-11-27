/* eslint-disable */

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
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Textarea,
    useToast,
    Select,
} from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';

// Custom components
import Card from '../../components/card/Card.js';

// API services
import {
    addTour,
    updateTour,
    deleteTour,
    getTourGuides,
    getAccommodations,
    getTravelVehicles,
    getTouristDestinations,
} from '../../../services/api';

export default function TourDetail(props) {
    const { tourData, onTourUpdate } = props;
    const textColor = useColorModeValue('white');
    const textColorSecondary = useColorModeValue('white');
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
    const toast = useToast();

    // Use all tours from the data
    const tours = tourData && tourData.length > 0 ? tourData : [];

    // Modal state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTour, setSelectedTour] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    // Dropdown options
    const [tourGuides, setTourGuides] = React.useState([]);
    const [accommodations, setAccommodations] = React.useState([]);
    const [travelVehicles, setTravelVehicles] = React.useState([]);
    const [touristDestinations, setTouristDestinations] = React.useState([]);

    // Selected IDs for multi-select
    const [selectedVehicleIds, setSelectedVehicleIds] = React.useState([]);
    const [selectedDestinationIds, setSelectedDestinationIds] = React.useState([]);

    const [formData, setFormData] = useState({
        tourName: "",
        tourDescription: "",
        tourPrice: "",
        tourStatus: "",
        tourRemainingSlots: "",
        tourImage: "",
        tourStartDate: "",
        tourEndDate: "",
        tourGuideId: "",
        accommodationId: "",
        travelVehicleIds: "",
        touristDestinationIds: "",
    });

    // Load dropdown options
    React.useEffect(() => {
        const loadDropdownOptions = async () => {
            try {
                const [guidesData, accommodationsData, vehiclesData, destinationsData] = await Promise.all([
                    getTourGuides(),
                    getAccommodations(),
                    getTravelVehicles(),
                    getTouristDestinations(),
                ]);
                setTourGuides(guidesData);
                setAccommodations(accommodationsData);
                setTravelVehicles(vehiclesData);
                setTouristDestinations(destinationsData);
            } catch (err) {
                console.error("Error loading dropdown options", err);
            }
        };
        loadDropdownOptions();
    }, []);

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

    // Format datetime-local to ISO 8601 format for backend
    const formatDateTimeForBackend = (dateTimeLocal) => {
        if (!dateTimeLocal || dateTimeLocal.trim() === "") return null;

        // If it's just a date (YYYY-MM-DD), add default time
        if (dateTimeLocal.length === 10) {
            return dateTimeLocal + "T00:00:00";
        }

        // If it's datetime-local format (YYYY-MM-DDTHH:mm), add seconds
        if (dateTimeLocal.length === 16) {
            return dateTimeLocal + ":00";
        }

        // If it already has seconds, return as is
        return dateTimeLocal;
    };

    // Handle form input change
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Open add modal
    const openAdd = () => {
        setIsEdit(false);
        setSelectedTour(null);
        setSelectedVehicleIds([]);
        setSelectedDestinationIds([]);
        setFormData({
            tourName: "",
            tourDescription: "",
            tourPrice: "",
            tourStatus: "",
            tourRemainingSlots: "",
            tourImage: "",
            tourStartDate: "",
            tourEndDate: "",
            tourGuideId: "",
            accommodationId: "",
            travelVehicleIds: "",
            touristDestinationIds: "",
        });
        onOpen();
    };

    // Open edit modal
    const openEdit = (tour) => {
        setIsEdit(true);
        setSelectedTour(tour);

        const vehicleIds = tour.travelVehicles?.map(v => v.vehicleId) || [];
        const destinationIds = tour.touristDestinations?.map(d => d.destinationId) || [];

        setSelectedVehicleIds(vehicleIds);
        setSelectedDestinationIds(destinationIds);

        setFormData({
            tourName: tour.tourName || "",
            tourDescription: tour.tourDescription || "",
            tourPrice: tour.tourPrice || "",
            tourStatus: tour.tourStatus || "",
            tourRemainingSlots: tour.tourRemainingSlots || "",
            tourImage: tour.tourImage || "",
            tourStartDate: tour.tourStartDate ? tour.tourStartDate.substring(0, 16) : "",
            tourEndDate: tour.tourEndDate ? tour.tourEndDate.substring(0, 16) : "",
            tourGuideId: tour.tourGuide?.tourGuideId || "",
            accommodationId: tour.accommodation?.accommodationId || "",
            travelVehicleIds: vehicleIds.join(', '),
            touristDestinationIds: destinationIds.join(', '),
        });
        onOpen();
    };

    // Handle add tour
    const handleAdd = async () => {
        try {
            const payload = {
                ...formData,
                tourPrice: parseFloat(formData.tourPrice),
                tourRemainingSlots: parseInt(formData.tourRemainingSlots),
                tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
                tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
                tourGuideId: formData.tourGuideId,
                accommodationId: formData.accommodationId,
                travelVehicleIds: selectedVehicleIds,
                touristDestinationIds: selectedDestinationIds,
            };

            console.log("Payload being sent:", JSON.stringify(payload, null, 2));

            await addTour(payload);
            toast({
                title: "Tour added successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
            if (onTourUpdate) {
                onTourUpdate();
            }
        } catch (err) {
            console.error("Error adding tour", err);
            console.error("Error response:", err.response?.data);
            toast({
                title: "Error adding tour",
                description: err.response?.data?.message || err.message || "Failed to add tour",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Handle update tour
    const handleUpdate = async () => {
        try {
            const payload = {
                ...formData,
                tourPrice: parseFloat(formData.tourPrice),
                tourRemainingSlots: parseInt(formData.tourRemainingSlots),
                tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
                tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
                tourGuideId: formData.tourGuideId,
                accommodationId: formData.accommodationId,
                travelVehicleIds: selectedVehicleIds,
                touristDestinationIds: selectedDestinationIds,
            };

            await updateTour(selectedTour.tourId, payload);
            toast({
                title: "Tour updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
            if (onTourUpdate) {
                onTourUpdate();
            }
        } catch (err) {
            console.error("Error updating tour", err);
            toast({
                title: "Error updating tour",
                description: err.message || "Failed to update tour",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Handle delete tour
    const handleDelete = async (tour) => {
        if (!window.confirm(`Are you sure you want to delete "${tour.tourName}"?`)) return;
        try {
            await deleteTour(tour.id || tour.tourId);
            toast({
                title: "Tour deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            if (onTourUpdate) {
                onTourUpdate();
            }
        } catch (err) {
            console.error("Error deleting tour", err);
            toast({
                title: "Error deleting tour",
                description: err.message || "Failed to delete tour",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
            {/* Add New Tour Button */}
            <Box>
                <Button
                    colorScheme="blue"
                    size="md"
                    onClick={openAdd}
                    w="100%"
                >
                    + Add New Tour
                </Button>
            </Box>

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
                        <HStack spacing={3}>
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
                            <Button
                                colorScheme="yellow"
                                size="sm"
                                onClick={() => openEdit(tour)}
                            >
                                Edit
                            </Button>
                            <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDelete(tour)}
                            >
                                Delete
                            </Button>
                        </HStack>
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

            {/* Add/Edit Tour Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEdit ? "Edit Tour" : "Add New Tour"}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <VStack spacing={3}>
                            <Input
                                placeholder="Tour Name *"
                                value={formData.tourName}
                                onChange={(e) => handleChange("tourName", e.target.value)}
                            />
                            <Textarea
                                placeholder="Tour Description *"
                                value={formData.tourDescription}
                                onChange={(e) => handleChange("tourDescription", e.target.value)}
                                rows={3}
                            />
                            <Input
                                placeholder="Price *"
                                type="number"
                                value={formData.tourPrice}
                                onChange={(e) => handleChange("tourPrice", e.target.value)}
                            />
                            <Select
                                placeholder="Select Status *"
                                value={formData.tourStatus}
                                onChange={(e) => handleChange("tourStatus", e.target.value)}
                            >
                                <option value="Available">Available</option>
                                <option value="Fully Booked">Fully Booked</option>
                            </Select>
                            <Input
                                placeholder="Remaining Slots *"
                                type="number"
                                value={formData.tourRemainingSlots}
                                onChange={(e) => handleChange("tourRemainingSlots", e.target.value)}
                            />
                            <Input
                                placeholder="Tour Image URL *"
                                value={formData.tourImage}
                                onChange={(e) => handleChange("tourImage", e.target.value)}
                            />
                            <Input
                                placeholder="Start Date *"
                                type="datetime-local"
                                value={formData.tourStartDate}
                                onChange={(e) => handleChange("tourStartDate", e.target.value)}
                            />
                            <Input
                                placeholder="End Date *"
                                type="datetime-local"
                                value={formData.tourEndDate}
                                onChange={(e) => handleChange("tourEndDate", e.target.value)}
                            />
                            <Select
                                placeholder="Select Tour Guide *"
                                value={formData.tourGuideId}
                                onChange={(e) => handleChange("tourGuideId", e.target.value)}
                            >
                                {tourGuides.map((guide) => (
                                    <option key={guide.tourGuideId} value={guide.tourGuideId}>
                                        {guide.tourGuideName} - {guide.tourGuideEmail}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Select Accommodation *"
                                value={formData.accommodationId}
                                onChange={(e) => handleChange("accommodationId", e.target.value)}
                            >
                                {accommodations.map((accommodation) => (
                                    <option key={accommodation.accommodationId} value={accommodation.accommodationId}>
                                        {accommodation.accommodationName} - {accommodation.location}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Select Travel Vehicles * (hold Ctrl/Cmd for multiple)"
                                multiple
                                size="md"
                                height="120px"
                                value={selectedVehicleIds}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setSelectedVehicleIds(selected);
                                }}
                            >
                                {travelVehicles.map((vehicle) => (
                                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                        {vehicle.vehicleType} - Capacity: {vehicle.capacity}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Select Tourist Destinations * (hold Ctrl/Cmd for multiple)"
                                multiple
                                size="md"
                                height="120px"
                                value={selectedDestinationIds}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setSelectedDestinationIds(selected);
                                }}
                            >
                                {touristDestinations.map((destination) => (
                                    <option key={destination.destinationId} value={destination.destinationId}>
                                        {destination.destinationName} - {destination.location}
                                    </option>
                                ))}
                            </Select>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            mr={3}
                            onClick={isEdit ? handleUpdate : handleAdd}
                        >
                            {isEdit ? "Update" : "Add Tour"}
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
