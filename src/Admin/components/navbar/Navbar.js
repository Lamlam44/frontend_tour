import React from "react";
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

export default function Navbar(props) {
    const { brandText } = props;

    let mainText = useColorModeValue("navy.700", "white");
    let navbarBg = useColorModeValue(
        "rgba(244, 247, 254, 0.2)",
        "rgba(11,20,55,0.5)"
    );

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
                flexDirection={{
                    sm: "column",
                    md: "row",
                }}
                alignItems={{ xl: "center" }}
                mb='0px'>
                <Box ms='auto' w={{ sm: "100%", md: "unset" }}>
                    <Text
                        color={mainText}
                        fontSize='xl'
                        fontWeight='bold'
                        lineHeight='100%'>
                        {brandText}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
}
