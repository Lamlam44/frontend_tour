import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Select as ChakraSelect,
  FormControl,
  FormLabel,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  Spinner,
  Center
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import Card from "../components/card/Card"; 
// Đảm bảo đường dẫn import Card đúng với project của bạn

import {
  getTours,
  addTour,
  updateTour,
  deleteTour,
  getTourGuides,
  getAccommodations,
  getTravelVehicles,
  getTouristDestinations,
} from "../../services/api";

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    name: true,
    meetingPoint: true,
    guide: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Màu sắc đồng bộ với TourDetail và Dark Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("secondaryGray.300", "navy.800"); 
  const modalBg = "gray.800"; // Ép cứng dark mode cho modal giống yêu cầu cũ
  // Các biến màu dùng trong JSX (gọi hook luôn ở top-level để không vi phạm rules-of-hooks)
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const searchLabelColor = useColorModeValue("gray.700", "white");

  // State cho dropdowns
  const [tourGuides, setTourGuides] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [touristDestinations, setTouristDestinations] = useState([]);

  // State cho multi-select
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  // Form Data - ĐÃ BỎ tourImage
  const [formData, setFormData] = useState({
    tourName: "",
    tourDescription: "",
    tourPrice: "",
    tourStatus: "Available",
    tourRemainingSlots: "",
    // tourImage: "", // Đã bỏ theo yêu cầu
    tourStartDate: "",
    tourEndDate: "",
    tourGuideId: "",
    accommodationId: "",
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memo options cho Select
  const vehicleOptions = useMemo(() => 
    travelVehicles.map(v => ({ value: v.vehicleId, label: `${v.vehicleType} - Capacity: ${v.capacity}` })),
    [travelVehicles]
  );
  const destinationOptions = useMemo(() => 
    touristDestinations.map(d => ({ value: d.destinationId, label: `${d.destinationName} - ${d.location}` })),
    [touristDestinations]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [toursData, guidesData, accData, vehiclesData, destData] = await Promise.all([
        getTours(),
        getTourGuides(),
        getAccommodations(),
        getTravelVehicles(),
        getTouristDestinations(),
      ]);
      setTours(toursData);
      setTourGuides(guidesData);
      setAccommodations(accData);
      setTravelVehicles(vehiclesData);
      setTouristDestinations(destData);
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      tourName: "",
      tourDescription: "",
      tourPrice: "",
      tourStatus: "Available",
      tourRemainingSlots: "",
      tourStartDate: "",
      tourEndDate: "",
      tourGuideId: "",
      accommodationId: "",
    });
    setSelectedVehicles([]);
    setSelectedDestinations([]);
  };

  const formatDateTimeForBackend = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    return dateTimeLocal.length === 16 ? dateTimeLocal + ":00" : dateTimeLocal;
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        tourPrice: parseFloat(formData.tourPrice) || 0,
        tourRemainingSlots: parseInt(formData.tourRemainingSlots) || 0,
        tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
        tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
        travelVehicleIds: selectedVehicles.map(v => v.value),
        touristDestinationIds: selectedDestinations.map(d => d.value),
        tourImages: [] // Mặc định danh sách rỗng khi tạo/sửa ở đây, việc thêm ảnh thực hiện ở TourDetail
      };

      if (isEdit) {
        // Khi update ở đây, ta gửi tourImages rỗng hoặc logic backend cần xử lý. 
        // Tuy nhiên, theo yêu cầu "bỏ phần quản lý ảnh", ta nên giữ nguyên ảnh cũ nếu backend hỗ trợ patch, 
        // hoặc gửi list ảnh cũ nếu backend bắt buộc ghi đè.
        // Để an toàn và đơn giản theo yêu cầu: TourManagement KHÔNG can thiệp ảnh.
        // Cần lấy lại list ảnh cũ để gửi kèm nếu PUT request ghi đè toàn bộ.
        const currentTour = tours.find(t => t.tourId === editId);
        if(currentTour && currentTour.tourImages) {
            payload.tourImages = currentTour.tourImages.map(img => img.imageUrl);
        }
        await updateTour(editId, payload);
      } else {
        await addTour(payload);
      }

      onClose();
      loadData(); // Reload lại list
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu tour", err);
      alert(`Lỗi khi lưu tour!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (tour) => {
    setIsEdit(true);
    setEditId(tour.tourId);

    const currentVehicles = vehicleOptions.filter(option => 
        tour.travelVehicles?.some(v => v.vehicleId === option.value)
    );
    
    const currentDestinations = destinationOptions.filter(option =>
        tour.touristDestinations?.some(d => d.destinationId === option.value)
    );

    setSelectedVehicles(currentVehicles);
    setSelectedDestinations(currentDestinations);

    setFormData({
      tourName: tour.tourName || "",
      tourDescription: tour.tourDescription || "",
      tourPrice: tour.tourPrice || "",
      tourStatus: tour.tourStatus || "Available",
      tourRemainingSlots: tour.tourRemainingSlots || "",
      tourStartDate: tour.tourStartDate ? tour.tourStartDate.substring(0, 16) : "",
      tourEndDate: tour.tourEndDate ? tour.tourEndDate.substring(0, 16) : "",
      tourGuideId: tour.tourGuide?.tourGuideId || "",
      accommodationId: tour.accommodation?.accommodationId || "",
    });

    onOpen();
  };
  
  const openAdd = () => {
      setIsEdit(false);
      resetForm();
      onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa tour này?")) return;
    try {
      await deleteTour(id);
      loadData();
    } catch (err) {
      console.error("Lỗi xóa tour", err);
      alert("Không thể xóa tour này!");
    }
  };

  if (loading) {
      return <Center h="50vh"><Spinner size="xl" color="blue.500" /></Center>;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Sử dụng Card và bg đồng bộ */}
      <Card bg={cardBg} mb="20px">
        <Flex direction="column" mb={4} gap={3}>
          <Flex justify='space-between' align='center'>
            <Text fontSize='xl' fontWeight='bold' color={textColor}>
              Tour Management
            </Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add New Tour
            </Button>
          </Flex>

          {/* Search Input */}
          <Input
            placeholder="Search by tour name, meeting point, or guide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={inputBg}
            color={inputColor}
            borderColor={inputBorderColor}
            _placeholder={{ color: "gray.400" }}
            size="md"
          />
          
          {/* Search Field Filters */}
          <HStack spacing={2} flexWrap="wrap">
            <Text fontSize="sm" color={searchLabelColor} fontWeight="medium">Search in:</Text>
            <Button
              size="sm"
              colorScheme={searchFields.name ? "blue" : "gray"}
              variant={searchFields.name ? "solid" : "outline"}
              onClick={() => setSearchFields({...searchFields, name: !searchFields.name})}
            >
              Tour Name
            </Button>
            <Button
              size="sm"
              colorScheme={searchFields.meetingPoint ? "blue" : "gray"}
              variant={searchFields.meetingPoint ? "solid" : "outline"}
              onClick={() => setSearchFields({...searchFields, meetingPoint: !searchFields.meetingPoint})}
            >
              Meeting Point
            </Button>
            <Button
              size="sm"
              colorScheme={searchFields.guide ? "blue" : "gray"}
              variant={searchFields.guide ? "solid" : "outline"}
              onClick={() => setSearchFields({...searchFields, guide: !searchFields.guide})}
            >
              Guide Name
            </Button>
          </HStack>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>NAME</Th>
                <Th color={textColor}>PRICE</Th>
                <Th color={textColor}>STATUS</Th>
                <Th color={textColor}>SLOTS</Th>
                <Th color={textColor}>DESTINATIONS</Th>
                <Th color={textColor}>ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tours.filter(tour => {
                if (!searchTerm) return true;
                return (
                  (searchFields.name && tour.tourName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (searchFields.meetingPoint && tour.tourMeetingPoint?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (searchFields.guide && tour.tourGuide?.tourGuideName?.toLowerCase().includes(searchTerm.toLowerCase()))
                );
              }).map((tour) => (
                <Tr key={tour.tourId}>
                  <Td>{tour.tourId}</Td>
                  <Td fontWeight="bold">{tour.tourName}</Td>
                  <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.tourPrice)}</Td>
                  <Td>
                     <Badge colorScheme={tour.tourStatus === 'Available' ? 'green' : 'red'}>
                      {tour.tourStatus}
                    </Badge>
                  </Td>
                  <Td>{tour.tourRemainingSlots}</Td>
                  <Td maxW="200px" isTruncated>{tour.touristDestinations?.map(d => d.destinationName).join(', ') || 'N/A'}</Td>
                  <Td>
                    <HStack>
                      <Button colorScheme="yellow" size="sm" onClick={() => openEdit(tour)}>Edit</Button>
                      <Button colorScheme="red" size="sm" onClick={() => handleDelete(tour.tourId)}>Delete</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* MODAL THÊM / SỬA - ĐÃ BỎ TOUR IMAGE */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Tour" : "Add New Tour"}</ModalHeader>
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
                <Textarea placeholder="Tour Description" value={formData.tourDescription} onChange={(e) => handleChange("tourDescription", e.target.value)} />
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
                    <Input placeholder="Remaining Slots" type="number" value={formData.tourRemainingSlots} onChange={(e) => handleChange("tourRemainingSlots", e.target.value)} />
                </FormControl>
            </HStack>
            
            {/* ĐÃ XÓA FORM CONTROL IMAGE TẠI ĐÂY */}

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
                    <ChakraSelect placeholder="Select Tour Guide" value={formData.tourGuideId} onChange={(e) => handleChange("tourGuideId", e.target.value)} bg="gray.700" borderColor="gray.600">
                        {tourGuides.map((guide) => <option style={{ backgroundColor: '#2D3748' }} key={guide.tourGuideId} value={guide.tourGuideId}>{guide.tourGuideName}</option>)}
                    </ChakraSelect>
                </FormControl>
                <FormControl>
                    <FormLabel>Accommodation</FormLabel>
                    <ChakraSelect placeholder="Select Accommodation" value={formData.accommodationId} onChange={(e) => handleChange("accommodationId", e.target.value)} bg="gray.700" borderColor="gray.600">
                        {accommodations.map((acc) => <option style={{ backgroundColor: '#2D3748' }} key={acc.accommodationId} value={acc.accommodationId}>{acc.accommodationName}</option>)}
                    </ChakraSelect>
                </FormControl>
            </HStack>
            <FormControl mb={4}>
                <FormLabel>Travel Vehicles</FormLabel>
                <Select
                    isMulti
                    name="vehicles"
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
                    name="destinations"
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
          </ModalBody>
          <ModalFooter bg="gray.800">
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {isEdit ? "Update Tour" : "Save Tour"}
            </Button>
            <Button variant="ghost" onClick={onClose} _hover={{ bg: "gray.700" }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TourManagement;