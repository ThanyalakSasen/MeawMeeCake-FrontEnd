import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import { InputField } from "../../components/inputField";
import api from "../../service/api";

export default function EmployeeManage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log("Fetching employees...");
      
      const response = await api.get("/api/user/admin/employees");
      console.log("Response:", response);
      console.log("Response data:", response.data);
      
      if (response.data.success) {
        console.log("Employees data:", response.data.data);
        console.log("Number of employees:", response.data.data.length);
        
        // Filter เฉพาะพนักงานที่ไม่ได้ถูก soft delete
        const activeEmployees = response.data.data.filter(
          (emp) => emp.softDelete === false
        );
        console.log("Active employees after filter:", activeEmployees.length);
        setEmployees(activeEmployees);
      }
    } catch (err) {
      console.error("Fetch Employees Error:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

const handleSoftDelete = async (employeeId) => {
  const result = await Swal.fire({
    title: "ยืนยันการลบพนักงาน",
    text: "คุณต้องการลบพนักงานคนนี้ใช่หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    reverseButtons: true,
  });

  // ถ้ากด Cancel
  if (!result.isConfirmed) return;

  try {
    const softDeleteEndpoints = [
      `/api/user/admin/employees/${employeeId}/softDeleted`,
    ];

    let response;
    let lastError;

    for (const endpoint of softDeleteEndpoints) {
      try {
        response = await api.delete(endpoint);
        break;
      } catch (error) {
        if (error?.response?.status !== 404) {
          throw error;
        }
        lastError = error;
      }
    }

    if (!response) {
      throw lastError || new Error("Soft delete endpoint not found");
    }

    if (response.data.success) { 
      await Swal.fire({
        icon: "success",
        title: "ลบสำเร็จ",
        text: "ลบข้อมูลพนักงานเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchEmployees();
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: err.response?.data?.message || "ไม่สามารถลบพนักงานได้",
    });
  }
};


  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout titleMain="รายชื่อพนักงาน">

          <div
            style={{
              backgroundColor: "#fff",
              padding: "2%",
              borderRadius: "10px",
              margin: "0% 4%",
            }}
          >
            <Row className="align-items-center p-0 w-80">
              <Col md={6}>
                <form
                  style={{ display: "flex", gap: "10px" }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <InputField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน"
                  />
                </form>
              </Col>
              <Col md={6} className="text-end">
                <Button
                  variant="primary"
                  onClick={() => navigate("/create-employee")}
                  style={{ marginRight: "1%" }}
                >
                  เพิ่มพนักงาน
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/deleted-employees")}
                >
                  รายชื่อพนักงานที่ถูกลบ
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2%",
              borderRadius: "10px",
              margin: "2% 4%",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>รหัสพนักงาน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">
                      <Alert variant="danger">{error}</Alert>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      ไม่พบข้อมูลพนักงาน
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} style={{ textAlign: "center" }}>
                      <td>{employee.emp_id || "-"}</td>
                      <td>{employee.user_fullname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.user_phone || "-"}</td>

                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() =>
                            navigate(`/information-profile/${employee._id}`)
                          }
                        >
                          <FiEdit /> แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleSoftDelete(employee._id)}
                        >
                          <FiTrash2 /> ลบ
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
    </Layout>
  );
}
