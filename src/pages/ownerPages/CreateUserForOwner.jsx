import { useState, useEffect } from "react";
import { InputField } from "../../components/inputField";
import InputDate from "../../components/inputDate";
import { SelectInput } from "../../components/selectInput";
import ImageUpload from "../../components/imageUploadComponent";
import Layout from "../../components/Layout";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../service/api";

export default function CreateUserForAdmin() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);

  // Employee only
  const [position, setPosition] = useState("");
  const [startWorkDate, setStartWorkDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [partTimeHours, setPartTimeHours] = useState("");
  const [positionOptions, setPositionOption] = useState([]);
  const [password, setPassword] = useState("");
  const passwordLength = 6;

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchPositions = async () => {
    try {
      const response = await api.get("/api/position/allPosition");

      const positions = response?.data?.data || response?.data || [];
      const options = [
        { value: "", label: "กรุณาเลือกตำแหน่งงาน" },
        ...positions.map((pos) => ({
          value: pos._id,
          label: pos.position_name, // ให้ตรงกับ field ใน PositionModel
        })),
      ];
      setPositionOption(options);
    } catch (error) {
      console.error("ดึงข้อมูลตำแหน่งพนักงานไม่สำเร็จ :", error);
    }
  };
  fetchPositions(); // การเรียกฟังก์ชัน
}, []);

  const generatePassword = () => {
    const charset = "0123456789abcdefghijklmnopqrstuvwxyz";
    let newPassword = "";

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(newPassword);
    setCopyMessage("");
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopyMessage("คัดลอกรหัสผ่านเรียบร้อยแล้ว!");
    setTimeout(() => setCopyMessage(""), 3000);
  };

  const roleOptions = [
    { value: "", label: "กรุณาเลือกบทบาท" },
    { value: "Employee", label: "พนักงาน" },
    { value: "Customer", label: "ลูกค้า" },
  ];

const typeEmployeeOptions = [
  { value: "", label: "กรุณาเลือกประเภทพนักงาน" },
  { value: "Full-time", label: "เต็มเวลา" },
  { value: "Part-time", label: "พาร์ทไทม์" },
  { value: "Daily", label: "รายวัน" },
];

  // ฟังก์ชันแปลงวันที่เป็น ISO format
  const formatDateToISO = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }
    if (typeof date === "string") {
      // ถ้าเป็น dd/mm/yyyy ให้แปลงเป็น YYYY-MM-DD
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return date; // ถ้าเป็น YYYY-MM-DD อยู่แล้ว
    }
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!fullname || !email || !phone || !password || !role) {
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

    // แสดง SweetAlert2 เพื่อยืนยัน
    const result = await Swal.fire({
      title: "ยืนยันการสร้างผู้ใช้งาน",
      html: `
        <div style="text-align: left;">
          <p><strong>ชื่อ:</strong> ${fullname}</p>
          <p><strong>อีเมล:</strong> ${email}</p>
          <p><strong>บทบาท:</strong> ${role}</p>
          ${role === "Employee" ? `<p><strong>ประเภทพนักงาน:</strong> ${employeeType}</p>` : ""}
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

    // ถ้ากด Cancel
    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);

      // เตรียมข้อมูลสำหรับส่งไป Backend
      const formData = new FormData();
      
      formData.append("userFullname", fullname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("empPosition", position);
      formData.append("userPhone", phone);
      formData.append("userBirthdate", formatDateToISO(birthdate));
      formData.append("role", role);
      formData.append("empSalary", Number(employeeSalary));
      formData.append("startWorkingDate", formatDateToISO(startWorkDate));
      formData.append("employmentType", employeeType);
      formData.append("empStatus", "Active"); 
      formData.append("authProvider", "local");
      formData.append("isEmailVerified", "true");
      formData.append("profileCompleted", "true");
      
      if (birthdate) {
        formData.append("user_birthdate", formatDateToISO(birthdate));
      }

      // เพิ่มรูปภาพถ้ามี
      if (image) {
        formData.append("user_img", image);
      }

      // Employee ให้เพิ่มข้อมูลพนักงาน
      if (role === "Employee") {
        formData.append("emp_position", position);
        formData.append("start_working_date", formatDateToISO(startWorkDate));
        formData.append("employment_type", employeeType);
        formData.append("emp_status", "Active");

        if (employeeType === "Full-time") {
          formData.append("emp_salary", Number(employeeSalary));
        }

        if (employeeType === "Part-time") {
          formData.append("partTimeHours", Number(partTimeHours));
        }
      }
      

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/user/admin/create-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // แสดง SweetAlert2 สำเร็จพร้อมรหัสผ่าน
        await Swal.fire({
          icon: "success",
          title: "เพิ่มผู้ใช้สำเร็จ!",
          html: `
            <div style="text-align: center;">
              <p>สร้างบัญชีผู้ใช้เรียบร้อยแล้ว</p>
              <hr>
              <p><strong>รหัสผ่านชั่วคราว:</strong></p>
              <p style="font-size: 24px; color: #3085d6; font-weight: bold;">${password}</p>
              <p style="color: #d33; font-size: 14px;">⚠️ กรุณาบันทึกรหัสผ่านนี้ไว้</p>
            </div>
          `,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3085d6",
        });

        // รีเซ็ตฟอร์ม
        setFullname("");
        setEmail("");
        setPhone("");
        setDateOfBirth("");
        setRole("");
        setPosition("");
        setStartWorkDate("");
        setEmployeeType("");
        setEmployeeSalary("");
        setPartTimeHours("");
        setPassword("");
        setImage(null);
      }
    } catch (error) {
      console.error("Create User Error:", error);
      
      // แสดง SweetAlert2 สำหรับข้อผิดพลาด
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้ได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout titleMain="เพิ่มผู้ใช้ใหม่">
      <Row className="m-3">
        <Col md={10} className="w-100">
          <div className="p-4 bg-white rounded">
            <form onSubmit={handleSubmit}>
                {/* เพิ่ม onChange handler หรือใช้แบบไม่ควบคุม */}
                <Row className="m-4 align-items-center">
                  <ImageUpload 
                    image={image} 
                    setImage={setImage}
                  />
                </Row>

                <Row>
                  {/* LEFT */}
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
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <InputField
                      label="รหัสผ่าน *"
                      type="text"
                      value={password}
                      //readOnly
                    />

                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={generatePassword}
                      >
                        🔐 สร้างรหัสผ่าน
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={copyToClipboard}
                        disabled={!password}
                      >
                        📋 คัดลอก
                      </button>
                    </div>

                    {copyMessage && (
                      <Alert variant="success">{copyMessage}</Alert>
                    )}

                    <InputDate
                      label="วันเกิด"
                      value={birthdate}
                      onChange={(value) => setDateOfBirth(value)}
                    />
                  </Col>

                  {/* RIGHT */}
                  <Col md={6}>
                    <SelectInput
                      label="บทบาท *"
                      options={roleOptions}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    {role === "Employee" && (
                      <>
                        <SelectInput
                          label="ตำแหน่งงาน *"
                          options={positionOptions}
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                        <InputDate
                          label="วันที่เริ่มงาน *"
                          value={startWorkDate}
                          onChange={(value) => setStartWorkDate(value)}
                        />
                        <SelectInput
                          label="ประเภทพนักงาน *"
                          options={typeEmployeeOptions}
                          value={employeeType}
                          onChange={(e) => setEmployeeType(e.target.value)}
                        />

                        {employeeType === "Full-time" && (
                          <InputField
                            label="เงินเดือน *"
                            type="number"
                            value={employeeSalary}
                            onChange={(e) => setEmployeeSalary(e.target.value)}
                          />
                        )}

                        {employeeType === "Part-time" && (
                          <InputField
                            label="ชั่วโมงทำงานต่อวัน *"
                            type="number"
                            value={partTimeHours}
                            onChange={(e) => setPartTimeHours(e.target.value)}
                          />
                        )}
                      </>
                    )}
                  </Col>
                </Row>

                {/* แสดงข้อความสำเร็จหรือผิดพลาด */}
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
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึกข้อมูล"
                    )}
                  </button>
                </div>
            </form>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}