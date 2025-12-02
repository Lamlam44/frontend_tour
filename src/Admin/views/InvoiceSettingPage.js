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
  useToast, // Import Toast
} from "@chakra-ui/react";

// SỬA LỖI: Import từ api.js thay vì dùng axios trực tiếp
import {
  getInvoices,
  getPromotions,
  getAccommodations,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from "../../services/api";

const InvoiceSettingPage = () => {
  // --- STATE ---
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    tourName: true,
    customerName: true,
    phone: true,
    email: true
  });
  const [promotionsList, setPromotionsList] = useState([]);
  const [accommodations, setAccommodations] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Hook thông báo

  // Styles
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";

  // Form Data gửi đi
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

  // Display Data (Read-only)
  const [displayData, setDisplayData] = useState({
    tourName: "",
    accommodationName: "",
    username: "",
    appliedPromotions: [],
    paymentMethodRaw: "",
  });

  // --- API CALLS ---
  const loadData = async () => {
    try {
      const [invData, promoData, accData] = await Promise.all([
        getInvoices(),
        getPromotions(),
        getAccommodations()
      ]);
      setInvoices(invData);
      setPromotionsList(promoData);
      setAccommodations(accData);
    } catch (err) {
      console.error("Error loading data", err);
      toast({
        title: "Lỗi tải dữ liệu",
        description: err.message || "Vui lòng kiểm tra kết nối",
        status: "error",
        duration: 3000
      });
    }
  };

  useEffect(() => {
    loadData();
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

  // MỞ FORM EDIT
  const openEdit = (inv) => {
    setIsEdit(true);
    setEditId(inv.invoiceId);

    const accName = inv.accommodation?.accommodationName || inv.tour?.accommodation?.accommodationName || "N/A";

    setDisplayData({
      tourName: inv.tour?.tourName || "N/A",
      accommodationName: accName,
      username: inv.account?.username || "N/A",
      appliedPromotions: inv.appliedPromotions || [],
      paymentMethodRaw: inv.paymentMethod || "N/A",
    });

    setFormData({
      status: inv.status,
      numberOfPeople: inv.numberOfPeople || "",
      discountAmount: inv.discountAmount || "",
      taxAmount: inv.taxAmount || "",
      serviceFee: inv.serviceFee || "",
      totalAmount: inv.totalAmount || "",
      paymentMethod: inv.paymentMethod || "", // Nếu null thì form sẽ nhận chuỗi rỗng ""
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
      // Sử dụng hàm từ api.js (có token)
      await createInvoice(dataToSend);

      toast({ title: "Tạo hóa đơn thành công", status: "success", duration: 3000 });
      loadData();
      onClose();
      resetForm();
    } catch (err) {
      toast({
        title: "Lỗi tạo hóa đơn",
        description: err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToSend = {
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople) || 0,
        discountAmount: parseFloat(formData.discountAmount) || 0,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        serviceFee: parseFloat(formData.serviceFee) || 0,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        promotionIds: formData.promotionIds.map(String),
        // PaymentMethod: nếu rỗng (null/undefined) thì backend sẽ xử lý hoặc giữ nguyên
        paymentMethod: formData.paymentMethod || null
      };

      // Sử dụng hàm từ api.js (có token)
      await updateInvoice(editId, dataToSend);

      toast({ title: "Cập nhật thành công", status: "success", duration: 3000 });
      loadData();
      onClose();
      setIsEdit(false);
      resetForm();
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Không thể cập nhật",
        description: err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;
    try {
      await deleteInvoice(id);
      toast({ title: "Đã xóa hóa đơn", status: "success", duration: 3000 });
      loadData();
    } catch (err) {
      toast({ title: "Lỗi xóa hóa đơn", description: err.message, status: "error", duration: 3000 });
    }
  };

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

        {/* Search Input */}
        <Input
          placeholder="Search by tour, customer name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={2}
          bg={inputBg}
          borderColor={borderColor}
          _placeholder={{ color: "gray.400" }}
        />
        
        {/* Search Field Filters */}
        <HStack spacing={2} mb={4} flexWrap="wrap">
          <Text fontSize="sm" color="gray.400">Search in:</Text>
          <Button
            size="sm"
            colorScheme={searchFields.tourName ? "blue" : "gray"}
            variant={searchFields.tourName ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, tourName: !searchFields.tourName})}
          >
            Tour Name
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.customerName ? "blue" : "gray"}
            variant={searchFields.customerName ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, customerName: !searchFields.customerName})}
          >
            Customer Name
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.phone ? "blue" : "gray"}
            variant={searchFields.phone ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, phone: !searchFields.phone})}
          >
            Phone
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.email ? "blue" : "gray"}
            variant={searchFields.email ? "solid" : "outline"}
            onClick={() => setSearchFields({...searchFields, email: !searchFields.email})}
          >
            Email
          </Button>
        </HStack>

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
            {invoices?.filter(inv => {
              if (!searchTerm) return true;
              return (
                (searchFields.tourName && inv.tour?.tourName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (searchFields.customerName && inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (searchFields.phone && inv.customerPhone?.includes(searchTerm)) ||
                (searchFields.email && inv.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
              );
            }).map(inv => (
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
                <Td>
                  {/* Hiển thị Payment Method đẹp hơn */}
                  {inv.paymentMethod ? (
                    <Tag colorScheme={inv.paymentMethod === 'VNPAY' ? 'blue' : 'yellow'}>
                      {inv.paymentMethod}
                    </Tag>
                  ) : (
                    <Text fontSize="sm" color="gray.500">N/A</Text>
                  )}
                </Td>
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

              {/* 1. SECTION: THÔNG TIN KHÁCH HÀNG */}
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
                      <option style={{ backgroundColor: '#2D3748' }} value="PAID">PAID</option>
                      <option style={{ backgroundColor: '#2D3748' }} value="UNPAID">UNPAID</option>
                      <option style={{ backgroundColor: '#2D3748' }} value="CANCELLED">CANCELLED</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* 2. SECTION: CHI TIẾT DỊCH VỤ */}
              <Box border="1px solid" borderColor={borderColor} p={4} borderRadius="md" position="relative" mt={2}>
                <Text position="absolute" top="-12px" left="10px" bg={modalBg} px={2} fontWeight="bold" color="gray.400">
                  Service Details {isEdit && "(Read-Only)"}
                </Text>

                <Stack spacing={4} mt={2}>
                  <FormControl isRequired={!isEdit}>
                    <FormLabel>Tour</FormLabel>
                    {isEdit ? (
                      <Text p={2} bg="whiteAlpha.100" borderRadius="md" fontWeight="bold">{displayData.tourName}</Text>
                    ) : (
                      <Input placeholder="Tour ID" value={formData.tourId} onChange={e => handleChange("tourId", e.target.value)} bg={inputBg} />
                    )}
                  </FormControl>

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
                          <option style={{ backgroundColor: '#2D3748' }} key={acc.accommodationId} value={acc.accommodationId}>
                            {acc.accommodationName}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl>
                      <FormLabel>User Account ID</FormLabel>
                      {isEdit ? (
                        <Text p={2} bg="whiteAlpha.100" borderRadius="md">{displayData.username} (ID: {formData.accountId})</Text>
                      ) : (
                        <Input placeholder="User ID" value={formData.accountId} onChange={e => handleChange("accountId", e.target.value)} bg={inputBg} />
                      )}
                    </FormControl>

                    {/* PAYMENT METHOD FIX */}
                    <FormControl>
                      <FormLabel>Payment Method</FormLabel>
                      {/* Trong chế độ Edit, chúng ta cho phép Admin GÁN phương thức thanh toán nếu nó đang trống (hoặc muốn đổi) */}
                      <Select
                        placeholder={isEdit && !formData.paymentMethod ? "Select Method (Currently N/A)" : "Select Method"}
                        value={formData.paymentMethod}
                        onChange={e => handleChange("paymentMethod", e.target.value)}
                        bg={inputBg}
                        borderColor={borderColor}
                      // Có thể disable nếu muốn chặt chẽ: disabled={isEdit && formData.paymentMethod}
                      >
                        <option style={{ backgroundColor: '#2D3748' }} value="CASH">CASH</option>
                        <option style={{ backgroundColor: '#2D3748' }} value="VNPAY">VNPAY</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

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

              {/* 3. SECTION: TÀI CHÍNH */}
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