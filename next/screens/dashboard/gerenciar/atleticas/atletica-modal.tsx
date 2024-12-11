import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { CloseIcon, Icon, EditIcon } from "@/components/ui/icon";
import {
  AlertTriangle,
  ChevronDownIcon,
  PlusIcon,
  XIcon,
} from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { AtividadesProps, Atletica, CursoProps } from "@/interfaces/atleticas";
import { createAtletica, updateAtletica } from "@/api/atleticas";
import { Image } from "@/components/ui/image";
import atividadesEsportivas from "@/mock/atividades_esportivas";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { getCursos } from "@/api/cursos";

const userSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "O nome deve ter menos de 20 caracteres"),
  cursoIds: z.array(z.string()).min(1, "Curso é obrigatório"),
  imagem: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  atividadesIds: z.array(
    z.string().min(1, "Atividades esportivas são obrigatórias")
  ),
});

type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalAtletica = ({
  showModal,
  setShowModal,
  refreshAtleticas,
  atleticaData,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshAtleticas: () => void;
  atleticaData?: any;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      imagem: "",
      cursoIds: [],
      atividadesIds: [],
    },
  });

  const getImageUrl = (path: string | null) => {
    if (!path) return undefined;
    const baseUrl = "http://localhost:3001/uploads/";
    const fileName = path.split("\\").pop();
    return `${baseUrl}${fileName}`;
  };

  const [cursos, setCursos] = useState<CursoProps[]>([]);
  const [cursoFields, setCursoFields] = useState<string[]>(["cursoIds"]);
  const [atividadeFields, setAtividadeFields] = useState<string[]>([
    "atividadesIds",
  ]);
  const [atleticaImage, setAtleticaImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { watch } = useForm();

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await getCursos();
      if (response.success) {
        setCursos(response.data);
      }
    };
    fetchCursos();
  }, []);

  const addCursoField = () => {
    setCursoFields([...cursoFields, `cursoIds.${cursoFields.length}`]);
    setValue("cursoIds", [...(watch("cursoIds") || []), ""]);
  };

  const removeCursoField = (index: number) => {
    const updatedFields = cursoFields.filter((_, i) => i !== index);
    setCursoFields(updatedFields);
  };

  const addAtividadeField = () => {
    setAtividadeFields([
      ...atividadeFields,
      `atividades${atividadeFields.length}`,
    ]);
  };

  const removeAtividadeField = (index: number) => {
    setAtividadeFields(atividadeFields.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    reset({
      nome: "",
      descricao: "",
      imagem: "",
      cursoIds: [],
      atividadesIds: [],
    });
    setCursoFields(["cursoIds"]);
    setAtividadeFields(["atividadesIds"]);
  };

	useEffect(() => {
		if (showModal) {
			resetForm();
			if (atleticaData) {
				setValue("nome", atleticaData.nome);
				setValue("descricao", atleticaData.descricao);
				setValue(
					"atividadesIds",
					atleticaData.atividades?.map((atividade: AtividadesProps) =>
						String(atividade)
					) || []
				);
				const cursosIds = atleticaData.cursos?.map((curso: CursoProps) =>
					String(curso.id)
				);
				setValue("cursoIds", cursosIds || []);
				setCursoFields(
					cursosIds?.map((_: any, index: any) => `cursoIds.${index}`) || ["cursoIds"]
				);
				const imageUrl = getImageUrl(atleticaData.imagem);
				setValue("imagem", imageUrl);
        setAtleticaImage(imageUrl || null);
	
				setAtividadeFields(
					atleticaData.atividades?.map(
						(_: any, index: any) => `atividadesIds.${index}`
					) || ["atividadesIds"]
				);
	
				setCursoFields(
					atleticaData.cursos?.map((_: any, index: any) => `cursoIds.${index}`) || [
						"cursoIds",
					]
				);
			}
		}
	}, [showModal, atleticaData, setValue, reset]);

  const pickImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAtleticaImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  };

	const onSubmit = async (data: any) => {
		const formData = new FormData();
		formData.append("nome", data.nome);
		formData.append("descricao", data.descricao);
	
		data.atividadesIds.forEach((id: string) =>
			formData.append("atividades[]", id)
		);
	
		const validCursoIds = data.cursoIds
			.filter((id: string) => id !== "") 
			.map((id: string) => Number(id)); 
	
		validCursoIds.forEach((id: number) => formData.append("cursoIds[]", id.toString()));
	
		if (selectedFile) {
			formData.append("imagem", selectedFile);
		} else if (atleticaImage) {
			formData.append("imagem", atleticaImage);
		}
	
		try {
			let response;
			if (atleticaData) {
				response = await updateAtletica(atleticaData.id, formData);
			} else {
				response = await createAtletica(formData);
			}
	
			if (response.success && response.data) {
				refreshAtleticas();
				resetForm();
				setShowModal(false);
			}
		} catch (error) {
			console.error("Erro ao salvar:", error);
		}
	};

  const storedUserType = sessionStorage.getItem("tipo");

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <Box className="w-full h-[110px]">
          <Image
            source={require("@/assets/profile-screens/profile/image2.png")}
            alt="Imagem de fundo"
            size="full"
          />
        </Box>
        <ModalHeader className="absolute w-full flex justify-end">
          <ModalCloseButton onPress={() => setShowModal(false)}>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <Center className="w-full absolute top-10">
          <Heading size="2xl" className="text-typography-800">
            {atleticaData ? "Editar Atlética" : "Cadastrar Atlética"}
          </Heading>
        </Center>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <Center className="w-full mb-6">
            <TouchableOpacity onPress={pickImage}>
              <Box>
                <Avatar size="xl">
                  {atleticaImage ? (
                    <AvatarImage
                      source={{ uri: atleticaImage }}
                      alt="Imagem da atlética"
                    />
                  ) : (
                    <AvatarImage
                      source={{
                        uri: "https://img.freepik.com/vetores-premium/icone-de-moldura-de-foto-foto-vazia-em-branco-vetor-em-fundo-transparente-isolado-eps-10_399089-1290.jpg",
                      }}
                    />
                  )}
                </Avatar>
              </Box>
            </TouchableOpacity>
          </Center>
          <VStack space="xl">
            <FormControl isInvalid={!!errors.nome}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome da Atlética</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="nome"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome da Atlética"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.nome?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.descricao}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Descrição</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="descricao"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Descrição"
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.descricao?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {cursoFields.map((field, index) => (
              <FormControl key={field} isInvalid={!!errors.cursoIds}>
                <FormControlLabel className="mb-2 flex items-center">
                  <FormControlLabelText>Curso</FormControlLabelText>
                </FormControlLabel>
                <div className="flex items-center w-full">
                  <Controller
                    name={`cursoIds.${index}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={onChange}
                        className="flex-1"
                        selectedValue={value}
                      >
                        <SelectTrigger variant="outline" size="md">
                          <SelectInput placeholder="Selecione um curso" />
                          <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {cursos.map((curso) => (
                              <SelectItem
                                key={curso.id}
                                value={String(curso.id)}
                                label={curso.nome + " - " + curso.departamento}
                              >
                                {curso.nome + " - " + curso.departamento}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {index === cursoFields.length - 1 && (
                    <Button
                      onPress={addCursoField}
                      className="ml-2 p-1"
                      variant="outline"
                      size="sm"
                    >
                      <Icon as={PlusIcon} size="sm" />
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      onPress={() => removeCursoField(index)}
                      className="ml-2 p-1"
                      variant="outline"
                      size="sm"
                    >
                      <Icon as={XIcon} size="sm" />
                    </Button>
                  )}
                </div>
                <FormControlError>
                  <FormControlErrorIcon size="sm" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.cursoIds?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            ))}

            {atividadeFields.map((field, index) => (
              <FormControl key={field} isInvalid={!!errors.atividadesIds}>
                <FormControlLabel className="mb-2 flex items-center">
                  <FormControlLabelText>
                    Atividade Esportiva
                  </FormControlLabelText>
                </FormControlLabel>
                <div className="flex items-center w-full">
                  <Controller
                    name={`atividadesIds.${index}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={onChange}
                        className="flex-1"
                        selectedValue={value}
                      >
                        <SelectTrigger variant="outline" size="md">
                          <SelectInput placeholder="Selecione uma atividade" />
                          <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {atividadesEsportivas.map((atividade) => (
                              <SelectItem
                                key={atividade.id}
                                value={atividade.nome}
                                label={atividade.nome}
                              >
                                {atividade.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {index === atividadeFields.length - 1 && (
                    <Button
                      onPress={addAtividadeField}
                      className="ml-2 p-1"
                      variant="outline"
                      size="sm"
                    >
                      <Icon as={PlusIcon} size="sm" />
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      onPress={() => removeAtividadeField(index)}
                      className="ml-2 p-1"
                      variant="outline"
                      size="sm"
                    >
                      <Icon as={XIcon} size="sm" />
                    </Button>
                  )}
                </div>
                <FormControlError>
                  <FormControlErrorIcon size="sm" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.atividadesIds?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            ))}

            {storedUserType === "master" && (
              <Button
                onPress={handleSubmit(onSubmit)}
                className="flex-1 p-2 mt-8"
              >
                <ButtonText>Salvar</ButtonText>
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
