import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import logoMaewMeeCake from "../assets/pictures/logoMaewMeeCake.png";
import { FiMenu } from "react-icons/fi";
import "./SideBar.css";

function SideBarMenu() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = () => setShow(!show);
  const toggleMenu = (index) =>
    setOpenIndex(openIndex === index ? null : index);

  const ListSideBarMenu = [
    {
      name: "รายงานยอดขาย/การวิเคราะห์ความคิดเห็น",
      subMenu: [
        { name: "รายงานยอดขาย", link: "/" },
        { name: "ผลการวิเคราะห์ความคิดเห็น", link: "/" },
      ],
    },
    {
      name: "จัดการสินค้า",
      subMenu: [
        { name: "รายการสินค้า", link: "/product-manage" },
        { name: "สต็อกสินค้า", link: "/" },
        { name: "ประวัติการสต็อกสินค้า", link: "/" },
      ],
    },
    {
      name: "จัดการสินค้าพรีออเดอร์",
      subMenu: [
        { name: "รายการสินค้าพรีออเดอร์", link: "/" },
        { name: "สถานะการผลิตสินค้าพรีออเดอร์", link: "/" },
        { name: "ประวัติการสต็อกสินค้าพรีออเดอร์", link: "/" },
      ],
    },
    {
      name: "จัดการคำสั่งซื้อ",
      subMenu: [
        { name: "คำสั่งซื้อทั้งหมด", link: "/" },
        { name: "การจัดส่งออเดอร์", link: "/" },
        { name: "ประวัติคำสั่งซื้อ", link: "/" },
      ],
    },
    {
      name: "จัดการวัตถุดิบ",
      subMenu: [
        { name: "รายการวัตถุดิบ", link: "/ingredient-list" },
        { name: "ฟอร์มรับวัตถุดิบใหม่", link: "/add-ingredient" },
        { name: "ประวัติการรับวัตถุดิบ", link: "/ingredient-receive-history" },
      ],
    },
    {
      name: "จัดการสูตร",
      link: "/manage-recipes",
    },
    {
      name: "จัดการพนักงาน",
      subMenu: [
        { name: "รายชื่อพนักงาน", link: "/employeeManage" },
        { name: "จัดการสิทธิ์พนักงาน", link: "/" },
        { name: "ตารางเวร/กะทำงาน", link: "/" },
      ],
    },
    {
      name: "การออกแบบเว็บไซต์",
      link: "/",
    },
  ];

  // ตรวจสอบขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MenuContent = () => (
    <Nav className="flex-column sidebar-menu">
      {ListSideBarMenu.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="sidebar-item">
            <div
              className={`sidebar-item-header ${isOpen ? "active" : ""}`}
              onClick={() => item.subMenu && toggleMenu(index)}
            >
              <span className="sidebar-item-title">{item.name}</span>

              {item.subMenu && (
                <span className={`chevron ${isOpen ? "rotate" : ""}`}>▾</span>
              )}
            </div>

            {item.subMenu && isOpen && (
              <div className="sidebar-submenu">
                {item.subMenu.map((sub, i) => (
                  <Nav.Link
                    key={i}
                    href={sub.link}
                    className="sidebar-submenu-item"
                    onClick={() => setShow(false)}
                  >
                    {sub.name}
                  </Nav.Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </Nav>
  );

  return (
    <>
      {/* ปุ่มเมนู (Mobile) */}
      {isMobile && (
        <Button
          variant="light"
          onClick={handleToggle}
          style={{ fontSize: "22px", border: "none" }}
        >
          <FiMenu />
        </Button>
      )}

      {/* Offcanvas (Mobile) */}
      <Offcanvas show={show} onHide={handleToggle} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar (Desktop) */}
      {!isMobile && (
        <div style={{ background: "#fff", padding: "10%", height: "100vh" }}>
          <img
            src={logoMaewMeeCake}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: "140px",
              display: "block",
              margin: "0 auto 20px",
            }}
          />
          <MenuContent />
        </div>
      )}
    </>
  );
}

export default SideBarMenu;
