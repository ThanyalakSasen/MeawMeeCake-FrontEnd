import { useCallback, useEffect, useMemo, useState } from "react";

const MOCK_INGREDIENTS = [
  {
    id: "ing-001",
    name: "แป้งเค้ก",
    unit: "กก.",
    quantity: 25,
    reorderPoint: 10,
    status: "พร้อมใช้",
  },
  {
    id: "ing-002",
    name: "เนยจืด",
    unit: "กก.",
    quantity: 8,
    reorderPoint: 10,
    status: "สต็อกต่ำ",
  },
  {
    id: "ing-003",
    name: "นมสด",
    unit: "ลิตร",
    quantity: 0,
    reorderPoint: 5,
    status: "หมดสต็อก",
  },
  {
    id: "ing-004",
    name: "น้ำตาลทราย",
    unit: "กก.",
    quantity: 14,
    reorderPoint: 8,
    status: "พร้อมใช้",
  },
];

const mapStatus = (quantity, reorderPoint, rawStatus) => {
  const normalizedStatus = String(rawStatus || "").toLowerCase();
  if (normalizedStatus.includes("หมด")) {
    return { statusLabel: "หมดสต็อก", statusVariant: "danger" };
  }
  if (quantity <= 0) {
    return { statusLabel: "หมดสต็อก", statusVariant: "danger" };
  }
  if (quantity <= reorderPoint || normalizedStatus.includes("ต่ำ")) {
    return { statusLabel: "ใกล้หมด", statusVariant: "warning" };
  }
  return { statusLabel: "พร้อมใช้", statusVariant: "success" };
};

const normalizeIngredient = (item, index) => {
  const quantity = Number(item?.ingredient_quantity ?? item?.quantity ?? 0);
  const reorderPoint = Number(item?.reorder_point ?? item?.minimum_stock ?? 10);
  const status = mapStatus(
    quantity,
    reorderPoint,
    item?.ingredient_status ?? item?.status,
  );

  return {
    id: item?._id || item?.id || `ingredient-${index}`,
    name: item?.ingredient_name || item?.name || "-",
    unit: item?.ingredient_unit || item?.unit || "หน่วย",
    quantity,
    reorderPoint,
    statusLabel: status.statusLabel,
    statusVariant: status.statusVariant,
  };
};

export const useViewModel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientMinQuantity, setNewIngredientMinQuantity] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("");

  const statusOptions = [
    { value: "all", label: "ทุกสถานะ" },
    { value: "พร้อมใช้", label: "พร้อมใช้" },
    { value: "ใกล้หมด", label: "ใกล้หมด" },
    { value: "หมดสต็อก", label: "หมดสต็อก" },
  ];

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const normalized = MOCK_INGREDIENTS.map((item, index) =>
        normalizeIngredient(item, index),
      );
      setIngredients(normalized);
    } catch (fetchError) {
      const errorMessage =
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "ไม่สามารถดึงข้อมูลวัตถุดิบได้";
      setError(errorMessage);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const filteredIngredients = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return ingredients.filter((item) => {
      const matchesName = !keyword || item.name.toLowerCase().includes(keyword);
      const matchesStatus =
        statusFilter === "all" || item.statusLabel === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [ingredients, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return filteredIngredients.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.statusLabel === "ใกล้หมด") acc.lowStock += 1;
        if (item.statusLabel === "หมดสต็อก") acc.outOfStock += 1;
        return acc;
      },
      { total: 0, lowStock: 0, outOfStock: 0 },
    );
  }, [filteredIngredients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleEdit = (id) => {
    console.log("edit ingredient", id);
  };

  const handleDelete = (id) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAddIngredientForm = () => {
    setNewIngredientName("");
    setNewIngredientMinQuantity("");
    setNewIngredientUnit("");
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetAddIngredientForm();
  };

  const handleSaveNewIngredient = () => {
    const name = newIngredientName.trim();
    const unit = newIngredientUnit.trim();
    const reorderPoint = Number(newIngredientMinQuantity);

    if (!name || !unit || Number.isNaN(reorderPoint) || reorderPoint < 0) {
      window.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newItem = normalizeIngredient(
      {
        id: `ingredient-${Date.now()}`,
        name,
        unit,
        quantity: 0,
        reorder_point: reorderPoint,
      },
      ingredients.length,
    );

    setIngredients((prev) => [newItem, ...prev]);
    handleCloseAddModal();
  };

  const handleDownloadPurchaseReport = () => {
    const purchaseList = ingredients.filter(
      (item) => item.quantity <= item.reorderPoint,
    );

    if (purchaseList.length === 0) {
      window.alert("ไม่มีรายการที่ต้องซื้อ");
      return;
    }

    const header = ["ชื่อวัตถุดิบ", "จำนวนคงเหลือ", "หน่วย", "สต็อกขั้นต่ำ", "สถานะ"];
    const rows = purchaseList.map((item) => [
      item.name,
      item.quantity,
      item.unit,
      item.reorderPoint,
      item.statusLabel,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purchase-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusOptions,
    filteredIngredients,
    stats,
    loading,
    error,
    handleRefresh: fetchIngredients,
    handleEdit,
    handleDelete,
    handleDownloadPurchaseReport,
    showAddModal,
    newIngredientName,
    setNewIngredientName,
    newIngredientMinQuantity,
    setNewIngredientMinQuantity,
    newIngredientUnit,
    setNewIngredientUnit,
    handleOpenAddModal,
    handleCloseAddModal,
    handleSaveNewIngredient,
    handleSubmit,
  };
};
