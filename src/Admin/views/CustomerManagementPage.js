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
    name: "",
    email: "",
    phone: "",
    address: "",
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
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Lỗi thêm customer", err);
      alert("Lỗi khi thêm customer!");
    }
  };

  const openEdit = (customer) => {
    setIsEdit(true);
    setEditId(customer.id);

    setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
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
        name: "",
        email: "",
        phone: "",
        address: "",
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
                name: "",
                email: "",
                phone: "",
                address: "",
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
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td color={textColor}>{customer.id}</Td>
                  <Td color={textColor}>{customer.name}</Td>
                  <Td color={textColor}>{customer.email}</Td>
                  <Td color={textColor}>{customer.phone}</Td>
                  <Td color={textColor}>{customer.address}</Td>
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
                        onClick={() => handleDelete(customer.id)}
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
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Email"
              mb={3}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              mb={3}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              placeholder="Address"
              mb={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
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
