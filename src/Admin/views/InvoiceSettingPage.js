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
  Select,
  Menu,
  MenuButton,
  MenuList,
  Checkbox,
  CheckboxGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const API_INVOICES = "http://localhost:8080/api/invoices";
const API_PROMOTIONS = "http://localhost:8080/api/promotions";

// SỬA LỖI CÚ PHÁP: Thêm backtick và dấu $ vào template literal, thêm nhãn "ID:"
const getSelectedPromotionNames = (selectedIds, promotionList) => {
  if (!selectedIds || selectedIds.length === 0) return "Select Promotions";

  return selectedIds
    .map(id => {
      const promo = promotionList.find(p => p.promotionId === Number(id));
      return promo ? promo.promotionName : `ID: ${id}`;
    })
    .join(", ");
};

const InvoiceSettingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [promotionsList, setPromotionsList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [formData, setFormData] = useState({
    status: "",
    totalAmount: "",
    paymentMethod: "",
    tourId: "",
    accountId: "",
    promotionIds: [],
  });

  // Load invoices và promotions từ API
  const loadInvoices = async () => {
    try {
      const res = await axios.get(API_INVOICES);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error loading invoices", err);
    }
  };

  const loadPromotions = async () => {
    try {
      const res = await axios.get(API_PROMOTIONS);
      setPromotionsList(res.data);
    } catch (err) {
      console.error("Error loading promotions", err);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadPromotions();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      status: "",
      totalAmount: "",
      paymentMethod: "",
      tourId: "",
      accountId: "",
      promotionIds: [],
    });
  };

    const handleAdd = async () => {
        try {
            const dataToSend = {
            ...formData,
            promotionIds: formData.promotionIds,
            };
            console.log("Sending invoice:", dataToSend);
            await axios.post(API_INVOICES, dataToSend);
            loadInvoices();
            onClose();
            resetForm();
        } catch (err) {
            console.error("Error adding invoice", err);
            alert("Cannot add invoice!");
        }
    };
  const handleUpdate = async () => {
    try {
      const dataToSend = {
        ...formData,
        // Đảm bảo gửi Number array
        promotionIds: formData.promotionIds,
      };
      await axios.put(`${API_INVOICES}/${editId}`, dataToSend);
      loadInvoices();
      onClose();
      setIsEdit(false);
      resetForm();
    } catch (err) {
      console.error("Error updating invoice", err);
      alert("Cannot update invoice!");
    }
  };

  const openEdit = (inv) => {
    setIsEdit(true);
    setEditId(inv.invoiceId);
    setFormData({
      status: inv.status,
      totalAmount: inv.totalAmount,
      paymentMethod: inv.paymentMethod,
      tourId: inv.tour?.tourId || "",
      accountId: inv.account?.accountId || "",
      // Lấy ID dưới dạng Number
      promotionIds: inv.appliedPromotions?.map(p => p.promotionId) || [], 
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this invoice?")) return;
    try {
      await axios.delete(`${API_INVOICES}/${id}`);
      loadInvoices();
    } catch (err) {
      console.error("Error deleting invoice", err);
      alert("Cannot delete!");
    }
  };

  return (
    <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
      <Heading size="md" mb={6}>
        Invoice Management
      </Heading>

      <Box bg="navy.800" p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Invoice List</Heading>
          <Button
            colorScheme="blue"
            onClick={() => { setIsEdit(false); resetForm(); onOpen(); }}
          >
            Add New Invoice
          </Button>
        </Box>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Tour</Th>
              <Th>User</Th>
              <Th>Created</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Payment</Th>
              <Th>Promotions</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map(inv => (
              <Tr key={inv.invoiceId}>
                <Td>{inv.invoiceId}</Td>
                <Td>{inv.tour?.tourId}</Td>
                <Td>{inv.account?.accountId}</Td>
                <Td>{inv.invoiceCreatedAt}</Td>
                <Td>{inv.status}</Td>
                <Td>{inv.totalAmount}</Td>
                <Td>{inv.paymentMethod}</Td>
                <Td>{inv.appliedPromotions?.map(p => p.promotionName).join(", ")}</Td>
                <Td>
                  <HStack>
                    <Button colorScheme="yellow" size="sm" onClick={() => openEdit(inv)}>Edit</Button>
                    <Button colorScheme="red" size="sm" onClick={() => handleDelete(inv.invoiceId)}>Delete</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Invoice" : "Add New Invoice"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Tour ID" mb={3} value={formData.tourId} onChange={e => handleChange("tourId", e.target.value)} />
            <Input placeholder="User ID" mb={3} value={formData.accountId} onChange={e => handleChange("accountId", e.target.value)} />

            <Select placeholder="Select Status" mb={3} value={formData.status} onChange={e => handleChange("status", e.target.value)}>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
            </Select>

            <Input placeholder="Total Amount" type="number" mb={3} value={formData.totalAmount || ""} isDisabled />

            <Select placeholder="Select Payment Method" mb={3} value={formData.paymentMethod} onChange={e => handleChange("paymentMethod", e.target.value)}>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
            </Select>

            {/* Promotions Multi-Select */}
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} variant="outline" width="100%" mb={3} textAlign="left">
                <Text noOfLines={1} color={formData.promotionIds.length === 0 ? "gray.500" : "inherit"}>
                  {getSelectedPromotionNames(formData.promotionIds, promotionsList)}
                </Text>
              </MenuButton>
              <MenuList maxH="250px" overflowY="auto" bg="white" color="gray.800">
                <CheckboxGroup 
                  value={formData.promotionIds.map(String)} 
                  // SỬA LỖI LOGIC: Chuyển đổi String array về Number array
                  onChange={values => handleChange("promotionIds", values)}
                >
                  <Stack spacing={1} px={2} py={1}>
                    {promotionsList.map(promo => (
                      <Box 
                        key={promo.promotionId} 
                        py={2} 
                        px={2} 
                        borderRadius="md" 
                        cursor="pointer" 
                        // NGĂN MENU ĐÓNG
                        onClick={e => e.stopPropagation()} 
                        _hover={{ bg: "gray.100" }}
                      >
                        <Checkbox value={String(promo.promotionId)} colorScheme="blue">
                          {promo.promotionName}
                        </Checkbox>
                      </Box>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </MenuList>
            </Menu>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={isEdit ? handleUpdate : handleAdd}>{isEdit ? "Update" : "Save"}</Button>
            <Button variant="ghost" onClick={() => { onClose(); setIsEdit(false); setEditId(null); resetForm(); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InvoiceSettingPage;