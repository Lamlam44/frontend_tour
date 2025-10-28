import React, { useState, useMemo } from 'react';
// style
import styles from '../../Assets/CSS/PageCSS/AdminDashboard.css';
// Component
import Sidebar from '../../Components/Sidebar';
import TourTable from '../../Components/TourTable';
import ResourceTable from '../../Components/ResourceTable';

export default function App() {
    const mockTours = [
        { id: 1, name: 'Tour Phú Quốc 3N2Đ', price: 2990000 },
        { id: 2, name: 'Khám phá Đà Nẵng - Hội An', price: 3500000 },
        { id: 3, name: 'Hà Giang - Mùa hoa tam giác mạch', price: 4200000 },
        { id: 4, name: 'Về Miền Tây Sông Nước', price: 2500000 },
    ];
    const mockResources = [
        { id: 1, name: 'Tour Phú Quốc 3N2Đ', price: 2990000 },
        { id: 2, name: 'Khám phá Đà Nẵng - Hội An', price: 3500000 },
        { id: 3, name: 'Hà Giang - Mùa hoa tam giác mạch', price: 4200000 },
        { id: 4, name: 'Về Miền Tây Sông Nước', price: 2500000 },
    ];

    const [active, setActive] = useState('TourTable');
    const [tours, setTours] = useState(mockTours);
    const [resources, setResources] = useState(mockResources);

    const panels = useMemo(() => ({
        'TourTable': <TourTable tours={tours} setTours={setTours} />,
        'ResourceTable': <ResourceTable resources={resources} setResources={setResources} />,
    }), [tours, resources]);

    return (
        <div className="admin-root">
            <header className="header">
                <div className="logo">ADMIN PANEL</div>
                <div className="header-right">
                    <div className="notif" />
                    <div className="avatar" />
                </div>
            </header>

            <div className="main-container">
                <Sidebar active={active} active_function={setActive} />

                <main className="main">
                    {panels[active]}
                </main>
            </div>

            <footer className="footer">© Admin Panel</footer>
        </div>
    );
}
