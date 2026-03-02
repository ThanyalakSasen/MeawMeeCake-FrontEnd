import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../service/api";

export const useViewModel = () => {
  const [productNameTh, setProductNameTh] = useState("");
  const [productNameEng, setProductNameEng] = useState("");
  const [productTypes, setProductTypes] = useState([
    { value: "", label: "กรุณาเลือกประเภทสินค้า" },
  ]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [preparationHeating, setPreparationHeating] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [hasHeatingMethod, setHasHeatingMethod] = useState(null);

  const handleHasHeatingMethodChange = (value) => {
    setHasHeatingMethod(value);
    if (value) {
      setPreparationHeating("");
    } else {
      setPreparationHeating("ไม่มีวิธีการเตรียมอุ่น");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await api.get("/api/product/create-product");
        const categories = response?.data?.data || response?.data || [];

        const options = [
          { value: "", label: "กรุณาเลือกประเภทสินค้า" },
          ...categories.map((cat) => ({
            value: cat._id,
            label: cat.category_name,
          })),
        ];

        setProductTypes(options);
      } catch (error) {
        console.error("ดึงข้อมูล Category ไม่สำเร็จ:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productNameTh || !productNameEng || !productTypes || !productPrice) {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการเพิ่มสินค้า",
      html: `
                <div style="text-align: left;">
                    <p><strong>ชื่อสินค้า:</strong> ${productNameTh} / ${productNameEng}</p>
                    <p><strong>ประเภท:</strong> ${productTypes}</p>
                    <p><strong>ราคา:</strong> ${productPrice} บาท</p>
                    </div>
            `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("product_name_th", productNameTh);
      formData.append("product_name_eng", productNameEng);
      formData.append("product_type", productTypes);
      formData.append("product_price", productPrice);
      formData.append("product_description", productDescription);
      formData.append("preparation_heating", preparationHeating);

      if (recipeId && recipeId !== "") {
        formData.append("recipe_id", recipeId);
      }

      if (image) {
        formData.append("product_img", image);
      }

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/products/create-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success || response.status === 201) {
        const result = await Swal.fire({
          icon: "success",
          title: "เพิ่มสินค้าสำเร็จ!",
          text: "สินค้าได้ถูกเพิ่มเข้าระบบแล้ว คุณต้องการเพิ่มสูตรต่อหรือไม่?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const newProductId = response.data.data?._id || response.data._id;
          window.location.href = `/add-recipe/${newProductId}`;
        } else {
          window.location.href = "/product-manage";
        }

        setProductNameTh("");
        setProductNameEng("");
        setProductTypes("");
        setProductNameEng("");
        setProductPrice("");
        setProductDescription("");
        setRecipeId("");
        setImage(null);
      }
    } catch (error) {
      console.error("Add Product Error:", error);

      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    productNameTh,
    setProductNameTh,
    productNameEng,
    setProductNameEng,
    productTypes,
    setProductTypes,
    categoryLoading,
    productPrice,
    setProductPrice,
    productDescription,
    setProductDescription,
    preparationHeating,
    setPreparationHeating,
    recipeId,
    image,
    setImage,
    isLoading,
    hasHeatingMethod,
    handleHasHeatingMethodChange,
    handleSubmit,
  };
};
