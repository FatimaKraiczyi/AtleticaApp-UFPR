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
  refreshMembros,
  membroData,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshMembros: () => void;
  membroData?: any;
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
      administrador: false,
    },
  });

  useEffect(() => {
    if (showModal) {
      resetForm();
      if (membroData) {
        setValue("email", membroData.Usuario.email);
        setValue("administrador", membroData.administrador);
      }
    }
  }, [showModal, membroData, setValue]);

  const resetForm = () => {
    reset();
  };

  const onSubmit = async (data: any) => {
    const membroPayload = {
      email: data.email,
      administrador: data.administrador,
      atleticaId: sessionStorage.getItem("atleticaId"),
    };

    try {
      if (membroData) {
        const response = await editarMembro(
          membroPayload.email,
          membroPayload.administrador
        );
        if (response.success) {
          refreshMembros();
        }
      } else {
        const response = await adicionarMembro(membroPayload as Membro);
        if (response.success) {
          refreshMembros();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro:", error);
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
            {membroData ? "Editar Membro" : "Adicionar Membro"}
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
