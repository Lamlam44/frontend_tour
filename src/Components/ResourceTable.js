import React, { useState, useMemo } from "react";
import styles from "../Assets/CSS/PageCSS/AdminDashboard.module.css";

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
    ]);

    const [showAdd, setShowAdd] = useState(false);
    const [newTour, setNewTour] = useState({ name: "", price: "" });
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        return resources.filter(t =>
            t.name.toLowerCase().includes(q.toLowerCase())
        );
    }, [q, resources]);

    const addTour = () => {
        if (!newTour.name.trim()) return;
        setResources(prev => [
            ...prev,
            { id: Date.now(), name: newTour.name.trim(), price: Number(newTour.price) || 0 }
        ]);
        setNewTour({ name: "", price: "" });
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
                        <button
                            className={styles.addButton}
                            onClick={() => setShowAdd(s => !s)}
                        >
                            + THÊM TÀI NGUYÊN
                        </button>
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
                            value={newTour.name}
                            onChange={e => setNewTour({ ...newTour, name: e.target.value })}
                        />
                        <input
                            placeholder="Giá"
                            value={newTour.price}
                            onChange={e => setNewTour({ ...newTour, price: e.target.value })}
                        />
                        <button onClick={addTour}>Thêm</button>
                    </div>
                )}

                <table className={styles["data-table"]}>
                    <thead>
                        <tr>
                            <th className={styles["thHead"]}>TOUR</th>
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
