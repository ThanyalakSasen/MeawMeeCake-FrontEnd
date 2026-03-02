import Form from "react-bootstrap/Form";

export const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
  pattern,
  name,
  rows = 4,
}) => {
  return (
    <Form.Group className="mb-3 w-100" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        as="textarea"
        rows={rows}
        style={{ resize: "none" }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        name={name}
      />
    </Form.Group>
  );
};
