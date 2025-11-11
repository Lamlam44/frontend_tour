import React, { useState } from "react";
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
} from "@chakra-ui/react";

const PromotionSettingPage = () => {
  const [promotions, setPromotions] = useState([
    {
      id: "P001",
      name: "Giảm 10% Tour Phú Quốc",
      discount: "10%",
      description: "Áp dụng cho tour Phú Quốc",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    },
    {
      id: "P002",
      name: "Ưu đãi Noel 2025",
      discount: "15%",
      description: "Giảm giá dịp lễ Noel",
      startDate: "2025-12-20",
      endDate: "2025-12-31",
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newPromo, setNewPromo] = useState({
    id: "",
    name: "",
    discount: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleSave = () => {
    if (
      !newPromo.id ||
      !newPromo.name ||
      !newPromo.discount ||
      !newPromo.description ||
      !newPromo.startDate ||
      !newPromo.endDate
    )
      return alert("Vui lòng nhập đầy đủ thông tin!");
    setPromotions([...promotions, newPromo]);
    setNewPromo({
      id: "",
      name: "",
      discount: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    onClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  return (
    <Box p={6} bg="navy.900" color="white" borderRadius="2xl">
      <Heading size="md" mb={6} color="white">
        Promotion Management
      </Heading>

      <Box bg="navy.800" p={6} borderRadius="2xl">
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Heading size="sm">Promotion List</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Add New Promotion
          </Button>
        </Box>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">NAME</Th>
              <Th color="white">DISCOUNT</Th>
              <Th color="white">DESCRIPTION</Th>
              <Th color="white">START DATE</Th>
              <Th color="white">END DATE</Th>
              <Th color="white">ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {promotions.map((promo) => (
              <Tr key={promo.id}>
                <Td>{promo.id}</Td>
                <Td>{promo.name}</Td>
                <Td>{promo.discount}</Td>
                <Td>{promo.description}</Td>
                <Td>{promo.startDate}</Td>
                <Td>{promo.endDate}</Td>
                <Td>
                  <HStack>
                    <Button colorScheme="yellow" size="sm">
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(promo.id)}
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

      {/* Modal form thêm khuyến mãi */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Promotion</ModalHeader>
          <ModalCloseButton />
            <ModalBody>
                <Input
                    placeholder="ID"
                    mb={3}
                    value={newPromo.id}
                    onChange={(e) => setNewPromo({ ...newPromo, id: e.target.value })}
                />
                <Input
                    placeholder="Name"
                    mb={3}
                    value={newPromo.name}
                    onChange={(e) =>
                    setNewPromo({ ...newPromo, name: e.target.value })
                    }
                />
                <Input
                    placeholder="Discount"
                    mb={3}
                    value={newPromo.discount}
                    onChange={(e) =>
                    setNewPromo({ ...newPromo, discount: e.target.value })
                    }
                />
                {/* Dùng Textarea cho Description */}
                <Textarea
                    placeholder="Description"
                    mb={3}
                    size="sm"
                    value={newPromo.description}
                    onChange={(e) =>
                    setNewPromo({ ...newPromo, description: e.target.value })
                    }
                    rows={3} // số dòng hiển thị ban đầu
                />
                <Input
                    type="date"
                    mb={3}
                    value={newPromo.startDate}
                    onChange={(e) =>
                    setNewPromo({ ...newPromo, startDate: e.target.value })
                    }
                />
                <Input
                    type="date"
                    mb={3}
                    value={newPromo.endDate}
                    onChange={(e) =>
                    setNewPromo({ ...newPromo, endDate: e.target.value })
                    }
                />
            </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PromotionSettingPage;
