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
  getTravelVehicles,
  addTravelVehicle,
  updateTravelVehicle,
  deleteTravelVehicle,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const TravelVehicleManagementPage = () => {
  const [travelVehicles, setTravelVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    type: true,
    capacity: true
  });
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    vehicleType: "",
    capacity: "",
    rentalPricePerDay: "",
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
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
        rentalPricePerDay: parseFloat(formData.rentalPricePerDay) || 0,
      };
      await addTravelVehicle(payload);
      onClose();
      loadTravelVehicles();
      setFormData({
        vehicleType: "",
        capacity: "",
        rentalPricePerDay: "",
      });
    } catch (err) {
      console.error("Lỗi thêm travel vehicle", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi thêm travel vehicle!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (travelVehicle) => {
    setIsEdit(true);
    setEditId(travelVehicle.vehicleId);

    setFormData({
      vehicleType: travelVehicle.vehicleType || "",
      capacity: travelVehicle.capacity || "",
      rentalPricePerDay: travelVehicle.rentalPricePerDay || "",
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
        rentalPricePerDay: parseFloat(formData.rentalPricePerDay) || 0,
      };
      await updateTravelVehicle(editId, payload);
      onClose();
      loadTravelVehicles();
      setIsEdit(false);
      setFormData({
        vehicleType: "",
        capacity: "",
        rentalPricePerDay: "",
      });
    } catch (err) {
      console.error("Lỗi update travel vehicle", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi cập nhật travel vehicle!\n${err.response?.data?.message || err.message}`);
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
              vehicleType: "",
              capacity: "",
              rentalPricePerDay: "",
            });
            onOpen();
          }}>Add New Travel Vehicle</Button>
        </Flex>

        {/* Search Input */}
        <Input
          placeholder="Search by vehicle type or capacity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={2}
          bg={useColorModeValue("white", "gray.700")}
          _placeholder={{ color: "gray.400" }}
        />
        
        {/* Search Field Filters */}
        <HStack spacing={2} mb={4} flexWrap="wrap">
          <Text fontSize="sm" color="gray.400">Search in:</Text>
          <Button
            size="sm"
            colorScheme={searchFields.type ? "blue" : "gray"}
            variant={searchFields.type ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, type: !searchFields.type})}
          >
            Vehicle Type
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.capacity ? "blue" : "gray"}
            variant={searchFields.capacity ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, capacity: !searchFields.capacity})}
          >
            Capacity
          </Button>
        </HStack>

        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Vehicle Type</Th>
                <Th color={textColor}>Capacity</Th>
                <Th color={textColor}>Rental Price/Day</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {travelVehicles.filter(vehicle => {
                if (!searchTerm) return true;
                return (
                  (searchFields.type && vehicle.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (searchFields.capacity && vehicle.capacity?.toString().includes(searchTerm))
                );
              }).map((travelVehicle) => (
                <Tr key={travelVehicle.vehicleId}>
                  <Td color={textColor}>{travelVehicle.vehicleId}</Td>
                  <Td color={textColor}>{travelVehicle.vehicleType}</Td>
                  <Td color={textColor}>{travelVehicle.capacity}</Td>
                  <Td color={textColor}>${travelVehicle.rentalPricePerDay}</Td>
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
                        onClick={() => handleDelete(travelVehicle.vehicleId)}
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
              placeholder="Vehicle Type *"
              mb={3}
              value={formData.vehicleType}
              onChange={(e) => handleChange("vehicleType", e.target.value)}
            />
            <Input
              placeholder="Capacity *"
              mb={3}
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />
            <Input
              placeholder="Rental Price Per Day *"
              mb={3}
              type="number"
              step="0.01"
              min="0"
              value={formData.rentalPricePerDay}
              onChange={(e) => handleChange("rentalPricePerDay", e.target.value)}
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
