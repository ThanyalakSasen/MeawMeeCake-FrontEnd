import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Alert,
  Spinner,
  Button,
  Image,
} from "react-bootstrap";
import { InputField } from "../../components/inputField";
import InputDate from "../../components/inputDate";
import { SelectInput } from "../../components/selectInput";
import ImageUpload from "../../components/imageUploadComponent";
import Layout from "../../components/Layout";
import api from "../../service/api";

export default function UpdateInfoEmployeeForOwner() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ===== FORM STATE =====
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");

  // Employee only
  const [position, setPosition] = useState("");
  const [startWorkDate, setStartWorkDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [partTimeHours, setPartTimeHours] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // ===== OPTIONS =====
  const positionOptions = [
    { value: "", label: "กรุณาเลือกตำแหน่ง" },
    { value: "พนักงานครัว", label: "พนักงานครัว" },
    { value: "พนักงานบริการ", label: "พนักงานบริการ" },
    { value: "ผู้จัดการ", label: "ผู้จัดการ" },
    { value: "แม่บ้าน", label: "แม่บ้าน" },
  ];

  const typeEmployeeOptions = [
    { value: "", label: "กรุณาเลือกประเภทพนักงาน" },
    { value: "Full-time", label: "เต็มเวลา" },
    { value: "Part-time", label: "พาร์ทไทม์" },
  ];

  // ===== HELPERS =====
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  const formatDateToISO = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  };

  // ===== FETCH EMPLOYEE =====
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsFetching(true);
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/api/user/admin/employee/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          const emp = res.data.data;

          setFullname(emp.user_fullname || "");
          setEmail(emp.email || "");
          setPhone(emp.user_phone || "");
          setDateOfBirth(
            emp.user_birthdate ? new Date(emp.user_birthdate) : ""
          );
          setRole(emp.role || "");

          setPosition(emp.emp_position?.position_name || "");
          setStartWorkDate(
            emp.start_working_date ? new Date(emp.start_working_date) : ""
          );
          setEmployeeType(emp.employment_type || "");
          setEmployeeSalary(emp.emp_salary || "");
          setPartTimeHours(emp.part_time_hours || "");

          setPreviewImage(getImageUrl(emp.user_img));
        } else {
          setErrorMessage(res?.data?.message || "ไม่พบข้อมูลพนักงาน");
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
        setErrorMessage(
          err?.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchEmployee();
  }, [userId]);

  // ===== IMAGE CHANGE =====
  const handleImageChange = (file) => {
    if (!file) return;
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullname || !email || !phone) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (role === "Employee") {
      if (!position || !startWorkDate || !employeeType) {
        setErrorMessage("กรุณากรอกข้อมูลพนักงานให้ครบถ้วน");
        return;
      }

      if (employeeType === "Full-time" && !employeeSalary) {
        setErrorMessage("กรุณากรอกเงินเดือน");
        return;
      }

      if (employeeType === "Part-time" && !partTimeHours) {
        setErrorMessage("กรุณากรอกชั่วโมงทำงาน");
        return;
      }
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("user_fullname", fullname);
      formData.append("email", email);
      formData.append("user_phone", phone);

      if (birthdate) {
        formData.append("user_birthdate", formatDateToISO(birthdate));
      }

      if (image) {
        formData.append("user_img", image);
      }

      if (role === "Employee") {
        formData.append("emp_position", position);
        formData.append(
          "start_working_date",
          formatDateToISO(startWorkDate)
        );
        formData.append("employment_type", employeeType);

        if (employeeType === "Full-time") {
          formData.append("emp_salary", Number(employeeSalary));
        }

        if (employeeType === "Part-time") {
          formData.append(
            "part_time_hours",
            Number(partTimeHours)
          );
        }
      }

      const res = await api.put(
        `/api/user/admin/update-info-employee-for-admin/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setSuccessMessage("อัปเดตข้อมูลพนักงานสำเร็จ");
        setTimeout(
          () => navigate(`/information-profile/${userId}`),
          1500
        );
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setErrorMessage(
        err?.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== LOADING =====
  if (isFetching) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  // ===== UI =====
  return (
    <Layout titleMain="แก้ไขข้อมูลพนักงาน">
      <div className="p-4 bg-white rounded m-4">
        <form onSubmit={handleSubmit}>
              {/* IMAGE */}
              <div className="text-center mb-4">
                <Image
                  src={previewImage || "/default-avatar.png"}
                  roundedCircle
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                  className="border shadow-sm mb-2"
                />

                <ImageUpload
                  label="เปลี่ยนรูปภาพ"
                  onChange={handleImageChange}
                />

                {image && (
                  <p className="text-success mt-2">
                    เลือกรูปใหม่แล้ว: {image.name}
                  </p>
                )}
              </div>

              <Row>
                <Col md={6}>
                  <InputField
                    label="ชื่อ-นามสกุล *"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  <InputField
                    label="อีเมล *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    label="เบอร์โทรศัพท์ *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <InputDate
                    label="วันเกิด"
                    value={birthdate}
                    onChange={setDateOfBirth}
                  />
                </Col>

                <Col md={6}>
                  {role === "Employee" && (
                    <>
                      <SelectInput
                        label="ตำแหน่งงาน *"
                        options={positionOptions}
                        value={position}
                        onChange={(e) =>
                          setPosition(e.target.value)
                        }
                      />
                      <InputDate
                        label="วันที่เริ่มงาน *"
                        value={startWorkDate}
                        onChange={setStartWorkDate}
                      />
                      <SelectInput
                        label="ประเภทพนักงาน *"
                        options={typeEmployeeOptions}
                        value={employeeType}
                        onChange={(e) =>
                          setEmployeeType(e.target.value)
                        }
                      />

                      {employeeType === "Full-time" && (
                        <InputField
                          label="เงินเดือน *"
                          type="number"
                          value={employeeSalary}
                          onChange={(e) =>
                            setEmployeeSalary(e.target.value)
                          }
                        />
                      )}

                      {employeeType === "Part-time" && (
                        <InputField
                          label="ชั่วโมงทำงานต่อวัน *"
                          type="number"
                          value={partTimeHours}
                          onChange={(e) =>
                            setPartTimeHours(e.target.value)
                          }
                        />
                      )}
                    </>
                  )}
                </Col>
              </Row>

              {successMessage && (
                <Alert variant="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}

          <div className="text-end mt-4">
            <Button
              variant="secondary"
              className="me-2"
              type="button"
              onClick={() => navigate(`/information-profile/${userId}`)}
            >
              ยกเลิก
            </Button>
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
