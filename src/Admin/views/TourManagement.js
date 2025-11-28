import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Heading,
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
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Flex,
  Text,
  Badge,
  Card, // SỬA LỖI: Import Card từ Chakra UI, không phải từ file local
} from "@chakra-ui/react";
// Import thư viện multi-select mới
import { Select } from "chakra-react-select";
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

// --- BẮT BUỘC: Hướng dẫn cài đặt ---
// Do tôi không thể chạy lệnh, bạn cần tự cài đặt thư viện còn thiếu.
// Mở terminal trong thư mục 'frontend_tour' và chạy lệnh sau:
// npm install chakra-react-select
// --- KẾT THÚC HƯỚNG DẪN ---

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageFileRef = useRef(null);
  const textColor = "white"; // SỬA LỖI: Đặt màu chữ là trắng để tương phản trên nền tối của Card

  // State cho các dropdown
  const [tourGuides, setTourGuides] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [touristDestinations, setTouristDestinations] = useState([]);

  // State cho các lựa chọn trong form (sử dụng định dạng {value, label} cho multi-select)
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  const [formData, setFormData] = useState({
    tourName: "",
    tourDescription: "",
    tourPrice: "",
    tourStatus: "Available",
    tourRemainingSlots: "",
    tourImage: "", // Sẽ lưu tên file hoặc URL
    tourStartDate: "",
    tourEndDate: "",
    tourGuideId: "",
    accommodationId: "",
  });

  const [editId, setEditId] = useState(null);

  // Tối ưu hóa việc tạo options cho các dropdown
  const vehicleOptions = useMemo(() => 
    travelVehicles.map(v => ({ value: v.vehicleId, label: `${v.vehicleType} - Capacity: ${v.capacity}` })),
    [travelVehicles]
  );
  const destinationOptions = useMemo(() => 
    touristDestinations.map(d => ({ value: d.destinationId, label: `${d.destinationName} - ${d.location}` })),
    [touristDestinations]
  );

  const loadTours = async () => {
    try {
      const data = await getTours();
      setTours(data);
    } catch (err) {
      console.error("Lỗi load tours", err);
    }
  };

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
      console.error("Lỗi load dropdown options", err);
    }
  };

  useEffect(() => {
    loadTours();
    loadDropdownOptions();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("tourImage", file.name);
    }
  };

  const resetForm = () => {
    setFormData({
      tourName: "",
      tourDescription: "",
      tourPrice: "",
      tourStatus: "Available",
      tourRemainingSlots: "",
      tourImage: "",
      tourStartDate: "",
      tourEndDate: "",
      tourGuideId: "",
      accommodationId: "",
    });
    setSelectedVehicles([]);
    setSelectedDestinations([]);
    if(imageFileRef.current) imageFileRef.current.value = null;
  };
  
  const formatDateTimeForBackend = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    return new Date(dateTimeLocal).toISOString().slice(0, 19);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        tourPrice: parseFloat(formData.tourPrice) || 0,
        tourRemainingSlots: parseInt(formData.tourRemainingSlots) || 0,
        tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
        tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
        travelVehicleIds: selectedVehicles.map(v => v.value), // Chuyển lại thành mảng ID
        touristDestinationIds: selectedDestinations.map(d => d.value), // Chuyển lại thành mảng ID
      };

      if (isEdit) {
        await updateTour(editId, payload);
      } else {
        await addTour(payload);
      }

      onClose();
      loadTours();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu tour", err);
      alert(`Lỗi khi lưu tour!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (tour) => {
    setIsEdit(true);
    setEditId(tour.tourId);

    // Chuyển đổi mảng ID từ tour thành định dạng {value, label}
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
      tourImage: tour.tourImage || "", // Giả sử đây là tên file hoặc URL
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
      loadTours();
    } catch (err) {
      console.error("Lỗi xóa tour", err);
      alert("Không thể xóa tour này!");
    }
  };

  return (
    <Box marginTop={100} color={textColor}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
           <Text fontSize='xl' fontWeight='bold'>
            Tour Management
          </Text>
          <Button colorScheme="blue" onClick={openAdd}>
            Add New Tour
          </Button>
        </Flex>

        <Box mt='20px'>
          <Table variant="simple">
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
              {tours.map((tour) => (
                <Tr key={tour.tourId}>
                  <Td>{tour.tourId}</Td>
                  <Td>{tour.tourName}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Tour" : "Add New Tour"}</ModalHeader>
          <ModalCloseButton />
          {/* SỬA LỖI: Thêm màu nền và màu chữ cho Modal để hợp với theme tối */}
          <ModalBody pb={6} bg="gray.800" color="white">
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
                    <ChakraSelect value={formData.tourStatus} onChange={(e) => handleChange("tourStatus", e.target.value)}>
                        <option style={{ backgroundColor: '#2D3748' }} value="Available">Available</option>
                        <option style={{ backgroundColor: '#2D3748' }} value="Fully Booked">Fully Booked</option>
                        <option style={{ backgroundColor: '#2D3748' }} value="Cancelled">Cancelled</option>
                    </ChakraSelect>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Remaining Slots</FormLabel>
                    {/* SỬA LỖI: e.g.target.value -> e.target.value */}
                    <Input placeholder="Remaining Slots" type="number" value={formData.tourRemainingSlots} onChange={(e) => handleChange("tourRemainingSlots", e.target.value)} />
                </FormControl>
            </HStack>
            <FormControl mb={4}>
                <FormLabel>Tour Image</FormLabel>
                <InputGroup>
                    <Input placeholder="Click button to select image" readOnly value={formData.tourImage} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => imageFileRef.current?.click()}>Browse</Button>
                    </InputRightElement>
                </InputGroup>
                <Input type="file" ref={imageFileRef} onChange={handleImageFileChange} accept="image/*" style={{ display: "none" }}/>
            </FormControl>
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
                    <ChakraSelect placeholder="Select Tour Guide" value={formData.tourGuideId} onChange={(e) => handleChange("tourGuideId", e.target.value)}>
                        {tourGuides.map((guide) => <option style={{ backgroundColor: '#2D3748' }} key={guide.tourGuideId} value={guide.tourGuideId}>{guide.tourGuideName}</option>)}
                    </ChakraSelect>
                </FormControl>
                <FormControl>
                    <FormLabel>Accommodation</FormLabel>
                    <ChakraSelect placeholder="Select Accommodation" value={formData.accommodationId} onChange={(e) => handleChange("accommodationId", e.target.value)}>
                        {accommodations.map((acc) => <option style={{ backgroundColor: '#2D3748' }} key={acc.accommodationId} value={acc.accommodationId}>{acc.accommodationName}</option>)}
                    </ChakraSelect>
                </FormControl>
            </HStack>
            <FormControl mb={4}>
                <FormLabel>Travel Vehicles</FormLabel>
                {/* SỬA LỖI: Thêm style cho multi-select để hợp với theme tối */}
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
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TourManagement;
