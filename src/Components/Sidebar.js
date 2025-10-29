import React, { useState } from "react";
import styles from "../Assets/CSS/PageCSS/AdminDashboard.module.css";

const menuItems = [
    { id: "TourTable", label: "QUẢN LÝ TOUR", img: "img/tourManaging.png" },
    { id: "ResourceTable", label: "QUẢN LÍ TÀI NGUYÊN", img: "img/resourceManaging.png" },
];

export default function Sidebar({ active_function }) {
    const [isClosed, setIsClosed] = useState(false);

    return (
        <div className={`${styles.navContainer} ${isClosed ? styles.navClose : ""}`}>

            <div className={styles.menuIcn} onClick={() => setIsClosed(!isClosed)}>
                <img src="img/menu.png" alt="Toggle menu" />
            </div>

            <nav className={styles.nav}>
                <div className={styles.navUpperOptions}>

                    <div className={`${styles.navOption} ${styles.option1}`}>
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                            className={styles.navImg}
                            alt="dashboard"
                        />
                        <h3>Dashboard</h3>
                    </div>

                    {menuItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${styles.navOption} ${styles[`option${index + 2}`]}`}
                            onClick={() => active_function(item.id)}
                        >
                            <img src={item.img} className={styles.navImg} alt={item.label} />
                            <h3>{item.label}</h3>
                        </div>
                    ))}

                </div>
            </nav>

        </div>
    );
}
