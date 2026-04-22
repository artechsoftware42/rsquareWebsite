import React, { useEffect, useMemo, useState } from "react";
import {
    Save,
    ImagePlus,
    Plus,
    Trash2,
    ChevronRight,
    LayoutPanelTop,
    Globe,
    ListOrdered,
    Image as ImageIcon,
    Settings2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    getPageByKey,
    getPages,
    savePageByKey,
    uploadImageFile,
} from "../services/adminPageService";

const LANG_KEYS = ["tr", "en", "ru", "fr"];

const panelShell = {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    background: "#f4f7fb",
};

const sidebarStyle = {
    borderRight: "1px solid #e5e7eb",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
};

const mainStyle = {
    minWidth: 0,
    padding: "24px",
};

const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    zIndex: 5,
    background: "rgba(244,247,251,0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
};

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

const sectionCardStyle = {
    ...cardStyle,
    marginBottom: "18px",
    padding: "20px",
};

const fieldRowStyle = {
    display: "grid",
    gap: "10px",
    marginBottom: "14px",
};

const labelStyle = {
    fontSize: "13px",
    fontWeight: 700,
    color: "#111827",
};

const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
};

const smallButtonStyle = {
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "#fff",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
};

const primaryButtonStyle = {
    border: "none",
    borderRadius: "14px",
    background: "#02acfa",
    color: "#fff",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
};

const dangerButtonStyle = {
    border: "1px solid #fecaca",
    borderRadius: "12px",
    background: "#fff1f2",
    color: "#b91c1c",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
};

const emptyLocalizedValue = () => ({
    tr: "",
    en: "",
    ru: "",
    fr: "",
});

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const setByPath = (obj, path, value) => {
    const cloned = deepClone(obj);
    let current = cloned;

    for (let i = 0; i < path.length - 1; i += 1) {
        current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    return cloned;
};

const removeByPath = (obj, path) => {
    const cloned = deepClone(obj);
    let current = cloned;

    for (let i = 0; i < path.length - 1; i += 1) {
        current = current[path[i]];
    }

    if (Array.isArray(current)) {
        current.splice(path[path.length - 1], 1);
    }

    return cloned;
};

const isPlainObject = (value) =>
    value && typeof value === "object" && !Array.isArray(value);

const isLocalizedObject = (value) => {
    if (!isPlainObject(value)) return false;
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every((key) => LANG_KEYS.includes(key));
};

const normalizeItemByShape = (shape) => {
    if (Array.isArray(shape)) return [];
    if (isLocalizedObject(shape)) return emptyLocalizedValue();

    if (isPlainObject(shape)) {
        const next = {};
        Object.keys(shape).forEach((key) => {
            const current = shape[key];

            if (Array.isArray(current)) {
                next[key] = [];
            } else if (isLocalizedObject(current)) {
                next[key] = emptyLocalizedValue();
            } else if (isPlainObject(current)) {
                next[key] = normalizeItemByShape(current);
            } else if (typeof current === "boolean") {
                next[key] = false;
            } else {
                next[key] = "";
            }
        });
        return next;
    }

    return "";
};

const createNewListItem = (field) => {
    const firstItem = Array.isArray(field?.value) ? field.value[0] : null;

    if (firstItem) {
        const item = normalizeItemByShape(firstItem);
        if (!item.id) item.id = `item-${Date.now()}`;
        return item;
    }

    if (field?.id === "navLinks") {
        return {
            id: `item-${Date.now()}`,
            text: emptyLocalizedValue(),
            href: "",
        };
    }

    if (field?.id === "actions") {
        return {
            id: `item-${Date.now()}`,
            text: emptyLocalizedValue(),
            href: "",
        };
    }

    if (field?.id === "languages") {
        return {
            id: `lang-${Date.now()}`,
            code: "",
            short: "",
            label: emptyLocalizedValue(),
            flag: "",
        };
    }

    return {
        id: `item-${Date.now()}`,
        label: emptyLocalizedValue(),
    };
};

const getUploadUrlFromResponse = (data) => {
    return (
        data?.url ||
        data?.imageUrl ||
        data?.fileUrl ||
        data?.path ||
        data?.data?.url ||
        data?.data?.imageUrl ||
        ""
    );
};

function AdminPanel() {
    const [pages, setPages] = useState([]);
    const [selectedPageKey, setSelectedPageKey] = useState("");
    const [selectedPageData, setSelectedPageData] = useState(null);
    const [loadingPages, setLoadingPages] = useState(true);
    const [loadingPage, setLoadingPage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    const filteredPages = useMemo(() => {
        if (!search.trim()) return pages;
        return pages.filter((page) =>
            String(page.pageKey || "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        );
    }, [pages, search]);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoadingPages(true);
                const data = await getPages();
                setPages(data || []);

                if (data?.length) {
                    const firstKey = data[0].pageKey;
                    setSelectedPageKey(firstKey);
                }
            } catch (error) {
                console.error(error);
                setMessage(error.message || "Sayfalar yüklenemedi.");
            } finally {
                setLoadingPages(false);
            }
        };

        fetchPages();
    }, []);

    useEffect(() => {
        if (!selectedPageKey) return;

        const fetchPageDetail = async () => {
            try {
                setLoadingPage(true);
                setMessage("");
                const data = await getPageByKey(selectedPageKey);
                setSelectedPageData(data);
            } catch (error) {
                console.error(error);
                setMessage(error.message || "Sayfa detayı yüklenemedi.");
            } finally {
                setLoadingPage(false);
            }
        };

        fetchPageDetail();
    }, [selectedPageKey]);

    const updatePageState = (updater) => {
        setSelectedPageData((prev) => {
            if (!prev) return prev;
            return typeof updater === "function" ? updater(prev) : updater;
        });
    };

    const updateFieldValue = (sectionIndex, fieldIndex, nextValue) => {
        updatePageState((prev) => {
            const next = deepClone(prev);
            next.sections[sectionIndex].fields[fieldIndex].value = nextValue;
            return next;
        });
    };

    const handleNestedChange = (sectionIndex, fieldIndex, path, nextValue) => {
        const currentValue = selectedPageData.sections[sectionIndex].fields[fieldIndex].value;
        const updatedValue = setByPath(currentValue, path, nextValue);
        updateFieldValue(sectionIndex, fieldIndex, updatedValue);
    };

    const handleRemoveArrayItem = (sectionIndex, fieldIndex, path) => {
        const currentValue = selectedPageData.sections[sectionIndex].fields[fieldIndex].value;
        const updatedValue = removeByPath(currentValue, path);
        updateFieldValue(sectionIndex, fieldIndex, updatedValue);
    };

    const handleAddListItem = (sectionIndex, fieldIndex, path = []) => {
        const field = selectedPageData.sections[sectionIndex].fields[fieldIndex];
        const currentValue = field.value;
        const newItem = createNewListItem(field);

        if (!path.length) {
            const next = Array.isArray(currentValue) ? [...currentValue, newItem] : [newItem];
            updateFieldValue(sectionIndex, fieldIndex, next);
            return;
        }

        const updatedValue = deepClone(currentValue);
        let current = updatedValue;

        for (let i = 0; i < path.length; i += 1) {
            current = current[path[i]];
        }

        if (Array.isArray(current)) {
            current.push(newItem);
        }

        updateFieldValue(sectionIndex, fieldIndex, updatedValue);
    };

    const handleUploadImage = async (sectionIndex, fieldIndex, path, file) => {
        try {
            const data = await uploadImageFile(file);
            const uploadedUrl = getUploadUrlFromResponse(data);

            if (!uploadedUrl) {
                throw new Error("Yüklenen görselin URL bilgisi alınamadı.");
            }

            const currentValue = selectedPageData.sections[sectionIndex].fields[fieldIndex].value;

            if (!path.length) {
                updateFieldValue(sectionIndex, fieldIndex, {
                    ...currentValue,
                    url: uploadedUrl,
                });
                return;
            }

            const updatedValue = setByPath(currentValue, path, uploadedUrl);
            updateFieldValue(sectionIndex, fieldIndex, updatedValue);
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Görsel yüklenemedi.");
        }
    };

    const handleSave = async () => {
        if (!selectedPageData) return;

        try {
            setSaving(true);
            setMessage("");

            await savePageByKey(selectedPageData.pageKey, {
                title: selectedPageData.title,
                sections: selectedPageData.sections,
            });

            setMessage("Kaydedildi.");
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Kaydetme işlemi başarısız.");
        } finally {
            setSaving(false);
        }
    };

    const renderPrimitiveEditor = ({
        label,
        value,
        onChange,
        placeholder = "",
        multiline = false,
    }) => {
        if (multiline) {
            return (
                <div style={fieldRowStyle}>
                    {label ? <span style={labelStyle}>{label}</span> : null}
                    <textarea
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "110px" }}
                    />
                </div>
            );
        }

        return (
            <div style={fieldRowStyle}>
                {label ? <span style={labelStyle}>{label}</span> : null}
                <input
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={inputStyle}
                />
            </div>
        );
    };

    const renderLocalizedEditor = ({
        label,
        value,
        onChange,
    }) => {
        return (
            <div style={{ ...cardStyle, padding: "14px", marginBottom: "12px", background: "#fafcff" }}>
                {label ? (
                    <div style={{ ...labelStyle, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Globe size={15} />
                        {label}
                    </div>
                ) : null}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "10px" }}>
                    {LANG_KEYS.map((lang) => (
                        <div key={lang} style={fieldRowStyle}>
                            <span style={labelStyle}>{lang.toUpperCase()}</span>
                            <input
                                value={value?.[lang] ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...(value || emptyLocalizedValue()),
                                        [lang]: e.target.value,
                                    })
                                }
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderImageEditor = ({
        label,
        value,
        onChange,
        onUpload,
    }) => {
        const currentValue = value || { url: "", alt: emptyLocalizedValue() };

        return (
            <div style={{ ...cardStyle, padding: "14px", marginBottom: "12px", background: "#fafcff" }}>
                <div style={{ ...labelStyle, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ImageIcon size={15} />
                    {label}
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                    <div style={fieldRowStyle}>
                        <span style={labelStyle}>Görsel URL</span>
                        <input
                            value={currentValue.url || ""}
                            onChange={(e) =>
                                onChange({
                                    ...currentValue,
                                    url: e.target.value,
                                })
                            }
                            style={inputStyle}
                        />
                    </div>

                    {currentValue.url ? (
                        <div
                            style={{
                                width: "100%",
                                minHeight: "150px",
                                border: "1px dashed #cbd5e1",
                                borderRadius: "16px",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "12px",
                            }}
                        >
                            <img
                                src={currentValue.url}
                                alt="preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "220px",
                                    objectFit: "contain",
                                    borderRadius: "12px",
                                }}
                            />
                        </div>
                    ) : null}

                    <label style={{ ...smallButtonStyle, display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
                        <ImagePlus size={15} />
                        Görsel Yükle
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpload(file);
                            }}
                        />
                    </label>

                    <div>
                        <span style={{ ...labelStyle, display: "block", marginBottom: "8px" }}>Alt Metin</span>
                        {renderLocalizedEditor({
                            value: currentValue.alt || emptyLocalizedValue(),
                            onChange: (nextAlt) =>
                                onChange({
                                    ...currentValue,
                                    alt: nextAlt,
                                }),
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderAnyValue = (params) => {
        const {
            value,
            sectionIndex,
            fieldIndex,
            path = [],
            label = "",
        } = params;

        if (Array.isArray(value)) {
            return (
                <div style={{ ...cardStyle, padding: "14px", marginBottom: "12px", background: "#fbfdff" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "8px" }}>
                            <ListOrdered size={15} />
                            {label || "Liste"}
                        </div>
                    </div>

                    <div style={{ display: "grid", gap: "12px" }}>
                        {value.length === 0 ? (
                            <div style={{ color: "#6b7280", fontSize: "14px" }}>Henüz öğe yok.</div>
                        ) : null}

                        {value.map((item, index) => (
                            <div
                                key={`item-${sectionIndex}-${fieldIndex}-${path.join("-")}-${index}`}
                                style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    padding: "14px",
                                    background: "#fff",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "10px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <strong style={{ fontSize: "14px", color: "#111827" }}>
                                        {item?.label?.tr ||
                                            item?.text?.tr ||
                                            item?.code ||
                                            item?.id ||
                                            `${label || "Item"} ${index + 1}`}
                                    </strong>

                                    <button
                                        type="button"
                                        style={dangerButtonStyle}
                                        onClick={() =>
                                            handleRemoveArrayItem(sectionIndex, fieldIndex, [...path, index])
                                        }
                                    >
                                        <Trash2 size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                                        Sil
                                    </button>
                                </div>

                                {renderAnyValue({
                                    value: item,
                                    sectionIndex,
                                    fieldIndex,
                                    path: [...path, index],
                                    label: "",
                                })}
                            </div>
                        ))}
                    </div>


                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            style={smallButtonStyle}
                            onClick={() => handleAddListItem(sectionIndex, fieldIndex, path)}
                        >
                            <Plus size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                            Öğe Ekle
                        </button>
                    </div>
                </div>
            );
        }

        if (isLocalizedObject(value)) {
            return renderLocalizedEditor({
                label,
                value,
                onChange: (nextValue) =>
                    handleNestedChange(sectionIndex, fieldIndex, path, nextValue),
            });
        }

        if (isPlainObject(value)) {
            const keys = Object.keys(value);

            if ("url" in value && "alt" in value) {
                return renderImageEditor({
                    label,
                    value,
                    onChange: (nextValue) =>
                        handleNestedChange(sectionIndex, fieldIndex, path, nextValue),
                    onUpload: (file) =>
                        handleUploadImage(sectionIndex, fieldIndex, [...path, "url"], file),
                });
            }

            return (
                <div style={{ display: "grid", gap: "10px", marginBottom: "12px" }}>
                    {keys.map((key) => {
                        const nestedValue = value[key];
                        const nestedLabel = key;

                        if (typeof nestedValue === "string" && key === "flag") {
                            return (
                                <div
                                    key={[...path, key].join(".")}
                                    style={{ ...cardStyle, padding: "14px", background: "#fafcff" }}
                                >
                                    <div style={{ ...labelStyle, marginBottom: "10px" }}>{nestedLabel}</div>

                                    <input
                                        value={nestedValue}
                                        onChange={(e) =>
                                            handleNestedChange(sectionIndex, fieldIndex, [...path, key], e.target.value)
                                        }
                                        style={{ ...inputStyle, marginBottom: "10px" }}
                                    />

                                    {nestedValue ? (
                                        <div
                                            style={{
                                                width: "100%",
                                                minHeight: "130px",
                                                border: "1px dashed #cbd5e1",
                                                borderRadius: "16px",
                                                background: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "12px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <img
                                                src={nestedValue}
                                                alt="flag"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "180px",
                                                    objectFit: "contain",
                                                    borderRadius: "12px",
                                                }}
                                            />
                                        </div>
                                    ) : null}

                                    <label style={{ ...smallButtonStyle, display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
                                        <ImagePlus size={15} />
                                        Görsel Yükle
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleUploadImage(
                                                        sectionIndex,
                                                        fieldIndex,
                                                        [...path, key],
                                                        file
                                                    );
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            );
                        }

                        return (
                            <div key={[...path, key].join(".")}>
                                {renderAnyValue({
                                    value: nestedValue,
                                    sectionIndex,
                                    fieldIndex,
                                    path: [...path, key],
                                    label: nestedLabel,
                                })}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return renderPrimitiveEditor({
            label,
            value: value ?? "",
            onChange: (nextValue) =>
                handleNestedChange(sectionIndex, fieldIndex, path, nextValue),
            multiline: typeof value === "string" && String(value).length > 120,
        });
    };

    const renderField = (field, sectionIndex, fieldIndex) => {
        return (
            <div
                key={`field-${sectionIndex}-${fieldIndex}`}
                style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "16px",
                    background: "#fcfdff",
                    marginBottom: "14px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "#111827" }}>
                            {field.label || field.id || "Field"}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                            Değiştirilebilir içerik alanı
                        </div>
                    </div>
                </div>

                {field.type === "image"
                    ? renderImageEditor({
                        label: field.label,
                        value: field.value,
                        onChange: (nextValue) => updateFieldValue(sectionIndex, fieldIndex, nextValue),
                        onUpload: (file) => handleUploadImage(sectionIndex, fieldIndex, [], file),
                    })
                    : renderAnyValue({
                        value: field.value,
                        sectionIndex,
                        fieldIndex,
                        path: [],
                        label: field.label || field.id,
                    })}
            </div>
        );
    };

    return (
        <div style={panelShell}>
            <aside style={sidebarStyle}>
                <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "14px",
                                background: "#02acfa",
                                color: "#fff",
                                display: "grid",
                                placeItems: "center",
                            }}
                        >
                            <LayoutPanelTop size={20} />
                        </div>

                        <div>
                            <div style={{ fontWeight: 800, fontSize: "18px", color: "#111827" }}>
                                Admin Panel
                            </div>
                            <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                PageKey bazlı içerik yönetimi
                            </div>
                        </div>
                    </div>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="PageKey ara..."
                        style={inputStyle}
                    />
                </div>

                <div style={{ padding: "10px", overflowY: "auto" }}>
                    {loadingPages ? (
                        <div style={{ padding: "14px", color: "#6b7280" }}>Sayfalar yükleniyor...</div>
                    ) : null}

                    {!loadingPages &&
                        filteredPages.map((page) => {
                            const active = selectedPageKey === page.pageKey;

                            return (
                                <button
                                    key={page._id || page.pageKey}
                                    type="button"
                                    onClick={() => setSelectedPageKey(page.pageKey)}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        border: active ? "1px solid #02acfa" : "1px solid transparent",
                                        background: active ? "#eff9ff" : "#fff",
                                        color: "#111827",
                                        borderRadius: "16px",
                                        padding: "14px",
                                        cursor: "pointer",
                                        marginBottom: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        fontWeight: active ? 700 : 600,
                                    }}
                                >
                                    <span>{page.pageKey}</span>
                                    <ChevronRight size={16} />
                                </button>
                            );
                        })}
                </div>
            </aside>

            <main style={mainStyle}>
                <div style={stickyHeaderStyle}>
                    <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#02acfa", marginBottom: "6px" }}>
                            DÜZENLENEN SAYFA
                        </div>
                        <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>
                            {selectedPageData?.title || selectedPageData?.pageKey || "Seçim yok"}
                        </div>
                        <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
                            İçerik düzenleme görünümü
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !selectedPageData}
                        style={{
                            ...primaryButtonStyle,
                            opacity: saving ? 0.7 : 1,
                            cursor: saving ? "not-allowed" : "pointer",
                        }}
                    >
                        <Save size={16} />
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>

                {message ? (
                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: "16px",
                            borderColor: message === "Kaydedildi." ? "#bbf7d0" : "#fecaca",
                            background: message === "Kaydedildi." ? "#f0fdf4" : "#fef2f2",
                            color: message === "Kaydedildi." ? "#166534" : "#991b1b",
                        }}
                    >
                        {message}
                    </div>
                ) : null}

                {loadingPage ? <div style={cardStyle}>Sayfa verisi yükleniyor...</div> : null}

                {!loadingPage && selectedPageData ? (
                    <div style={{ display: "grid", gap: "18px" }}>
                        <div style={cardStyle}>
                            <div>
                                <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>
                                    {selectedPageData.title || "Başlıksız Sayfa"}
                                </div>
                                <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                                    Sayfa içeriği
                                </div>
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <div style={fieldRowStyle}>
                                    <span style={labelStyle}>Başlık</span>
                                    <input
                                        value={selectedPageData.title || ""}
                                        onChange={(e) =>
                                            updatePageState((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {(selectedPageData.sections || []).map((section, sectionIndex) => (
                            <div key={`section-${sectionIndex}`} style={sectionCardStyle}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "14px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>
                                            {section.label || section.id || `Section ${sectionIndex + 1}`}
                                        </div>
                                        <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                                            Bölüm içerikleri
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {(section.fields || []).map((field, fieldIndex) =>
                                        renderField(field, sectionIndex, fieldIndex)
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </main>
        </div>
    );
}

export default AdminPanel;