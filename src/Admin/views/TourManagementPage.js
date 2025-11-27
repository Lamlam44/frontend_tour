import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    Spinner,
    Text,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

// Import các hàm API và component con
import { getTours, deleteTour } from '../../../../services/api';
import TourList from './dataTables/TourList'; // Component đã được sửa đổi

export default function TourManagementPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const textColor = useColorModeValue("gray.700", "white");
    const boxBg = useColorModeValue("white", "navy.800");

    // Hàm để lấy dữ liệu tour từ API
    const fetchTours = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTours();
            setTours(data);
        } catch (err) {
            setError('Không thể tải danh sách tour. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Sử dụng useEffect để gọi API khi component được mount
    useEffect(() => {
        fetchTours();
    }, [fetchTours]);

    // Hàm xử lý xóa tour
    const handleDeleteTour = async (tourId) => {
        try {
            await deleteTour(tourId);
            // Sau khi xóa thành công, tải lại danh sách tour
            await fetchTours();
        } catch (err) {
            setError(`Lỗi khi xóa tour: ${err.message}`);
            console.error(err);
        }
    };

    // Hàm xử lý khi nhấn nút "Thêm Tour" (sẽ được phát triển sau)
    const handleAddTour = () => {
        // TODO: Mở Modal hoặc điều hướng đến trang tạo tour mới
        alert('Chức năng "Thêm Tour" sẽ được triển khai!');
    };

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Flex direction="column" w="100%">
                {/* Header */}
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb="20px"
                    p="4"
                    bg={boxBg}
                    borderRadius="20px"
                    boxShadow="lg"
                >
                    <Heading as="h1" size="lg" color={textColor}>
                        Quản Lý Tour
                    </Heading>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="teal"
                        onClick={handleAddTour}
                    >
                        Thêm Tour Mới
                    </Button>
                </Flex>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <Alert status="error" mb="20px" borderRadius="lg">
                        <AlertIcon />
                        <AlertTitle mr={2}>Lỗi!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Content */}
                <Box
                    p="4"
                    bg={boxBg}
                    borderRadius="20px"
                    boxShadow="lg"
                >
                    {loading ? (
                        <Flex justifyContent="center" alignItems="center" minH="200px">
                            <Spinner size="xl" />
                            <Text ml="4">Đang tải dữ liệu...</Text>
                        </Flex>
                    ) : (
                        // Sử dụng TourList để hiển thị danh sách
                        // Bỏ prop onTourSelect và selectedTour vì không dùng ở đây
                        <TourList
                            tourData={tours}
                            onDelete={handleDeleteTour}
                        />
                    )}
                </Box>
            </Flex>
        </Box>
    );
}
