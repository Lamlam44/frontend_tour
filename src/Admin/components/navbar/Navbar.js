
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    IconButton,
    Button,
    HStack,
} from "@chakra-ui/react";
import { FaBars, FaHome, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar(props) {
    const { brandText, onOpenSidebar } = props;
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    let mainText = useColorModeValue("navy.700", "white");
    let navbarBg = useColorModeValue(
        "rgba(244, 247, 254, 0.2)",
        "rgba(11,20,55,0.5)"
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoDashboard = () => {
        navigate('/admin/dashboard');
    };

    // Check if user is admin
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'admin';

    return (
        <Box
            position='fixed'
            boxShadow='none'
            bg={navbarBg}
            borderColor='transparent'
            filter='none'
            backdropFilter='blur(20px)'
            borderWidth='1.5px'
            borderStyle='solid'
            transitionDelay='0s, 0s, 0s, 0s'
            transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
            transition-property='box-shadow, background-color, filter, border'
            transitionTimingFunction='linear, linear, linear, linear'
            alignItems={{ xl: "center" }}
            display='flex'
            minH='75px'
            justifyContent={{ xl: "center" }}
            lineHeight='25.6px'
            mx='auto'
            mt='0px'
            pb='8px'
            right={{ base: "12px", md: "30px", lg: "30px", xl: "30px" }}
            px={{
                sm: "15px",
                md: "10px",
            }}
            ps={{
                xl: "12px",
            }}
            pt='8px'
            top={{ base: "12px", md: "16px", xl: "18px" }}
            w={{
                base: "calc(100vw - 6%)",
                md: "calc(100vw - 8%)",
                lg: "calc(100vw - 6%)",
                xl: "calc(100vw - 350px)",
                "2xl": "calc(100vw - 365px)",
            }}
            zIndex='1000'>
            <Flex
                w='100%'
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mb='0px'>
                <HStack spacing={2}>
                    {/* Hamburger Menu Button - Only visible on mobile */}
                    <IconButton
                        display={{ base: "flex", xl: "none" }}
                        icon={<FaBars />}
                        onClick={onOpenSidebar}
                        variant="ghost"
                        color={mainText}
                        fontSize="xl"
                        aria-label="Open Menu"
                        _hover={{ bg: "whiteAlpha.200" }}
                    />
                    <Text
                        color={mainText}
                        fontSize='xl'
                        fontWeight='bold'
                        lineHeight='100%'>
                        {brandText}
                    </Text>
                </HStack>

                <HStack spacing={2}>
                    {/* Home Button */}
                    <IconButton
                        icon={<FaHome />}
                        onClick={handleGoHome}
                        variant="ghost"
                        color={mainText}
                        fontSize="lg"
                        aria-label="Go to Home"
                        _hover={{ bg: "whiteAlpha.200" }}
                    />

                    {/* Dashboard Button - Only for Admin */}
                    {isAdmin && (
                        <IconButton
                            icon={<FaTachometerAlt />}
                            onClick={handleGoDashboard}
                            variant="ghost"
                            color={mainText}
                            fontSize="lg"
                            aria-label="Go to Dashboard"
                            _hover={{ bg: "whiteAlpha.200" }}
                        />
                    )}

                    {/* Logout Button */}
                    <Button
                        leftIcon={<FaSignOutAlt />}
                        onClick={handleLogout}
                        variant="ghost"
                        color={mainText}
                        fontSize="sm"
                        _hover={{ bg: "whiteAlpha.200" }}
                    >
                        Logout
                    </Button>
                </HStack>
            </Flex>
        </Box >
    );
}
