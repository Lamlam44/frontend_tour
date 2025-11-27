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
  useColorModeValue,
  Flex,
  Text,
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
    name: "",
    description: "",
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
      await addTouristDestination(formData);
      onClose();
      loadTouristDestinations();
      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      console.error("Lỗi thêm tourist destination", err);
      alert("Lỗi khi thêm tourist destination!");
    }
  };

  const openEdit = (touristDestination) => {
    setIsEdit(true);
    setEditId(touristDestination.id);

    setFormData({
        name: touristDestination.name,
        description: touristDestination.description,
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateTouristDestination(editId, formData);
      onClose();
      loadTouristDestinations();
      setIsEdit(false);
      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      console.error("Lỗi update tourist destination", err);
      alert("Lỗi khi cập nhật tourist destination!");
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
                name: "",
                description: "",
              });
              onOpen();
            }}>Add New Tourist Destination</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Description</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {touristDestinations.map((touristDestination) => (
                <Tr key={touristDestination.id}>
                  <Td color={textColor}>{touristDestination.id}</Td>
                  <Td color={textColor}>{touristDestination.name}</Td>
                  <Td color={textColor}>{touristDestination.description}</Td>
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
                        onClick={() => handleDelete(touristDestination.id)}
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
              placeholder="Tourist Destination Name"
              mb={3}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Textarea
              placeholder="Description"
              mb={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
