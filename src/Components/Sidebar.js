import React, { useState } from "react";
import "../Assets/CSS/PageCSS/AdminDashboard.css";

const menuItems = [
    {
        id: "TourTable",
        label: "QUẢN LÝ TOUR",
        img: "img/tourManaging.png"
    },
    {
        id: "ResourceTable",
        label: "QUẢN LÍ TÀI NGUYÊN",
        img: "img/resourceManaging.png"
    },
];

export default function Sidebar({ active_function }) {
    const [isClosed, setIsClosed] = useState(false);

    const toggleMenu = () => {
        setIsClosed(!isClosed);
    };

    return (
        <div className={`navcontainer ${isClosed ? "navclose" : ""}`}>
            {/* Nút Icon toggle */}
            <div className="menuicn" onClick={toggleMenu}>
                <img src="img/menu.png" alt="Toggle menu" />
            </div>

            <nav className="nav">
                <div className="nav-upper-options">
                    <div class="nav-option option1">
                        <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png" class="nav-img" alt="dashboard" />
                        <h3> Dashboard</h3>
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`nav-option option${index + 2}`}
                            onClick={() => active_function(item.id)}
                        >
                            <img src={item.img} className="nav-img" alt={item.label} />
                            <h3>{item.label}</h3>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
}

