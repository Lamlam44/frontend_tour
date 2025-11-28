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
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_INVOICES = "http://localhost:8080/api/invoices";

export default function MainDashboard() {
    const textColor = "white";
    const brandColor = useColorModeValue("brand.500", "white");

    const [invoices, setInvoices] = useState([]);

    // Load invoices
    const loadInvoices = async () => {
        try {
            const res = await axios.get(API_INVOICES);
            setInvoices(res.data);
        } catch (err) {
            console.error("Error fetching invoices", err);
        }
    };

    useEffect(() => {
        loadInvoices();
    }, []);

    // -----------------------------
    // 1️⃣ TÍNH DOANH THU THỰC TẾ
    // -----------------------------
    const totalRevenue = invoices
        .filter((i) => i.status === "PAID")
        .reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

    const totalBookings = invoices.length;
    const totalPaid = invoices.filter((i) => i.status === "PAID").length;

    // -----------------------------
    // 2️⃣ DỮ LIỆU BIỂU ĐỒ DOANH THU
    // -----------------------------
    const monthlyRevenue = Array(12).fill(0);

    invoices.forEach((inv) => {
        if (inv.status === "PAID") {
            const month = new Date(inv.invoiceCreatedAt).getMonth();
            monthlyRevenue[month] += Number(inv.totalAmount) || 0;
        }
    });

    const chartOptions = {
        chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#4b49ac"],
        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            labels: { style: { colors: "#888", fontSize: "12px" } },
        },
        yaxis: {
            labels: { style: { colors: "#888", fontSize: "12px" } },
        },
        tooltip: {
            y: { formatter: (val) => `₫${val.toLocaleString()}` },
        },
    };

    const chartSeries = [
        {
            name: "Revenue",
            data: monthlyRevenue,
        },
    ];

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            {/* =========================== */}
            {/*        TOP STAT CARDS       */}
            {/* =========================== */}
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
                gap="20px"
                mb="20px"
            >
                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Total Revenue</StatLabel>
                        <StatNumber color={textColor}>
                            ₫{totalRevenue.toLocaleString()}
                        </StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            Real Data
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Total Invoices</StatLabel>
                        <StatNumber color={textColor}>{totalBookings}</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            Real Data
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Paid Invoices</StatLabel>
                        <StatNumber color={textColor}>{totalPaid}</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            Real Data
                        </StatHelpText>
                    </Stat>
                </Card>

                <Card>
                    <Stat>
                        <StatLabel color={textColor}>Pending Invoices</StatLabel>
                        <StatNumber color={textColor}>
                            {totalBookings - totalPaid}
                        </StatNumber>
                        <StatHelpText>
                            <StatArrow type="decrease" />
                            Real Data
                        </StatHelpText>
                    </Stat>
                </Card>
            </SimpleGrid>

            {/* =========================== */}
            {/*        REVENUE CHART        */}
            {/* =========================== */}
            <Card p="30px" mb="20px">
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb="20px">
                    Revenue Overview
                </Text>
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height={300}
                />
            </Card>
            <Card p="30px" mb="20px">
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb="20px">
                    Recent Activity
                </Text>

                <Box>
                    {invoices
                        .sort(
                            (a, b) =>
                                new Date(b.invoiceCreatedAt) -
                                new Date(a.invoiceCreatedAt)
                        )
                        .slice(0, 8) // 8 hoạt động gần nhất
                        .map((inv, index) => (
                            <Text key={index} color={textColor} mb="10px">
                                • {new Date(inv.invoiceCreatedAt).toLocaleDateString(
                                    "vi-VN"
                                )}:{" "}
                                {inv.status === "PAID" ? (
                                    <>
                                        Thanh toán thành công hóa đơn{" "}
                                        <b>#{inv.invoiceId}</b> — Tour:{" "}
                                        <b>{inv.tour?.tourName}</b> — Số tiền:{" "}
                                        <b>₫{Number(inv.totalAmount).toLocaleString()}</b>
                                    </>
                                ) : (
                                    <>
                                        Tạo mới hóa đơn <b>#{inv.invoiceId}</b> cho tour{" "}
                                        <b>{inv.tour?.tourName}</b>
                                    </>
                                )}
                            </Text>
                        ))}
                </Box>
            </Card>
        </Box>
    );
}
