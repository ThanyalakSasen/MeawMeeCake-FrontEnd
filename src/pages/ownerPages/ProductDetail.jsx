import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../service/api";

export default function ProductDetail() {
	const { productId } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await api.get(`/api/products/get-by-id/${productId}`);
				setProduct(response?.data || null);
			} catch (err) {
				console.error("Fetch Product Detail Error:", err);
				setError("ไม่สามารถดึงข้อมูลสินค้าได้");
			} finally {
				setLoading(false);
			}
		};

		if (productId) {
			fetchProduct();
		} else {
			setLoading(false);
			setError("ไม่พบรหัสสินค้า");
		}
	}, [productId]);

	const imageUrl = product?.product_img || "";

	return (
		<Layout titleMain="รายละเอียดสินค้า">
			<Row className="px-4 pb-4">
				<Col>
					{loading && (
						<div className="text-center py-4">
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						</div>
					)}

					{!loading && error && <Alert variant="danger">{error}</Alert>}

					{!loading && !error && product && (
						<Card className="p-3">
							<Row>
								<Col md={4} className="mb-3">
									<Card.Img
										src={imageUrl || "holder.js/300x300"}
										alt={product.product_name_th}
										style={{ objectFit: "cover", width: "100%", height: 300 }}
									/>
								</Col>
								<Col md={8}>
									<h4 className="mb-2">
										{product.product_name_th} ({product.product_name_eng})
									</h4>
									<p className="mb-1">
										<strong>ประเภท:</strong> {product.product_type || "-"}
									</p>
									<p className="mb-1">
										<strong>ราคา:</strong> {product.product_price ?? "-"} บาท
									</p>
									<p className="mb-1">
										<strong>คำอธิบาย:</strong> {product.product_description || "-"}
									</p>
									<p className="mb-3">
										<strong>วิธีการเตรียมอุ่น:</strong> {product.preparation_heating || "-"}
									</p>

									<div className="d-flex gap-2">
										<Button variant="secondary" onClick={() => navigate(-1)}>
											กลับ
										</Button>
										<Button
											variant="warning"
											onClick={() => navigate(`/edit-product/${product._id}`)}
										>
											แก้ไขสินค้า
										</Button>
									</div>
								</Col>
							</Row>
						</Card>
					)}
				</Col>
			</Row>
		</Layout>
	);
}
