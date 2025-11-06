import { Box } from "@chakra-ui/react";

function Card(props) {
    const { variant, children, ...rest } = props;

    return (
        <Box
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            wordWrap="break-word"
            bg="navy.800"
            _dark={{ bg: "navy.800" }}
            backgroundClip="border-box"
            boxShadow="md"
            {...rest}
        >
            {children}
        </Box>
    );
}

export default Card;