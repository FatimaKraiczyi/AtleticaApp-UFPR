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
import Image from "@unitools/image";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard, Switch } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { adicionarMembro, editarMembro } from "../../../../api/membros";
import type { Membro, MembrosResponse } from "../../../../interfaces/membros";

const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .regex(/@ufpr\.br$/, "O email deve ser do domínio @ufpr.br"),
  nomeAtletica: z.string().min(1, "Descrição é obrigatória"),
  administrador: z.boolean(),
});
type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalMembros = ({
  showModal,
  setShowModal,
  addMembros,
  editMembro,
  membroData,
  setMembros,
}: {
  showModal: boolean;
  setShowModal: any;
  addMembros: (newMembro: Membro) => void;
  editMembro?: (membro: any) => void;
  membroData?: any;
  setMembros: React.Dispatch<React.SetStateAction<MembrosResponse[]>>;
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (membroData) {
      console.log("Dados do membro:", membroData);
      setValue("email", membroData.Usuario.email);
      setValue("administrador", membroData.administrador);
      setIsAdmin(membroData.administrador);
    }
  }, [showModal, membroData, setValue]);

  const onSubmit = async (data: userSchemaDetails) => {
    console.log("Formulário enviado:", data);
    const membroPayload = {
      email: data.email,
      nomeAtletica: data.nomeAtletica,
      administrador: data.administrador,
    };

    try {
      if (membroData) {
        const response = await editarMembro(
          membroData.email,
          membroPayload.administrador
        );
        console.log("Response editarMembro:", response);
        if (response.success) {
          editMembro && editMembro(membroPayload);
        }
      } else {
        const response = await adicionarMembro(membroPayload);
        console.log("Response adicionarMembro:", response);
        if (response.success) {
          addMembros(membroPayload);
        }
        setMembros(response.data);
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
            {membroData ? "Editar Membro" : "Adicionar Membro"}
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6">
          <VStack space="xl">
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="email"
                defaultValue=""
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
            <FormControl isInvalid={!!errors.nomeAtletica}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome da Atlética</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="nomeAtletica"
                defaultValue=""
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
                      enterKeyHint="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} size="md" />
                <FormControlErrorText>
                  {errors?.nomeAtletica?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Administrador</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="administrador"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={(value) => {
                      onChange(value);
                      setIsAdmin(value);
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
