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
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Evento } from "@/interfaces/evento";
import { Center } from "@/components/ui/center";
import { addEventoAPI } from "@/api/evento";

const eventoSchema = z.object({
  data: z
    .string()
    .min(6, "Data é obrigatória")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido"),
  hora: z.string().min(4, "Hora é obrigatória"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});
type EventoFormData = z.infer<typeof eventoSchema>;

export const ModalEvento = ({
  showModal,
  setShowModal,
  refreshEventos,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshEventos: () => void;
}) => {
  const ref = useRef(null);

  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isEventoRoute = currentPath === "/dashboard/gerenciar/eventos";

  const defaultValues: Partial<EventoFormData> = {
    modalidade: "FESTA",
    statusEvento: "EM_ANDAMENTO",
    atleticaId: atleticaId ? parseInt(atleticaId) : undefined,
    qtdeVagas: 1,
    ingresso: 0,
    linkPlataformaIngressos: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues,
  });

  const onSubmit = async (data: Evento) => {
    try {
      const formattedData = {
        ...data,
        data: data.data.split("/").reverse().join("-"),
        hora: `${data.hora}:00`,
      };

      const response = await addEventoAPI(formattedData);
      if (response.success) {
        refreshEventos();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to save evento:", error);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        reset(defaultValues);
      }}
      finalFocusRef={ref}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent>
        <Box className="w-full h-[110px]">
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
            "Cadastrar Evento"
          </Heading>
        </Center>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <VStack space="xl">
            <FormControl>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>
                  Link Plataforma Ingressos
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="linkPlataformaIngressos"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="URL da plataforma de ingressos"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.linkPlataformaIngressos && (
                <FormControlError>
                  <FormControlErrorIcon size="md" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors.linkPlataformaIngressos.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Título</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Título do evento"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.descricao && (
                <FormControlError>
                  <FormControlErrorIcon size="md" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors.descricao.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Data</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="data"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      className="text-sm"
                      placeholder="Data do evento"
                      value={value}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const formatted = text
                          .replace(/\D/g, "")
                          .replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
                        onChange(formatted);
                      }}
                    />
                  </Input>
                )}
              />
              {errors.data && (
                <FormControlError>
                  <FormControlErrorIcon size="md" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors.data.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Hora de Ínicio</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="hora"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      className="text-sm"
                      placeholder="HH:MM"
                      value={value}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const formatted = text
                          .replace(/\D/g, "")
                          .replace(/(\d{2})(\d{2})/, "$1:$2");
                        onChange(formatted);
                      }}
                    />
                  </Input>
                )}
              />
              {errors.hora && (
                <FormControlError>
                  <FormControlErrorIcon size="md" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors.hora.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Endereço</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="endereco"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Endereço do evento"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.endereco && (
                <FormControlError>
                  <FormControlErrorIcon size="md" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors.endereco.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
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
