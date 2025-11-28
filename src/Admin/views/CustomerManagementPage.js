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
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/api";
import Card from '../../Admin/components/card/Card';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerDateOfBirth: "",
    accountId: "",
  });

  const [editId, setEditId] = useState(null);

  const textColor = useColorModeValue('white');

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Lỗi load customers", err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    try {
      await addCustomer(formData);
      onClose();
      loadCustomers();
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        customerDateOfBirth: "",
        accountId: "",
      });
    } catch (err) {
      console.error("Lỗi thêm customer", err);
      alert("Lỗi khi thêm customer!");
    }
  };

  const openEdit = (customer) => {
    setIsEdit(true);
    setEditId(customer.customerId);

    setFormData({
        customerName: customer.customerName,
        customerEmail: customer.customerEmail,
        customerPhone: customer.customerPhone,
        customerAddress: customer.customerAddress,
        customerDateOfBirth: customer.customerDateOfBirth || "",
        accountId: customer.account?.accountId || "",
    });

    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await updateCustomer(editId, formData);
      onClose();
      loadCustomers();
      setIsEdit(false);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        customerDateOfBirth: "",
        accountId: "",
      });
    } catch (err) {
      console.error("Lỗi update customer", err);
      alert("Lỗi khi cập nhật customer!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa customer này?")) return;
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      console.error("Lỗi xóa customer", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Box marginTop={100}>
      <Card>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text fontSize='xl' fontWeight='bold' color={textColor}>
            Customer Management
          </Text>
          <Button colorScheme='blue' onClick={() => {
              setIsEdit(false);
              setFormData({
                customerName: "",
                customerEmail: "",
                customerPhone: "",
                customerAddress: "",
                customerDateOfBirth: "",
                accountId: "",
              });
              onOpen();
            }}>Add New Customer</Button>
        </Flex>
        <Box mt='20px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th color={textColor}>ID</Th>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Email</Th>
                <Th color={textColor}>Phone</Th>
                <Th color={textColor}>Address</Th>
                <Th color={textColor}>Date of Birth</Th>
                <Th color={textColor}>Account</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.customerId}>
                  <Td color={textColor}>{customer.customerId}</Td>
                  <Td color={textColor}>{customer.customerName}</Td>
                  <Td color={textColor}>{customer.customerEmail}</Td>
                  <Td color={textColor}>{customer.customerPhone}</Td>
                  <Td color={textColor}>{customer.customerAddress}</Td>
                  <Td color={textColor}>{customer.customerDateOfBirth || "N/A"}</Td>
                  <Td color={textColor}>
                    {customer.account ? (
                      <Badge colorScheme="green">{customer.account.username}</Badge>
                    ) : (
                      <Badge colorScheme="gray">No Account</Badge>
                    )}
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
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Customer" : "Add New Customer"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Customer Name"
              mb={3}
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              mb={3}
              value={formData.customerEmail}
              onChange={(e) => handleChange("customerEmail", e.target.value)}
            />
            <Input
              placeholder="Phone"
              mb={3}
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
            />
            <Input
              placeholder="Address"
              mb={3}
              value={formData.customerAddress}
              onChange={(e) => handleChange("customerAddress", e.target.value)}
            />
            <Input
              placeholder="Date of Birth"
              type="date"
              mb={3}
              value={formData.customerDateOfBirth}
              onChange={(e) => handleChange("customerDateOfBirth", e.target.value)}
            />
            <Input
              placeholder="Account ID (optional)"
              mb={3}
              value={formData.accountId}
              onChange={(e) => handleChange("accountId", e.target.value)}
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

export default CustomerManagementPage;
