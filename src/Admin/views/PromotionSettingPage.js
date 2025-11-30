import React, { useState, useEffect, useMemo } from "react";
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
  Textarea,
  FormControl,
  FormLabel,
  Tag,
  Wrap,
  WrapItem,
  Text,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import {
  getPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getTours,
} from "../../services/api";

const PromotionSettingPage = () => {
  const [promotions, setPromotions] = useState([]);
  // Modal states
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const [isEdit, setIsEdit] = useState(false);
  const [tours, setTours] = useState([]);
  const [selectedTours, setSelectedTours] = useState([]); // For Form
  const [viewingPromo, setViewingPromo] = useState(null); // For Detail View

  const [formData, setFormData] = useState({
    promotionName: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [editId, setEditId] = useState(null);

  // Styling for Dark Mode
  const tableBg = "navy.800";
  const hoverBg = "navy.700";
  const modalBg = "gray.800";
  const textColor = "white";

  // React Select Options
  const tourOptions = useMemo(() =>
    tours.map(tour => ({ value: tour.tourId, label: tour.tourName })),
    [tours]
  );

  // Custom Styles for Chakra-React-Select in Dark Mode
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2D3748", // gray.700
      borderColor: "#4A5568", // gray.600
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1A202C", // gray.900
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#3182CE" : "transparent",
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#3182CE", // blue.500
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ':hover': {
        backgroundColor: "#E53E3E", // red.500
        color: "white",
      },
    }),
  };

  const loadPromotions = async () => {
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error("Lỗi load promotions", err);
    }
  };

  const loadToursList = async () => {
    try {
      const data = await getTours();
      setTours(data);
    } catch (err) {
      console.error("Lỗi load tours", err);
    }
  };

  useEffect(() => {
    loadPromotions();
    loadToursList();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // --- ACTIONS ---
  const handleAdd = async () => {
    try {
      const payload = {
        ...formData,
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        tourIds: selectedTours.map(tour => tour.value),
      };
      await addPromotion(payload);
      onFormClose();
      loadPromotions();
      resetForm();
    } catch (err) {
      console.error("Lỗi thêm promotion", err);
      alert("Lỗi khi thêm khuyến mãi!");
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        tourIds: selectedTours.map(tour => tour.value),
      };
      await updatePromotion(editId, payload);
      onFormClose();
      loadPromotions();
      resetForm();
    } catch (err) {
      console.error("Lỗi update promotion", err);
      alert("Lỗi khi cập nhật khuyến mãi!");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Ngăn sự kiện double click của row
    if (!window.confirm("Bạn có muốn xóa khuyến mãi này?")) return;
    try {
      await deletePromotion(id);
      loadPromotions();
    } catch (err) {
      console.error("Lỗi xóa promotion", err);
      alert("Không thể xóa!");
    }
  };

  const openEdit = (promo, e) => {
    e.stopPropagation(); // Ngăn sự kiện double click
    setIsEdit(true);
    setEditId(promo.promotionId);

    setFormData({
      promotionName: promo.promotionName,
      discountPercentage: promo.discountPercentage,
      description: promo.description,
      startDate: promo.startDate,
      endDate: promo.endDate,
    });

    // Map tours từ object trả về (có id, name) sang format của Select
    // Lưu ý: PromotionResponseDTO trả về appliedTours là Set<Map<String, String>>
    const currentTours = promo.appliedTours?.map(tourMap => ({
        value: tourMap.id,
        label: tourMap.name
    })) || [];
    
    // Fallback nếu backend trả về cấu trúc cũ (List object tour)
    const legacyTours = promo.tours?.map(tour => ({
        value: tour.tourId,
        label: tour.tourName
    })) || [];

    setSelectedTours(currentTours.length > 0 ? currentTours : legacyTours);
    onFormOpen();
  };

  const resetForm = () => {
    setIsEdit(false);
    setFormData({
      promotionName: "",
      discountPercentage: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    setSelectedTours([]);
  };

  // --- DETAIL VIEW LOGIC ---
  const handleRowDoubleClick = (promo) => {
    setViewingPromo(promo);
    onDetailOpen();
  };

  return (
    <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
      <Heading size="md" mb={6} color="white">
        Promotion Management
      </Heading>

      <Box bg={tableBg} p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Promotion List</Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              resetForm();
              onFormOpen();
            }}
          >
            Add New Promotion
          </Button>
        </Box>
        
        <Text fontSize="sm" fontStyle="italic" color="gray.400" mb={2}>
          * Double-click on a row to view Applied Tours details.
        </Text>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="gray.400">ID</Th>
              <Th color="gray.400">NAME</Th>
              <Th color="gray.400" isNumeric>DISCOUNT</Th>
              <Th color="gray.400">DESCRIPTION</Th>
              <Th color="gray.400">DURATION</Th>
              {/* Đã ẨN cột APPLIED TOURS ở đây */}
              <Th color="gray.400">ACTIONS</Th>
            </Tr>
          </Thead>

          <Tbody>
            {promotions.map((promo) => (
              <Tr 
                key={promo.promotionId} 
                _hover={{ bg: hoverBg, cursor: "pointer" }}
                onDoubleClick={() => handleRowDoubleClick(promo)}
              >
                <Td>{promo.promotionId}</Td>
                <Td fontWeight="bold" color="blue.300">{promo.promotionName}</Td>
                <Td isNumeric>
                    <Badge colorScheme="green" fontSize="0.9em">
                        {promo.discountPercentage}%
                    </Badge>
                </Td>
                <Td maxW="300px" isTruncated>{promo.description}</Td>
                <Td fontSize="sm">
                    {promo.startDate} <br/> ➝ {promo.endDate}
                </Td>

                <Td>
                  <HStack>
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={(e) => openEdit(promo, e)}
                    >
                      Edit
                    </Button>

                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={(e) => handleDelete(promo.promotionId, e)}
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

      {/* MODAL THÊM / SỬA */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
          <ModalHeader>{isEdit ? "Edit Promotion" : "Add New Promotion"}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl mb={4} isRequired>
                <FormLabel>Promotion Name</FormLabel>
                <Input
                  placeholder="e.g. Summer Sale 2024"
                  value={formData.promotionName}
                  onChange={(e) => handleChange("promotionName", e.target.value)}
                />
            </FormControl>

            <FormControl mb={4} isRequired>
                <FormLabel>Discount Percentage (%)</FormLabel>
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={formData.discountPercentage}
                  onChange={(e) => handleChange("discountPercentage", e.target.value)}
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Promotion details..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
            </FormControl>

            <HStack mb={4}>
                <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                </FormControl>
            </HStack>

            <FormControl mb={4}>
                <FormLabel fontWeight="bold" color="blue.300">Applied Tours (Multi-select)</FormLabel>
                <Select
                    isMulti
                    name="tours"
                    options={tourOptions}
                    placeholder="Search and select tours..."
                    closeMenuOnSelect={false}
                    value={selectedTours}
                    onChange={setSelectedTours}
                    chakraStyles={selectStyles}
                />
                <Text fontSize="xs" color="gray.400" mt={1}>
                    * You can search by tour name and select multiple tours.
                </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={isEdit ? handleUpdate : handleAdd}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onFormClose} _hover={{ bg: "whiteAlpha.200" }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL CHI TIẾT (VIEW DETAILS) */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg} color="white">
            <ModalHeader borderBottomWidth="1px" borderColor="gray.600">
                Promotion Details: {viewingPromo?.promotionName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <Box mb={4}>
                    <Text fontWeight="bold" color="gray.400" mb={1}>Applied Tours List:</Text>
                    {/* Hiển thị danh sách tours dạng Tags hoặc List */}
                    <Wrap spacing={2}>
                        {/* Hỗ trợ cả 2 format dữ liệu cũ và mới để an toàn */}
                        {(viewingPromo?.appliedTours || viewingPromo?.tours || []).length > 0 ? (
                            (viewingPromo?.appliedTours || viewingPromo?.tours).map((tour, idx) => (
                                <WrapItem key={idx}>
                                    <Tag size="lg" variant="solid" colorScheme="blue" borderRadius="full">
                                        {tour.name || tour.tourName} 
                                    </Tag>
                                </WrapItem>
                            ))
                        ) : (
                            <Text color="gray.500" fontStyle="italic">No tours applied yet.</Text>
                        )}
                    </Wrap>
                </Box>
                <Box>
                    <Text fontWeight="bold" color="gray.400" mb={1}>Full Description:</Text>
                    <Text>{viewingPromo?.description}</Text>
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" onClick={onDetailClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PromotionSettingPage;