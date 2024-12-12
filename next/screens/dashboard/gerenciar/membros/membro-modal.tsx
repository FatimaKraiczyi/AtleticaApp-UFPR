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
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { adicionarMembro, editarMembro, getMembros } from "@/api/membros";
import { Membro, MembrosResponse } from "@/interfaces/membros";
import { Switch } from "@/components/ui/switch";
import { useAtletica } from "@/hooks/AtleticaContex";

const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .regex(/@ufpr\.br$/, "O email deve ser do domínio @ufpr.br"),
  administrador: z.boolean().optional(),
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
    setValue,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
  });
  const { atleticaData } = useAtletica();
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;

  useEffect(() => {
    if (showModal) {
      if (editMembro) {
        setValue("email", editMembro.email || "");
        setValue("administrador", editMembro.administrador);
      }
    }
  }, [showModal, editMembro, setValue]);

  const resetForm = () => {
    reset();
  };

  const onSubmit = async (formData: userSchemaDetails) => {
    try {
      if (editMembro && editMembro.email) {
        const response = await editarMembro(
          editMembro.email,
          formData.administrador ?? false
        );
        if (response.success) {
          setMembros((prevMembros) =>
            prevMembros.map((membro) =>
              membro.email === editMembro.email
                ? { ...membro, administrador: formData.administrador ?? false }
                : membro
            )
          );
        }
      } else {
        const response = await adicionarMembro({
          email: formData.email,
          administrador: formData.administrador ?? false,
          atleticaId: atleticaId ?? '',
        });
        if (response.success && response.data) {
          setMembros(response.data.novoMembro ? [...membros, response.data.novoMembro] : membros);
        }
      }
      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Erro ao adicionar/editar membro:", error);
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
              source={require("@/assets/dashboard/headermodal.png")}
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
            {editMembro ? "Editar Membro" : "Adicionar Membro"}
          </Heading>
        </Center>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
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
                      placeholder="Email do membro"
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
                  {errors?.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.administrador}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Administrador</FormControlLabelText>
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
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.administrador?.message}
                </FormControlErrorText>
              </FormControlError>
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