import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { ChevronDownIcon, CloseIcon, Icon } from "@/components/ui/icon";
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
import { CursoProps } from "../../../../interfaces/cursos";
import { getCursos } from "../../../../api/cursos";
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
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { EditPhotoIcon } from "../../profile-screens/profile/assets/icons/edit-photo";

const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Name must be less than 50 characters"),
  curso: z.string().min(1, "Curso é obrigatório"),
  descricao: z.string().min(1, "Curso é obrigatório"),
  position: z.string().optional(),
});
type userSchemaDetails = z.infer<typeof userSchema>;

export const ModalAtletica = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const ref = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [cursos, setCursos] = useState<CursoProps[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await getCursos();
      if (response.success) {
        setCursos(response.data ?? []);
      }
    };
    fetchCursos();
  }, []);

  const onSubmit = (_data: userSchemaDetails) => {
    setShowModal(false);
    reset();
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
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
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <Center className="w-full absolute top-10">
          <Heading size="2xl" className="text-typography-800">
            Cadastrar Atlética
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6">
          <Center className="w-full mb-6">
            <Avatar size="2xl">
              <AvatarImage
                source={require("@/assets/profile-screens/profile/image.png")}
              />
              <AvatarBadge className="justify-center items-center bg-background-500">
                <Icon as={EditPhotoIcon} />
              </AvatarBadge>
            </Avatar>
          </Center>
          <VStack space="xl">
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Nome da Atlética</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="name"
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
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.name?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
						<FormControl isInvalid={!!errors.name}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Descrição</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="descricao"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Descrição"
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
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
            <FormControl isInvalid={!!errors.curso}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Curso</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="curso"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="Selecione um curso" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {cursos.map((curso) => (
                          <SelectItem
                            key={curso.id}
                            value={String(curso.id)}
                            label={curso.nome}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.curso?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
                      
            <Button
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
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