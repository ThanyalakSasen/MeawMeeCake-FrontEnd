import { useParams } from "react-router-dom";
import { useViewModel } from "./viewmodel";
import Layout from "../../../components/Layout";
import { InputField } from "../../../components/inputField";
import { SelectInput } from "../../../components/selectInput";
import { Row, Col, Spinner } from "react-bootstrap";
import IngredientSection from "./components/IngredientSection";
import MethodSection from "./components/MethodSection";

export default function AddRecipeForOwner() {
  const { newProductId } = useParams();
  const {
    recipeNameTh,
    setRecipeNameTh,
    recipeYield,
    setRecipeYield,
    ingredientOptions,
    categoryId,
    setCategoryId,
    ingredients,
    recipeComponent,
    unitOptions,
    INGREDIENT_SECTION,
    handleAddIngredientRow,
    handleIngredientChange,
    handleDeleteIngredientRow,
    methodsList,
    handleMethodMainTopicChange,
    handleMethodSubTopicChange,
    handleAddMethodSubTopic,
    handleRemoveMethodSubTopic,
    handleAddMethod,
    handleRemoveMethod,
    isLoading,
    handleSubmit,
    mainTopicOptions,
    subTopicOptions,
  } = useViewModel(newProductId);

  return (
    <Layout titleMain="เพิ่มสูตร">
      <Row className="m-3">
        <Col md={10} className="w-100">
          <div className="p-4 bg-white rounded">
            <form onSubmit={handleSubmit}>
              <Row
                className="g-5"
                style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
              >
                <Col md={6}>
                  <InputField
                    label="ชื่อสูตร"
                    value={recipeNameTh}
                    onChange={(e) => setRecipeNameTh(e.target.value)}
                  />
                  <InputField
                    label="จำนวนที่ได้ (ต่อการอบ 1 ครั้ง)"
                    type="number"
                    value={recipeYield}
                    onChange={(e) => setRecipeYield(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <SelectInput
                    label="หมวดหมู่"
                    options={ingredientOptions}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  />
                </Col>
              </Row>
              <IngredientSection
                ingredientLabel="วัตถุดิบ"
                emptyText="ยังไม่มีวัตถุดิบ"
                ingredients={ingredients}
                ingredientOptions={ingredientOptions}
                unitOptions={unitOptions}
                onIngredientChange={(id, field, value) =>
                  handleIngredientChange(
                    INGREDIENT_SECTION.INGREDIENTS,
                    id,
                    field,
                    value,
                  )
                }
                onIngredientDelete={(id) =>
                  handleDeleteIngredientRow(INGREDIENT_SECTION.INGREDIENTS, id)
                }
                onAddIngredient={() =>
                  handleAddIngredientRow(INGREDIENT_SECTION.INGREDIENTS)
                }
              />
              <IngredientSection
                ingredientLabel="สูตรส่วนประกอบ"
                emptyText="ยังไม่มีสูตรส่วนประกอบ"
                addIngredientLabel="เพิ่มสูตรส่วนประกอบ"
                ingredients={recipeComponent}
                ingredientOptions={ingredientOptions}
                unitOptions={unitOptions}
                onIngredientChange={(id, field, value) =>
                  handleIngredientChange(
                    INGREDIENT_SECTION.RECIPE_COMPONENT,
                    id,
                    field,
                    value,
                  )
                }
                onIngredientDelete={(id) =>
                  handleDeleteIngredientRow(
                    INGREDIENT_SECTION.RECIPE_COMPONENT,
                    id,
                  )
                }
                onAddIngredient={() =>
                  handleAddIngredientRow(INGREDIENT_SECTION.RECIPE_COMPONENT)
                }
              />
              <MethodSection
                methodLabel="วิธีการทำ"
                methodsList={methodsList}
                onMethodMainTopicChange={handleMethodMainTopicChange}
                onMethodSubTopicChange={handleMethodSubTopicChange}
                onAddMethodSubTopic={handleAddMethodSubTopic}
                onRemoveMethodSubTopic={handleRemoveMethodSubTopic}
                onAddMethod={handleAddMethod}
                onRemoveMethod={handleRemoveMethod}
                mainTopicOptions={mainTopicOptions}
                subTopicOptions={subTopicOptions}
              />

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
