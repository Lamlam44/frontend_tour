import React from "react";
import {
    Box,
    Flex,
    Icon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

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

export default Sidebar;
