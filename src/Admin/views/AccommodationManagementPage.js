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
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import {
  getAccommodations,
  addAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const AccommodationManagementPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    accommodationName: "",
    location: "",
    rating: "",
    pricePerNight: "",
    accommodationType: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadAccommodations = async () => {
    try {
      const data = await getAccommodations();
      setAccommodations(data);
    } catch (err) {
      console.error("Lỗi load accommodations", err);
    }
  };

  useEffect(() => {
    loadAccommodations();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        pricePerNight: parseFloat(formData.pricePerNight),
      };
      await addAccommodation(payload);
      onClose();
      loadAccommodations();
      setFormData({
        accommodationName: "",
        location: "",
        rating: "",
        pricePerNight: "",
        accommodationType: "",
      });
    } catch (err) {
      console.error("Lỗi thêm accommodation", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi thêm accommodation!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (accommodation) => {
    setIsEdit(true);
    setEditId(accommodation.accommodationId);

    setFormData({
      accommodationName: accommodation.accommodationName || "",
      location: accommodation.location || "",
      rating: accommodation.rating || "",
      pricePerNight: accommodation.pricePerNight || "",
      accommodationType: accommodation.accommodationType || "",
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        pricePerNight: parseFloat(formData.pricePerNight),
      };
      await updateAccommodation(editId, payload);
      onClose();
      loadAccommodations();
      setIsEdit(false);
      setFormData({
        accommodationName: "",
        location: "",
        rating: "",
        pricePerNight: "",
        accommodationType: "",
      });
    } catch (err) {
      console.error("Lỗi update accommodation", err);
      alert("Lỗi khi cập nhật accommodation!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa accommodation này?")) return;
    try {
      await deleteAccommodation(id);
      loadAccommodations();
    } catch (err) {
      console.error("Lỗi xóa accommodation", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Accommodation Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
            setIsEdit(false);
            setFormData({
              accommodationName: "",
              location: "",
              rating: "",
              pricePerNight: "",
              accommodationType: "",
            });
            onOpen();
          }}>Add New Accommodation</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Location</Th>
                <Th color={textColor}>Type</Th>
                <Th color={textColor}>Price/Night</Th>
                <Th color={textColor}>Rating</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accommodations.map((accommodation) => (
                <Tr key={accommodation.accommodationId}>
                  <Td color={textColor}>{accommodation.accommodationId}</Td>
                  <Td color={textColor}>{accommodation.accommodationName}</Td>
                  <Td color={textColor}>{accommodation.location}</Td>
                  <Td color={textColor}>{accommodation.accommodationType}</Td>
                  <Td color={textColor}>{accommodation.pricePerNight}</Td>
                  <Td color={textColor}>{accommodation.rating}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(accommodation)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(accommodation.accommodationId)}
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
          <ModalHeader>{isEdit ? "Edit Accommodation" : "Add New Accommodation"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Accommodation Name *"
              mb={3}
              value={formData.accommodationName}
              onChange={(e) => handleChange("accommodationName", e.target.value)}
            />
            <Input
              placeholder="Location *"
              mb={3}
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <Input
              placeholder="Accommodation Type (e.g., Hotel, Resort, Villa) *"
              mb={3}
              value={formData.accommodationType}
              onChange={(e) => handleChange("accommodationType", e.target.value)}
            />
            <Input
              placeholder="Price Per Night *"
              mb={3}
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => handleChange("pricePerNight", e.target.value)}
            />
            <Input
              placeholder="Rating (0-5)"
              mb={3}
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
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

export default AccommodationManagementPage;
