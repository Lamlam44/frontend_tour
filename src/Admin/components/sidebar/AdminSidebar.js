import React from "react";
import {
    Box,
    Flex,
    Drawer,
    DrawerBody,
    Icon,
    useColorModeValue,
    DrawerOverlay,
    useDisclosure,
    DrawerContent,
    DrawerCloseButton,
    Text
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
    renderThumb,
    renderTrack,
    renderView,
} from "../../components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
    const { routes } = props;
    let location = useLocation();

    let sidebarBg = useColorModeValue("navy.800");
    let sidebarMargins = "0px";

    const activeColor = useColorModeValue("gray.700");
    const inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
    const activeIcon = useColorModeValue("brand.500");
    const textColor = useColorModeValue("secondaryGray.500");
    const brandColor = useColorModeValue("brand.500", "brand.400");

    const activeRoute = (routeName) => {
        return location.pathname.includes(routeName);
    };

    const createLinks = (routes) => {
        return routes.map((route, index) => {
            if (route.layout === "/admin") {
                return (
                    <NavLink key={index} to={route.layout + route.path}>
                        <Box>
                            <Flex
                                align='center'
                                justifyContent='space-between'
                                w='100%'
                                ps='10px'
                                py='12px'
                                borderRadius='12px'
                                _hover={{ boxShadow: "none" }}
                                bg={activeRoute(route.path) ? 'white' : 'transparent'}
                                mb='5px'>
                                <Flex w='100%' alignItems='center' justifyContent='center'>
                                    <Box
                                        color={activeRoute(route.path) ? activeIcon : textColor}
                                        me='18px'>
                                        {route.icon}
                                    </Box>
                                    <Text
                                        me='auto'
                                        color={activeRoute(route.path) ? activeColor : textColor}
                                        fontWeight={activeRoute(route.path) ? 'bold' : 'normal'}>
                                        {route.name}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                    </NavLink>
                );
            }
            return null;
        });
    };

    return (
        <Box display={{ sm: "none", xl: "block" }} w="100%" position='fixed' minH='100%'>
            <Box
                bg={sidebarBg}
                transition='0.2s linear'
                w='300px'
                h='100vh'
                m={sidebarMargins}
                minH='100%'
                overflowX='hidden'
                boxShadow='14px 17px 40px 4px rgba(112, 144, 176, 0.08)'>
                <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
                    <Box ps='20px' mb='30px'>
                        <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color={brandColor}>
                            TOUR ADMIN
                        </Text>
                    </Box>
                    <Box ps='20px' pe='16px'>
                        {createLinks(routes)}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}

export function SidebarResponsive(props) {
    let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
    let menuColor = useColorModeValue("gray.400", "white");
    // // SIDEBAR
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    const { routes } = props;
    const location = useLocation();
    // let isWindows = navigator.platform.startsWith("Win");
    //  BRAND

    const activeColor = useColorModeValue("gray.700");
    const activeIcon = useColorModeValue("brand.500");
    const textColor = useColorModeValue("secondaryGray.500");

    const activeRoute = (routeName) => {
        return location.pathname.includes(routeName);
    };

    const createLinks = (routes) => {
        return routes.map((route, index) => {
            if (route.layout === "/admin") {
                return (
                    <NavLink key={index} to={route.layout + route.path}>
                        <Flex
                            align='center'
                            justifyContent='space-between'
                            w='100%'
                            ps='10px'
                            py='12px'
                            borderRadius='12px'
                            _hover={{ boxShadow: "none" }}
                            bg={activeRoute(route.path) ? 'white' : 'transparent'}
                            mb='5px'>
                            <Flex w='100%' alignItems='center' justifyContent='center'>
                                <Box
                                    color={activeRoute(route.path) ? activeIcon : textColor}
                                    me='18px'>
                                    {route.icon}
                                </Box>
                                <Text
                                    me='auto'
                                    color={activeRoute(route.path) ? activeColor : textColor}
                                    fontWeight={activeRoute(route.path) ? 'bold' : 'normal'}>
                                    {route.name}
                                </Text>
                            </Flex>
                        </Flex>
                    </NavLink>
                );
            }
            return null;
        });
    };

    return (
        <Flex display={{ sm: "flex", xl: "none" }} alignItems='center'>
            <Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
                <Icon
                    as={IoMenuOutline}
                    color={menuColor}
                    my='auto'
                    w='20px'
                    h='20px'
                    me='10px'
                    _hover={{ cursor: "pointer" }}
                />
            </Flex>
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement={document.documentElement.dir === "rtl" ? "right" : "left"}
                finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
                    <DrawerCloseButton
                        zIndex='3'
                        onClose={onClose}
                        _focus={{ boxShadow: "none" }}
                        _hover={{ boxShadow: "none" }}
                    />
                    <DrawerBody maxW='285px' px='0rem' pb='0'>
                        <Scrollbars
                            autoHide
                            renderTrackVertical={renderTrack}
                            renderThumbVertical={renderThumb}
                            renderView={renderView}>
                            <Box ps='20px' pe='16px'>
                                {createLinks(routes)}
                            </Box>
                        </Scrollbars>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
}
// PROPS

Sidebar.propTypes = {
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    variant: PropTypes.string,
};

export default Sidebar;
