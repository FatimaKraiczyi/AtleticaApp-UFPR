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
import { Keyboard, TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import * as ImagePicker from "expo-image-picker";
import { updateProduto, createProduto } from "../../../../../api/produtos";
import { EditPhotoIcon } from "../../../profile-screens/profile/assets/icons/edit-photo";

const userSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.number().min(1, "Valor é obrigatório"),
  quantidade: z.number().min(1, "Quantidade é obrigatória"),
  imagem: z.string().optional(),
});
type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalProduto = ({
  showModal,
  setShowModal,
  refreshProdutos,
  produtoData,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshProdutos: () => void;
  produtoData?: any;
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
      valor: 0,
      quantidade: 0,
      imagem: "",
    },
  });

  const [produtoImage, setProdutoImage] = useState<string | null>(null);

  useEffect(() => {
    if (showModal) {
      resetForm();
      if (produtoData) {
        setValue("nome", produtoData.nome);
        setValue("valor", produtoData.valor);
        setValue("quantidade", produtoData.quantidade);
        setProdutoImage(produtoData.imagem || null);
      }
    }
  }, [showModal, produtoData, setValue]);

  const resetForm = () => {
    reset();
    setProdutoImage(null);
  };

  const onSubmit = async (data: userSchemaDetails) => {
    const produtoPayload = {
      nome: data.nome,
      valor: Number(data.valor),
      quantidade: Number(data.quantidade),
      imagem: produtoImage,
    };

    try {
      if (produtoData) {
        const response = await updateProduto(produtoData.id, produtoPayload);
        if (response.success) {
          refreshProdutos();
        }
      } else {
        const response = await createProduto(produtoPayload);
        if (response.success) {
          refreshProdutos();
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
      setProdutoImage(uri);
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
            {produtoData ? "Editar Produto" : "Cadastrar Produto"}
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6 max-h-[70vh] overflow-y-auto">
          <Center className="w-full mb-6">
            <TouchableOpacity onPress={pickImage}>
              <Avatar size="2xl">
                <AvatarImage
                  source={
                    produtoImage
                      ? { uri: produtoImage }
                      : require("@/shared/assets/dashboard/dashboard-layout/image2.png")
                  }
                  alt={"Imagem do produto"}
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
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="nome"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome do produto"
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
            <FormControl isInvalid={!!errors.valor}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Valor</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="valor"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Valor do produto"
                      value={String(value)}
                      onChangeText={(value) => onChange(Number(value) || 0)}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.valor?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.quantidade}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Quantidade</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="quantidade"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Quantidade do produto"
                      value={String(value)}
                      onChangeText={(value) => onChange(Number(value) || 0)}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.quantidade?.message}
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
