import React, { useState, useMemo } from "react";
import styles from '../Assets/CSS/PageCSS/AdminDashboard.css';

export default function ResourceTable({ compact = false }) {
    const [resources, setResources] = useState([
        { id: 1, name: "Hạ Long Bay", price: 5000000 },
        { id: 2, name: "Nilah Adventure", price: 4500000 },
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
        <section className="panel">
            <div className="panel-header">
                <h2>QUẢN LÍ TOUR</h2>
                <div>
                    {!compact && (
                        <button onClick={() => setShowAdd(s => !s)}>
                            THÊM TOUR
                        </button>
                    )}
                    <input
                        placeholder="Tìm kiếm..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>
            </div>

            {showAdd && (
                <div className="add-box">
                    <input
                        placeholder="Tên"
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

            <table className="data-table">
                <thead>
                    <tr>
                        <th>TOUR</th>
                        <th>GIÁ</th>
                        {!compact && <th>XÓA</th>}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(t => (
                        <tr key={t.id}>
                            <td>{t.name}</td>
                            <td>{t.price.toLocaleString()}₫</td>
                            {!compact && (
                                <td>
                                    <button onClick={() => remove(t.id)}>
                                        XÓA
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
