import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, CloseIcon, Icon } from "@/components/ui/icon";
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
import { AlertCircle, type LucideIcon } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard } from "react-native";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { CameraSparklesIcon } from "../../profile-screens/profile/assets/icons/camera-sparkles";
import { EditPhotoIcon } from "../../profile-screens/profile/assets/icons/edit-photo";

type userSchemaDetails = z.infer<typeof userSchema>;

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  course: z.string().min(1, "Course is required"),
  isAdmin: z.boolean(),
  position: z.string().optional(),
});

export const ModalMembros = ({
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
        <Box className={"w-full h-[215px] "}>
          <Image
            source={require("@/assets/profile-screens/profile/image2.png")}
            height={"100%"}
            width={"100%"}
            alt="Banner Image"
          />
        </Box>
        <Pressable className="absolute bg-background-500 rounded-full items-center justify-center h-8 w-8 right-6 top-44">
          <Icon as={CameraSparklesIcon} />
        </Pressable>
        <ModalHeader className="absolute w-full">
          <Heading size="2xl" className="text-typography-800">
            Edit Profile
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <Center className="w-full absolute top-16">
          <Avatar size="2xl">
            <AvatarImage
              source={require("@/assets/profile-screens/profile/image.png")}
            />
            <AvatarBadge className="justify-center items-center bg-background-500">
              <Icon as={EditPhotoIcon} />
            </AvatarBadge>
          </Avatar>
        </Center>
        <ModalBody className="px-10 py-6">
          <VStack space="xl">
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="email"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await userSchema.parseAsync({
                        email: value,
                      });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Email"
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
                <FormControlErrorIcon as={AlertCircleIcon} size="md" />
                <FormControlErrorText>
                  {errors?.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              className="flex-1 p-2"
            >
              <ButtonText>Salvar</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
