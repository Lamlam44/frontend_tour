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
  Badge,
  useToast,
  FormControl,
  FormLabel,
  SimpleGrid,
  Icon,
  Text,
  InputGroup,
  InputRightElement,
  Switch,
  Flex
} from "@chakra-ui/react";
import { FaUser, FaLock, FaUserTag, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  getAccounts,
  getAccountRoles,
  addAccount,
  updateAccount,
  deleteAccount,
  getCustomers, 
  deleteCustomer
} from "../../services/api";

const AccountManagementPage = () => {
  // --- STATE ---
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Design System Colors
  const bgColor = "navy.900";
  const cardBg = "navy.800";
  const modalBg = "gray.800";
  const inputBg = "gray.700";
  const borderColor = "gray.600";
  const hoverBg = "navy.700";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    status: true,
  });

  // --- API CALLS ---
  const loadData = async () => {
    try {
        const [accountsData, rolesData] = await Promise.all([
            getAccounts(),
            getAccountRoles()
        ]);
        setAccounts(accountsData);
        setRoles(rolesData);
    } catch (err) {
      console.error("Error loading data", err);
      toast({
        title: "Error loading data",
        description: "Check console for details.",
        status: "error",
        duration: 3000,
        isClosable: true,
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
      username: "",
      password: "",
      roleId: "",
      status: true,
    });
    setIsEdit(false);
    setEditId(null);
    setShowPassword(false);
  };

  const validateForm = () => {
    if (!formData.username || !formData.roleId) {
        toast({ title: "Username and Role are required.", status: "warning", duration: 3000 });
        return false;
    }
    // Validate password logic
    if (!isEdit && !formData.password) {
        toast({ title: "Password is required for new accounts.", status: "warning", duration: 3000 });
        return false;
    }
    if (formData.password && formData.password.length < 6) {
        toast({ title: "Password must be at least 6 characters.", status: "warning", duration: 3000 });
        return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      await addAccount(formData);
      toast({ title: "Account created successfully", status: "success", duration: 3000 });
      onClose();
      loadData();
      resetForm();
    } catch (err) {
      console.error("Error adding account", err);
      toast({ 
        title: "Error adding account", 
        description: err.response?.data?.message || err.message, 
        status: "error", 
        duration: 5000 
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      // Backend DTO yêu cầu password @NotBlank. 
      // Nếu user không nhập password mới, form sẽ gửi chuỗi rỗng và gây lỗi 400.
      // Do không được sửa Backend, nếu user để trống, ta sẽ cảnh báo họ.
      if (!formData.password) {
          toast({ 
            title: "Backend Constraint", 
            description: "Password is required for update due to system security policy.", 
            status: "warning", 
            duration: 5000 
          });
          return;
      }

      await updateAccount(editId, formData);
      toast({ title: "Account updated successfully", status: "success", duration: 3000 });
      onClose();
      loadData();
      resetForm();
    } catch (err) {
      console.error("Error updating account", err);
      toast({ 
        title: "Error updating account", 
        description: err.response?.data?.message || err.message, 
        status: "error", 
        duration: 5000 
      });
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm("Are you sure? This will also delete any linked Customer data.")) return;

    try {
        // 1. Tìm và xóa Customer liên kết trước (Logic từ code cũ của bạn)
        try {
            const customers = await getCustomers();
            const associatedCustomer = customers.find(c => c.account?.accountId === accountId);
            
            if (associatedCustomer) {
                await deleteCustomer(associatedCustomer.customerId);
                console.log("Deleted associated customer:", associatedCustomer.customerId);
            }
        } catch (custErr) {
            console.warn("Could not check/delete associated customer", custErr);
            // Vẫn tiếp tục xóa account
        }

        // 2. Xóa Account
        await deleteAccount(accountId);
        toast({ title: "Account deleted successfully", status: "success", duration: 3000 });
        loadData();
    } catch (err) {
      console.error("Error deleting account", err);
      toast({ title: "Cannot delete account", status: "error", duration: 3000 });
    }
  };

  const openEdit = (acc) => {
    setIsEdit(true);
    setEditId(acc.accountId);
    setFormData({
      username: acc.username || "",
      password: "", // Không thể lấy mật khẩu cũ, user phải nhập mới nếu muốn đổi
      roleId: acc.role?.accountRoleId || "",
      status: acc.status,
    });
    onOpen();
  };

  // --- RENDER ---
  return (
    <Box p={6} bg={bgColor} color="white" borderRadius="2xl" minH="100vh">
      <Heading size="md" mb={6}>Account Management</Heading>

      <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
        <Flex justify='space-between' align='center' mb='20px'>
          <Heading size="sm">System Accounts</Heading>
          <Button 
            colorScheme='blue' 
            onClick={() => { resetForm(); onOpen(); }}
            size="md"
          >
            Add New Account
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant='simple' colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">ID / Username</Th>
                <Th color="gray.400">Role</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Created At</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accounts.map((acc) => (
                <Tr key={acc.accountId} _hover={{ bg: hoverBg }}>
                  <Td>
                    <Box>
                        <Text fontSize="xs" color="gray.500">{acc.accountId}</Text>
                        <HStack mt={1}>
                            <Icon as={FaUser} color="blue.300" />
                            <Text fontWeight="bold" fontSize="md">{acc.username}</Text>
                        </HStack>
                    </Box>
                  </Td>
                  
                  <Td>
                    <Badge 
                        colorScheme={acc.role?.roleName === 'ROLE_ADMIN' ? 'red' : 'green'}
                        variant="subtle"
                        px={2} py={1} borderRadius="md"
                    >
                        <HStack spacing={1}>
                            <Icon as={FaUserTag} />
                            <Text>{acc.role?.roleName || 'N/A'}</Text>
                        </HStack>
                    </Badge>
                  </Td>
                  
                  <Td>
                    {acc.status ? (
                        <Badge colorScheme="green" borderRadius="full" px={2}><Icon as={FaCheckCircle} mr={1}/> Active</Badge>
                    ) : (
                        <Badge colorScheme="red" borderRadius="full" px={2}><Icon as={FaTimesCircle} mr={1}/> Inactive</Badge>
                    )}
                  </Td>

                  <Td fontSize="sm" color="gray.300">
                    {new Date(acc.accountCreatedAt).toLocaleDateString('vi-VN')}
                  </Td>
                  
                  <Td>
                    <HStack>
                      <Button colorScheme="yellow" size="sm" onClick={() => openEdit(acc)}>Edit</Button>
                      <Button colorScheme="red" size="sm" onClick={() => handleDelete(acc.accountId)}>Delete</Button>
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
          <ModalHeader>{isEdit ? "Edit Account" : "Add New Account"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>
                
                <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <InputGroup>
                        <Input
                          placeholder="e.g. admin_user"
                          value={formData.username}
                          onChange={(e) => handleChange("username", e.target.value)}
                          bg={inputBg} borderColor={borderColor}
                          isReadOnly={isEdit} // Thường không cho sửa username
                          _readOnly={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                        <InputRightElement children={<Icon as={FaUser} color="gray.500" />} />
                    </InputGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>
                        Password {isEdit && <Text as="span" fontSize="xs" color="yellow.300">(Required for update)</Text>}
                    </FormLabel>
                    <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={isEdit ? "Enter new password" : "Enter password"}
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          bg={inputBg} borderColor={borderColor}
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} bg="transparent">
                                {showPassword ? <FaEyeSlash color="white"/> : <FaEye color="white"/>}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Role</FormLabel>
                        <Select
                            placeholder="Select Role"
                            value={formData.roleId}
                            onChange={(e) => handleChange("roleId", e.target.value)}
                            bg={inputBg} borderColor={borderColor}
                        >
                            {roles.map((role) => (
                                <option style={{backgroundColor: '#2D3748'}} key={role.accountRoleId} value={role.accountRoleId}>
                                    {role.roleName}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">
                            Status: <Badge ml={2} colorScheme={formData.status ? "green" : "red"}>{formData.status ? "Active" : "Inactive"}</Badge>
                        </FormLabel>
                        <Switch 
                            id="status-switch" 
                            isChecked={formData.status} 
                            onChange={(e) => handleChange("status", e.target.checked)}
                            colorScheme="green"
                            ml="auto"
                        />
                    </FormControl>
                </SimpleGrid>

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

export default AccountManagementPage;