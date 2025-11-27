import {
    Box,
    SimpleGrid,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    useColorModeValue,
} from "@chakra-ui/react";
import Card from "../../components/card/Card";
import ReactApexChart from "react-apexcharts";
import React from "react";

export default function MainDashboard() {
    
    
    const textColor = "white";
    // Ngay trong MainDashboard component
    const chartOptions = {
    chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#4b49ac"],
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        labels: { style: { colors: "#888", fontSize: "12px" } },
    },
    yaxis: {
        labels: { style: { colors: "#888", fontSize: "12px" } },
    },
    grid: { borderColor: "#f1f1f1" },
    tooltip: {
        y: {
        formatter: (val) => `₫${val}M`,
        },
    },
    };

    const chartSeries = [
    {
        name: "Revenue",
        data: [85, 92, 100, 125, 110, 130, 145, 160],
    },
    ];

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
                gap='20px'
                mb='20px'>
                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Total Tours</StatLabel>
                        <StatNumber color={textColor}>45</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            23.36%
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Total Bookings</StatLabel>
                        <StatNumber color={textColor}>1,234</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            15.48%
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Revenue</StatLabel>
                        <StatNumber color={textColor}>₫125M</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            12.05%
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Active Users</StatLabel>
                        <StatNumber color={textColor}>856</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            8.24%
                        </StatHelpText>
                    </Stat>
                </Card>
            </SimpleGrid>
            <Card p='30px' mb='20px'>
                <Text fontSize='xl' fontWeight='bold' color={textColor} mb='20px'>
                    Revenue Overview
                </Text>
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type='area'
                    height={300}
                />
            </Card>

            <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
                <Card p='30px'>
                    <Text fontSize='xl' fontWeight='bold' color={textColor} mb='20px'>
                        Recent Activity
                    </Text>
                    <Box>
                        <Text color={textColor} mb='10px'>• New booking for Phú Quốc Paradise Beach</Text>
                        <Text color={textColor} mb='10px'>• Tour Đà Lạt updated</Text>
                        <Text color={textColor} mb='10px'>• New user registered</Text>
                        <Text color={textColor} mb='10px'>• Payment received for Hạ Long Bay Cruise</Text>
                    </Box>
                </Card>

                <Card p='30px'>
                    <Text fontSize='xl' fontWeight='bold' color={textColor} mb='20px'>
                        Popular Tours
                    </Text>
                    <Box>
                        <Text color={textColor} mb='10px'>1. Phú Quốc Paradise Beach - 145 bookings</Text>
                        <Text color={textColor} mb='10px'>2. Đà Lạt Dream Escape - 132 bookings</Text>
                        <Text color={textColor} mb='10px'>3. Hạ Long Bay Cruise - 98 bookings</Text>
                        <Text color={textColor} mb='10px'>4. Sapa Cloudy Paradise - 87 bookings</Text>
                    </Box>
                </Card>
            </SimpleGrid>
        </Box>
    );
}
