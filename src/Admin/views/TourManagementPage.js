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
  Image,
  VStack,
  useToast,
  useColorModeValue,
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
import axios from "axios";

// --- BẮT BUỘC: Hướng dẫn cài đặt ---
// Do tôi không thể chạy lệnh, bạn cần tự cài đặt thư viện còn thiếu.
// Mở terminal trong thư mục 'frontend_tour' và chạy lệnh sau:
// npm install chakra-react-select
// --- KẾT THÚC HƯỚNG DẪN ---

const TourManagementPage = () => {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    name: true,
    meetingPoint: true,
    guide: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // State cho các dropdown
  const [tourGuides, setTourGuides] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [touristDestinations, setTouristDestinations] = useState([]);

  // State cho các lựa chọn trong form (sử dụng định dạng {value, label} cho multi-select)
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  // Cloudinary image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    tourName: "",
    tourDescription: "",
    tourPrice: "",
    tourStatus: "Available",
    tourRemainingSlots: "",
    tourImages: [], // Changed to array for multiple images
    tourStartDate: "",
    tourEndDate: "",
    tourMeetingPoint: "", // Added tourMeetingPoint
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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "tours");

    try {
      const response = await axios.post("http://localhost:8080/api/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const resetForm = () => {
    setFormData({
      tourName: "",
      tourDescription: "",
      tourPrice: "",
      tourStatus: "Available",
      tourRemainingSlots: "",
      tourImages: [], // Reset to empty array
      tourStartDate: "",
      tourEndDate: "",
      tourMeetingPoint: "", // Reset tourMeetingPoint
      tourGuideId: "",
      accommodationId: "",
    });
    setSelectedVehicles([]);
    setSelectedDestinations([]);
    setImageFile(null);
    setImagePreview(null);
    setIsUploading(false);
  };

  const formatDateTimeForBackend = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    return new Date(dateTimeLocal).toISOString().slice(0, 19);
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      // Upload image to Cloudinary if a file is selected
      let imageUrl = formData.tourImages.length > 0 ? formData.tourImages[0] : "";

      if (imageFile) {
        toast({
          title: "Uploading image...",
          status: "info",
          duration: 2000,
        });

        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 2000,
          });
        } catch (uploadError) {
          toast({
            title: "Image upload failed",
            description: uploadError.message,
            status: "error",
            duration: 3000,
          });
          setIsUploading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        tourPrice: parseFloat(formData.tourPrice) || 0,
        tourRemainingSlots: parseInt(formData.tourRemainingSlots) || 0,
        tourStartDate: formatDateTimeForBackend(formData.tourStartDate),
        tourEndDate: formatDateTimeForBackend(formData.tourEndDate),
        tourMeetingPoint: formData.tourMeetingPoint,
        tourImages: imageUrl ? [imageUrl] : formData.tourImages,

        travelVehicleIds: selectedVehicles.map(v => v.value),
        touristDestinationIds: selectedDestinations.map(d => d.value),
      };

      if (isEdit) {
        await updateTour(editId, payload);
        toast({
          title: "Tour updated successfully!",
          status: "success",
          duration: 2000,
        });
      } else {
        await addTour(payload);
        toast({
          title: "Tour added successfully!",
          status: "success",
          duration: 2000,
        });
      }

      onClose();
      loadTours();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu tour", err);
      toast({
        title: "Error saving tour",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openEdit = (tour) => {
    setIsEdit(true);
    setEditId(tour.tourId);

    // Chuyển đổi mảng ID từ tour thành định dạng {value, label}
    const currentVehicles = tour.travelVehicles?.map(v => ({
      value: v.vehicleId,
      label: `${v.vehicleType} - Capacity: ${v.capacity}`
    })) || [];

    const currentDestinations = tour.touristDestinations?.map(d => ({
      value: d.destinationId,
      label: `${d.destinationName} - ${d.location}`
    })) || [];

    setSelectedVehicles(currentVehicles);
    setSelectedDestinations(currentDestinations);

    // Set image preview if tour has images
    if (tour.tourImages && tour.tourImages.length > 0) {
      setImagePreview(tour.tourImages[0]);
    }

    setFormData({
      tourName: tour.tourName || "",
      tourDescription: tour.tourDescription || "",
      tourPrice: tour.tourPrice || "",
      tourStatus: tour.tourStatus || "Available",
      tourRemainingSlots: tour.tourRemainingSlots || "",
      tourImages: tour.tourImages || [],

      tourStartDate: tour.tourStartDate ? tour.tourStartDate.substring(0, 16) : "",
      tourEndDate: tour.tourEndDate ? tour.tourEndDate.substring(0, 16) : "",
      tourMeetingPoint: tour.tourMeetingPoint || "", // Populate tourMeetingPoint
      tourGuideId: tour.tourGuide?.tourGuideId || "",
      accommodationId: tour.accommodation?.accommodationId || "",
    });

    onOpen();
  }; const openAdd = () => {
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
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Tour Management
      </Heading>

      <Box bg={useColorModeValue("secondaryGray.300", "navy.800")} p={6} borderRadius="lg" shadow="md">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="md">Tour List</Heading>
          <Button colorScheme="blue" onClick={openAdd}>
            Add New Tour
          </Button>
        </Box>

        {/* Search Input */}
        <Input
          placeholder="Search by tour name, meeting point, or guide..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={2}
          bg={useColorModeValue("white", "gray.700")}
          _placeholder={{ color: "gray.400" }}
        />
        
        {/* Search Field Filters */}
        <HStack spacing={2} mb={4} flexWrap="wrap">
          <Text fontSize="sm" color="gray.400">Search in:</Text>
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

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>NAME</Th>
              <Th>PRICE</Th>
              <Th>STATUS</Th>
              <Th>SLOTS</Th>
              <Th>MEETING POINT</Th>
              <Th>TOUR GUIDE</Th>
              <Th>ACCOMMODATION</Th>
              <Th>DESTINATIONS</Th>
              <Th>ACTIONS</Th>
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
                <Td>{tour.tourName}</Td>
                <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.tourPrice)}</Td>
                <Td>{tour.tourStatus}</Td>
                <Td>{tour.tourRemainingSlots}</Td>
                <Td>{tour.tourMeetingPoint || 'N/A'}</Td>
                <Td>{tour.tourGuide?.tourGuideName || 'N/A'}</Td>
                <Td>{tour.accommodation?.accommodationName || 'N/A'}</Td>
                <Td>{tour.touristDestinations?.map(d => d.destinationName).join(', ') || 'N/A'}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
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
                <ChakraSelect value={formData.tourStatus} onChange={(e) => handleChange("tourStatus", e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Fully Booked">Fully Booked</option>
                  <option value="Cancelled">Cancelled</option>
                </ChakraSelect>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Remaining Slots</FormLabel>
                <Input placeholder="Remaining Slots" type="number" value={formData.tourRemainingSlots} onChange={(e) => handleChange("tourRemainingSlots", e.g.target.value)} />
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
            <FormControl mb={4}>
              <FormLabel>Meeting Point</FormLabel>
              <Input placeholder="Tour Meeting Point" value={formData.tourMeetingPoint} onChange={(e) => handleChange("tourMeetingPoint", e.target.value)} />
            </FormControl>

            {/* Image Upload Section */}
            <FormControl mb={4}>
              <FormLabel>Tour Image</FormLabel>
              <VStack align="stretch" spacing={3}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                {imagePreview && (
                  <Box>
                    <Image
                      src={imagePreview}
                      alt="Tour preview"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                )}
                {isUploading && (
                  <Box color="blue.500" fontWeight="medium">
                    Uploading image...
                  </Box>
                )}
              </VStack>
            </FormControl>

            <HStack spacing={4} mb={4}>
              <FormControl>
                <FormLabel>Tour Guide</FormLabel>
                <ChakraSelect placeholder="Select Tour Guide" value={formData.tourGuideId} onChange={(e) => handleChange("tourGuideId", e.target.value)}>
                  {tourGuides.map((guide) => <option key={guide.tourGuideId} value={guide.tourGuideId}>{guide.tourGuideName}</option>)}
                </ChakraSelect>
              </FormControl>
              <FormControl>
                <FormLabel>Accommodation</FormLabel>
                <ChakraSelect placeholder="Select Accommodation" value={formData.accommodationId} onChange={(e) => handleChange("accommodationId", e.target.value)}>
                  {accommodations.map((acc) => <option key={acc.accommodationId} value={acc.accommodationId}>{acc.accommodationName}</option>)}
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
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isUploading}
              loadingText="Uploading..."
              disabled={isUploading}
            >
              {isEdit ? "Update Tour" : "Save Tour"}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={isUploading}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TourManagementPage;