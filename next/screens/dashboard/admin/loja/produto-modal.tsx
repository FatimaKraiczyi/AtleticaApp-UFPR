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
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { createProduto, updateProduto } from "@/api/produtos";
import { Image } from "@/components/ui/image";

const userSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.union([z.string(), z.number()]).refine((val) => {
    const num =
      typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;
    return !isNaN(num) && num > 0;
  }, "Valor deve ser um número válido maior que 0"),
  quantidade: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    return Number.isInteger(num) && num >= 0;
  }, "Quantidade deve ser um número inteiro válido maior ou igual a 0"),
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
      valor: "",
      quantidade: "",
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
    /*  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProdutoImage(uri);
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
            {produtoData ? "Editar Produto" : "Cadastrar Produto"}
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6 max-h-[70vh] overflow-y-auto">
          <Center className="w-full mb-6">
            <TouchableOpacity onPress={pickImage}>
              <Box>
                <Image
                  size="xl"
                  class="rounded-full"
                  source={
                    produtoImage
                      ? { uri: produtoImage }
                      : require("@/assets/dashboard/image2.png")
                  }
                  alt={"Imagem do produto"}
                />
              </Box>
            </TouchableOpacity>
          </Center>
          <VStack space="xl">
            <FormControl isInvalid={!!errors.nome}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Controller
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
                      onChangeText={(text) => {
                        const numericValue = text.replace(",", ".");
                        onChange(numericValue);
                      }}
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
