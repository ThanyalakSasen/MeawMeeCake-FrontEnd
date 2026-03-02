import { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SquareImageUpload = ({ label, setImage, fluid = false, size = 180 }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0 });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImageMeta({ width: img.width, height: img.height });
      setPreview(imageUrl);
      setImage(file);
    };
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const getImageStyle = () => {
    const width = imageMeta.width;
    const height = imageMeta.height;
    const mainSize = fluid ? "100%" : size;

    if (!width || !height || width === height) {
      return {
        width: mainSize,
        height: fluid ? "auto" : size,
        maxWidth: "100%",
        maxHeight: fluid ? "100%" : size,
        borderRadius: "12px",
      };
    }

    if (height > width) {
      return {
        height: mainSize,
        width: "auto",
        maxWidth: "100%",
        maxHeight: fluid ? "100%" : size,
        borderRadius: "12px",
      };
    }

    return {
      width: mainSize,
      height: "auto",
      maxWidth: "100%",
      maxHeight: fluid ? "100%" : size,
      borderRadius: "12px",
    };
  };

  return (
    <Container
      fluid={fluid}
      style={{
        display: "flex",
        flex: fluid ? 1 : undefined,
        width: fluid ? "100%" : undefined,
      }}
    >
      <Row className="align-items-center w-100">
        <Col xs={12} className="text-center mx-auto">
          {label && (
            <Form.Label className="w-100 text-start">{label}</Form.Label>
          )}
          <Container
            fluid
            className="border shadow-sm d-flex justify-content-center align-items-center p-4"
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "12px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Image
              src={preview}
              className="object-fit-cover"
              style={getImageStyle()}
            />
          </Container>
          <br />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <Button variant="primary" onClick={handleButtonClick}>
            อัปโหลดรูปภาพ
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SquareImageUpload;
