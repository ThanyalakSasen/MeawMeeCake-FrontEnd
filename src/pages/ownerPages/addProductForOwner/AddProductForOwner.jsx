import { InputField } from "../../../components/inputField";
import { SelectInput } from "../../../components/selectInput";
import { TextArea } from "../../../components/TextArea";
import SquareImageUpload from "../../../components/SquareImageUpload";
import Layout from "../../../components/Layout";
import { Row, Col, Spinner, Form } from "react-bootstrap";
import { useViewModel } from "./viewmodel";

export default function AddProductForOwner() {
  const {
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
    image,
    setImage,
    isLoading,
    hasHeatingMethod,
    handleHasHeatingMethodChange,
    handleSubmit,
  } = useViewModel();

  return (
    <Layout titleMain="เพิ่มสินค้าใหม่">
      <Row className="m-3">
        <Col md={10} className="w-100">
          <div className="p-4 bg-white rounded">
            <form onSubmit={handleSubmit}>
              <Row className="p-5 g-5">
                {/* LEFT */}
                <Col md={6}>
                  <InputField
                    label="ชื่อสินค้า (ภาษาไทย) *"
                    value={productNameTh}
                    onChange={(e) => setProductNameTh(e.target.value)}
                  />
                  <InputField
                    label="ชื่อสินค้า (ภาษาอังกฤษ) *"
                    value={productNameEng}
                    onChange={(e) => setProductNameEng(e.target.value)}
                  />
                  <InputField
                    label="ราคาสินค้า (บาท) *"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                  <SelectInput
                    label="ประเภทสินค้า *"
                    options={productTypes}
                    value={productTypes}
                    onChange={(e) => setProductTypes(e.target.value)}
                    disabled={categoryLoading} // disable ระหว่างโหลด
                  />
                  <TextArea
                    label="คำอธิบายสินค้า"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                  <div style={{ marginBottom: "16px", marginTop: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontWeight: "500",
                      }}
                    >
                      มีวิธีการเตรียมอุ่น/เก็บรักษาหรือไม่
                    </label>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <Form.Check
                        type="radio"
                        id="has-heating-method-yes"
                        name="hasHeatingMethod"
                        label="มี"
                        checked={hasHeatingMethod === true}
                        onChange={() => handleHasHeatingMethodChange(true)}
                        style={{ cursor: "pointer" }}
                      />
                      <Form.Check
                        type="radio"
                        id="has-heating-method-no"
                        name="hasHeatingMethod"
                        label="ไม่มี"
                        checked={hasHeatingMethod === false}
                        onChange={() => handleHasHeatingMethodChange(false)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  {hasHeatingMethod === true && (
                    <Col md={12}>
                      <TextArea
                        label="วิธีการเตรียมอุ่น"
                        value={preparationHeating}
                        onChange={(e) => setPreparationHeating(e.target.value)}
                      />
                    </Col>
                  )}
                </Col>

                {/* RIGHT */}
                <Col md={6}>
                  <SquareImageUpload
                    label="อัปโหลดรูป"
                    image={image}
                    setImage={setImage}
                    fluid
                  />
                </Col>
              </Row>

              <div className="text-center mt-4">
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
