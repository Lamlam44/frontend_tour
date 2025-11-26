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
  getTravelVehicles,
  addTravelVehicle,
  updateTravelVehicle,
  deleteTravelVehicle,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const TravelVehicleManagementPage = () => {
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadTravelVehicles = async () => {
    try {
      const data = await getTravelVehicles();
      setTravelVehicles(data);
    } catch (err) {
      console.error("Lỗi load travel vehicles", err);
    }
  };

  useEffect(() => {
    loadTravelVehicles();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      await addTravelVehicle(formData);
      onClose();
      loadTravelVehicles();
      setFormData({
        name: "",
        type: "",
      });
    } catch (err) {
      console.error("Lỗi thêm travel vehicle", err);
      alert("Lỗi khi thêm travel vehicle!");
    }
  };

  const openEdit = (travelVehicle) => {
    setIsEdit(true);
    setEditId(travelVehicle.id);

    setFormData({
        name: travelVehicle.name,
        type: travelVehicle.type,
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateTravelVehicle(editId, formData);
      onClose();
      loadTravelVehicles();
      setIsEdit(false);
      setFormData({
        name: "",
        type: "",
      });
    } catch (err) {
      console.error("Lỗi update travel vehicle", err);
      alert("Lỗi khi cập nhật travel vehicle!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa travel vehicle này?")) return;
    try {
      await deleteTravelVehicle(id);
      loadTravelVehicles();
    } catch (err) {
      console.error("Lỗi xóa travel vehicle", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Travel Vehicle Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
              setIsEdit(false);
              setFormData({
                name: "",
                type: "",
              });
              onOpen();
            }}>Add New Travel Vehicle</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Type</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {travelVehicles.map((travelVehicle) => (
                <Tr key={travelVehicle.id}>
                  <Td color={textColor}>{travelVehicle.id}</Td>
                  <Td color={textColor}>{travelVehicle.name}</Td>
                  <Td color={textColor}>{travelVehicle.type}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(travelVehicle)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(travelVehicle.id)}
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
          <ModalHeader>{isEdit ? "Edit Travel Vehicle" : "Add New Travel Vehicle"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Travel Vehicle Name"
              mb={3}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Type"
              mb={3}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
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

export default TravelVehicleManagementPage;
