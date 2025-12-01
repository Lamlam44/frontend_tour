import React, { useState, useEffect } from "react";
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
  Flex,
  Text,
  Badge,
  useToast,
  Heading,
  FormControl,
  FormLabel,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaUserTie, FaEnvelope, FaPhone, FaBriefcase } from "react-icons/fa";
import {
  getTourGuides,
  addTourGuide,
  updateTourGuide,
  deleteTourGuide,
} from "../../services/api";

const TourGuideManagementPage = () => {
  // --- STATE ---
  const [tourGuides, setTourGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    name: true,
    email: true,
    phone: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Design System Colors
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";
  const hoverBg = "navy.700";

  const [formData, setFormData] = useState({
    tourGuideName: "",
    tourGuideEmail: "",
    tourGuidePhone: "",
    tourGuideExperienceYears: "",
  });

  // --- API CALLS ---
  const loadTourGuides = async () => {
    try {
      const data = await getTourGuides();
      setTourGuides(data);
    } catch (err) {
      console.error("Lỗi load tour guides", err);
      toast({
        title: "Error loading data",
        description: "Could not fetch tour guides from server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadTourGuides();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      tourGuideName: "",
      tourGuideEmail: "",
      tourGuidePhone: "",
      tourGuideExperienceYears: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const validateForm = () => {
    if (!formData.tourGuideName || !formData.tourGuideEmail || !formData.tourGuidePhone) {
      toast({ title: "Name, Email and Phone are required.", status: "warning", duration: 3000 });
      return false;
    }
    if (parseInt(formData.tourGuideExperienceYears) < 0) {
      toast({ title: "Experience years cannot be negative.", status: "warning", duration: 3000 });
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        tourGuideExperienceYears: parseInt(formData.tourGuideExperienceYears) || 0,
      };
      await addTourGuide(payload);

      toast({ title: "Tour Guide added successfully", status: "success", duration: 3000 });
      onClose();
      loadTourGuides();
      resetForm();
    } catch (err) {
      console.error("Lỗi thêm tour guide", err);
      toast({
        title: "Error adding tour guide",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        tourGuideExperienceYears: parseInt(formData.tourGuideExperienceYears) || 0,
      };
      await updateTourGuide(editId, payload);

      toast({ title: "Tour Guide updated successfully", status: "success", duration: 3000 });
      onClose();
      loadTourGuides();
      resetForm();
    } catch (err) {
      console.error("Lỗi update tour guide", err);
      toast({
        title: "Error updating tour guide",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour guide?")) return;
    try {
      await deleteTourGuide(id);
      toast({ title: "Tour Guide deleted successfully", status: "success", duration: 3000 });
      loadTourGuides();
    } catch (err) {
      console.error("Lỗi xóa tour guide", err);
      toast({ title: "Cannot delete tour guide", status: "error", duration: 3000 });
    }
  };

  const openEdit = (guide) => {
    setIsEdit(true);
    setEditId(guide.tourGuideId);
    setFormData({
      tourGuideName: guide.tourGuideName || "",
      tourGuideEmail: guide.tourGuideEmail || "",
      tourGuidePhone: guide.tourGuidePhone || "",
      tourGuideExperienceYears: guide.tourGuideExperienceYears || "",
    });
    onOpen();
  };

  // --- RENDER ---
  // Filter tour guides based on search term and selected fields
  const filteredTourGuides = tourGuides.filter(guide => {
    if (!searchTerm) return true;
    return (
      (searchFields.name && guide.tourGuideName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.email && guide.tourGuideEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.phone && guide.tourGuidePhone?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl" minH="100vh">
      <Heading size="md" mb={6}>Tour Guide Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
        <Flex justify='space-between' align='center' mb='20px'>
          <Heading size="sm">Guide List</Heading>
          <Button
            colorScheme='blue'
            onClick={() => { resetForm(); onOpen(); }}
            size="md"
          >
            Add New Guide
          </Button>
        </Flex>

        {/* Search Input */}
        <Input
          placeholder="Search by name, email, or phone..."
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
            colorScheme={searchFields.email ? "blue" : "gray"}
            variant={searchFields.email ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, email: !searchFields.email })}
          >
            Email
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.phone ? "blue" : "gray"}
            variant={searchFields.phone ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, phone: !searchFields.phone })}
          >
            Phone
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant='simple' colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Email</Th>
                <Th color="gray.400">Phone</Th>
                <Th color="gray.400">Experience</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTourGuides.map((guide) => (
                <Tr key={guide.tourGuideId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Text fontSize="sm" fontWeight="bold" color="blue.300">{guide.tourGuideId}</Text>
                  </Td>

                  <Td>
                    <Text fontWeight="bold" fontSize="md">{guide.tourGuideName}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{guide.tourGuideEmail}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{guide.tourGuidePhone}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{guide.tourGuideExperienceYears} Years</Text>
                  </Td>

                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(guide)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(guide.tourGuideId)}
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
      </Box>

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Tour Guide" : "Add New Tour Guide"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>

              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="e.g. Nguyen Van A"
                  value={formData.tourGuideName}
                  onChange={(e) => handleChange("tourGuideName", e.target.value)}
                  bg={inputBg} borderColor={borderColor}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="guide@example.com"
                    value={formData.tourGuideEmail}
                    onChange={(e) => handleChange("tourGuideEmail", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    placeholder="Phone number"
                    value={formData.tourGuidePhone}
                    onChange={(e) => handleChange("tourGuidePhone", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Experience (Years)</FormLabel>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  value={formData.tourGuideExperienceYears}
                  onChange={(e) => handleChange("tourGuideExperienceYears", e.target.value)}
                  bg={inputBg} borderColor={borderColor}
                />
              </FormControl>

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
}

export default TourGuideManagementPage;