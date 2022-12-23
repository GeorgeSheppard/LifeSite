import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ExitSaveButtons } from "../../components/core/exit_save_buttons";
import { UploadDisplayImages } from "../../components/cards/upload_and_display_images";
import { stopPropagation } from "../../components/core/utilities";
import { CenteredComponent } from "../../components/core/centered_component";
import { ComponentForm } from "../../components/recipes/component_form";
import { ComponentsFormData } from "../../components/recipes/component_form_data";
import { addOrUpdateRecipe } from "../../store/reducers/food/recipes/recipes";
import clone from "just-clone";
import { RecipeUuid } from "../../store/reducers/food/recipes/types";
import { isRecipeValid } from "../../store/reducers/food/recipes/schema";
import { useRecipes } from "../../components/hooks/use_data";
import { useMutateAndStore } from "../../components/hooks/user_data";

const EditUploadRecipe = () => {
  const router = useRouter();
  const [uuid] = useState(router.query.recipeUuid as RecipeUuid);
  const { mutateAsync } = useMutateAndStore(addOrUpdateRecipe);
  const recipeData = useRecipes().data[uuid] ?? {
    uuid,
    name: "",
    description: "",
    images: [],
    components: [
      {
        name: "",
        ingredients: [],
        instructions: [],
        storeable: false,
        uuid: uuidv4(),
      },
    ],
  };
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // Because this form is quite deeply nested, and the state needs to be placed at the top it was very slow
  // Instead, we use a class that never changes reference and therefore doesn't need to re-render child components/
  // the child components can then populate themselves from the initial state and then mutate the class whenever
  // their properties change.
  const [componentFormData] = useState(
    () => new ComponentsFormData(clone(recipeData.components))
  );
  const [recipeName, setRecipeName] = useState(recipeData.name);
  const [description, setDescription] = useState(recipeData.description);
  const [images, setImages] = useState(recipeData.images);
  const [formAlert, setFormAlert] = useState<string | null>(null);

  const dispatchRecipe = useCallback(async () => {
    if (recipeName.length === 0) {
      setFormAlert("Please set recipe name");
      return;
    }

    const components = Object.values(componentFormData.components);
    if (
      components.length === 1 &&
      components[0].ingredients.length === 0 &&
      components[0].instructions.length === 0
    ) {
      setFormAlert("Please set an ingredient or instruction");
      return;
    }

    const recipe = {
      uuid: recipeData.uuid,
      name: recipeName,
      description,
      images,
      components: Object.values(componentFormData.components),
    };

    if (isRecipeValid(recipe)) {
      await mutateAsync({
        uuid: recipeData.uuid,
        name: recipeName,
        description,
        images,
        components: Object.values(componentFormData.components),
      });
      router.push("/food");
    } else {
      setFormAlert("Error validating recipe");
      console.error("Validation error creating recipe" + recipe);
    }
  }, [
    router,
    recipeData.uuid,
    recipeName,
    description,
    images,
    componentFormData.components,
    mutateAsync,
  ]);

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
      <Card sx={{ padding: 4 }} onClick={stopPropagation}>
        <TextField
          key="NameTextField"
          fullWidth
          label={"Name"}
          value={recipeName}
          id="name"
          variant="standard"
          margin="none"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setRecipeName(event.target.value)
          }
          error={recipeName.length === 0}
        />
        <TextField
          key="DescriptionTextField"
          fullWidth
          label={"Description"}
          value={description}
          id="name"
          variant="standard"
          margin="none"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
          sx={{ mt: 2 }}
        />
        <UploadDisplayImages images={images} setImages={setImages} />
        {Object.entries(componentFormData.components).map(([key, _]) => (
          <ComponentForm
            key={key}
            uuid={key}
            componentFormData={componentFormData}
            forceUpdate={forceUpdate}
          />
        ))}
        <CenteredComponent>
          <Button
            sx={{ mt: 2, mb: 3 }}
            onClick={() => {
              componentFormData.components[uuidv4()] = {
                name: "",
                ingredients: [],
                instructions: [],
                storeable: false,
                uuid: uuidv4(),
              };
              forceUpdate();
            }}
            startIcon={<AddIcon />}
          >
            Add new section
          </Button>
        </CenteredComponent>
        <ExitSaveButtons
          saveOnClick={dispatchRecipe}
          exitOnClick={() => router.push("/food")}
          saveDisabled={false}
          buttonSx={{ flexGrow: 0.4 }}
          boxSx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
          }}
        />
        {formAlert && (
          <Alert
            sx={{ mt: 2 }}
            severity="error"
            onClose={() => setFormAlert(null)}
          >
            {formAlert}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default EditUploadRecipe;
