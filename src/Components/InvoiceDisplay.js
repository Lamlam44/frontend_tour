import React from 'react';
import styles from '../Assets/CSS/ComponentsCSS/Invoice.module.css'; // Reuse the same styles

const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return null;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        }).format(new Date(dateString));
    } catch (e) {
        return dateString; // Fallback to original string if format fails
    }
};

const FIELD_LABELS = {
    invoiceId: 'Mã hóa đơn',
    customerName: 'Tên khách hàng',
    customerEmail: 'Email',
    customerPhone: 'Số điện thoại',
    invoiceCreatedAt: 'Ngày tạo',
    status: 'Trạng thái',
    paymentMethod: 'Phương thức thanh toán',
    numberOfPeople: 'Số lượng khách',
    serviceFee: 'Phí dịch vụ',
    discountAmount: 'Tổng giảm giá',
    taxAmount: 'Thuế (VAT)',
    totalAmount: 'Tổng cộng',
};

// Controls the display order
const ORDER_OF_FIELDS = [
    'invoiceId',
    'customerName',
    'customerEmail',
    'customerPhone',
    'invoiceCreatedAt',
    'status',
    'paymentMethod',
    'numberOfPeople',
    'serviceFee',
    'discountAmount',
    'taxAmount',
    'totalAmount',
];

const InvoiceDisplay = ({ invoice, children }) => {
    if (!invoice) {
        return null;
    }

    // Special rendering for tour details
    const renderTourInfo = () => {
        if (!invoice.tour) return null;
        return (
            <div className={styles.summaryItem}>
                <p><strong>Tour:</strong> {invoice.tour.tourName}</p>
                <span>{formatPrice(invoice.tour.tourPrice)}</span>
            </div>
        );
    };

    return (
        <aside className={styles.summary}>
            <h3>Chi tiết hóa đơn</h3>
            
            {renderTourInfo()}
            <hr />

            {ORDER_OF_FIELDS.map(field => {
                const value = invoice[field];
                const label = FIELD_LABELS[field];
                
                // Don't render if value is null, undefined, or an empty string
                if (value === null || value === undefined || value === '') {
                    return null;
                }
                
                // Don't render monetary values if they are zero (except for totalAmount)
                if (['serviceFee', 'discountAmount', 'taxAmount'].includes(field) && value === 0) {
                    return null;
                }

                let displayValue;
                const isPrice = ['serviceFee', 'discountAmount', 'taxAmount', 'totalAmount'].includes(field);
                
                if (isPrice) {
                    displayValue = formatPrice(value);
                } else if (field === 'invoiceCreatedAt') {
                    displayValue = formatDate(value);
                } else {
                    displayValue = value;
                }

                const valueStyle = isPrice ? { fontWeight: 'bold' } : {};
                if (field === 'totalAmount') {
                    valueStyle.color = 'var(--secondary-color, #e53e3e)';
                    valueStyle.fontSize = '1.5rem';
                }

                return (
                    <div key={field} className={styles.summaryItem}>
                        <p>{label}</p>
                        <span style={valueStyle}>{displayValue}</span>
                    </div>
                );
            })}
            
            {children}
        </aside>
    );
};

export default InvoiceDisplay;
