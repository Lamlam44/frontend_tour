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
  getTourGuides,
  addTourGuide,
  updateTourGuide,
  deleteTourGuide,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const TourGuideManagementPage = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadTourGuides = async () => {
    try {
      const data = await getTourGuides();
      setTourGuides(data);
    } catch (err) {
      console.error("Lỗi load tour guides", err);
    }
  };

  useEffect(() => {
    loadTourGuides();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      await addTourGuide(formData);
      onClose();
      loadTourGuides();
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Lỗi thêm tour guide", err);
      alert("Lỗi khi thêm tour guide!");
    }
  };

  const openEdit = (tourGuide) => {
    setIsEdit(true);
    setEditId(tourGuide.id);

    setFormData({
        name: tourGuide.name,
        email: tourGuide.email,
        phone: tourGuide.phone,
        address: tourGuide.address,
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateTourGuide(editId, formData);
      onClose();
      loadTourGuides();
      setIsEdit(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Lỗi update tour guide", err);
      alert("Lỗi khi cập nhật tour guide!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa tour guide này?")) return;
    try {
      await deleteTourGuide(id);
      loadTourGuides();
    } catch (err) {
      console.error("Lỗi xóa tour guide", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Tour Guide Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
              setIsEdit(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
              });
              onOpen();
            }}>Add New Tour Guide</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Email</Th>
                <Th color={textColor}>Phone</Th>
                <Th color={textColor}>Address</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tourGuides.map((tourGuide) => (
                <Tr key={tourGuide.id}>
                  <Td color={textColor}>{tourGuide.id}</Td>
                  <Td color={textColor}>{tourGuide.name}</Td>
                  <Td color={textColor}>{tourGuide.email}</Td>
                  <Td color={textColor}>{tourGuide.phone}</Td>
                  <Td color={textColor}>{tourGuide.address}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(tourGuide)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(tourGuide.id)}
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
          <ModalHeader>{isEdit ? "Edit Tour Guide" : "Add New Tour Guide"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Tour Guide Name"
              mb={3}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Email"
              mb={3}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              mb={3}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              placeholder="Address"
              mb={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
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

export default TourGuideManagementPage;
