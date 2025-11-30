import React, { useState, useMemo, useEffect } from 'react';
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
    FormControl,
    FormLabel,
    Select as ChakraSelect,
    IconButton,
} from '@chakra-ui/react';
import { Select } from "chakra-react-select";
import { FaTrash, FaPlus } from 'react-icons/fa';

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
    const textColorSecondary = useColorModeValue('gray.300');
    // Dùng màu nền tối cho Card để đồng bộ theme
    const cardBg = useColorModeValue("secondaryGray.300", "navy.800"); 
    const modalBg = "gray.800"; 

    const toast = useToast();

    // Lấy danh sách tours từ props
    const tours = tourData && tourData.length > 0 ? tourData : [];

    // Modal logic
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTour, setSelectedTour] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    // State hiển thị ảnh (View Mode)
    const [currentDisplayImage, setCurrentDisplayImage] = useState("");

    useEffect(() => {
        if (tours.length > 0) {
            const firstTour = tours[0];
            if (firstTour.tourImages && firstTour.tourImages.length > 0) {
                setCurrentDisplayImage(firstTour.tourImages[0].imageUrl);
            } else {
                setCurrentDisplayImage("");
            }
        }
    }, [tours]);

    // Dropdown Data States
    const [tourGuides, setTourGuides] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [travelVehicles, setTravelVehicles] = useState([]);
    const [touristDestinations, setTouristDestinations] = useState([]);

    // Multi-select States cho Form
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [selectedDestinations, setSelectedDestinations] = useState([]);

    // Form Data State
    const [formData, setFormData] = useState({
        tourName: "",
        tourDescription: "",
        tourPrice: "",
        tourStatus: "Available",
        tourRemainingSlots: "",
        tourImages: [], 
        tourStartDate: "",
        tourEndDate: "",
        tourMeetingPoint: "",
        tourGuideId: "",
        accommodationId: "",
    });

    // Options cho React-Select
    const vehicleOptions = useMemo(() =>
        travelVehicles.map(v => ({ value: v.vehicleId, label: `${v.vehicleType} - Capacity: ${v.capacity}` })),
        [travelVehicles]
    );
    const destinationOptions = useMemo(() =>
        touristDestinations.map(d => ({ value: d.destinationId, label: `${d.destinationName} - ${d.location}` })),
        [touristDestinations]
    );

    // Load Data cho Dropdowns
    useEffect(() => {
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

    const formatDateTimeForBackend = (dateTimeLocal) => {
        if (!dateTimeLocal || dateTimeLocal.trim() === "") return null;
        if (dateTimeLocal.length === 16) {
            return dateTimeLocal + ":00";
        }
        return dateTimeLocal;
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // --- Logic xử lý mảng ảnh trong Form ---
    const handleAddImageField = () => {
        setFormData({
            ...formData,
            tourImages: [...formData.tourImages, ""]
        });
    };

    const handleRemoveImageField = (index) => {
        const newImages = [...formData.tourImages];
        newImages.splice(index, 1);
        setFormData({ ...formData, tourImages: newImages });
    };

    const handleImageInputChange = (index, value) => {
        const newImages = [...formData.tourImages];
        newImages[index] = value;
        setFormData({ ...formData, tourImages: newImages });
    };
    
    // Hàm helper để lọc ảnh rỗng và ảnh trùng lặp
    const getUniqueValidImages = (images) => {
        const validImages = images.filter(url => url && url.trim() !== "");
        return [...new Set(validImages)]; // Sử dụng Set để loại bỏ trùng lặp
    };
    // ----------------------------------------

    const openAdd = () => {
        setIsEdit(false);
        setSelectedTour(null);
        setSelectedVehicles([]);
        setSelectedDestinations([]);
        
        setFormData({
            tourName: "",
            tourDescription: "",
            tourPrice: "",
            tourStatus: "Available",
            tourRemainingSlots: "",
            tourImages: [""], 
            tourStartDate: "",
            tourEndDate: "",
            tourMeetingPoint: "",
            tourGuideId: "",
            accommodationId: "",
        });
        onOpen();
    };

    const openEdit = (tour) => {
        setIsEdit(true);
        setSelectedTour(tour);

        // Map data cũ vào form
        const currentVehicles = vehicleOptions.filter(option => 
            tour.travelVehicles?.some(v => v.vehicleId === option.value)
        );
        const currentDestinations = destinationOptions.filter(option =>
            tour.touristDestinations?.some(d => d.destinationId === option.value)
        );

        setSelectedVehicles(currentVehicles);
        setSelectedDestinations(currentDestinations);

        // Chuyển List<TourImage> objects -> List<String> urls cho form
        const imageUrls = tour.tourImages && tour.tourImages.length > 0 
            ? tour.tourImages.map(img => img.imageUrl) 
            : [""];

        setFormData({
            tourName: tour.tourName || "",
            tourDescription: tour.tourDescription || "",
            tourPrice: tour.tourPrice || "",
            tourStatus: tour.tourStatus || "Available",
            tourRemainingSlots: tour.tourRemainingSlots || "",
            tourImages: imageUrls,
            tourStartDate: tour.tourStartDate ? tour.tourStartDate.substring(0, 16) : "",
            tourEndDate: tour.tourEndDate ? tour.tourEndDate.substring(0, 16) : "",
            tourMeetingPoint: tour.tourMeetingPoint || "",
            tourGuideId: tour.tourGuide?.tourGuideId || "",
            accommodationId: tour.accommodation?.accommodationId || "",
        });
        onOpen();
    };

    const handleAdd = async () => {
        try {
            // Lọc trùng và rỗng trước khi gửi
            const validImages = getUniqueValidImages(formData.tourImages);

            const payload = {
                ...formData,
                tourPrice: parseFloat(formData.tourPrice),
                tourRemainingSlots: parseInt(formData.tourRemainingSlots),
                tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
                tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
                travelVehicleIds: selectedVehicles.map(v => v.value),
                touristDestinationIds: selectedDestinations.map(d => d.value),
                tourImages: validImages 
            };

            await addTour(payload);
            toast({ title: "Tour added successfully", status: "success", duration: 3000, isClosable: true });
            onClose();
            if (onTourUpdate) onTourUpdate();
        } catch (err) {
            console.error("Error adding tour", err);
            toast({ title: "Error adding tour", description: err.response?.data?.message || err.message, status: "error", duration: 5000, isClosable: true });
        }
    };

    const handleUpdate = async () => {
        try {
            // Lọc trùng và rỗng trước khi gửi
            const validImages = getUniqueValidImages(formData.tourImages);

            const payload = {
                ...formData,
                tourPrice: parseFloat(formData.tourPrice),
                tourRemainingSlots: parseInt(formData.tourRemainingSlots),
                tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
                tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
                travelVehicleIds: selectedVehicles.map(v => v.value),
                touristDestinationIds: selectedDestinations.map(d => d.value),
                tourImages: validImages 
            };
            
            await updateTour(selectedTour.tourId, payload);
            toast({ title: "Tour updated successfully", status: "success", duration: 3000, isClosable: true });
            onClose();
            if (onTourUpdate) onTourUpdate();
        } catch (err) {
            console.error("Error updating tour", err);
            toast({ title: "Error updating tour", description: err.message, status: "error", duration: 3000, isClosable: true });
        }
    };

    const handleDelete = async (tour) => {
        if (!window.confirm(`Are you sure you want to delete "${tour.tourName}"?`)) return;
        try {
            await deleteTour(tour.tourId);
            toast({ title: "Tour deleted successfully", status: "success", duration: 3000, isClosable: true });
            if (onTourUpdate) onTourUpdate();
        } catch (err) {
            console.error("Error deleting tour", err);
            toast({ title: "Error deleting tour", description: err.message, status: "error", duration: 3000, isClosable: true });
        }
    };

    const getImageUrl = (imageInput) => {
        // 1. Ảnh thế thân (Fallback) nếu dữ liệu null
        // Sử dụng placehold.co (ổn định hơn via.placeholder.com)
        const PLACEHOLDER_IMG = 'https://placehold.co/600x400?text=No+Image';

        if (!imageInput) return PLACEHOLDER_IMG;
        
        // 2. Lấy đường dẫn (Xử lý cả trường hợp String lẫn Object)
        let path = (typeof imageInput === 'string') ? imageInput : imageInput.imageUrl;

        if (!path) return PLACEHOLDER_IMG;

        // 3. Nếu là ảnh Online (bắt đầu bằng http) -> Giữ nguyên
        if (path.startsWith('http')) {
            return path;
        }
        
        // 4. Nếu là ảnh Local -> Thêm domain backend
        // Đảm bảo không bị thừa dấu / (ví dụ: path là "/Images/..." thì cộng chuỗi bình thường)
        return `http://localhost:8080${path}`;
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
            bg={cardBg}
        >
            <Box>
                <Button colorScheme="blue" size="md" onClick={openAdd} w="100%">
                    + Add New Tour (Detailed)
                </Button>
            </Box>

            {tours.map((tour, index) => {
                const tourImages = tour.tourImages || [];
                // Fix lỗi hiển thị: Nếu tourImages rỗng thì dùng placeholder
                const firstImage = tourImages.length > 0 ? tourImages[0].imageUrl : "https://via.placeholder.com/150";
                
                // Kiểm tra xem currentDisplayImage có hợp lệ với tour hiện tại không
                const isCurrentImageValidForThisTour = tourImages.some(img => img.imageUrl === currentDisplayImage);
                const displaySrc = isCurrentImageValidForThisTour ? currentDisplayImage : firstImage;

                const otherImages = tourImages.filter(img => img.imageUrl !== displaySrc);

                return (
                    <Card
                        key={tour.tourId || index}
                        flexDirection="column"
                        w="100%"
                        px="0px"
                        bg="navy.800"
                        overflowX="hidden"
                    >
                        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                            <Text color={textColor} fontSize="18px" fontWeight="700" lineHeight="100%">
                                {tour.tourName || tour.title}
                            </Text>
                            <HStack spacing={3}>
                                <Badge colorScheme={tour.tourStatus === 'Available' ? 'green' : 'red'}>
                                    {tour.tourStatus}
                                </Badge>
                                <Button colorScheme="yellow" size="sm" onClick={() => openEdit(tour)}>Edit</Button>
                                <Button colorScheme="red" size="sm" onClick={() => handleDelete(tour)}>Delete</Button>
                            </HStack>
                        </Flex>

                        <Box p="25px" pt="0">
                            <VStack spacing="20px" align="stretch">
                                
                                {/* 1. MAIN IMAGE */}
                                <Box borderRadius="15px" overflow="hidden" border="2px solid" borderColor="blue.500">
                                    <Image
                                        src={getImageUrl(displaySrc)}
                                        alt={tour.tourName}
                                        w="100%"
                                        h="350px"
                                        objectFit="cover"
                                        fallbackSrc="https://via.placeholder.com/350"
                                        transition="all 0.3s ease"
                                    />
                                </Box>

                                {/* 2. OTHER IMAGES */}
                                {otherImages.length > 0 && (
                                    <Box overflowX="auto" py="2">
                                        <HStack spacing="10px">
                                            {otherImages.map((img, idx) => (
                                                <Box 
                                                    key={idx} 
                                                    borderRadius="10px" 
                                                    overflow="hidden" 
                                                    minW="100px" 
                                                    h="80px" 
                                                    cursor="pointer"
                                                    border="1px solid transparent"
                                                    _hover={{ borderColor: "blue.300", transform: "scale(1.05)" }}
                                                    transition="all 0.2s"
                                                    onClick={() => setCurrentDisplayImage(img.imageUrl)}
                                                >
                                                    <Image 
                                                        src={getImageUrl(img.imageUrl)} 
                                                        w="100%" 
                                                        h="100%" 
                                                        objectFit="cover" 
                                                    />
                                                </Box>
                                            ))}
                                        </HStack>
                                    </Box>
                                )}

                                <Text color={textColorSecondary} fontSize="sm" lineHeight="1.6">
                                    {tour.tourDescription}
                                </Text>

                                <Divider />

                                <VStack spacing="12px" align="stretch">
                                    <HStack justifyContent="space-between">
                                        <Text color={textColorSecondary} fontSize="sm" fontWeight="600">Price:</Text>
                                        <Text color={textColor} fontSize="lg" fontWeight="700">
                                            {tour.tourPrice ? formatPrice(tour.tourPrice) : tour.price}
                                        </Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text color={textColorSecondary} fontSize="sm" fontWeight="600">Schedule:</Text>
                                        <Text color={textColor} fontSize="sm" fontWeight="700">
                                            {formatDate(tour.tourStartDate)} - {formatDate(tour.tourEndDate)}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>
                    </Card>
                );
            })}

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent bg={modalBg} color="white">
                    <ModalHeader>{isEdit ? "Edit Tour (Full Details)" : "Add New Tour (Full Details)"}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <HStack spacing={4} mb={4}>
                            <FormControl isRequired>
                                <FormLabel>Tour Name</FormLabel>
                                <Input placeholder="Tour Name" value={formData.tourName} onChange={(e) => handleChange("tourName", e.target.value)} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Price</FormLabel>
                                <Input placeholder="Price" type="number" value={formData.tourPrice} onChange={(e) => handleChange("tourPrice", e.target.value)} />
                            </FormControl>
                        </HStack>

                        <FormControl mb={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder="Tour Description" value={formData.tourDescription} onChange={(e) => handleChange("tourDescription", e.target.value)} rows={3} />
                        </FormControl>

                        <HStack spacing={4} mb={4}>
                            <FormControl isRequired>
                                <FormLabel>Status</FormLabel>
                                <ChakraSelect value={formData.tourStatus} onChange={(e) => handleChange("tourStatus", e.target.value)} bg="gray.700" borderColor="gray.600">
                                    <option style={{ backgroundColor: '#2D3748' }} value="Available">Available</option>
                                    <option style={{ backgroundColor: '#2D3748' }} value="Fully Booked">Fully Booked</option>
                                    <option style={{ backgroundColor: '#2D3748' }} value="Cancelled">Cancelled</option>
                                </ChakraSelect>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Remaining Slots</FormLabel>
                                <Input placeholder="Slots" type="number" value={formData.tourRemainingSlots} onChange={(e) => handleChange("tourRemainingSlots", e.target.value)} />
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} mb={4}>
                            <FormControl isRequired>
                                <FormLabel>Start Date</FormLabel>
                                <Input type="datetime-local" value={formData.tourStartDate} onChange={(e) => handleChange("tourStartDate", e.target.value)} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>End Date</FormLabel>
                                <Input type="datetime-local" value={formData.tourEndDate} onChange={(e) => handleChange("tourEndDate", e.target.value)} />
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} mb={4}>
                            <FormControl>
                                <FormLabel>Tour Guide</FormLabel>
                                <ChakraSelect placeholder="Select Guide" value={formData.tourGuideId} onChange={(e) => handleChange("tourGuideId", e.target.value)} bg="gray.700" borderColor="gray.600">
                                    {tourGuides.map((guide) => (
                                        <option style={{ backgroundColor: '#2D3748' }} key={guide.tourGuideId} value={guide.tourGuideId}>
                                            {guide.tourGuideName}
                                        </option>
                                    ))}
                                </ChakraSelect>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Accommodation</FormLabel>
                                <ChakraSelect placeholder="Select Accommodation" value={formData.accommodationId} onChange={(e) => handleChange("accommodationId", e.target.value)} bg="gray.700" borderColor="gray.600">
                                    {accommodations.map((acc) => (
                                        <option style={{ backgroundColor: '#2D3748' }} key={acc.accommodationId} value={acc.accommodationId}>
                                            {acc.accommodationName}
                                        </option>
                                    ))}
                                </ChakraSelect>
                            </FormControl>
                        </HStack>
                        
                        <FormControl mb={4}>
                            <FormLabel>Meeting Point</FormLabel>
                            <Input placeholder="Location address..." value={formData.tourMeetingPoint} onChange={(e) => handleChange("tourMeetingPoint", e.target.value)} />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Travel Vehicles</FormLabel>
                            <Select
                                isMulti
                                name="travelVehicles"
                                options={vehicleOptions}
                                placeholder="Select vehicles..."
                                value={selectedVehicles}
                                onChange={setSelectedVehicles}
                                closeMenuOnSelect={false}
                                chakraStyles={{
                                    control: (provided) => ({ ...provided, bg: "gray.700", borderColor: "gray.600" }),
                                    menu: (provided) => ({ ...provided, bg: "gray.800" }),
                                    option: (provided, state) => ({ ...provided, bg: state.isFocused ? "blue.500" : "transparent", color: "white" }),
                                    multiValue: (provided) => ({ ...provided, bg: "blue.600" }),
                                    multiValueLabel: (provided) => ({ ...provided, color: "white" }),
                                }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Tourist Destinations</FormLabel>
                            <Select
                                isMulti
                                name="touristDestinations"
                                options={destinationOptions}
                                placeholder="Select destinations..."
                                value={selectedDestinations}
                                onChange={setSelectedDestinations}
                                closeMenuOnSelect={false}
                                chakraStyles={{
                                    control: (provided) => ({ ...provided, bg: "gray.700", borderColor: "gray.600" }),
                                    menu: (provided) => ({ ...provided, bg: "gray.800" }),
                                    option: (provided, state) => ({ ...provided, bg: state.isFocused ? "blue.500" : "transparent", color: "white" }),
                                    multiValue: (provided) => ({ ...provided, bg: "blue.600" }),
                                    multiValueLabel: (provided) => ({ ...provided, color: "white" }),
                                }}
                            />
                        </FormControl>

                        <Box borderTop="1px solid gray" pt={4} mt={4}>
                            <FormLabel fontSize="lg" fontWeight="bold">Tour Images Gallery</FormLabel>
                            <VStack spacing={3} align="stretch">
                                {formData.tourImages.map((url, index) => (
                                    <HStack key={index}>
                                        <Input 
                                            placeholder="Paste image URL here..." 
                                            value={url} 
                                            onChange={(e) => handleImageInputChange(index, e.target.value)}
                                        />
                                        <IconButton 
                                            icon={<FaTrash />} 
                                            colorScheme="red" 
                                            onClick={() => handleRemoveImageField(index)}
                                            isDisabled={formData.tourImages.length === 1 && formData.tourImages[0] === ""}
                                        />
                                    </HStack>
                                ))}
                                <Button leftIcon={<FaPlus />} onClick={handleAddImageField} variant="outline" borderStyle="dashed">
                                    Add another Image URL
                                </Button>
                            </VStack>
                        </Box>

                    </ModalBody>

                    <ModalFooter bg="gray.800">
                        <Button colorScheme="green" mr={3} onClick={isEdit ? handleUpdate : handleAdd}>
                            {isEdit ? "Update" : "Add Tour"}
                        </Button>
                        <Button variant="ghost" onClick={onClose} _hover={{ bg: "gray.700" }}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}