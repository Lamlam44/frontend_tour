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

        <Box overflowX="auto">
          <Table variant='simple' colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID / Account</Th>
                <Th color="gray.400">Customer Info</Th>
                <Th color="gray.400">Contact</Th>
                <Th color="gray.400">Address</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.customerId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Box>
                        <Text fontSize="sm" fontWeight="bold" color="blue.300">{customer.customerId}</Text>
                        {customer.account ? (
                          <Badge colorScheme="green" mt={1} borderRadius="full" px={2}>
                            Acc: {customer.account.username}
                          </Badge>
                        ) : (
                          <Badge colorScheme="gray" mt={1} borderRadius="full" px={2}>
                            No Account
                          </Badge>
                        )}
                    </Box>
                  </Td>
                  
                  <Td>
                    <HStack mb={1}>
                        <Icon as={FaUser} color="gray.400" w={3} h={3} />
                        <Text fontWeight="bold">{customer.customerName}</Text>
                    </HStack>
                    <HStack>
                        <Icon as={FaBirthdayCake} color="pink.400" w={3} h={3} />
                        <Text fontSize="sm" color="gray.300">
                            {customer.customerDateOfBirth ? new Date(customer.customerDateOfBirth).toLocaleDateString('vi-VN') : "N/A"}
                        </Text>
                    </HStack>
                  </Td>
                  
                  <Td>
                    <Box>
                        <HStack mb={1}>
                            <Icon as={FaEnvelope} color="yellow.400" w={3} h={3}/>
                            <Text fontSize="sm">{customer.customerEmail}</Text>
                        </HStack>
                        <HStack>
                            <Icon as={FaPhone} color="green.400" w={3} h={3}/>
                            <Text fontSize="sm">{customer.customerPhone}</Text>
                        </HStack>
                    </Box>
                  </Td>
                  
                  <Td>
                    <HStack>
                        <Icon as={FaMapMarkerAlt} color="red.400" />
                        <Text fontSize="sm" noOfLines={2} maxW="200px">{customer.customerAddress}</Text>
                    </HStack>
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