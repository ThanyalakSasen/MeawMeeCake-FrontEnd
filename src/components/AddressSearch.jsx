import { useEffect, useMemo, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import geographyData from "../constant/geography.json";

const formatAddressLabel = (item) =>
  `${item.subdistrictNameTh}, ${item.districtNameTh}, ${item.provinceNameTh} ${item.postalCode}`;

const ADDRESS_OPTIONS = geographyData.map((item) => ({
  ...item,
  label: formatAddressLabel(item),
  searchableText:
    `${item.provinceNameTh} ${item.districtNameTh} ${item.subdistrictNameTh} ${item.postalCode}`.toLowerCase(),
}));

const ADDRESS_BY_LABEL = new Map(
  ADDRESS_OPTIONS.map((item) => [item.label, item]),
);

export const AddressSearch = ({
  label,
  name,
  value,
  onChange,
  onSelect,
  placeholder = "ค้นหาแขวง/ตำบล, เขต/อำเภอ, จังหวัด หรือรหัสไปรษณีย์",
  required = false,
  className,
  disabled = false,
  maxResults = 20,
}) => {
  const dropdownRef = useRef(null);
  const [internalValue, setInternalValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const selectedValue = value ?? internalValue;
  const displayValue =
    value !== undefined && !isTyping ? value || "" : inputValue;
  const normalizedQuery = inputValue.toString().trim().toLowerCase();
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (searchTerms.length === 0) {
      return ADDRESS_OPTIONS.slice(0, maxResults);
    }

    return ADDRESS_OPTIONS.filter((item) =>
      searchTerms.every((term) => item.searchableText.includes(term)),
    ).slice(0, maxResults);
  }, [searchTerms, maxResults]);

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setIsTyping(true);
    setInputValue(nextValue);
    setIsOpen(true);

    if (!nextValue && value === undefined) {
      setInternalValue("");
    }
  };

  const handleSelectAddress = (selectedAddress) => {
    if (value === undefined) {
      setInternalValue(selectedAddress.label);
    }
    setIsTyping(false);
    setInputValue(selectedAddress.label);
    setIsOpen(false);

    onChange?.({
      target: {
        name,
        value: selectedAddress.label,
      },
    });

    onSelect?.(selectedAddress);
  };

  const handleBlur = () => {
    setIsTyping(false);

    const selectedAddress = ADDRESS_BY_LABEL.get(selectedValue);
    if (selectedAddress) {
      setInputValue(selectedAddress.label);
      return;
    }

    setInputValue("");
  };

  const showDropdown = isOpen && filteredOptions.length > 0;

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "2px",
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    backgroundColor: "#fff",
    maxHeight: "240px",
    overflowY: "auto",
    zIndex: 1050,
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        width: "100%",
        marginBottom: label ? "16px" : "0",
        position: "relative",
      }}
      className={className}
    >
      {label && (
        <Form.Label style={{ display: "block", marginBottom: "8px" }}>
          {label}
        </Form.Label>
      )}
      <Form.Control
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => {
          setIsTyping(true);
          setIsOpen(true);
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        required={required && !selectedValue}
      />
      <input type="hidden" name={name} value={selectedValue} />

      {showDropdown && (
        <div style={dropdownStyle}>
          {filteredOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelectAddress(item)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.375rem 2.25rem 0.375rem 0.75rem",
                border: "none",
                backgroundColor:
                  item.label === selectedValue ? "#e9ecef" : "#fff",
                fontSize: "1rem",
                lineHeight: "1.5",
                color: "#212529",
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
