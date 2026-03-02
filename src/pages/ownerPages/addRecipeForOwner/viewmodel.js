import { useState } from "react";

export const useViewModel = (productId) => {
  const INGREDIENT_SECTION = {
    INGREDIENTS: "ingredients",
    RECIPE_COMPONENT: "recipeComponent",
  };

  const [recipeNameTh, setRecipeNameTh] = useState("");
  const [recipeYield, setRecipeYield] = useState("");

  // Ingredient states
  const [ingredientOptions, setIngredientOptions] = useState([
    { value: "ing 1", label: "ing 1" },
    { value: "ing 2", label: "ing 2" },
    { value: "ing 3", label: "ing 3" },
    { value: "ing 4", label: "ing 4" },
    { value: "ing 5", label: "ing 5" },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "unit 1", label: "unit 1" },
    { value: "unit 2", label: "unit 2" },
    { value: "unit 3", label: "unit 3" },
    { value: "unit 4", label: "unit 4" },
    { value: "unit 5", label: "unit 5" },
  ]);
  const [categoryId, setCategoryId] = useState("");

  const [ingredients, setIngredients] = useState([
    {
      id: `0`,
      ingredient: "",
      quantity: "",
      unit: "",
    },
  ]);

  const [recipeComponent, setRecipeComponent] = useState([
    {
      id: `0`,
      ingredient: "",
      quantity: "",
      unit: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const [methodsList, setMethodsList] = useState([
    {
      id: "method 1",
      mainTopic: "mainTopic 1",
      subTopics: ["subtopic 1-1", "subtopic 1-2"],
    },
  ]);

  const mainTopicOptions = [
    { value: "mainTopic 1", label: "mainTopic 1" },
    { value: "mainTopic 2", label: "mainTopic 2" },
    { value: "mainTopic 3", label: "mainTopic 3" },
    { value: "mainTopic 4", label: "mainTopic 4" },
    { value: "mainTopic 5", label: "mainTopic 5" },
  ];

  const subTopicOptions = [
    { value: "subtopic 1", label: "subtopic 1" },
    { value: "subtopic 2", label: "subtopic 2" },
    { value: "subtopic 3", label: "subtopic 3" },
    { value: "subtopic 4", label: "subtopic 4" },
    { value: "subtopic 5", label: "subtopic 5" },
  ];

  const getSectionItems = (sectionName) =>
    sectionName === INGREDIENT_SECTION.RECIPE_COMPONENT
      ? recipeComponent
      : ingredients;

  const setSectionItems = (sectionName, updater) => {
    if (sectionName === INGREDIENT_SECTION.RECIPE_COMPONENT) {
      setRecipeComponent((prev) => updater(prev));
      return;
    }

    setIngredients((prev) => updater(prev));
  };

  const normalizeIngredientArgs = (arg1, arg2, arg3, arg4) => {
    if (arg4 !== undefined) {
      return [arg1, arg2, arg3, arg4];
    }

    return [INGREDIENT_SECTION.INGREDIENTS, arg1, arg2, arg3];
  };

  const handleAddIngredientRow = (
    sectionName = INGREDIENT_SECTION.INGREDIENTS,
  ) => {
    const newRow = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ingredient: "",
      quantity: "",
      unit: "",
    };

    setSectionItems(sectionName, (prev) => [...prev, newRow]);
  };

  const handleIngredientChange = (arg1, arg2, arg3, arg4) => {
    const [sectionName, id, field, value] = normalizeIngredientArgs(
      arg1,
      arg2,
      arg3,
      arg4,
    );

    setSectionItems(sectionName, (prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteIngredientRow = (
    sectionName = INGREDIENT_SECTION.INGREDIENTS,
    id,
  ) => {
    const targetId = id ?? sectionName;
    const targetSection = id ? sectionName : INGREDIENT_SECTION.INGREDIENTS;

    setSectionItems(targetSection, (prev) =>
      prev.filter((item) => item.id !== targetId),
    );
  };

  const handleMethodMainTopicChange = (id, value) => {
    setMethodsList((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, mainTopic: value } : method,
      ),
    );
  };

  const handleMethodSubTopicChange = (id, subTopicIndex, value) => {
    setMethodsList((prev) =>
      prev.map((method) => {
        if (method.id !== id) {
          return method;
        }

        const updatedSubTopics = method.subTopics.map((subTopic, index) =>
          index === subTopicIndex ? value : subTopic,
        );

        return {
          ...method,
          subTopics: updatedSubTopics,
        };
      }),
    );
  };

  const handleAddMethodSubTopic = (id) => {
    setMethodsList((prev) =>
      prev.map((method) =>
        method.id === id
          ? { ...method, subTopics: [...(method.subTopics ?? []), ""] }
          : method,
      ),
    );
  };

  const handleRemoveMethodSubTopic = (id, subTopicIndex) => {
    setMethodsList((prev) =>
      prev.map((method) => {
        if (method.id !== id) {
          return method;
        }

        const updatedSubTopics = method.subTopics.filter(
          (_, index) => index !== subTopicIndex,
        );

        return {
          ...method,
          subTopics: updatedSubTopics,
        };
      }),
    );
  };

  const handleAddMethod = () => {
    const newMethod = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      mainTopic: "",
      subTopics: [""],
    };

    setMethodsList((prev) => [...prev, newMethod]);
  };

  const handleRemoveMethod = (id) => {
    setMethodsList((prev) => prev.filter((method) => method.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return {
    recipeNameTh,
    setRecipeNameTh,
    recipeYield,
    setRecipeYield,
    ingredientOptions,
    setIngredientOptions,
    unitOptions,
    setUnitOptions,
    categoryId,
    setCategoryId,
    ingredients,
    setIngredients,
    recipeComponent,
    setRecipeComponent,
    INGREDIENT_SECTION,
    getSectionItems,
    handleAddIngredientRow,
    handleIngredientChange,
    handleDeleteIngredientRow,
    productId,
    isLoading,
    setIsLoading,
    methodsList,
    handleMethodMainTopicChange,
    handleMethodSubTopicChange,
    handleAddMethodSubTopic,
    handleRemoveMethodSubTopic,
    handleAddMethod,
    handleRemoveMethod,
    handleSubmit,
    mainTopicOptions,
    subTopicOptions,
  };
};
