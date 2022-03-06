import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import {
  RecipeUuid,
  IDisplayRecipe,
  IMethodStage,
} from "../../store/reducers/food/recipes";
import { useAppSelector } from "../../store/hooks/hooks";
import {
  ChangeEvent,
  createRef,
  useRef,
  useState,
  RefObject,
  Ref,
} from "react";
import Grid from "@mui/material/Grid";
import { stopPropagation } from "../cards/utilities";
import TextField from "@mui/material/TextField";
import { UploadDisplayImages } from "../cards/upload_and_display_images";
import {
  AccordionDetails,
  IconButton,
  List,
  ListItemText,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

export interface IEditUploadRecipeProps {
  /**
   * New recipe will have a uuid but no data in store
   */
  uuid: RecipeUuid;
  closeBackdrop: () => void;
}

export const EditUploadRecipe = (props: IEditUploadRecipeProps) => {
  const [uuid] = useState<RecipeUuid>(props.uuid);
  const recipeData: IDisplayRecipe = useAppSelector((store) => {
    if (uuid in store.recipes.recipes) {
      return store.recipes.recipes[uuid];
    } else {
      return {
        uuid,
        name: "",
        description: "",
        images: [],
        method: [
          {
            name: "",
            instructions: [""],
            ingredients: [
              {
                name: "",
              },
            ],
          },
        ],
      };
    }
  });

  const [recipeName, setRecipeName] = useState(recipeData.name);
  const [description, setDescription] = useState(recipeData.description);
  const [images, setImages] = useState(recipeData.images);
  const [method, setMethod] = useState(recipeData.method);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Grid container alignItems="center" justifyContent="center">
        <Grid item key="edit_upload" xs={12} sm={6} md={4}>
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
            />
            <UploadDisplayImages images={images} setImages={setImages} />
            {method.map((individualMethod, index) => (
              <MethodForm
                key={index}
                method={individualMethod}
                noName={method.length === 1}
              />
            ))}
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 0.5 }} />
              <IconButton
                onClick={() =>
                  setMethod((method) =>
                    method.concat([
                      {
                        name: "",
                        instructions: [],
                        ingredients: [],
                      },
                    ])
                  )
                }
              >
                <AddIcon />
              </IconButton>
              <div style={{ flexGrow: 0.5 }} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export interface IMethodFormProps {
  method: IMethodStage;
  noName: boolean;
}

export const MethodForm = (props: IMethodFormProps) => {
  const { method } = props;

  const focusRef = useRef<Ref<any> | undefined>(null);
  const [name, setName] = useState(method.name);
  const [instructions, setInstructions] = useState(method.instructions);

  const nameTextField = (
    <TextField
      key="MethodTextField"
      fullWidth
      value={name}
      id="name"
      variant="standard"
      margin="none"
      onClick={stopPropagation}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        setName(event.target.value)
      }
    />
  );

  const inputs = (
    <List>
      {instructions.map((instruction, index) => (
        // TODO: This needs to be a proper key
        <ListItem key={index} disablePadding>
          <ListItemText primary={`${index + 1}.`} sx={{ paddingRight: 1 }} />
          <TextField
            inputRef={index === instructions.length - 1 ? focusRef : undefined}
            fullWidth
            value={instruction}
            id="instruction"
            variant="standard"
            margin="none"
            multiline
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setInstructions((prevInstructions) => {
                const copyInstructions = [...prevInstructions];
                copyInstructions[index] = event.target.value;
                return copyInstructions;
              });
            }}
          />
          <IconButton
            onClick={(event) => {
              setInstructions((prevInstructions) => {
                const copyInstructions = [...prevInstructions];
                copyInstructions.splice(index, 1);
                return copyInstructions;
              });
            }}
            size="small"
            sx={{ alignSelf: "center" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0.5 }} />
        <IconButton
          onClick={() => {
            if (instructions[instructions.length - 1] !== "") {
              setInstructions((prevInstructions) =>
                prevInstructions.concat([""])
              );
            } else {
              // TODO: Fix this
              focusRef?.current?.focus();
            }
          }}
        >
          <AddIcon />
        </IconButton>
        <div style={{ flexGrow: 0.5 }} />
      </div>
    </List>
  );

  if (props.noName) {
    return inputs;
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {nameTextField}
      </AccordionSummary>
      <AccordionDetails>{inputs}</AccordionDetails>
    </Accordion>
  );
};
