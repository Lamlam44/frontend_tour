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
    useColorModeValue,
} from "@chakra-ui/react";
import axiosInstance from "../../api/axiosConfig";
import Card from '../../Admin/components/card/Card';

const API_ACCOUNTS = "http://localhost:8080/api/accounts";
const API_ROLES = "http://localhost:8080/api/account-roles";

const AccountManagementPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState(null);
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        roleId: "",
        status: true,
    });

    const [editId, setEditId] = useState(null);

    // Load accounts and roles
    const loadAccounts = async () => {
        try {
            const res = await axiosInstance.get(API_ACCOUNTS);
            setAccounts(res.data);
        } catch (err) {
            console.error("Error loading accounts", err);
            toast({
                title: "Error",
                description: "Unable to load account list",
                status: "error",
                duration: 3000,
            });
        }
    };

    const loadRoles = async () => {
        try {
            const res = await axiosInstance.get(API_ROLES);
            console.log("Loaded roles:", res.data);
            setRoles(res.data);
        } catch (err) {
            console.error("Error loading roles", err);
        }
    };

    useEffect(() => {
        loadAccounts();
        loadRoles();
    }, []);

    // Create new or update
    const handleSubmit = async () => {
        // Validation
        if (!formData.username || !formData.roleId) {
            toast({
                title: "Error",
                description: "Please fill in all required information (Username and Role)",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (!isEdit && !formData.password) {
            toast({
                title: "Error",
                description: "Please enter password",
                status: "error",
                duration: 3000,
            });
            return;
        }

        console.log("Submitting data:", formData);

        try {
            if (isEdit) {
                await axiosInstance.put(`${API_ACCOUNTS}/${editId}`, formData);
                toast({
                    title: "Success",
                    description: "Account updated successfully",
                    status: "success",
                    duration: 3000,
                });
            } else {
                await axiosInstance.post(API_ACCOUNTS, formData);
                toast({
                    title: "Success",
                    description: "Account created successfully",
                    status: "success",
                    duration: 3000,
                });
            }
            loadAccounts();
            onClose();
            resetForm();
        } catch (err) {
            console.error("Error submitting", err);
            console.error("Response data:", err.response?.data);
            
            // Handle validation errors from backend
            let errorMessage = "An error occurred";
            
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Get all validation errors
                const validationErrors = err.response.data.errors
                    .map(error => error.defaultMessage)
                    .join(", ");
                errorMessage = validationErrors;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
            });
        }
    };

    // Open delete confirmation
    const openDeleteConfirm = (id) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    // Delete account
    const handleDelete = async () => {
        try {
            // First, try to find and delete associated customer
            try {
                const customersRes = await axiosInstance.get("http://localhost:8080/api/customers");
                const associatedCustomer = customersRes.data.find(
                    customer => customer.account?.accountId === deleteId
                );
                
                if (associatedCustomer) {
                    await axiosInstance.delete(`http://localhost:8080/api/customers/${associatedCustomer.customerId}`);
                    console.log("Associated customer deleted");
                }
            } catch (customerErr) {
                console.error("Error checking/deleting customer", customerErr);
                // Continue to delete account even if customer deletion fails
            }

            // Then delete the account
            await axiosInstance.delete(`${API_ACCOUNTS}/${deleteId}`);
            toast({
                title: "Success",
                description: "Account deleted successfully",
                status: "success",
                duration: 3000,
            });
            loadAccounts();
            onDeleteClose();
        } catch (err) {
            console.error("Error deleting", err);
            toast({
                title: "Error",
                description: "Unable to delete account",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Open edit form
    const openEdit = (account) => {
        setIsEdit(true);
        setEditId(account.accountId);
        setFormData({
            username: account.username,
            password: "", // Leave empty, user will enter new password
            roleId: account.role?.accountRoleId || "",
            status: account.status,
        });
        onOpen();
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            roleId: "",
            status: true,
        });
        setIsEdit(false);
        setEditId(null);
    };

    return (
        <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
            <Heading size="md" mb={6} color="white">
                Account Management
            </Heading>

            <Box bg="navy.800" p={6} borderRadius="2xl">
                <Box display="flex" justifyContent="space-between" mb={4}>
                    <Heading size="sm">Account List</Heading>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            resetForm();
                            onOpen();
                        }}
                    >
                        Add New Account
                    </Button>
                </Box>

                <Table variant="simple" colorScheme="whiteAlpha">
                    <Thead>
                        <Tr>
                            <Th color="white">ID</Th>
                            <Th color="white">USERNAME</Th>
                            <Th color="white">ROLE</Th>
                            <Th color="white">STATUS</Th>
                            <Th color="white">CREATED AT</Th>
                            <Th color="white">ACTIONS</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {accounts.map((account) => (
                            <Tr key={account.accountId}>
                                <Td>{account.accountId}</Td>
                                <Td>{account.username}</Td>
                                <Td>
                                    <Badge colorScheme={account.role?.roleName === 'ROLE_ADMIN' ? 'red' : 'green'}>
                                        {account.role?.roleName || 'N/A'}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge colorScheme={account.status ? "green" : "red"}>
                                        {account.status ? "Active" : "Inactive"}
                                    </Badge>
                                </Td>
                                <Td>{new Date(account.accountCreatedAt).toLocaleDateString('en-US')}</Td>
                                <Td>
                                    <HStack>
                                        <Button
                                            colorScheme="yellow"
                                            size="sm"
                                            onClick={() => openEdit(account)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() => openDeleteConfirm(account.accountId)}
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

            {/* MODAL FORM */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {isEdit ? "Edit Account" : "Add New Account"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Password {isEdit && "(Leave empty if not changing)"}</FormLabel>
                            <Input
                                type="password"
                                placeholder="Enter password (minimum 6 characters)"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Role</FormLabel>
                            <Select
                                placeholder="Select role"
                                value={formData.roleId}
                                onChange={(e) =>
                                    setFormData({ ...formData, roleId: e.target.value })
                                }
                            >
                                {roles.map((role) => (
                                    <option key={role.accountRoleId} value={role.accountRoleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={formData.status.toString()}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value === "true" })
                                }
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            mr={3}
                            onClick={handleSubmit}
                        >
                            {isEdit ? "Update" : "Save"}
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this account? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AccountManagementPage;