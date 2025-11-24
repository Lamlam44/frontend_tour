import React, { useState, useEffect } from "react"
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
} from "@chakra-ui/react";

import axios from "axios";

const API = "http://localhost:8080/api/promotions";

const PromotionSettingPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    promotionName: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    endDate: "",
    tourIds: [],
  });

  const [editId, setEditId] = useState(null);

  // ========================
  // 🔥 LOAD DATA FROM API
  // ========================
  const loadPromotions = async () => {
    try {
      const res = await axios.get(API);
      setPromotions(res.data);
    } catch (err) {
      console.error("Lỗi load promotions", err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // ========================
  // 🔥 HANDLE INPUT CHANGE
  // ========================
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // ========================
  // 🔥 ADD NEW PROMOTION
  // ========================
  const handleAdd = async () => {
    try {
      await axios.post(API, formData);

      onClose();
      loadPromotions();

      setFormData({
        promotionName: "",
        discountPercentage: "",
        description: "",
        startDate: "",
        endDate: "",
        tourIds: [],
      });
    } catch (err) {
      console.error("Lỗi thêm promotion", err);
      alert("Lỗi khi thêm khuyến mãi!");
    }
  };

  // ========================
  // 🔥 OPEN EDIT FORM
  // ========================
  const openEdit = (promo) => {
    setIsEdit(true);
    setEditId(promo.promotionId);

    setFormData({
      promotionName: promo.promotionName,
      discountPercentage: promo.discountPercentage,
      description: promo.description,
      startDate: promo.startDate,
      endDate: promo.endDate,
      tourIds: [], // không load tourIds
    });

    onOpen();
  };

  // ========================
  // 🔥 UPDATE PROMOTION
  // ========================
  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${editId}`, formData);

      onClose();
      loadPromotions();
      setIsEdit(false);

      setFormData({
        promotionName: "",
        discountPercentage: "",
        description: "",
        startDate: "",
        endDate: "",
        tourIds: [],
      });
    } catch (err) {
      console.error("Lỗi update promotion", err);
      alert("Lỗi khi cập nhật khuyến mãi!");
    }
  };

  // ========================
  // 🔥 DELETE PROMOTION
  // ========================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa khuyến mãi này?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      loadPromotions();
    } catch (err) {
      console.error("Lỗi xóa promotion", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
      <Heading size="md" mb={6} color="white">
        Promotion Management
      </Heading>

      <Box bg="navy.800" p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Promotion List</Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              setIsEdit(false);
              setFormData({
                promotionName: "",
                discountPercentage: "",
                description: "",
                startDate: "",
                endDate: "",
                tourIds: [],
              });
              onOpen();
            }}
          >
            Add New Promotion
          </Button>
        </Box>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">NAME</Th>
              <Th color="white">DISCOUNT</Th>
              <Th color="white">DESCRIPTION</Th>
              <Th color="white">START</Th>
              <Th color="white">END</Th>
              <Th color="white">ACTIONS</Th>
            </Tr>
          </Thead>

          <Tbody>
            {promotions.map((promo) => (
              <Tr key={promo.promotionId}>
                <Td>{promo.promotionId}</Td>
                <Td>{promo.promotionName}</Td>
                <Td>{promo.discountPercentage}%</Td>
                <Td>{promo.description}</Td>
                <Td>{promo.startDate}</Td>
                <Td>{promo.endDate}</Td>

                <Td>
                  <HStack>
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => openEdit(promo)}
                    >
                      Edit
                    </Button>

                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(promo.promotionId)}
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

      {/* Modal thêm / sửa */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Promotion" : "Add New Promotion"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Promotion Name"
              mb={3}
              value={formData.promotionName}
              onChange={(e) => handleChange("promotionName", e.target.value)}
            />

            <Input
              placeholder="Discount Percentage"
              type="number"
              mb={3}
              value={formData.discountPercentage}
              onChange={(e) =>
                handleChange("discountPercentage", e.target.value)
              }
            />

            <Textarea
              placeholder="Description"
              mb={3}
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            <Input
              type="date"
              mb={3}
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />

            <Input
              type="date"
              mb={3}
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
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

export default PromotionSettingPage;
