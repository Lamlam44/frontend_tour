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
    name: "",
    price: "",
    rating: "",
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
      await addAccommodation(formData);
      onClose();
      loadAccommodations();
      setFormData({
        name: "",
        price: "",
        rating: "",
      });
    } catch (err) {
      console.error("Lỗi thêm accommodation", err);
      alert("Lỗi khi thêm accommodation!");
    }
  };

  const openEdit = (accommodation) => {
    setIsEdit(true);
    setEditId(accommodation.id);

    setFormData({
        name: accommodation.name,
        price: accommodation.price,
        rating: accommodation.rating,
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateAccommodation(editId, formData);
      onClose();
      loadAccommodations();
      setIsEdit(false);
      setFormData({
        name: "",
        price: "",
        rating: "",
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
                name: "",
                price: "",
                rating: "",
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
                <Th color={textColor}>Price</Th>
                <Th color={textColor}>Rating</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accommodations.map((accommodation) => (
                <Tr key={accommodation.id}>
                  <Td color={textColor}>{accommodation.id}</Td>
                  <Td color={textColor}>{accommodation.name}</Td>
                  <Td color={textColor}>{accommodation.price}</Td>
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
                        onClick={() => handleDelete(accommodation.id)}
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
              placeholder="Accommodation Name"
              mb={3}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Price"
              mb={3}
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <Input
              placeholder="Rating"
              mb={3}
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
