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
} from "@chakra-ui/react";
import axios from "axios";

const API_ACCOUNTS = "http://localhost:8080/api/accounts";
const API_ROLES = "http://localhost:8080/api/account-roles";

const AccountManagementPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        roleId: "",
        status: true,
    });

    const [editId, setEditId] = useState(null);

    // Load accounts và roles
    const loadAccounts = async () => {
        try {
            const res = await axios.get(API_ACCOUNTS);
            setAccounts(res.data);
        } catch (err) {
            console.error("Lỗi load accounts", err);
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách tài khoản",
                status: "error",
                duration: 3000,
            });
        }
    };

    const loadRoles = async () => {
        try {
            const res = await axios.get(API_ROLES);
            console.log("Loaded roles:", res.data);
            setRoles(res.data);
        } catch (err) {
            console.error("Lỗi load roles", err);
        }
    };

    useEffect(() => {
        loadAccounts();
        loadRoles();
    }, []);

    // Tạo mới hoặc cập nhật
    const handleSubmit = async () => {
        // Validation
        if (!formData.username || !formData.roleId) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin (Username và Role)",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (!isEdit && !formData.password) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập mật khẩu",
                status: "error",
                duration: 3000,
            });
            return;
        }

        console.log("Submitting data:", formData);

        try {
            if (isEdit) {
                await axios.put(`${API_ACCOUNTS}/${editId}`, formData);
                toast({
                    title: "Thành công",
                    description: "Cập nhật tài khoản thành công",
                    status: "success",
                    duration: 3000,
                });
            } else {
                await axios.post(API_ACCOUNTS, formData);
                toast({
                    title: "Thành công",
                    description: "Tạo tài khoản mới thành công",
                    status: "success",
                    duration: 3000,
                });
            }
            loadAccounts();
            onClose();
            resetForm();
        } catch (err) {
            console.error("Lỗi submit", err);
            console.error("Response data:", err.response?.data);
            
            // Xử lý lỗi validation từ backend
            let errorMessage = "Có lỗi xảy ra";
            
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Lấy tất cả các lỗi validation
                const validationErrors = err.response.data.errors
                    .map(error => error.defaultMessage)
                    .join(", ");
                errorMessage = validationErrors;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            toast({
                title: "Lỗi",
                description: errorMessage,
                status: "error",
                duration: 5000,
            });
        }
    };

    // Xóa tài khoản
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
        try {
            await axios.delete(`${API_ACCOUNTS}/${id}`);
            toast({
                title: "Thành công",
                description: "Xóa tài khoản thành công",
                status: "success",
                duration: 3000,
            });
            loadAccounts();
        } catch (err) {
            console.error("Lỗi delete", err);
            toast({
                title: "Lỗi",
                description: "Không thể xóa tài khoản",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Mở form edit
    const openEdit = (account) => {
        setIsEdit(true);
        setEditId(account.accountId);
        setFormData({
            username: account.username,
            password: "", // Để trống, user sẽ nhập mật khẩu mới
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
                Quản Lý Tài Khoản
            </Heading>

            <Box bg="navy.800" p={6} borderRadius="2xl">
                <Box display="flex" justifyContent="space-between" mb={4}>
                    <Heading size="sm">Danh Sách Tài Khoản</Heading>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            resetForm();
                            onOpen();
                        }}
                    >
                        Thêm Tài Khoản Mới
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
                                <Td>{new Date(account.accountCreatedAt).toLocaleDateString('vi-VN')}</Td>
                                <Td>
                                    <HStack>
                                        <Button
                                            colorScheme="yellow"
                                            size="sm"
                                            onClick={() => openEdit(account)}
                                        >
                                            Sửa
                                        </Button>

                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() => handleDelete(account.accountId)}
                                        >
                                            Xóa
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
                <ModalContent bg="navy.800" color="white">
                    <ModalHeader>
                        {isEdit ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="Nhập username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                bg="navy.700"
                                border="none"
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Password {isEdit && "(Để trống nếu không đổi)"}</FormLabel>
                            <Input
                                type="password"
                                placeholder="Nhập password (tối thiểu 6 ký tự)"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                bg="navy.700"
                                border="none"
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Role</FormLabel>
                            <Select
                                placeholder="Chọn role"
                                value={formData.roleId}
                                onChange={(e) =>
                                    setFormData({ ...formData, roleId: e.target.value })
                                }
                                bg="navy.700"
                                border="none"
                            >
                                {roles.map((role) => (
                                    <option key={role.accountRoleId} value={role.accountRoleId} style={{ background: '#1a365d' }}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={formData.status ? "true" : "false"}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value === "true" })
                                }
                                bg="navy.700"
                                border="none"
                            >
                                <option value="true" style={{ background: '#1a365d' }}>Active</option>
                                <option value="false" style={{ background: '#1a365d' }}>Inactive</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            {isEdit ? "Cập Nhật" : "Tạo Mới"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AccountManagementPage;