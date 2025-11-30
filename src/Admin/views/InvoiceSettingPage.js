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
  Badge,
  FormControl,
  FormLabel,
  SimpleGrid,
  Tag,
  Wrap,
  WrapItem,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { getAccommodations } from "../../services/api";
import axios from "axios";

const API_INVOICES = "http://localhost:8080/api/invoices";
const API_PROMOTIONS = "http://localhost:8080/api/promotions";

const InvoiceSettingPage = () => {
  // --- STATE ---
  const [invoices, setInvoices] = useState([]);
  const [promotionsList, setPromotionsList] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Styles
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";
  
  // Form Data cho việc Gửi đi (API Payload)
  const [formData, setFormData] = useState({
    status: "",
    numberOfPeople: "",
    discountAmount: "",
    taxAmount: "",
    serviceFee: "",
    totalAmount: "",
    paymentMethod: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    tourId: "",
    accommodationId: "",
    accountId: "",
    promotionIds: [],
  });

  // State riêng để hiển thị thông tin Read-only khi Edit (Display Data)
  // Giúp khắc phục lỗi dropdown không hiện giá trị cũ
  const [displayData, setDisplayData] = useState({
    tourName: "",
    accommodationName: "",
    username: "",
    appliedPromotions: [], // Array objects đầy đủ
    paymentMethodRaw: "",
  });

  // --- API CALLS ---
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

  const loadAccommodations = async () => {
    try {
      const res = await getAccommodations();
      setAccommodations(res.data);
    } catch (err) {
      console.error("Error loading accommodations", err);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadPromotions();
    loadAccommodations();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      status: "",
      numberOfPeople: "",
      discountAmount: "",
      taxAmount: "",
      serviceFee: "",
      totalAmount: "",
      paymentMethod: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      tourId: "",
      accommodationId: "",
      accountId: "",
      promotionIds: [],
    });
    setDisplayData({
        tourName: "",
        accommodationName: "",
        username: "",
        appliedPromotions: [],
        paymentMethodRaw: "",
    });
  };

  // MỞ FORM EDIT - Logic quan trọng để fix lỗi hiển thị
  const openEdit = (inv) => {
    setIsEdit(true);
    setEditId(inv.invoiceId);

    // 1. Set dữ liệu để hiển thị (Read-only)
    const accName = inv.accommodation?.accommodationName || inv.tour?.accommodation?.accommodationName || "N/A";
    setDisplayData({
        tourName: inv.tour?.tourName || "N/A",
        accommodationName: accName,
        username: inv.account?.username || "N/A",
        appliedPromotions: inv.appliedPromotions || [], // Lấy mảng object promotion
        paymentMethodRaw: inv.paymentMethod || "N/A",
    });

    // 2. Set dữ liệu vào Form để gửi đi (Editable fields)
    setFormData({
      status: inv.status,
      numberOfPeople: inv.numberOfPeople || "",
      discountAmount: inv.discountAmount || "",
      taxAmount: inv.taxAmount || "",
      serviceFee: inv.serviceFee || "",
      totalAmount: inv.totalAmount || "",
      paymentMethod: inv.paymentMethod || "",
      customerName: inv.customerName || "",
      customerPhone: inv.customerPhone || "",
      customerEmail: inv.customerEmail || "",
      tourId: inv.tour?.tourId || "",
      accommodationId: inv.accommodation?.accommodationId || "",
      accountId: inv.account?.accountId || "",
      promotionIds: inv.appliedPromotions?.map(p => String(p.promotionId)) || [], 
    });
    onOpen();
  };

  const openAdd = () => {
      setIsEdit(false);
      resetForm();
      onOpen();
  };

  const handleAdd = async () => {
    try {
        const dataToSend = {
            ...formData,
            numberOfPeople: parseInt(formData.numberOfPeople) || 0,
            discountAmount: parseFloat(formData.discountAmount) || 0,
            taxAmount: parseFloat(formData.taxAmount) || 0,
            serviceFee: parseFloat(formData.serviceFee) || 0,
            totalAmount: parseFloat(formData.totalAmount) || 0,
            promotionIds: formData.promotionIds.map(String),
        };
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
      // Khi Edit, ta chỉ gửi các trường được phép sửa hoặc giữ nguyên các trường cũ
      // Backend cần xử lý logic: nếu field null thì không update, hoặc frontend gửi lại data cũ
      const dataToSend = {
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople) || 0,
        discountAmount: parseFloat(formData.discountAmount) || 0,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        serviceFee: parseFloat(formData.serviceFee) || 0,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        promotionIds: formData.promotionIds.map(String),
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

  // Helper hiển thị tên promotion trong dropdown (chỉ dùng cho Add mode)
  const getSelectedPromotionNames = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return "Select Promotions";
    return selectedIds
      .map(id => {
        const promo = promotionsList.find(p => String(p.promotionId) === String(id));
        return promo ? promo.promotionName : `ID: ${id}`;
      })
      .join(", ");
  };

  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl">
      <Heading size="md" mb={6}>Invoice Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Invoice List</Heading>
          <Button colorScheme="blue" onClick={openAdd}>Add New Invoice</Button>
        </Box>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="gray.400">ID</Th>
              <Th color="gray.400">TOUR NAME</Th>
              <Th color="gray.400">CUSTOMER</Th>
              <Th color="gray.400">STATUS</Th>
              <Th color="gray.400" isNumeric>TOTAL</Th>
              <Th color="gray.400">PAYMENT</Th>
              <Th color="gray.400">ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices?.map(inv => (
              <Tr key={inv.invoiceId} _hover={{ bg: "navy.700" }}>
                <Td fontSize="sm" fontWeight="bold">{inv.invoiceId}</Td>
                <Td maxW="200px" isTruncated>{inv.tour?.tourName || "N/A"}</Td>
                <Td>
                    <Box>
                        <Text fontWeight="bold" fontSize="sm">{inv.customerName}</Text>
                        <Text fontSize="xs" color="gray.400">{inv.customerPhone}</Text>
                    </Box>
                </Td>
                <Td>
                    <Badge colorScheme={inv.status === 'PAID' ? 'green' : 'orange'}>
                        {inv.status}
                    </Badge>
                </Td>
                <Td isNumeric fontWeight="bold" color="green.300">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.totalAmount)}
                </Td>
                <Td>{inv.paymentMethod}</Td>
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

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Invoice Info" : "Add New Invoice"}</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Stack spacing={4}>
                
                {/* 1. SECTION: THÔNG TIN KHÁCH HÀNG (EDITABLE) */}
                <Box border="1px solid" borderColor="blue.500" p={4} borderRadius="md" position="relative">
                    <Text position="absolute" top="-12px" left="10px" bg={modalBg} px={2} fontWeight="bold" color="blue.300">
                        Customer Information (Editable)
                    </Text>
                    <SimpleGrid columns={2} spacing={4} mt={2}>
                        <FormControl isRequired>
                            <FormLabel>Customer Name</FormLabel>
                            <Input 
                                placeholder="Full Name" 
                                value={formData.customerName} 
                                onChange={e => handleChange("customerName", e.target.value)}
                                bg={inputBg} borderColor={borderColor}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Phone Number</FormLabel>
                            <Input 
                                placeholder="Phone" 
                                value={formData.customerPhone} 
                                onChange={e => handleChange("customerPhone", e.target.value)}
                                bg={inputBg} borderColor={borderColor}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                placeholder="Email" 
                                value={formData.customerEmail} 
                                onChange={e => handleChange("customerEmail", e.target.value)}
                                bg={inputBg} borderColor={borderColor}
                            />
                        </FormControl>
                         <FormControl isRequired>
                            <FormLabel>Payment Status</FormLabel>
                            <Select 
                                value={formData.status} 
                                onChange={e => handleChange("status", e.target.value)}
                                bg={inputBg} borderColor={borderColor}
                            >
                                <option style={{backgroundColor: '#2D3748'}} value="PAID">PAID</option>
                                <option style={{backgroundColor: '#2D3748'}} value="UNPAID">UNPAID</option>
                                <option style={{backgroundColor: '#2D3748'}} value="CANCELLED">CANCELLED</option>
                            </Select>
                        </FormControl>
                    </SimpleGrid>
                </Box>

                {/* 2. SECTION: CHI TIẾT DỊCH VỤ (READ-ONLY KHI EDIT) */}
                <Box border="1px solid" borderColor={borderColor} p={4} borderRadius="md" position="relative" mt={2}>
                    <Text position="absolute" top="-12px" left="10px" bg={modalBg} px={2} fontWeight="bold" color="gray.400">
                        Service Details {isEdit && "(Read-Only)"}
                    </Text>
                    
                    <Stack spacing={4} mt={2}>
                        {/* TOUR INFO */}
                        <FormControl isRequired={!isEdit}>
                            <FormLabel>Tour</FormLabel>
                            {isEdit ? (
                                <Text p={2} bg="whiteAlpha.100" borderRadius="md" fontWeight="bold">{displayData.tourName}</Text>
                            ) : (
                                <Input placeholder="Tour ID" value={formData.tourId} onChange={e => handleChange("tourId", e.target.value)} bg={inputBg} />
                            )}
                        </FormControl>

                        {/* ACCOMMODATION INFO */}
                        <FormControl>
                            <FormLabel>Accommodation</FormLabel>
                            {isEdit ? (
                                <Text p={2} bg="whiteAlpha.100" borderRadius="md">{displayData.accommodationName}</Text>
                            ) : (
                                <Select 
                                    placeholder="Select Accommodation" 
                                    value={formData.accommodationId} 
                                    onChange={e => handleChange("accommodationId", e.target.value)}
                                    bg={inputBg} borderColor={borderColor}
                                >
                                    {accommodations?.map(acc => (
                                        <option style={{backgroundColor: '#2D3748'}} key={acc.accommodationId} value={acc.accommodationId}>
                                            {acc.accommodationName}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        </FormControl>

                        {/* PAYMENT METHOD */}
                        <SimpleGrid columns={2} spacing={4}>
                             <FormControl>
                                <FormLabel>User Account ID</FormLabel>
                                {isEdit ? (
                                     <Text p={2} bg="whiteAlpha.100" borderRadius="md">{displayData.username} (ID: {formData.accountId})</Text>
                                ) : (
                                    <Input placeholder="User ID" value={formData.accountId} onChange={e => handleChange("accountId", e.target.value)} bg={inputBg} />
                                )}
                            </FormControl>
                             <FormControl>
                                <FormLabel>Payment Method</FormLabel>
                                {isEdit ? (
                                    <Text p={2} bg="whiteAlpha.100" borderRadius="md" fontWeight="bold" color={displayData.paymentMethodRaw === 'VNPAY' ? 'blue.300' : 'orange.300'}>
                                        {displayData.paymentMethodRaw}
                                    </Text>
                                ) : (
                                    <Select placeholder="Method" value={formData.paymentMethod} onChange={e => handleChange("paymentMethod", e.target.value)} bg={inputBg} borderColor={borderColor}>
                                        <option style={{backgroundColor: '#2D3748'}} value="CASH">CASH</option>
                                        <option style={{backgroundColor: '#2D3748'}} value="VNPAY">VNPAY</option>
                                    </Select>
                                )}
                            </FormControl>
                        </SimpleGrid>

                        {/* PROMOTIONS - HIỂN THỊ THÔNG MINH */}
                        <FormControl>
                            <FormLabel>Applied Promotions</FormLabel>
                            {isEdit ? (
                                <Box p={3} bg="whiteAlpha.100" borderRadius="md" minH="50px">
                                    {displayData.appliedPromotions.length > 0 ? (
                                        <Wrap spacing={2}>
                                            {displayData.appliedPromotions.map((promo, idx) => (
                                                <WrapItem key={idx}>
                                                    <Tag size="md" variant="solid" colorScheme="purple">
                                                        {promo.promotionName} (-{promo.discountPercentage}%)
                                                    </Tag>
                                                </WrapItem>
                                            ))}
                                        </Wrap>
                                    ) : (
                                        <Text fontStyle="italic" color="gray.500">No promotions applied</Text>
                                    )}
                                </Box>
                            ) : (
                                <Menu closeOnSelect={false}>
                                    <MenuButton as={Button} variant="outline" width="100%" textAlign="left" bg={inputBg} borderColor={borderColor}>
                                        <Text noOfLines={1} color={formData.promotionIds.length === 0 ? "gray.400" : "white"}>
                                        {getSelectedPromotionNames(formData.promotionIds)}
                                        </Text>
                                    </MenuButton>
                                    <MenuList maxH="200px" overflowY="auto" bg={cardBg} borderColor={borderColor} zIndex={1400}>
                                        <CheckboxGroup value={formData.promotionIds} onChange={values => handleChange("promotionIds", values)}>
                                        <Stack spacing={1} px={2}>
                                            {promotionsList?.map(promo => (
                                            <Checkbox key={promo.promotionId} value={String(promo.promotionId)} colorScheme="blue">
                                                {promo.promotionName}
                                            </Checkbox>
                                            ))}
                                        </Stack>
                                        </CheckboxGroup>
                                    </MenuList>
                                </Menu>
                            )}
                        </FormControl>
                    </Stack>
                </Box>

                {/* 3. SECTION: TÀI CHÍNH (READ-ONLY KHI EDIT) */}
                <Box border="1px solid" borderColor={borderColor} p={4} borderRadius="md" position="relative" mt={2}>
                     <Text position="absolute" top="-12px" left="10px" bg={modalBg} px={2} fontWeight="bold" color="green.300">
                        Financial Details {isEdit && "(Read-Only)"}
                    </Text>
                    <SimpleGrid columns={2} spacing={4} mt={2}>
                        <FormControl>
                            <FormLabel>Num People</FormLabel>
                            <Input type="number" value={formData.numberOfPeople} onChange={e => handleChange("numberOfPeople", e.target.value)} bg={inputBg} isReadOnly={isEdit} />
                        </FormControl>
                         <FormControl>
                            <FormLabel>Service Fee</FormLabel>
                            <Input type="number" value={formData.serviceFee} onChange={e => handleChange("serviceFee", e.target.value)} bg={inputBg} isReadOnly={isEdit} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Discount Amt</FormLabel>
                            <Input type="number" value={formData.discountAmount} onChange={e => handleChange("discountAmount", e.target.value)} bg={inputBg} isReadOnly={isEdit} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Tax Amt</FormLabel>
                            <Input type="number" value={formData.taxAmount} onChange={e => handleChange("taxAmount", e.target.value)} bg={inputBg} isReadOnly={isEdit} />
                        </FormControl>
                    </SimpleGrid>
                    <Divider my={3} />
                    <FormControl>
                        <FormLabel fontWeight="bold" fontSize="lg" color="green.300">Total Amount</FormLabel>
                        <Input 
                            value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.totalAmount || 0)} 
                            isReadOnly 
                            bg="navy.900" 
                            color="green.300" 
                            fontWeight="bold" 
                            fontSize="lg"
                            textAlign="right"
                        />
                         {/* Hidden input for logic if needed, but display formatted above */}
                    </FormControl>
                </Box>

            </Stack>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={isEdit ? handleUpdate : handleAdd}>
              {isEdit ? "Update Changes" : "Create Invoice"}
            </Button>
            <Button variant="ghost" onClick={onClose} _hover={{ bg: "whiteAlpha.200" }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InvoiceSettingPage;