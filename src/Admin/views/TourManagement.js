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
  Badge,
} from "@chakra-ui/react";
import {
  getTours,
  addTour,
  updateTour,
  deleteTour,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    tourName: "",
    tourPrice: "",
    tourStatus: "",
    tourRemainingSlots: "",
    destination: "",
    vehicle: "",
    tourType: "",
    tourImage: "",
    departureDate: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadTours = async () => {
    try {
      const data = await getTours();
      setTours(data);
    } catch (err) {
      console.error("Lỗi load tours", err);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      await addTour(formData);
      onClose();
      loadTours();
      setFormData({
        tourName: "",
        tourPrice: "",
        tourStatus: "",
        tourRemainingSlots: "",
        destination: "",
        vehicle: "",
        tourType: "",
        tourImage: "",
        departureDate: "",
      });
    } catch (err) {
      console.error("Lỗi thêm tour", err);
      alert("Lỗi khi thêm tour!");
    }
  };

  const openEdit = (tour) => {
    setIsEdit(true);
    setEditId(tour.id);

    setFormData({
        tourName: tour.tourName,
        tourPrice: tour.tourPrice,
        tourStatus: tour.tourStatus,
        tourRemainingSlots: tour.tourRemainingSlots,
        destination: tour.destination,
        vehicle: tour.vehicle,
        tourType: tour.tourType,
        tourImage: tour.tourImage,
        departureDate: tour.departureDate,
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateTour(editId, formData);
      onClose();
      loadTours();
      setIsEdit(false);
      setFormData({
        tourName: "",
        tourPrice: "",
        tourStatus: "",
        tourRemainingSlots: "",
        destination: "",
        vehicle: "",
        tourType: "",
        tourImage: "",
        departureDate: "",
      });
    } catch (err) {
      console.error("Lỗi update tour", err);
      alert("Lỗi khi cập nhật tour!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa tour này?")) return;
    try {
      await deleteTour(id);
      loadTours();
    } catch (err) {
      console.error("Lỗi xóa tour", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Tour Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
              setIsEdit(false);
              setFormData({
                tourName: "",
                tourPrice: "",
                tourStatus: "",
                tourRemainingSlots: "",
                destination: "",
                vehicle: "",
                tourType: "",
                tourImage: "",
                departureDate: "",
              });
              onOpen();
            }}>Add New Tour</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Price</Th>
                <Th color={textColor}>Status</Th>
                <Th color={textColor}>Bookings</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tours.map((tour) => (
                <Tr key={tour.id}>
                  <Td color={textColor}>{tour.id}</Td>
                  <Td color={textColor}>{tour.tourName}</Td>
                  <Td color={textColor}>{tour.tourPrice}</Td>
                  <Td color={textColor}>
                    <Badge colorScheme={tour.tourStatus === 'Available' ? 'green' : 'red'}>
                      {tour.tourStatus}
                    </Badge>
                  </Td>
                  <Td color={textColor}>{tour.tourRemainingSlots}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(tour)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(tour.id)}
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
          <ModalHeader>{isEdit ? "Edit Tour" : "Add New Tour"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Tour Name"
              mb={3}
              value={formData.tourName}
              onChange={(e) => handleChange("tourName", e.target.value)}
            />
            <Input
              placeholder="Price"
              mb={3}
              value={formData.tourPrice}
              onChange={(e) => handleChange("tourPrice", e.target.value)}
            />
            <Input
              placeholder="Status"
              mb={3}
              value={formData.tourStatus}
              onChange={(e) => handleChange("tourStatus", e.target.value)}
            />
            <Input
              placeholder="Remaining Slots"
              mb={3}
              value={formData.tourRemainingSlots}
              onChange={(e) => handleChange("tourRemainingSlots", e.target.value)}
            />
            <Input
              placeholder="Destination"
              mb={3}
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
            />
            <Input
              placeholder="Vehicle"
              mb={3}
              value={formData.vehicle}
              onChange={(e) => handleChange("vehicle", e.target.value)}
            />
            <Input
              placeholder="Tour Type"
              mb={3}
              value={formData.tourType}
              onChange={(e) => handleChange("tourType", e.target.value)}
            />
            <Input
              placeholder="Tour Image"
              mb={3}
              value={formData.tourImage}
              onChange={(e) => handleChange("tourImage", e.target.value)}
            />
            <Input
              placeholder="Departure Date"
              mb={3}
              type="date"
              value={formData.departureDate}
              onChange={(e) => handleChange("departureDate", e.target.value)}
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
};
export default TourManagement;