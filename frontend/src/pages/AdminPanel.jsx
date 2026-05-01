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

//#region GAMES, GAMESPAGE, GAMESDETAIL ile ilgilidir. 
const MASTER_GAMES_PAGE_KEY = "GameDetails";
const SYNCED_GAMES_PAGE_KEYS = ["GamesPage", "Games", "Header"];

const isSyncedGamesField = (pageKey, section, field) => {
    if (!SYNCED_GAMES_PAGE_KEYS.includes(pageKey)) return false;

    if (
        (pageKey === "GamesPage" || pageKey === "Games") &&
        section?.id === "games" &&
        field?.id === "items"
    ) {
        return true;
    }

    if (
        pageKey === "Header" &&
        section?.id === "gamesDropdown" &&
        field?.id === "gameItems"
    ) {
        return true;
    }

    return false;
};

const getFieldValueById = (page, sectionId, fieldId) => {
    const section = page?.sections?.find((item) => item.id === sectionId);
    const field = section?.fields?.find((item) => item.id === fieldId);
    return field?.value ?? null;
};

const replaceFieldValueById = (page, sectionId, fieldId, nextValue) => {
    const next = deepClone(page);

    next.sections = next.sections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
            ...section,
            fields: section.fields.map((field) => {
                if (field.id !== fieldId) return field;

                return {
                    ...field,
                    value: nextValue,
                };
            }),
        };
    });

    return next;
};

const localizedFromName = (game) => {
    return game?.name || game?.title || {
        tr: "",
        en: "",
        fr: "",
        ru: "",
    };
};

const getImageObject = (image, fallbackAlt) => {
    if (!image) {
        return {
            url: "",
            alt: fallbackAlt || emptyLocalizedValue(),
        };
    }

    if (typeof image === "string") {
        return {
            url: image,
            alt: fallbackAlt || emptyLocalizedValue(),
        };
    }

    return {
        url: image.url || image.image || "",
        alt: image.alt || fallbackAlt || emptyLocalizedValue(),
    };
};

const mapMasterGamesToGamesPageItems = (masterGames) => {
    return masterGames.map((game, index) => {
        const title = localizedFromName(game);
        const category = game.category || "pc-games";
        const slug = game.slug || game.id || `game-${index + 1}`;

        return {
            id: String(index + 1).padStart(2, "0"),
            slug,
            title,
            category,
            image: getImageObject(game.heroImage || game.image, {
                tr: `${title.tr || slug} oyun görseli`,
                en: `${title.en || slug} game image`,
                fr: `Image du jeu ${title.fr || slug}`,
                ru: `Изображение игры ${title.ru || slug}`,
            }),
            hoverImage: getImageObject(game.hoverImage || game.heroImage || game.image, {
                tr: `${title.tr || slug} önizleme görseli`,
                en: `${title.en || slug} preview image`,
                fr: `Image d’aperçu de ${title.fr || slug}`,
                ru: `Превью изображение ${title.ru || slug}`,
            }),
            description: game.description || game.intro?.text || emptyLocalizedValue(),
            stores: (game.platforms || []).map((platform) => {
                const key = platform.key || platform.id;

                if (key === "steam") {
                    return {
                        id: "steam",
                        name: "Steam",
                        icon: "steam",
                        href: platform.href || "#",
                    };
                }

                if (key === "epic") {
                    return {
                        id: "epic-games",
                        name: "Epic Games",
                        icon: "epicGames",
                        href: platform.href || "#",
                    };
                }

                if (key === "googleplay") {
                    return {
                        id: "google-play",
                        name: "Google Play",
                        icon: "googlePlay",
                        href: platform.href || "#",
                    };
                }

                if (key === "appstore") {
                    return {
                        id: "app-store",
                        name: "App Store",
                        icon: "appStore",
                        href: platform.href || "#",
                    };
                }

                return {
                    id: key || `store-${Date.now()}`,
                    name: platform.name || key || "Store",
                    icon: key || "",
                    href: platform.href || "#",
                };
            }),
            link: game.detailPath || `/games/${slug}`,
            status: game.status || {
                tr: "Geliştiriliyor",
                en: "In Development",
                fr: "En développement",
                ru: "В разработке",
            },
        };
    });
};

const mapMasterGamesToGamesItems = (masterGames) => {
    return masterGames.map((game, index) => {
        const title = localizedFromName(game);
        const category = game.category || "pc-games";
        const slug = game.slug || game.id || `game-${index + 1}`;

        return {
            id: String(index + 1).padStart(2, "0"),
            slug,
            category,
            link: game.detailPath || `/games/${slug}`,
            title,
            categoryLabel: game.label || {
                tr: "Oyun",
                en: "Game",
                fr: "Jeu",
                ru: "Игра",
            },
            image: getImageObject(game.heroImage || game.image, {
                tr: `${title.tr || slug} oyun görseli`,
                en: `${title.en || slug} game image`,
                fr: `Image du jeu ${title.fr || slug}`,
                ru: `Изображение игры ${title.ru || slug}`,
            }),
            description: game.description || game.intro?.text || emptyLocalizedValue(),
            stores: (game.platforms || []).map((platform) => {
                const key = platform.key || platform.id;

                if (key === "steam") {
                    return {
                        id: "steam",
                        name: "Steam",
                        href: platform.href || "#",
                    };
                }

                if (key === "epic") {
                    return {
                        id: "epic-games",
                        name: "Epic Games",
                        href: platform.href || "#",
                    };
                }

                if (key === "googleplay") {
                    return {
                        id: "google-play",
                        name: "Google Play",
                        href: platform.href || "#",
                    };
                }

                if (key === "appstore") {
                    return {
                        id: "app-store",
                        name: "App Store",
                        href: platform.href || "#",
                    };
                }

                return {
                    id: key || `store-${Date.now()}`,
                    name: platform.name || key || "Store",
                    href: platform.href || "#",
                };
            }),
            hoverStatus: game.hoverStatus || {
                tr: "2026’da Yakında",
                en: "Coming Soon in 2026",
                fr: "Bientôt disponible en 2026",
                ru: "Скоро в 2026",
            },
            status: game.status || {
                tr: "Geliştiriliyor",
                en: "In Development",
                fr: "En développement",
                ru: "В разработке",
            },
        };
    });
};

const mapMasterGamesToHeaderGameItems = (masterGames) => {
    return masterGames.map((game, index) => {
        const title = localizedFromName(game);
        const slug = game.slug || game.id || `game-${index + 1}`;

        return {
            id: slug,
            text: title,
            slug,
            href: game.detailPath || `/games/${slug}`,
        };
    });
};

const syncGamesFromMaster = async (masterPage) => {
    const masterGames = getFieldValueById(masterPage, "games", "items") || [];

    const gamesPage = await getPageByKey("GamesPage");
    const gamesSection = await getPageByKey("Games");
    const headerPage = await getPageByKey("Header");

    const nextGamesPage = replaceFieldValueById(
        gamesPage,
        "games",
        "items",
        mapMasterGamesToGamesPageItems(masterGames)
    );

    const nextGamesSection = replaceFieldValueById(
        gamesSection,
        "games",
        "items",
        mapMasterGamesToGamesItems(masterGames)
    );

    const nextHeaderPage = replaceFieldValueById(
        headerPage,
        "gamesDropdown",
        "gameItems",
        mapMasterGamesToHeaderGameItems(masterGames)
    );

    await savePageByKey("GamesPage", {
        title: nextGamesPage.title,
        sections: nextGamesPage.sections,
    });

    await savePageByKey("Games", {
        title: nextGamesSection.title,
        sections: nextGamesSection.sections,
    });

    await savePageByKey("Header", {
        title: nextHeaderPage.title,
        sections: nextHeaderPage.sections,
    });
};
//#endregion

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

const slugifyText = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const getGameNameForSlug = (game) => {
    return (
        game?.name?.en ||
        game?.name?.tr ||
        game?.title?.en ||
        game?.title?.tr ||
        game?.id ||
        "new-game"
    );
};

const buildGameSlug = (game) => {
    return slugifyText(getGameNameForSlug(game)) || `game-${Date.now()}`;
};

const normalizeGameRoutingFields = (game) => {
    const slug = game.slug || buildGameSlug(game);

    return {
        ...game,
        id: game.id || slug,
        slug,
        detailPath: game.detailPath || `/games/${slug}`,
    };
};

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
    const [messageType, setMessageType] = useState("");
    const [search, setSearch] = useState("");
    const [gameCategoryOptions, setGameCategoryOptions] = useState([]);

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
        const fetchGameCategoryOptions = async () => {
            try {
                const gamesPage = await getPageByKey("GamesPage");

                const tabsSection = gamesPage?.sections?.find(
                    (section) => section.id === "tabs"
                );

                const tabsField = tabsSection?.fields?.find(
                    (field) => field.id === "items"
                );

                const tabs = Array.isArray(tabsField?.value) ? tabsField.value : [];

                const options = tabs
                    .filter((tab) => tab.value && tab.value !== "all")
                    .map((tab) => ({
                        value: tab.value,
                        label: tab.label || {
                            tr: tab.value,
                            en: tab.value,
                            fr: tab.value,
                            ru: tab.value,
                        },
                    }));

                setGameCategoryOptions(options);
            } catch (error) {
                console.error("Game category options yüklenemedi:", error);
                setGameCategoryOptions([]);
            }
        };

        fetchGameCategoryOptions();
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
        let newItem = createNewListItem(field);

        const isMasterGamesItems =
            selectedPageData?.pageKey === MASTER_GAMES_PAGE_KEY &&
            selectedPageData?.sections?.[sectionIndex]?.id === "games" &&
            field?.id === "items" &&
            path.length === 0;

        if (isMasterGamesItems) {
            newItem = {
                ...newItem,
                name: newItem.name || emptyLocalizedValue(),
                category: newItem.category || gameCategoryOptions[0]?.value || "pc-games",
                detailPath: newItem.detailPath || "",
                slug: newItem.slug || "",
            };

            newItem = normalizeGameRoutingFields(newItem);
        }

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

    const preparePageBeforeSave = (page) => {
        if (page?.pageKey !== MASTER_GAMES_PAGE_KEY) return page;

        const next = deepClone(page);

        next.sections = next.sections.map((section) => {
            if (section.id !== "games") return section;

            return {
                ...section,
                fields: section.fields.map((field) => {
                    if (field.id !== "items" || !Array.isArray(field.value)) return field;

                    return {
                        ...field,
                        value: field.value.map((game) => normalizeGameRoutingFields(game)),
                    };
                }),
            };
        });

        return next;
    };

    const handleSave = async () => {
        if (!selectedPageData) return;

        try {
            setSaving(true);
            setMessage("");
            setMessageType("");

            const pageToSave =
                typeof preparePageBeforeSave === "function"
                    ? preparePageBeforeSave(selectedPageData)
                    : selectedPageData;

            setSelectedPageData(pageToSave);

            await savePageByKey(pageToSave.pageKey, {
                title: pageToSave.title,
                sections: pageToSave.sections,
            });

            if (pageToSave.pageKey === MASTER_GAMES_PAGE_KEY) {
                await syncGamesFromMaster(pageToSave);
            }

            setMessage("Güncellendi.");
            setMessageType("success");
        } catch (error) {
            console.error(error);
            setMessage("Kaydedilemedi. Lütfen oturumu yenileyip tekrar deneyin.");
            setMessageType("error");
        } finally {
            setSaving(false);
        }
    };

    const renderCategorySelectEditor = ({
        label,
        value,
        onChange,
    }) => {
        const options = gameCategoryOptions.length
            ? gameCategoryOptions
            : [
                {
                    value: "pc-games",
                    label: {
                        tr: "PC Oyunları",
                        en: "PC Games",
                        fr: "Jeux PC",
                        ru: "Игры для ПК",
                    },
                },
            ];

        return (
            <div style={fieldRowStyle}>
                {label ? <span style={labelStyle}>{label}</span> : null}

                <select
                    value={value || options[0]?.value || "pc-games"}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        ...inputStyle,
                        cursor: "pointer",
                        background: "#fff",
                    }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {(option.label?.tr || option.label?.en || option.value)} — {option.value}
                        </option>
                    ))}
                </select>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#2563eb",
                        fontWeight: 600,
                    }}
                >
                    Bu seçenekler GamesPage içindeki tab kategorilerinden otomatik gelir.
                </div>
            </div>
        );
    };

    const renderGameRouteEditor = ({
        label,
        value,
        sectionIndex,
        fieldIndex,
        path,
    }) => {
        const gamePath = path.slice(0, -1);
        const fieldKey = path[path.length - 1];

        const currentGames = selectedPageData.sections[sectionIndex].fields[fieldIndex].value;
        let currentGame = currentGames;

        for (let i = 0; i < gamePath.length; i += 1) {
            currentGame = currentGame?.[gamePath[i]];
        }

        const generatedSlug = buildGameSlug(currentGame);
        const generatedDetailPath = `/games/${generatedSlug}`;

        const applyAutoValue = () => {
            if (fieldKey === "slug") {
                handleNestedChange(sectionIndex, fieldIndex, path, generatedSlug);

                const detailPathPath = [...gamePath, "detailPath"];
                handleNestedChange(sectionIndex, fieldIndex, detailPathPath, generatedDetailPath);
                return;
            }

            if (fieldKey === "detailPath") {
                handleNestedChange(sectionIndex, fieldIndex, path, generatedDetailPath);
            }
        };

        return (
            <div style={fieldRowStyle}>
                {label ? <span style={labelStyle}>{label}</span> : null}

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        value={value ?? ""}
                        onChange={(e) =>
                            handleNestedChange(sectionIndex, fieldIndex, path, e.target.value)
                        }
                        style={inputStyle}
                    />

                    <button
                        type="button"
                        onClick={applyAutoValue}
                        style={{
                            ...smallButtonStyle,
                            whiteSpace: "nowrap",
                            borderColor: "#bfdbfe",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                        }}
                    >
                        Otomatik Oluştur
                    </button>
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#2563eb",
                        fontWeight: 600,
                    }}
                >
                    Önerilen değer:{" "}
                    <strong>{fieldKey === "slug" ? generatedSlug : generatedDetailPath}</strong>
                </div>
            </div>
        );
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

        const lastPathKey = path[path.length - 1];

        const isGameCategoryField =
            selectedPageData?.pageKey === MASTER_GAMES_PAGE_KEY &&
            lastPathKey === "category";

        if (isGameCategoryField) {
            return renderCategorySelectEditor({
                label: label || "category",
                value: value || gameCategoryOptions[0]?.value || "pc-games",
                onChange: (nextValue) =>
                    handleNestedChange(sectionIndex, fieldIndex, path, nextValue),
            });
        }

        const isGameRouteField =
            selectedPageData?.pageKey === MASTER_GAMES_PAGE_KEY &&
            (lastPathKey === "slug" || lastPathKey === "detailPath");

        if (isGameRouteField) {
            return renderGameRouteEditor({
                label: label || lastPathKey,
                value,
                sectionIndex,
                fieldIndex,
                path,
            });
        }

        return renderPrimitiveEditor({
            label,
            value: value ?? "",
            onChange: (nextValue) =>
                handleNestedChange(sectionIndex, fieldIndex, path, nextValue),
            multiline: typeof value === "string" && String(value).length > 120,
        });
    };

    const renderSyncedGamesWarning = () => {
        return (
            <div
                style={{
                    border: "1px solid #bfdbfe",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    marginBottom: "14px",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    fontWeight: 700,
                }}
            >
                Bu oyun listesi senkron çalışır. Oyunları sadece{" "}
                <strong>GameDetails</strong> sayfasındaki <strong>Game Detail Items</strong>{" "}
                alanından değiştirebilirsiniz. Bu alan burada sadece önizleme amaçlıdır.
            </div>
        );
    };

    const renderField = (field, sectionIndex, fieldIndex) => {
        const section = selectedPageData?.sections?.[sectionIndex];

        const isReadonlySyncedGames = isSyncedGamesField(
            selectedPageData?.pageKey,
            section,
            field
        );

        const isMasterGamesField =
            selectedPageData?.pageKey === MASTER_GAMES_PAGE_KEY &&
            section?.id === "games" &&
            field?.id === "items";

        return (
            <div
                key={`field-${sectionIndex}-${fieldIndex}`}
                style={{
                    border: isMasterGamesField
                        ? "1px solid #bfdbfe"
                        : "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "16px",
                    background: isMasterGamesField ? "#eff6ff" : "#fcfdff",
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

                {isReadonlySyncedGames ? (
                    <>
                        {renderSyncedGamesWarning()}

                        <div
                            style={{
                                opacity: 0.85,
                                pointerEvents: "none",
                                filter: "grayscale(0.1)",
                                background: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                borderRadius: "18px",
                                padding: "14px",
                            }}
                        >
                            {renderAnyValue({
                                value: field.value,
                                sectionIndex,
                                fieldIndex,
                                path: [],
                                label: field.label || field.id,
                            })}
                        </div>
                    </>
                ) : field.type === "image" ? (
                    renderImageEditor({
                        label: field.label,
                        value: field.value,
                        onChange: (nextValue) => updateFieldValue(sectionIndex, fieldIndex, nextValue),
                        onUpload: (file) => handleUploadImage(sectionIndex, fieldIndex, [], file),
                    })
                ) : (
                    renderAnyValue({
                        value: field.value,
                        sectionIndex,
                        fieldIndex,
                        path: [],
                        label: field.label || field.id,
                    })
                )}
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

                        {SYNCED_GAMES_PAGE_KEYS.includes(selectedPageData?.pageKey) ? (
                            <div
                                style={{
                                    marginTop: "8px",
                                    color: "#b91c1c",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                }}
                            >
                                Bu sayfadaki oyun verileri GameDetails üzerinden senkronize edilir. Buradan düzenlenemez.
                            </div>
                        ) : null}

                        {selectedPageData?.pageKey === MASTER_GAMES_PAGE_KEY ? (
                            <div
                                style={{
                                    marginTop: "8px",
                                    color: "#047857",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                }}
                            >
                                Bu sayfa merkez oyun verisidir. Kaydedildiğinde GamesPage, Games ve Header otomatik güncellenir.
                            </div>
                        ) : null}

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
                            borderColor: messageType === "success" ? "#86efac" : "#fecaca",
                            background:
                                messageType === "success"
                                    ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                                    : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                            color: messageType === "success" ? "#166534" : "#991b1b",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontWeight: 800,
                            fontSize: "14px",
                        }}
                    >
                        <span
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "999px",
                                background: messageType === "success" ? "#22c55e" : "#ef4444",
                                boxShadow:
                                    messageType === "success"
                                        ? "0 0 0 4px rgba(34,197,94,0.15)"
                                        : "0 0 0 4px rgba(239,68,68,0.15)",
                                flexShrink: 0,
                            }}
                        />

                        <span>{message}</span>
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