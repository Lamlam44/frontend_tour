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
  Flex,
  Text,
  Badge,
  useToast,
  Heading,
  FormControl,
  FormLabel,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from "react-icons/fa";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/api";

const CustomerManagementPage = () => {
  // --- STATE ---
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState({
    name: true,
    email: true,
    phone: true,
    address: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Design System Colors
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";
  const hoverBg = "navy.700";
  const textColor = "white";

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerDateOfBirth: "",
    accountId: "",
  });

  // --- API CALLS ---
  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Lỗi load customers", err);
      toast({
        title: "Error loading customers",
        description: "Could not fetch data from server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerDateOfBirth: "",
      accountId: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast({ title: "Name, Email, and Phone are required.", status: "warning", duration: 3000 });
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      await addCustomer(formData);
      toast({ title: "Customer added successfully", status: "success", duration: 3000 });
      onClose();
      loadCustomers();
      resetForm();
    } catch (err) {
      console.error("Lỗi thêm customer", err);
      toast({
        title: "Error adding customer",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updateCustomer(editId, formData);
      toast({ title: "Customer updated successfully", status: "success", duration: 3000 });
      onClose();
      loadCustomers();
      resetForm();
    } catch (err) {
      console.error("Lỗi update customer", err);
      toast({
        title: "Error updating customer",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast({ title: "Customer deleted successfully", status: "success", duration: 3000 });
      loadCustomers();
    } catch (err) {
      console.error("Lỗi xóa customer", err);
      toast({ title: "Cannot delete customer", status: "error", duration: 3000 });
    }
  };

  const openEdit = (customer) => {
    setIsEdit(true);
    setEditId(customer.customerId);

    setFormData({
      customerName: customer.customerName || "",
      customerEmail: customer.customerEmail || "",
      customerPhone: customer.customerPhone || "",
      customerAddress: customer.customerAddress || "",
      customerDateOfBirth: customer.customerDateOfBirth || "",
      accountId: customer.account?.accountId || "",
    });

    onOpen();
  };

  // --- RENDER ---
  // Filter customers based on search term and selected fields
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    return (
      (searchFields.name && customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.email && customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.phone && customer.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchFields.address && customer.customerAddress?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl" minH="100vh">
      <Heading size="md" mb={6}>Customer Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
        <Flex justify='space-between' align='center' mb='20px'>
          <Heading size="sm">Customer List</Heading>
          <Button
            colorScheme='blue'
            onClick={() => { resetForm(); onOpen(); }}
            size="md"
          >
            Add New Customer
          </Button>
        </Flex>

        {/* Search Input */}
        <Input
          placeholder="Search by name, email, phone, or address..."
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
            colorScheme={searchFields.name ? "blue" : "gray"}
            variant={searchFields.name ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, name: !searchFields.name })}
          >
            Name
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.email ? "blue" : "gray"}
            variant={searchFields.email ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, email: !searchFields.email })}
          >
            Email
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.phone ? "blue" : "gray"}
            variant={searchFields.phone ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, phone: !searchFields.phone })}
          >
            Phone
          </Button>
          <Button
            size="sm"
            colorScheme={searchFields.address ? "blue" : "gray"}
            variant={searchFields.address ? "solid" : "outline"}
            onClick={() => setSearchFields({ ...searchFields, address: !searchFields.address })}
          >
            Address
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant='simple' colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Email</Th>
                <Th color="gray.400">Phone</Th>
                <Th color="gray.400">Address</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCustomers.map((customer) => (
                <Tr key={customer.customerId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Text fontSize="sm" fontWeight="bold" color="blue.300">{customer.customerId}</Text>
                  </Td>

                  <Td>
                    <Text fontWeight="bold">{customer.customerName}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{customer.customerEmail}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{customer.customerPhone}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm" noOfLines={2} maxW="200px">{customer.customerAddress}</Text>
                  </Td>

                  <Td>
                    <HStack>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEdit(customer)}
                      >
                        Edit
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(customer.customerId)}
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
      </Box>

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Customer" : "Add New Customer"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>

              {/* Name & Phone */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Customer Name</FormLabel>
                  <Input
                    placeholder="Full Name"
                    value={formData.customerName}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    placeholder="Phone"
                    value={formData.customerPhone}
                    onChange={(e) => handleChange("customerPhone", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Email & DOB */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.customerEmail}
                    onChange={(e) => handleChange("customerEmail", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.customerDateOfBirth}
                    onChange={(e) => handleChange("customerDateOfBirth", e.target.value)}
                    bg={inputBg} borderColor={borderColor}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Address */}
              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Full Address"
                  value={formData.customerAddress}
                  onChange={(e) => handleChange("customerAddress", e.target.value)}
                  bg={inputBg} borderColor={borderColor}
                />
              </FormControl>

              {/* Account ID (Optional) */}
              <FormControl>
                <FormLabel>Linked Account ID (Optional)</FormLabel>
                <Input
                  placeholder="Enter Account ID to link"
                  value={formData.accountId}
                  onChange={(e) => handleChange("accountId", e.target.value)}
                  bg={inputBg} borderColor={borderColor}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Leave empty if this customer has no login account.
                </Text>
              </FormControl>

            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={isEdit ? handleUpdate : handleAdd}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onClose} _hover={{ bg: "whiteAlpha.200" }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CustomerManagementPage;