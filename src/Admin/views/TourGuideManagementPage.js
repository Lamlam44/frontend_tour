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
    tourGuideName: "",
    tourGuideEmail: "",
    tourGuidePhone: "",
    tourGuideExperienceYears: "",
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
      const payload = {
        ...formData,
        tourGuideExperienceYears: parseInt(formData.tourGuideExperienceYears) || 0,
      };
      await addTourGuide(payload);
      onClose();
      loadTourGuides();
      setFormData({
        tourGuideName: "",
        tourGuideEmail: "",
        tourGuidePhone: "",
        tourGuideExperienceYears: "",
      });
    } catch (err) {
      console.error("Lỗi thêm tour guide", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi thêm tour guide!\n${err.response?.data?.message || err.message}`);
    }
  };

  const openEdit = (tourGuide) => {
    setIsEdit(true);
    setEditId(tourGuide.tourGuideId);

    setFormData({
      tourGuideName: tourGuide.tourGuideName || "",
      tourGuideEmail: tourGuide.tourGuideEmail || "",
      tourGuidePhone: tourGuide.tourGuidePhone || "",
      tourGuideExperienceYears: tourGuide.tourGuideExperienceYears || "",
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        tourGuideExperienceYears: parseInt(formData.tourGuideExperienceYears) || 0,
      };
      await updateTourGuide(editId, payload);
      onClose();
      loadTourGuides();
      setIsEdit(false);
      setFormData({
        tourGuideName: "",
        tourGuideEmail: "",
        tourGuidePhone: "",
        tourGuideExperienceYears: "",
      });
    } catch (err) {
      console.error("Lỗi update tour guide", err);
      console.error("Error response:", err.response?.data);
      alert(`Lỗi khi cập nhật tour guide!\n${err.response?.data?.message || err.message}`);
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
              tourGuideName: "",
              tourGuideEmail: "",
              tourGuidePhone: "",
              tourGuideExperienceYears: "",
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
                <Th color={textColor}>Experience (Years)</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tourGuides.map((tourGuide) => (
                <Tr key={tourGuide.tourGuideId}>
                  <Td color={textColor}>{tourGuide.tourGuideId}</Td>
                  <Td color={textColor}>{tourGuide.tourGuideName}</Td>
                  <Td color={textColor}>{tourGuide.tourGuideEmail}</Td>
                  <Td color={textColor}>{tourGuide.tourGuidePhone}</Td>
                  <Td color={textColor}>{tourGuide.tourGuideExperienceYears}</Td>
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
                        onClick={() => handleDelete(tourGuide.tourGuideId)}
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
              placeholder="Tour Guide Name *"
              mb={3}
              value={formData.tourGuideName}
              onChange={(e) => handleChange("tourGuideName", e.target.value)}
            />
            <Input
              placeholder="Email *"
              mb={3}
              type="email"
              value={formData.tourGuideEmail}
              onChange={(e) => handleChange("tourGuideEmail", e.target.value)}
            />
            <Input
              placeholder="Phone *"
              mb={3}
              value={formData.tourGuidePhone}
              onChange={(e) => handleChange("tourGuidePhone", e.target.value)}
            />
            <Input
              placeholder="Experience Years *"
              mb={3}
              type="number"
              min="0"
              value={formData.tourGuideExperienceYears}
              onChange={(e) => handleChange("tourGuideExperienceYears", e.target.value)}
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
