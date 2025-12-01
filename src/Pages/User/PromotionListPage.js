import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getPromotions } from '../../services/api';

// Import Chakra UI components cho Modal đẹp
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Box,
  Badge,
  Image,
  SimpleGrid,
  Flex,
  Icon,
  Divider
} from "@chakra-ui/react";
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';

function PromotionListPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPromo, setSelectedPromo] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getPromotions();
        setPromotions(data);
      } catch (error) {
        setError('Không thể tải danh sách khuyến mãi.');
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // --- LOGIC LẤY ẢNH HIỂN THỊ ---
  const getPromoDisplayImage = (promo) => {
    // 1. Nếu promotion có danh sách tour áp dụng
    if (promo.appliedTours && promo.appliedTours.length > 0) {
        // Lấy tour đầu tiên (vì Set chuyển thành Array trong JSON)
        const firstTour = promo.appliedTours[0];
        // Nếu tour đó có ảnh -> Dùng ảnh đó
        if (firstTour.image && firstTour.image.trim() !== "") {
            return firstTour.image;
        }
    }
    // 2. Fallback: Ảnh mặc định đẹp hơn placeholder xám
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop'; 
  };

  const handleCardClick = (promo) => {
    setSelectedPromo(promo);
    onOpen();
  };

  const handleNavigateToTour = (tourId) => {
    onClose();
    navigate(`/tours/${tourId}`);
  };

  const renderContent = () => {
    if (loading) return <p style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (promotions.length === 0) return <p style={{textAlign: 'center'}}>Hiện chưa có chương trình khuyến mãi nào.</p>;

    return (
      <div className={styles.grid}>
        {promotions.map(promo => {
          const displayImage = getPromoDisplayImage(promo);
          
          return (
            <div 
                key={promo.promotionId} 
                className={styles.card}
                onClick={() => handleCardClick(promo)}
                style={{ cursor: 'pointer' }} // Thêm con trỏ tay
            >
              <img 
                src={displayImage} 
                alt={promo.promotionName} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }}
              />
              
              <div className={styles.cardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{promo.promotionName}</h3>
                    <Badge colorScheme="red" fontSize="0.9em" borderRadius="md" px={2}>
                        -{promo.discountPercentage}%
                    </Badge>
                </div>
                
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {promo.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '0.85rem' }}>
                    <FaCalendarAlt style={{ marginRight: '5px' }} />
                    {new Date(promo.endDate).toLocaleDateString('vi-VN')} (Hết hạn)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Săn Deal Hot - Vi Vu Giá Rẻ</h1>
          <p>Khám phá các chương trình khuyến mãi hấp dẫn nhất dành riêng cho bạn</p>
        </div>
        
        {renderContent()}

        {/* --- MODAL CHI TIẾT KHUYẾN MÃI --- */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent borderRadius="xl" overflow="hidden">
                {selectedPromo && (
                    <>
                        {/* Header Modal có ảnh nền */}
                        <Box 
                            bgImage={`url(${getPromoDisplayImage(selectedPromo)})`}
                            bgSize="cover"
                            bgPosition="center"
                            h="150px"
                            position="relative"
                        >
                            <Box 
                                position="absolute" 
                                top="0" left="0" w="100%" h="100%" 
                                bg="blackAlpha.600" 
                                display="flex" 
                                alignItems="flex-end" 
                                p={6}
                            >
                                <Box>
                                    <Badge colorScheme="yellow" mb={2} fontSize="md">
                                        GIẢM {selectedPromo.discountPercentage}%
                                    </Badge>
                                    <Text color="white" fontSize="2xl" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.5)">
                                        {selectedPromo.promotionName}
                                    </Text>
                                </Box>
                            </Box>
                            <ModalCloseButton color="white" size="lg" />
                        </Box>

                        <ModalBody py={6}>
                            <VStack align="stretch" spacing={4}>
                                {/* Thời gian áp dụng */}
                                <Flex align="center" bg="blue.50" p={3} borderRadius="md" color="blue.700">
                                    <Icon as={FaCalendarAlt} mr={2} />
                                    <Text fontWeight="bold">Thời gian áp dụng:</Text>
                                    <Text ml={2}>
                                        {new Date(selectedPromo.startDate).toLocaleDateString('vi-VN')} 
                                        {' - '} 
                                        {new Date(selectedPromo.endDate).toLocaleDateString('vi-VN')}
                                    </Text>
                                </Flex>

                                {/* Mô tả */}
                                <Box>
                                    <Text fontWeight="bold" mb={1} fontSize="lg">Chi tiết ưu đãi</Text>
                                    <Text color="gray.600" style={{ whiteSpace: 'pre-line' }}>
                                        {selectedPromo.description}
                                    </Text>
                                </Box>

                                <Divider />

                                {/* Danh sách Tour áp dụng */}
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="lg" display="flex" alignItems="center">
                                        <Icon as={FaTag} mr={2} color="red.500" />
                                        Áp dụng cho các Tour sau:
                                    </Text>
                                    
                                    {selectedPromo.appliedTours && selectedPromo.appliedTours.length > 0 ? (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                            {selectedPromo.appliedTours.map((tour) => (
                                                <Box 
                                                    key={tour.id} 
                                                    border="1px solid" 
                                                    borderColor="gray.200" 
                                                    borderRadius="lg" 
                                                    overflow="hidden"
                                                    _hover={{ shadow: 'md', borderColor: 'blue.300', transform: 'translateY(-2px)' }}
                                                    transition="all 0.2s"
                                                    bg="white"
                                                >
                                                    <Image 
                                                        src={tour.image || 'https://via.placeholder.com/150'} 
                                                        h="100px" w="100%" objectFit="cover" 
                                                    />
                                                    <Box p={3}>
                                                        <Text fontWeight="bold" fontSize="sm" noOfLines={2} mb={2} minH="40px">
                                                            {tour.name}
                                                        </Text>
                                                        <Button 
                                                            size="sm" 
                                                            colorScheme="blue" 
                                                            width="100%" 
                                                            rightIcon={<FaArrowRight />}
                                                            onClick={() => handleNavigateToTour(tour.id)}
                                                        >
                                                            Xem & Đặt Tour
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    ) : (
                                        <Text color="gray.500" fontStyle="italic">
                                            Chưa có tour cụ thể nào được gán. Vui lòng liên hệ để biết thêm chi tiết.
                                        </Text>
                                    )}
                                </Box>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>Đóng</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
      </div>
      <Footer />
    </div>
  );
}

// Helper component nhỏ để căn chỉnh layout trong ModalBody
const VStack = ({ children, spacing = 0, align = 'stretch', ...props }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing * 4}px`, alignItems: align === 'stretch' ? 'stretch' : align, ...props }}>
        {children}
    </div>
);

export default PromotionListPage;