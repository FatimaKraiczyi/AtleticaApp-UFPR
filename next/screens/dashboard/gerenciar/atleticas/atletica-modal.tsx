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
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { getCursos } from "@/api/cursos";
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

const userSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "O nome deve ter menos de 10 caracteres"),
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
  const ref = useRef(null);
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

  const [cursos, setCursos] = useState<CursoProps[]>([]);
  const [cursoFields, setCursoFields] = useState<string[]>(["cursoIds"]);
  const [atividadeFields, setAtividadeFields] = useState<string[]>([
    "atividadesIds",
  ]);
  const [atleticaImage, setAtleticaImage] = useState<string | null>(null);

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
    setCursoFields([...cursoFields, `cursoIds${cursoFields.length}`]);
  };

  const removeCursoField = (index: number) => {
    setCursoFields(cursoFields.filter((_, i) => i !== index));
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

  useEffect(() => {
    if (showModal) {
      resetForm();
    }

    if (atleticaData) {
      setValue("nome", atleticaData.nome);
      setValue("descricao", atleticaData.descricao);
      setValue(
        "atividadesIds",
        atleticaData.atividades?.map((atividade: AtividadesProps) =>
          String(atividade.id)
        ) || []
      );
      setValue(
        "cursoIds",
        atleticaData.cursos?.map((curso: CursoProps) => String(curso.id)) || []
      );
      setAtleticaImage(atleticaData.imagem || null);
    }
  }, [showModal, atleticaData, setValue]);

  const resetForm = () => {
    reset();
    setCursoFields(["cursoIds"]);
    setAtividadeFields(["atividadesIds"]);
    setAtleticaImage(null);
  };

  const onSubmit = async (data: any) => {
    const atleticaPayload = {
      nome: data.nome,
      descricao: data.descricao,
      atividades: (data.atividadesIds ?? []).filter((id: any) => id !== ""),
      imagem: atleticaImage,
      cursoIds: (data.cursoIds ?? []).filter((id: any) => id !== ""),
    };

    try {
      if (atleticaData) {
        const response = await updateAtletica(atleticaData.id, {
          ...atleticaPayload,
          id: atleticaData.id,
        });
        if (response.success) {
          refreshAtleticas();
        }
      } else {
        const response = await createAtletica({
          ...atleticaPayload,
          id: Date.now(),
        });
        if (response.success) {
          refreshAtleticas();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const pickImage = async () => {
    /*  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setAtleticaImage(uri);
    } */
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        resetForm();
      }}
      finalFocusRef={ref}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent>
        <Box className={"w-full h-[110px] "}>
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
                <Image
                  size="xl"
                  class="rounded-full"
                  source={
                    atleticaImage
                      ? { uri: atleticaImage }
                      : require("@/assets/dashboard/image2.png")
                  }
                  alt={"Imagem da atletica"}
                />
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome da Atlética"
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
                    render={({ field: { onChange } }) => (
                      <Select onValueChange={onChange} className="flex-1">
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
                    render={({ field: { onChange } }) => (
                      <Select onValueChange={onChange} className="flex-1">
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

            <Button
              onPress={handleSubmit(onSubmit)}
              className="flex-1 p-2 mt-8"
            >
              <ButtonText>Salvar</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
