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
  useToast,
  Badge,
  Text,
  FormControl,
  FormLabel,
  SimpleGrid,
  Select,
  Icon,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import {
  getAccommodations,
  addAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "../../services/api";

const AccommodationManagementPage = () => {
  // --- STATE ---
  const [accommodations, setAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    name: true,
    location: true,
    type: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Design System Colors (Đồng bộ với Invoice/Promotion Page)
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";
  const hoverBg = "navy.700";

  const [formData, setFormData] = useState({
    accommodationName: "",
    location: "",
    rating: "",
    pricePerNight: "",
    accommodationType: "",
  });

  // --- API CALLS ---
  const loadAccommodations = async () => {
    try {
      const data = await getAccommodations();
      setAccommodations(data);
    } catch (err) {
      console.error("Lỗi load accommodations", err);
      toast({
        title: "Error loading data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadAccommodations();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      accommodationName: "",
      location: "",
      rating: "",
      pricePerNight: "",
      accommodationType: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const handleAdd = async () => {
    try {
      // Validate cơ bản
      if (!formData.accommodationName || !formData.pricePerNight) {
        toast({ title: "Please fill required fields", status: "warning", duration: 3000 });
        return;
      }

      const payload = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        pricePerNight: parseFloat(formData.pricePerNight),
      };

      await addAccommodation(payload);

      toast({ title: "Added successfully", status: "success", duration: 3000 });
      onClose();
      loadAccommodations();
      resetForm();
    } catch (err) {
      console.error("Error adding", err);
      toast({
        title: "Error adding accommodation",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        pricePerNight: parseFloat(formData.pricePerNight),
      };

      await updateAccommodation(editId, payload);

      toast({ title: "Updated successfully", status: "success", duration: 3000 });
      onClose();
      loadAccommodations();
      resetForm();
    } catch (err) {
      console.error("Error updating", err);
      toast({ title: "Error updating accommodation", status: "error", duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accommodation?")) return;
    try {
      await deleteAccommodation(id);
      toast({ title: "Deleted successfully", status: "success", duration: 3000 });
      loadAccommodations();
    } catch (err) {
      console.error("Error deleting", err);
      toast({ title: "Cannot delete accommodation", status: "error", duration: 3000 });
    }
  };

  const openEdit = (acc) => {
    setIsEdit(true);
    setEditId(acc.accommodationId);
    setFormData({
      accommodationName: acc.accommodationName || "",
      location: acc.location || "",
      rating: acc.rating || "",
      pricePerNight: acc.pricePerNight || "",
      accommodationType: acc.accommodationType || "",
    });
    onOpen();
  };

  // --- RENDER ---
  // Filter accommodations based on search term and selected fields
  const filteredAccommodations = accommodations.filter(acc => {
    if (!searchTerm) return true;
    return (
      (searchFields.name && acc.accommodationName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.location && acc.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.type && acc.accommodationType?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl" minH="100vh">
      <Heading size="md" mb={6}>Accommodation Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
        <Box display="flex" justifyContent="space-between" mb={6} alignItems="center">
          <Heading size="sm">Accommodation List</Heading>
          <Button
            colorScheme="blue"
            onClick={() => { resetForm(); onOpen(); }}
            size="md"
          >
            Add New Accommodation
          </Button>
        </Box>

        {/* Search Input */}
        <Input
          placeholder="Search by name, location, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={2}
          bg={inputBg}
          borderColor={borderColor}
          _placeholder={{ color: "gray.400" }}
        />

        {/* Search Field Filters */}
        <HStack spacing={2} mb={4} flexWrap="wrap">
          <Text fontSize="sm" color="gray.400">Search in:</Text>
          <Button
            size="sm"
            colorScheme={searchFields.name ? "blue" : "gray"}
            variant={searchFields.name ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, name: !searchFields.name })}
          >
            Name
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.location ? "blue" : "gray"}
            variant={searchFields.location ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, location: !searchFields.location })}
          >
            Location
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.type ? "blue" : "gray"}
            variant={searchFields.type ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, type: !searchFields.type })}
          >
            Type
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Type</Th>
                <Th color="gray.400">Location</Th>
                <Th color="gray.400" isNumeric>Price / Night</Th>
                <Th color="gray.400" isNumeric>Rating</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredAccommodations.map((acc) => (
                <Tr key={acc.accommodationId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Text fontSize="sm" color="gray.400">{acc.accommodationId}</Text>
                  </Td>

                  <Td>
                    <Text fontWeight="bold" fontSize="md">{acc.accommodationName}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{acc.accommodationType || "Unknown"}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{acc.location}</Text>
                  </Td>

                  <Td isNumeric>
                    <Text fontWeight="bold" color="green.300">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(acc.pricePerNight)}
                    </Text>
                  </Td>

                  <Td isNumeric>
                    <Text fontWeight="bold" color="yellow.400">{acc.rating}</Text>
                  </Td>

                  <Td>
                    <HStack>
                      <Button colorScheme="yellow" size="sm" onClick={() => openEdit(acc)}>Edit</Button>
                      <Button colorScheme="red" size="sm" onClick={() => handleDelete(acc.accommodationId)}>Delete</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Accommodation" : "Add New Accommodation"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>
              {/* Name & Type */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Accommodation Name</FormLabel>
                  <Input
                    placeholder="e.g. Sunrise Hotel"
                    value={formData.accommodationName}
                    onChange={(e) => handleChange("accommodationName", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  {/* Dùng Select cho Type để chuẩn hóa dữ liệu */}
                  <Select
                    placeholder="Select Type"
                    value={formData.accommodationType}
                    onChange={(e) => handleChange("accommodationType", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  >
                    <option style={{ backgroundColor: '#2D3748' }} value="Hotel">Hotel</option>
                    <option style={{ backgroundColor: '#2D3748' }} value="Resort">Resort</option>
                    <option style={{ backgroundColor: '#2D3748' }} value="Villa">Villa</option>
                    <option style={{ backgroundColor: '#2D3748' }} value="Homestay">Homestay</option>
                    <option style={{ backgroundColor: '#2D3748' }} value="Guesthouse">Guesthouse</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Location */}
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  placeholder="e.g. 123 Beach Road, Da Nang"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  bg={inputBg} borderColor={borderColor}
                />
              </FormControl>

              {/* Price & Rating */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Price Per Night (VND)</FormLabel>
                  <Input
                    type="number"
                    placeholder="e.g. 500000"
                    value={formData.pricePerNight}
                    onChange={(e) => handleChange("pricePerNight", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Rating (0 - 5)</FormLabel>
                  <HStack>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleChange("rating", e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                    />
                    <Icon as={FaStar} color="yellow.400" />
                  </HStack>
                </FormControl>
              </SimpleGrid>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={isEdit ? handleUpdate : handleAdd}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onClose} _hover={{ bg: "whiteAlpha.200" }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccommodationManagementPage;