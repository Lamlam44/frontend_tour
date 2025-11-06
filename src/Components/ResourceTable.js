import React, { useState, useMemo } from "react";
import styles from "../Assets/CSS/PageCSS/AdminDashboard.module.css";
import Button from '@mui/material/Button';

export default function ResourceTable({ compact = false }) {
    const [resources, setResources] = useState([
        { id: 1, name: "Hạ Long Bay", price: 5000000 },
        { id: 2, name: "Nilah Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
        { id: 2, name: "Haha Adventure", price: 4500000 },
    ]);

    const [showAdd, setShowAdd] = useState(false);
    const [newResource, setNewResource] = useState({ name: "", price: "" });
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        return resources.filter(t =>
            t.name.toLowerCase().includes(q.toLowerCase())
        );
    }, [q, resources]);

    const addResource = () => {
        if (!newResource.name.trim()) return;
        setResources(prev => [
            ...prev,
            { id: Date.now(), name: newResource.name.trim(), price: Number(newResource.price) || 0 }
        ]);
        setNewResource({ name: "", price: "" });
        setShowAdd(false);
    };

    const remove = (id) => {
        setResources(prev => prev.filter(t => t.id !== id));
    };

    return (
        <section className={styles.panel}>
            <div className={styles["reportHeader"]}>
                <h2 className={styles["recent-Articles"]}>QUẢN LÍ TÀI NGUYÊN</h2>
                <div>
                    {!compact && (
                        <Button variant="contained"
                            className={styles.addButton}
                            onClick={() => setShowAdd(s => !s)}
                        >
                            + THÊM TÀI NGUYÊN
                        </Button>
                    )}
                    <input
                        className={styles.search}
                        placeholder="Tìm kiếm..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles["sectionBody"]}>
                {showAdd && (
                    <div className={styles["add-box"]}>
                        <input
                            placeholder="Tên tài nguyên"
                            value={newResource.name}
                            onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                        />
                        <input
                            placeholder="Giá"
                            value={newResource.price}
                            onChange={e => setNewResource({ ...newResource, price: e.target.value })}
                        />
                        <button onClick={addResource}>Thêm</button>
                    </div>
                )}
            </div>
            <div className={styles["sectionBody"]}>
                <table className={styles["data-table"]}>
                    <thead>
                        <tr>
                            <th className={styles["thHead"]}>RESOURCE</th>
                            <th className={styles["thHead"]}>GIÁ</th>
                            {!compact && <th>XÓA</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id}>
                                <td className={styles["thBody"]} >{t.name}</td>
                                <td className={styles["thBody"]} >{t.price.toLocaleString()}₫</td>
                                {!compact && (
                                    <td>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => remove(t.id)}
                                        >
                                            XÓA
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
