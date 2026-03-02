import { Row, Col } from "react-bootstrap";
import SideBarMenu from "./SideBarMenu";
import NavBar from "./NavBar";

export default function Layout({ children, titleMain }) {
  return (
    <Row>
      <Col md={3} className="p-0">
        <SideBarMenu />
      </Col>

      <Col md={9} style={{ backgroundColor: "#F0F0FA", minHeight: "100vh" }}>
        <NavBar titleMain={titleMain} />
        {children}
      </Col>
    </Row>
  );
}
