import React, { useState, useEffect } from "react";
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
  Select,
} from "@chakra-ui/react";
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

const TourManagementPage = () => {
  const [tours, setTours] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Dropdown options
  const [tourGuides, setTourGuides] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [touristDestinations, setTouristDestinations] = useState([]);

  // Selected IDs for multi-select
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState([]);

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

  const [editId, setEditId] = useState(null);

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

  // Format datetime-local to ISO 8601 format for backend
  const formatDateTimeForBackend = (dateTimeLocal) => {
    if (!dateTimeLocal || dateTimeLocal.trim() === "") return null;
    // datetime-local format: "2025-11-27T08:00"
    // Backend expects: "2025-11-27T08:00:00"

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

      // Debug: Log the payload to see what's being sent
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      await addTour(payload);
      onClose();
      loadTours();
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
    } catch (err) {
      console.error("Lỗi thêm tour", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi thêm tour!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (tour) => {
    setIsEdit(true);
    setEditId(tour.tourId);

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
      await updateTour(editId, payload);
      onClose();
      loadTours();
      setIsEdit(false);
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
    } catch (err) {
      console.error("Lỗi update tour", err);
      alert("Lỗi khi cập nhật tour!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa tour này?")) return;
    try {
      await deleteTour(id);
      loadTours();
    } catch (err) {
      console.error("Lỗi xóa tour", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
      <Heading size="md" mb={6} color="white">
        Tour Management
      </Heading>

      <Box bg="navy.800" p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Tour List</Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              setIsEdit(false);
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
            }}
          >
            Add New Tour
          </Button>
        </Box>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">NAME</Th>
              <Th color="white">PRICE</Th>
              <Th color="white">STATUS</Th>
              <Th color="white">SLOTS</Th>
              <Th color="white">DESTINATION</Th>
              <Th color="white">ACTIONS</Th>
            </Tr>
          </Thead>

          <Tbody>
            {tours.map((tour) => (
              <Tr key={tour.tourId}>
                <Td>{tour.tourId}</Td>
                <Td>{tour.tourName}</Td>
                <Td>{tour.tourPrice}</Td>
                <Td>{tour.tourStatus}</Td>
                <Td>{tour.tourRemainingSlots}</Td>
                <Td>{tour.touristDestinations?.map(d => d.destinationName).join(', ') || 'N/A'}</Td>

                <Td>
                  <HStack>
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
                      onClick={() => handleDelete(tour.tourId)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Tour" : "Add New Tour"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Tour Name *"
              mb={3}
              value={formData.tourName}
              onChange={(e) => handleChange("tourName", e.target.value)}
            />
            <Textarea
              placeholder="Tour Description *"
              mb={3}
              value={formData.tourDescription}
              onChange={(e) => handleChange("tourDescription", e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Price *"
              mb={3}
              type="number"
              value={formData.tourPrice}
              onChange={(e) => handleChange("tourPrice", e.target.value)}
            />
            <Select
              placeholder="Select Status *"
              mb={3}
              value={formData.tourStatus}
              onChange={(e) => handleChange("tourStatus", e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Fully Booked">Fully Booked</option>
            </Select>
            <Input
              placeholder="Remaining Slots *"
              mb={3}
              type="number"
              value={formData.tourRemainingSlots}
              onChange={(e) => handleChange("tourRemainingSlots", e.target.value)}
            />
            <Input
              placeholder="Tour Image URL *"
              mb={3}
              value={formData.tourImage}
              onChange={(e) => handleChange("tourImage", e.target.value)}
            />
            <Input
              placeholder="Start Date *"
              mb={3}
              type="datetime-local"
              value={formData.tourStartDate}
              onChange={(e) => handleChange("tourStartDate", e.target.value)}
            />
            <Input
              placeholder="End Date *"
              mb={3}
              type="datetime-local"
              value={formData.tourEndDate}
              onChange={(e) => handleChange("tourEndDate", e.target.value)}
            />
            <Select
              placeholder="Select Tour Guide *"
              mb={3}
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
              mb={3}
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
              mb={3}
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
              mb={3}
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={isEdit ? handleUpdate : handleAdd}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TourManagementPage;
