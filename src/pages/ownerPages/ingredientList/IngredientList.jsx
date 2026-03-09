import Layout from "../../../components/Layout";
import { useViewModel } from "./viewmodel";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";
import { FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiDownload } from "react-icons/fi";
import "./IngredientList.css";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "../../../components/selectInput";

export default function IngredientList() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusOptions,
    filteredIngredients,
    stats,
    loading,
    error,
    handleRefresh,
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
  } = useViewModel();

  return (
    <Layout titleMain="จัดการวัตถุดิบ">
      <Row className="m-3">
        <Col md={12} className="w-100">
          <div className="ingredient-list-panel p-4 rounded">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h4 className="mb-1">รายการวัตถุดิบ</h4>
                <p className="text-muted mb-0">
                  ตรวจสอบสต็อกและสถานะวัตถุดิบล่าสุด
                </p>
              </div>

              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={handleRefresh}>
                  <FiRefreshCw className="me-2" /> รีเฟรช
                </Button>
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={handleDownloadPurchaseReport}
                >
                  <FiDownload className="me-2" /> รายการที่ต้องซื้อ
                </Button>
                <Button variant="success" type="button" onClick={handleOpenAddModal}>
                  <FiPlus className="me-2" /> เพิ่มวัตถุดิบใหม่
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Row className="g-3 mb-4">
                <Col md={5} lg={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FiSearch />
                    </InputGroup.Text>
                    <Form.Control
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="ค้นหาชื่อวัตถุดิบ"
                    />
                  </InputGroup>
                </Col>
                <Col md={4} lg={3}>
                  <SelectInput
                    name="statusFilter"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                </Col>
                <Col md={3} lg={2}>
                  <Button type="submit" variant="primary" className="w-100">
                    ค้นหา
                  </Button>
                </Col>
              </Row>
            </form>

            <Row className="g-3 mb-4">
              <Col sm={6} lg={4}>
                <Card className="ingredient-stat-card border-0 shadow-sm h-100">
                  <Card.Body>
                    <small className="text-muted d-block mb-2">
                      วัตถุดิบทั้งหมด
                    </small>
                    <h3 className="mb-0">{stats.total}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} lg={4}>
                <Card className="ingredient-stat-card border-0 shadow-sm h-100">
                  <Card.Body>
                    <small className="text-muted d-block mb-2">
                      สต็อกใกล้หมด
                    </small>
                    <h3 className="mb-0 text-warning">{stats.lowStock}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} lg={4}>
                <Card className="ingredient-stat-card border-0 shadow-sm h-100">
                  <Card.Body>
                    <small className="text-muted d-block mb-2">หมดสต็อก</small>
                    <h3 className="mb-0 text-danger">{stats.outOfStock}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" role="status" />
              </div>
            )}

            {!loading && error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 ingredient-table table-striped border">
                  <thead>
                    <tr>
                      <th>ชื่อวัตถุดิบ</th>
                      <th className="text-end">จำนวนคงเหลือ</th>
                      <th>หน่วย</th>
                      <th>สถานะ</th>
                      <th className="text-end">สต็อกขั้นต่ำ</th>
                      <th className="text-center">เพิ่มเติม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIngredients.length > 0 ? (
                      filteredIngredients.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td className="text-end fw-semibold">
                            {item.quantity}
                          </td>
                          <td>{item.unit}</td>
                          <td>
                            <Badge bg={item.statusVariant}>
                              {item.statusLabel}
                            </Badge>
                          </td>
                          <td className="text-end">{item.reorderPoint}</td>
                          <td className="text-center">
                            <div className="ingredient-actions">
                              <FiEdit2
                                size={18}
                                className="text-success"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleEdit(item.id)}
                              />

                              <BsTrash
                                size={18}
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(item.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          ไม่พบข้อมูลวัตถุดิบตามคำค้นหา
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>

          <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>รายละเอียดของวัตถุดิบ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder="กรอกชื่อวัตถุดิบ"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>จำนวนขั้นต่ำ</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={newIngredientMinQuantity}
                  onChange={(e) => setNewIngredientMinQuantity(e.target.value)}
                  placeholder="กรอกจำนวนขั้นต่ำ"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>หน่วย</Form.Label>
                <Form.Control
                  value={newIngredientUnit}
                  onChange={(e) => setNewIngredientUnit(e.target.value)}
                  placeholder="เช่น กก., ลิตร, ถุง"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={handleCloseAddModal}>
                ยกเลิก
              </Button>
              <Button variant="success" onClick={handleSaveNewIngredient}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Layout>
  );
}
