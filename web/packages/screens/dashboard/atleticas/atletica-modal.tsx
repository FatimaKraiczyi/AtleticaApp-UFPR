import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { ChevronDownIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { AlertTriangle, PlusIcon, XIcon } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import Image from "@unitools/image";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard, TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import type { CursoProps } from "../../../../interfaces/cursos";
import { getCursos } from "../../../../api/cursos";
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
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { EditPhotoIcon } from "../../profile-screens/profile/assets/icons/edit-photo";
import * as ImagePicker from "expo-image-picker";
import { createAtletica, updateAtletica } from "../../../../api/atleticas";
import type { Atletica } from "../../../../interfaces/atleticas";

const userSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "O nome deve ter menos de 10 caracteres"),
  departamento: z.string().min(1, "Departamento é obrigatório"),
  cursoIds: z.array(z.string()).min(1, "Curso é obrigatório"),
  imagem: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  atividades: z.string().min(1, "Atividades esportivas são obrigatórias"),
});
type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalAtletica = ({
  showModal,
  setShowModal,
  addAtletica,
  editAtletica,
  atleticaData,
}: {
  showModal: boolean;
  setShowModal: any;
  addAtletica: (newAtletica: Atletica) => void;
  editAtletica?: (atletica: Atletica) => void;
  atleticaData?: Atletica;
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
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
  };

  const [cursos, setCursos] = useState<CursoProps[]>([]);
  const [cursoFields, setCursoFields] = useState<string[]>(["cursoIds"]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<
    string | null
  >(null);
  const [cursosFiltrados, setCursosFiltrados] = useState<CursoProps[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await getCursos();
      if (response.success) {
        setCursos(response.data);
        const uniqueDepartamentos = Array.from(
          new Set(response.data.map((curso) => curso.departamento))
        );
        setDepartamentos(uniqueDepartamentos);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    if (departamentoSelecionado) {
      const filtrados = cursos.filter(
        (curso) => curso.departamento === departamentoSelecionado
      );
      setCursosFiltrados(filtrados);
    } else {
      setCursosFiltrados([]);
    }
  }, [departamentoSelecionado, cursos]);

  const addCursoField = () => {
    setCursoFields([...cursoFields, `cursoIds${cursoFields.length}`]);
  };

  const removeCursoField = (index: number) => {
    setCursoFields(cursoFields.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (showModal) {
      resetForm();
    }

    if (atleticaData) {
      setValue("nome", atleticaData.nome);
      setValue("descricao", atleticaData.descricao);
      setValue("atividades", atleticaData.atividades);
      setValue(
        "cursoIds",
        atleticaData.cursos?.map((curso) => String(curso.id)) || []
      );
      setProfileImage(atleticaData.imagem || null);
    }
  }, [showModal, atleticaData, setValue]);

  const resetForm = () => {
    reset();
    setCursoFields(["cursoIds"]);
    setProfileImage(null);
  };

  const onSubmit = async (data: any) => {
    const atleticaPayload = {
      nome: data.nome,
      descricao: data.descricao,
      atividades: data.atividades,
      imagem: profileImage,
      cursoIds: (data.cursoIds ?? []).filter((id: any) => id !== ""),
    };

    try {
      if (atleticaData) {
        if (atleticaData.id !== undefined) {
          const response = await updateAtletica(
            atleticaData.id,
            atleticaPayload
          );
          if (response.success) {
            editAtletica && editAtletica(atleticaPayload);
          }
        }
      } else {
        const response = await createAtletica(atleticaPayload);
        if (response.success) {
          addAtletica(atleticaPayload);
        }
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProfileImage(uri);
    }
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
            height={"100%"}
            width={"100%"}
            alt="Banner Image"
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
        <ModalBody className="px-10 py-6 max-h-[70vh] overflow-y-auto">
          <Center className="w-full mb-6">
            <TouchableOpacity onPress={pickImage}>
              <Avatar size="2xl">
                <AvatarImage
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("@/shared/assets/dashboard/image2.png")
                  }
                  alt={"Imagem de perfil"}
                />
                <AvatarBadge className="justify-center items-center bg-background-500">
                  <Icon as={EditPhotoIcon} />
                </AvatarBadge>
              </Avatar>
            </TouchableOpacity>
          </Center>
          <VStack space="xl">
            <FormControl isInvalid={!!errors.nome}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome da Atlética</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
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
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
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
                defaultValue=""
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
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
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
            <FormControl isInvalid={!!errors.departamento}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Departamento</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="departamento"
                control={control}
                render={({ field: { onChange } }) => (
                  <Select
                    onValueChange={(value) => {
                      onChange(value);
                      setDepartamentoSelecionado(value);
                    }}
                    className="flex-1"
                  >
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="Selecione um departamento" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {departamentos.map((departamento) => (
                          <SelectItem
                            key={departamento}
                            value={departamento}
                            label={departamento}
                          >
                            {departamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.departamento?.message}
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
                    defaultValue=""
                    name={`cursoIds.${index}`}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Select
                        onValueChange={onChange}
                        isDisabled={!departamentoSelecionado}
                        className="flex-1"
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
                            {cursosFiltrados.map((curso) => (
                              <SelectItem
                                key={curso.id}
                                value={String(curso.id)}
                                label={curso.nome}
                              >
                                {curso.nome}
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
                      disabled={!departamentoSelecionado}
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

            <FormControl isInvalid={!!errors.atividades}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>
                  Atividades esportivas
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="atividades"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Atividades esportivas"
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.atividades?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <Button
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
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
