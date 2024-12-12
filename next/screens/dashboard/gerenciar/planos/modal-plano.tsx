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
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
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
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { editPlano, newPlano } from "@/api/planos";

const AssinaturaSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "O nome deve ter menos de 50 caracteres"),
  valor: z.union([z.string(), z.number()]).refine((val) => {
    const num =
      typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;
    return !isNaN(num) && num > 0;
  }, "Valor deve ser um número válido maior que 0"),
  descricao: z.array(
    z.object({
      id: z.number(),
      beneficioDescricao: z.string(),
      beneficioValor: z.number(),
    })
  ).nonempty("Descrição é obrigatória"),
  duracao: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    return Number.isInteger(num) && num > 0;
  }, "Duração deve ser um número inteiro válido maior que 0"),
});
type AssianaturaSchemaDetails = z.infer<typeof AssinaturaSchema>;

export const ModalPlano = ({
  showModal,
  setShowModal,
  refreshPlanos,
  planoData,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshPlanos: () => void;
  planoData?: any;
}) => {
  const ref = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<AssianaturaSchemaDetails>({
    resolver: zodResolver(AssinaturaSchema),
  });

  useEffect(() => {
    if (showModal) {
      resetForm();
    }

    if (planoData) {
      setValue("nome", planoData.nome);
      setValue("descricao", planoData.descricao || []);
      setValue("valor", planoData.valor);
      setValue("duracao", planoData.duracao);
    }
  }, [showModal, planoData, setValue]);

  const resetForm = () => {
    reset();
  };

  const onSubmit = async (data: AssianaturaSchemaDetails) => {
    const assinaturaPayload = {
      nome: data.nome,
      descricao: data.descricao.map((item) => item.beneficioDescricao),
      valor: Number(data.valor),
      duracao: Number(data.duracao),
      id: planoData?.id,
    };

    try {
      if (planoData) {
        const response = await editPlano(planoData.id, assinaturaPayload);
        if (response.success) {
          refreshPlanos();
        }
      } else {
        const response = await newPlano(assinaturaPayload);
        if (response.success) {
          refreshPlanos();
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
              source={require("@/assets/dashboard/headermodal.png")}
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
            {planoData
              ? "Editar Plano de Assinatura"
              : "Cadastrar Plano de Assinatura"}
          </Heading>
        </Center>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <VStack space="xl">
            <FormControl isInvalid={!!errors.nome}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="nome"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome do Plano"
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
                <FormControlLabelText>Preço do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="valor"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Valor do plano"
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
                      placeholder="Descrição do Plano"
                      type="text"
                      value={Array.isArray(value) ? value.map((item) => item.beneficioDescricao).join(", ") : ""}
                      onChangeText={(text) =>
                        onChange(
                          text.split(",").map((item, index) => ({
                            id: index,
                            beneficioDescricao: item.trim(),
                            beneficioValor: 0,
                          }))
                        )
                      }
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

            <FormControl isInvalid={!!errors.duracao}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Duração do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="duracao"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      type="text"
                      placeholder="Duração do Plano"
                      value={String(value)}
                      onChangeText={(value) => onChange(Number(value))}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.duracao?.message}
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