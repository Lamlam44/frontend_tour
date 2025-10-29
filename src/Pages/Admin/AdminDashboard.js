import React, { useState, useMemo } from 'react';
// style
import styles from "../../Assets/CSS/PageCSS/AdminDashboard.module.css";
// Component
import Sidebar from '../../Components/Sidebar';
import TourTable from '../../Components/TourTable';
import ResourceTable from '../../Components/ResourceTable';

export default function App() {

    const [active, setActive] = useState('TourTable');
    const [tours, setTours] = useState();
    const [resources, setResources] = useState();

    const panels = useMemo(() => ({
        TourTable: <TourTable tours={tours} setTours={setTours} />,
        ResourceTable: <ResourceTable resources={resources} setResources={setResources} />,
    }), [tours, resources]);

    return (
        <div className={styles.adminRoot}>
            <header className={styles.header}>
                <div className={styles.logo}>ADMIN PANEL</div>
                <div className={styles.headerRight}>
                    <div className={styles.notif} />
                    <div className={styles.avatar} />
                </div>
            </header>

            <div className={styles.mainContainer}>
                <Sidebar active={active} active_function={setActive} />

                <div className={styles.main}>
                    <div className={styles.reportContainer}>
                        {panels[active]}
                    </div>
                </div>
            </div>

        </div>
    );
}
