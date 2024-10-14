import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText, } from "@/components/ui/form-control";
import { ChevronDownIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { AlertTriangle, PlusIcon, XIcon } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, } from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { createAssinatura, updateAssinatura } from "../../../api/assinatura";
const AssinaturaSchema = z.object({
    nome: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(50, "O nome deve ter menos de 50 caracteres"),
    valor: z.string().min(1, "Preço é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    duracao: z.string().min(1, "Duração é obrigatória"),
});
export const ModalAssinatura = ({ showModal, setShowModal, addAssinatura, editAssinatura, assinaturaData, }) => {
    const ref = useRef(null);
    const { control, formState: { errors }, handleSubmit, reset, setValue, } = useForm({
        resolver: zodResolver(AssinaturaSchema),
    });
    useEffect(() => {
        if (showModal) {
            resetForm();
        }
        if (assinaturaData) {
            setValue("nome", assinaturaData.nome);
            setValue("descricao", assinaturaData.descricao);
            setValue("valor", assinaturaData.valor);
            setValue("duracao", assinaturaData.duracao);
        }
    }, [showModal, assinaturaData, setValue]);
    const resetForm = () => {
        reset();
    };
    const onSubmit = async (data) => {
        const assinaturaPayload = {
            nome: data.nome,
            descricao: data.descricao,
            valor: data.valor,
            duracao: data.duracao,
        };
        try {
            if (assinaturaData) {
                if (assinaturaData.id !== undefined) {
                    const response = await updateAssinatura(assinaturaData.id, assinaturaPayload);
                    if (response.success) {
                        editAssinatura && editAssinatura(assinaturaPayload);
                    }
                }
            }
            else {
                const response = await createAssinatura(assinaturaPayload);
                if (response.success) {
                    addAssinatura(assinaturaPayload);
                }
            }
            setShowModal(false);
            resetForm();
        }
        catch (error) {
            console.error("Erro:", error);
        }
    };
    return (<Modal isOpen={showModal} onClose={() => {
            setShowModal(false);
            resetForm();
        }} finalFocusRef={ref} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="absolute w-full flex justify-end">
          <ModalCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"/>
          </ModalCloseButton>
        </ModalHeader>
        <Center className="w-full absolute top-10">
          <Heading size="2xl" className="text-typography-800">
            {assinaturaData ? "Editar Plano" : "Cadastrar Plano"}
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6 max-h-[70vh] overflow-y-auto">
          <VStack space="xl">
            <FormControl isInvalid={!!errors.nome}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller defaultValue="" name="nome" control={control} render={({ field: { onChange, onBlur, value } }) => (<Input>
                    <InputField placeholder="Nome do Plano" type="text" value={value} onChangeText={onChange} onBlur={onBlur} onSubmitEditing={Keyboard.dismiss} returnKeyType="done"/>
                  </Input>)}/>
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle}/>
                <FormControlErrorText>
                  {errors?.nome?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.valor}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Preço do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller defaultValue="" name="valor" control={control} render={({ field: { onChange, onBlur, value } }) => (<Input>
                    <InputField placeholder="Valor" type="text" value={value} onChangeText={onChange} onBlur={onBlur} onSubmitEditing={Keyboard.dismiss} returnKeyType="done"/>
                  </Input>)}/>
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle}/>
                <FormControlErrorText>
                  {errors?.valor?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>


            <FormControl isInvalid={!!errors.descricao}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Descrição</FormControlLabelText>
              </FormControlLabel>
              <Controller defaultValue="" name="descricao" control={control} render={({ field: { onChange, onBlur, value } }) => (<Input>
                    <InputField placeholder="Descrição do Plano" type="text" value={value} onChangeText={onChange} onBlur={onBlur} onSubmitEditing={Keyboard.dismiss} returnKeyType="done"/>
                  </Input>)}/>
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle}/>
                <FormControlErrorText>
                  {errors?.descricao?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.duracao}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Duração do Plano</FormControlLabelText>
              </FormControlLabel>
              <Controller defaultValue="" name="duracao" control={control} render={({ field: { onChange, onBlur, value } }) => (<Input>
                    <InputField placeholder="Duração do Plano" type="text" value={value} onChangeText={onChange} onBlur={onBlur} onSubmitEditing={Keyboard.dismiss} returnKeyType="done"/>
                  </Input>)}/>
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle}/>
                <FormControlErrorText>
                  {errors?.duracao?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button onPress={handleSubmit(onSubmit)} className="flex-1 p-2 mt-8">
              <ButtonText>Salvar</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>);
};
