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
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { editPlano, newPlano } from "@/api/planos";

const AssinaturaSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Máximo de 50 caracteres"),
  valor: z.union([z.string(), z.number()]).refine((val) => {
    const num =
      typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;
    return !isNaN(num) && num > 0;
  }, "Valor deve ser um número válido maior que 0"),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(250, "Máximo de 250 caracteres"),
  duracao: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    return Number.isInteger(num) && num > 0;
  }, "Duração deve ser um número válido maior que 0"),
  desconto:  z.union([z.string(), z.number()]),
  beneficios: z.array(z.string()).optional(),
});

type AssinaturaSchemaDetails = z.infer<typeof AssinaturaSchema>;

export const ModalPlano = ({
  showModal,
  setShowModal,
  refreshPlanos,
  planoData,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  refreshPlanos: () => void;
  planoData?: any;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<AssinaturaSchemaDetails>({
    resolver: zodResolver(AssinaturaSchema),
    defaultValues: {
      nome: "",
      valor: "",
      descricao: "",
      duracao: "",
      desconto: "",
      beneficios: [""],
    },
  });

  const resetForm = () => {
    reset({
      nome: "",
      valor: "",
      descricao: "",
      duracao: "",
      desconto: "",
      beneficios: [""],
    });
  };

  useEffect(() => {
    if (showModal) {
      resetForm();
      if (planoData) {
        setValue("nome", planoData.nome);
        setValue("descricao", planoData.descricao);
        setValue("valor", String(planoData.valor));
        setValue("duracao", String(planoData.duracao));
        setValue("desconto", planoData.desconto || 0);
        setValue("beneficios", planoData.beneficios || [""]);
      }
    }
  }, [showModal, planoData, setValue]);

  const addBeneficioField = () => {
    const beneficios = getValues("beneficios") || [];
    setValue("beneficios", [...beneficios, ""]);
  };

  const removeBeneficioField = (index: number) => {
    const beneficios = getValues("beneficios") || [];
    const updatedBeneficios = beneficios.filter((_, i) => i !== index);
    setValue(
      "beneficios",
      updatedBeneficios.length > 0 ? updatedBeneficios : [""]
    );
  };

  const onSubmit = async (data: AssinaturaSchemaDetails) => {
    const response = planoData
      ? await editPlano(planoData.id, data)
      : await newPlano(data);

    if (response.success) {
      refreshPlanos();
    }
    setShowModal(false);
    resetForm();
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        resetForm();
      }}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent>
        <Box className="w-full h-[110px]">
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

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Desconto (%)</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="desconto"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Porcentagem de desconto na loja"
                      value={String(value)}
                      onChangeText={(text) => onChange(Number(text))}
                    />
                  </Input>
                )}
              />
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
                      placeholder="Duração do Plano (em dias)"
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

            <FormControl>
              <FormControlLabel className="mb-2 flex items-center">
                <FormControlLabelText>Beneficios</FormControlLabelText>
              </FormControlLabel>
              <div className="w-full">
                <Controller
                  name="beneficios"
                  control={control}
                  render={() => (
                    <>
                      {(getValues("beneficios") || []).map(
                        (beneficio, index) => (
                          <div key={index} className="mb-2 flex items-center">
                            <Input  className="flex-1">
                              <InputField
															 className="flex-1"
                                placeholder={`Descreva o benefício ${
                                  index + 1
                                }`}
                                value={beneficio}
                                type="text"
                                onChangeText={(text) => {
                                  const beneficios =
                                    getValues("beneficios") || [];
                                  beneficios[index] = text;
                                  setValue("beneficios", [...beneficios]);
                                }}
                              />
                            </Input>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 p-1"
                              onPress={() => removeBeneficioField(index)}
                            >
                              <Icon as={XIcon} size="sm" />
                            </Button>
                            {index ===
                              (getValues("beneficios") || []).length - 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 p-1"
                                onPress={addBeneficioField}
                              >
                                <Icon as={PlusIcon} size="sm" />
                              </Button>
                            )}
                          </div>
                        )
                      )}
                    </>
                  )}
                />
              </div>
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
