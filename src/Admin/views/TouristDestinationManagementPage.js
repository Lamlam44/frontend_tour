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
  useColorModeValue,
  Flex,
  Text,
  Badge,
} from "@chakra-ui/react";
import {
  getTouristDestinations,
  addTouristDestination,
  updateTouristDestination,
  deleteTouristDestination,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const TouristDestinationManagementPage = () => {
  const [touristDestinations, setTouristDestinations] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    destinationName: "",
    location: "",
    description: "",
    entryFee: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadTouristDestinations = async () => {
    try {
      const data = await getTouristDestinations();
      setTouristDestinations(data);
    } catch (err) {
      console.error("Lỗi load tourist destinations", err);
    }
  };

  useEffect(() => {
    loadTouristDestinations();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      const payload = {
        destinationName: formData.destinationName,
        location: formData.location,
        description: formData.description || null,
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : null,
      };
      await addTouristDestination(payload);
      onClose();
      loadTouristDestinations();
      setFormData({
        destinationName: "",
        location: "",
        description: "",
        entryFee: "",
      });
    } catch (err) {
      console.error("Lỗi thêm tourist destination", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi thêm tourist destination!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (touristDestination) => {
    setIsEdit(true);
    setEditId(touristDestination.destinationId);

    setFormData({
      destinationName: touristDestination.destinationName || "",
      location: touristDestination.location || "",
      description: touristDestination.description || "",
      entryFee: touristDestination.entryFee || "",
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        destinationName: formData.destinationName,
        location: formData.location,
        description: formData.description || null,
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : null,
      };
      await updateTouristDestination(editId, payload);
      onClose();
      loadTouristDestinations();
      setIsEdit(false);
      setFormData({
        destinationName: "",
        location: "",
        description: "",
        entryFee: "",
      });
    } catch (err) {
      console.error("Lỗi update tourist destination", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi cập nhật tourist destination!\n${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa tourist destination này?")) return;
    try {
      await deleteTouristDestination(id);
      loadTouristDestinations();
    } catch (err) {
      console.error("Lỗi xóa tourist destination", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Tourist Destination Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
            setIsEdit(false);
            setFormData({
              destinationName: "",
              location: "",
              description: "",
              entryFee: "",
            });
            onOpen();
          }}>Add New Tourist Destination</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Destination Name</Th>
                <Th color={textColor}>Location</Th>
                <Th color={textColor}>Entry Fee</Th>
                <Th color={textColor}>Description</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {touristDestinations.map((touristDestination) => (
                <Tr key={touristDestination.destinationId}>
                  <Td color={textColor}>{touristDestination.destinationId}</Td>
                  <Td color={textColor}>{touristDestination.destinationName}</Td>
                  <Td color={textColor}>{touristDestination.location}</Td>
                  <Td color={textColor}>${touristDestination.entryFee || 'Free'}</Td>
                  <Td color={textColor}>{touristDestination.description?.substring(0, 50)}...</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(touristDestination)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(touristDestination.destinationId)}
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
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Tourist Destination" : "Add New Tourist Destination"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Destination Name *"
              mb={3}
              value={formData.destinationName}
              onChange={(e) => handleChange("destinationName", e.target.value)}
            />
            <Input
              placeholder="Location *"
              mb={3}
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <Textarea
              placeholder="Description (max 2000 characters)"
              mb={3}
              maxLength={2000}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <Input
              placeholder="Entry Fee (optional)"
              mb={3}
              type="number"
              step="0.01"
              min="0"
              value={formData.entryFee}
              onChange={(e) => handleChange("entryFee", e.target.value)}
            />
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
}

export default TouristDestinationManagementPage;
