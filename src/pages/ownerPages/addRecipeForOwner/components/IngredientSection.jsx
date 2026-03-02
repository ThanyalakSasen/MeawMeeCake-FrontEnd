import React from "react";
import { BsPlus, BsTrash } from "react-icons/bs";
import { InputField } from "../../../../components/inputField";
import { SelectInput } from "../../../../components/selectInput";

export default function IngredientSection({
  ingredients,
  ingredientOptions,
  unitOptions,
  onIngredientChange,
  onIngredientDelete,
  onAddIngredient,
  ingredientLabel = "ส่วนผสม",
  quantityLabel = "ปริมาณ",
  unitLabel = "หน่วย",
  addIngredientLabel = "เพิ่มวัตถุดิบ",
  emptyText = "ยังไม่มีวัตถุดิบ",
}) {
  const handleChange = (id, field) => (e) =>
    onIngredientChange(id, field, e.target.value);
  const hasIngredients = ingredients.length > 0;

  return (
    <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
      <table className="table table-striped align-middle border">
        <thead>
          <tr>
            <th style={{ width: "55%" }}>{ingredientLabel}</th>
            <th style={{ width: "20%" }}>{quantityLabel}</th>
            <th style={{ width: "20%" }}>{unitLabel}</th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>

        <tbody>
          {hasIngredients ? (
            ingredients.map((ing) => (
              <tr>
                <td>
                  <SelectInput
                    options={ingredientOptions}
                    value={ing.ingredient}
                    onChange={handleChange(ing.id, "ingredient")}
                  />
                </td>
                <td>
                  <InputField
                    type="number"
                    value={ing.quantity}
                    onChange={handleChange(ing.id, "quantity")}
                  />
                </td>
                <td>
                  <SelectInput
                    options={unitOptions}
                    value={ing.unit}
                    onChange={handleChange(ing.id, "unit")}
                  />
                </td>
                <td className="text-center align-middle">
                  <BsTrash
                    size={18}
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => onIngredientDelete(ing.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
                <div className="mb-2">{emptyText}</div>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={onAddIngredient}
                >
                  <BsPlus size={18} />
                  {addIngredientLabel}
                </button>
              </td>
            </tr>
          )}
        </tbody>

        {hasIngredients && (
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={onAddIngredient}
                >
                  <BsPlus size={18} />
                  {addIngredientLabel}
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
