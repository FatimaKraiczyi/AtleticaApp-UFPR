import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { AlertTriangle } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard, Switch } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { adicionarMembro, editarMembro, getMembros } from "@/api/membros";
import { MembrosResponse } from "@/interfaces/membros";

const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .regex(/@ufpr\.br$/, "O email deve ser do domínio @ufpr.br"),
  administrador: z.boolean(),
});

type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalMembros = ({
  showModal,
  setShowModal,
  editMembro,
  membros,
  setMembros,
}: {
  showModal: boolean;
  setShowModal: any;
  setMembros: React.Dispatch<React.SetStateAction<MembrosResponse[]>>;
  membros: MembrosResponse[];
  editMembro: MembrosResponse | null;
}) => {
  const ref = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (showModal) {
      if (editMembro) {
        reset({
          email: editMembro.Usuario?.email || "",
          administrador: editMembro.administrador,
        });
      } else {
        reset({
          email: "",
          administrador: false,
        });
      }
    }
  }, [editMembro, showModal, reset]);

  const onSubmit = async (formData: userSchemaDetails) => {
    try {
      if (editMembro && editMembro.Usuario?.email) {
        const response = await editarMembro(
          editMembro.Usuario.email,
          formData.administrador
        );

        if (response.success) {
          setMembros((prevMembros) =>
            prevMembros.map((membro) =>
              membro.Usuario?.email === editMembro.Usuario?.email
                ? { ...membro, administrador: formData.administrador }
                : membro
            )
          );
        }
      } else {
        const response = await adicionarMembro({
          email: formData.email,
          administrador: formData.administrador,
          atleticaId: membros[0].atleticaId,
        });

        if (response.success) {
          const atleticaId = membros[0].atleticaId;
          const response = await getMembros(atleticaId);
          const updatedMembros: MembrosResponse[] = response.data;
          setMembros(updatedMembros);
        }
      }
      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Erro ao adicionar/editar membro:", error);
    }
  };

  return (
    <Modal isOpen={showModal} finalFocusRef={ref} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <Box className={"w-full h-[110px]"}>
          <Image
            source={require("@/assets/profile-screens/profile/image2.png")}
            size="full"
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
            {editMembro ? "Editar Membro" : "Adicionar Membro"}
          </Heading>
        </Center>
        <ModalBody>
          <VStack space="xl">
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Email"
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      enterKeyHint="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} size="md" />
                <FormControlErrorText>
                  {errors?.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Gerenciar</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="administrador"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </FormControl>
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
