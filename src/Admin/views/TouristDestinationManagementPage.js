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
  Textarea,
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
import { FaMapMarkerAlt, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
import {
  getTouristDestinations,
  addTouristDestination,
  updateTouristDestination,
  deleteTouristDestination,
} from "../../services/api";

const TouristDestinationManagementPage = () => {
  // --- STATE ---
  const [touristDestinations, setTouristDestinations] = useState([]);
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
    destinationName: "",
    location: "",
    description: "",
    entryFee: "",
  });

  // --- API CALLS ---
  const loadTouristDestinations = async () => {
    try {
      const data = await getTouristDestinations();
      setTouristDestinations(data);
    } catch (err) {
      console.error("Lỗi load tourist destinations", err);
      toast({
        title: "Error loading data",
        description: "Could not fetch destinations from server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadTouristDestinations();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      destinationName: "",
      location: "",
      description: "",
      entryFee: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const validateForm = () => {
    if (!formData.destinationName || !formData.location) {
        toast({ title: "Destination Name and Location are required.", status: "warning", duration: 3000 });
        return false;
    }
    if (formData.entryFee && parseFloat(formData.entryFee) < 0) {
        toast({ title: "Entry Fee cannot be negative.", status: "warning", duration: 3000 });
        return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        destinationName: formData.destinationName,
        location: formData.location,
        description: formData.description || null,
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      };
      await addTouristDestination(payload);
      
      toast({ title: "Destination added successfully", status: "success", duration: 3000 });
      onClose();
      loadTouristDestinations();
      resetForm();
    } catch (err) {
      console.error("Lỗi thêm tourist destination", err);
      toast({ 
        title: "Error adding destination", 
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
        destinationName: formData.destinationName,
        location: formData.location,
        description: formData.description || null,
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      };
      await updateTouristDestination(editId, payload);
      
      toast({ title: "Destination updated successfully", status: "success", duration: 3000 });
      onClose();
      loadTouristDestinations();
      resetForm();
    } catch (err) {
      console.error("Lỗi update tourist destination", err);
      toast({ 
        title: "Error updating destination", 
        description: err.response?.data?.message || err.message, 
        status: "error", 
        duration: 5000 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await deleteTouristDestination(id);
      toast({ title: "Destination deleted successfully", status: "success", duration: 3000 });
      loadTouristDestinations();
    } catch (err) {
      console.error("Lỗi xóa tourist destination", err);
      toast({ title: "Cannot delete destination", status: "error", duration: 3000 });
    }
  };

  const openEdit = (dest) => {
    setIsEdit(true);
    setEditId(dest.destinationId);
    setFormData({
      destinationName: dest.destinationName || "",
      location: dest.location || "",
      description: dest.description || "",
      entryFee: dest.entryFee || "",
    });
    onOpen();
  };

  // --- RENDER ---
  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl" minH="100vh">
      <Heading size="md" mb={6}>Tourist Destination Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
        <Flex justify='space-between' align='center' mb='20px'>
          <Heading size="sm">Destinations List</Heading>
          <Button 
            colorScheme='blue' 
            onClick={() => { resetForm(); onOpen(); }}
            size="md"
          >
            Add New Destination
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant='simple' colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID / Name</Th>
                <Th color="gray.400">Location</Th>
                <Th color="gray.400" isNumeric>Entry Fee</Th>
                <Th color="gray.400">Description</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {touristDestinations.map((dest) => (
                <Tr key={dest.destinationId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Box>
                        <Text fontSize="xs" color="gray.400">{dest.destinationId}</Text>
                        <Text fontWeight="bold" fontSize="md" color="blue.300">{dest.destinationName}</Text>
                    </Box>
                  </Td>
                  
                  <Td>
                    <HStack>
                        <Icon as={FaMapMarkerAlt} color="red.400" />
                        <Text fontSize="sm">{dest.location}</Text>
                    </HStack>
                  </Td>
                  
                  <Td isNumeric>
                    <HStack justify="flex-end">
                        <Icon as={FaMoneyBillWave} color="green.400" />
                        <Text fontWeight="bold" color="green.300">
                            {dest.entryFee > 0 
                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dest.entryFee)
                                : "Free"}
                        </Text>
                    </HStack>
                  </Td>

                  <Td>
                     <HStack align="start">
                        <Icon as={FaInfoCircle} color="gray.500" mt={1} />
                        <Text fontSize="sm" noOfLines={2} maxW="250px" color="gray.300">
                            {dest.description || "No description provided."}
                        </Text>
                     </HStack>
                  </Td>
                  
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(dest)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(dest.destinationId)}
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
          <ModalHeader>{isEdit ? "Edit Destination" : "Add New Destination"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>
                
                <FormControl isRequired>
                    <FormLabel>Destination Name</FormLabel>
                    <Input
                      placeholder="e.g. Ha Long Bay"
                      value={formData.destinationName}
                      onChange={(e) => handleChange("destinationName", e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                      placeholder="e.g. Quang Ninh Province"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Entry Fee (VND)</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0 for Free"
                      value={formData.entryFee}
                      onChange={(e) => handleChange("entryFee", e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>Leave blank or 0 if free.</Text>
                </FormControl>

                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Enter description here..."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                      rows={4}
                      maxLength={2000}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                        {formData.description.length}/2000
                    </Text>
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

export default TouristDestinationManagementPage;