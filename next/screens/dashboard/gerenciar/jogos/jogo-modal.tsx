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
import { AlertTriangle, ChevronDownIcon } from "lucide-react-native";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import { addEventoAPI } from "@/api/evento";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import atividadesEsportivas from "@/mock/atividades_esportivas";

const eventoSchema = z.object({
  data: z
    .string()
    .min(6, "Data é obrigatória")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido"),
  hora: z
    .string()
    .min(4, "Hora é obrigatória")
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido"),
  titulo: z.string().min(1, "Título é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  qtdeVagas: z.number().min(1, "Quantidade de vagas é obrigatória"),
});

type EventoFormData = z.infer<typeof eventoSchema>;

export const ModalJogo = ({
  showModal,
  setShowModal,
  refreshEventos,
}: {
  showModal: boolean;
  setShowModal: any;
  refreshEventos: () => void;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
  });

  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;
  const atleticaNome =
    typeof window !== "undefined"
      ? sessionStorage.getItem("atleticaNome")
      : null;

  const onSubmit = async (data: EventoFormData) => {
    try {
      const formattedData = {
        ...data,
        data: data.data.split("/").reverse().join("-"),
        hora: data.hora,
        atleticaId: Number(atleticaId),
        atleticaName: atleticaNome,
        modalidade: "JOGO",
        statusEvento: "EM_ANDAMENTO",
      };
      const response = await addEventoAPI(formattedData);
      if (response.success) {
        refreshEventos();
        setShowModal(false);
        reset();
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        reset();
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <Box className="w-full h-[110px]">
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
            Cadastrar Jogo
          </Heading>
        </Center>
        <ModalBody className="overflow-y-auto">
          <VStack space="md">
            <FormControl>
              <FormControlLabelText>Atividade</FormControlLabelText>
              <Controller
                name="titulo"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} selectedValue={value}>
                    <SelectTrigger variant="outline">
                      <SelectInput placeholder="Atividade" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {atividadesEsportivas.map((atividade) => (
                          <SelectItem
                            key={atividade.nome}
                            value={atividade.nome}
                            label={atividade.nome}
                          >
                            {atividade.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.titulo?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.descricao?.message}>
              <FormControlLabelText>Descrição</FormControlLabelText>
              <Controller
                control={control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Descrição do jogo"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.descricao?.message && (
                <FormControlErrorText>
                  {errors.descricao.message}
                </FormControlErrorText>
              )}
            </FormControl>
            <FormControl>
              <FormControlLabelText>Data</FormControlLabelText>
              <Controller
                control={control}
                name="data"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Data do jogo"
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
              <FormControlLabelText>Horário de Ínicio</FormControlLabelText>
              <Controller
                control={control}
                name="hora"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
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
              <FormControlLabelText>Endereço</FormControlLabelText>
              <Controller
                name="endereco"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Local do jogo"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.endereco && (
                <FormControlError>{errors.endereco.message}</FormControlError>
              )}
            </FormControl>
            <FormControl>
              <FormControlLabelText>
                Quantidade de vagas disponíveis
              </FormControlLabelText>
              <Controller
                control={control}
                name="qtdeVagas"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Número de vagas"
                      keyboardType="numeric"
                      value={value?.toString() || ""}
                      onChangeText={(text) => onChange(Number(text))}
                    />
                  </Input>
                )}
              />
              {errors.qtdeVagas && (
                <FormControlError>{errors.qtdeVagas.message}</FormControlError>
              )}
            </FormControl>
          </VStack>
          <Button className=" mt-4" onPress={handleSubmit(onSubmit)}>
            <ButtonText>Salvar</ButtonText>
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
