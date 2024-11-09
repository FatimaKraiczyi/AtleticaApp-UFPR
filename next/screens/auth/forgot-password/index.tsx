import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Toast, useToast, ToastTitle } from "@/components/ui/toast";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, ArrowLeftIcon } from "lucide-react-native";
import { Link as RNLink } from "react-native-web-next-link";
import useRouter from "@unitools/router";
import AuthLayout from "../layout";
import { resetPasswordRequest } from "@/api/users";
import Link from "@unitools/link";
import { Divider } from "@/components/ui/divider";
import { LinkText } from "@/components/ui/link";
import { Keyboard } from "react-native";
import { useAuthContext } from "@/hooks/AuthProvider";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email(),
});

export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

function MobileHeader() {
  return (
    <HStack
      space="md"
      className="px-3 py-4 items-center bg-violet-600
            dark:bg-background-0"
    >
      <RNLink href="..">
        <Icon
          size="md"
          as={ArrowLeftIcon}
          className="color-typography-50 dark:color-typography-950"
        />
      </RNLink>
      <Text className="color-typography-50 text-lg dark:color-typography-50">
        Esqueceu a senha?
      </Text>
    </HStack>
  );
}

function MobileScreenImage() {
  return (
    <Center
      className="px-4 py-4 -mb-0.5 bg-background-0
            dark:bg-background-0 md:py-48 md:px-12 md:bg-primary-500 md:dark:bg-primary-700"
    >
      <Image
        className="flex dark:hidden md:hidden md:dark:hidden h-40 w-48"
        source={require("@/assets/auth/forgotPassword_mobile_light.png")}
        resizeMode="contain"
        alignSelf="center"
      />
      <Image
        className="h-40 w-48 hidden dark:flex md:hidden"
        source={require("@/assets/auth/forgotPassword_mobile_dark.png")}
        resizeMode="contain"
        alignSelf="center"
      />
    </Center>
  );
}

function SideContainerWeb() {
  return (
    <Center
      className="bg-violet-600
            dark:bg-background-0 flex-1"
    >
      <Image
        alt="Esqueceu a senha"
        resizeMode="contain"
        className="w-[200px] h-80"
        source={require("@/assets/auth/forgotPassword_web_dark.png")}
      />
    </Center>
  );
}
const ForgotPasswordForm = () => {
  const { setEmail } = useAuthContext();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: forgotPasswordSchemaType) => {
    setEmail(data.email);

    const response = await resetPasswordRequest(data.email);
    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>
              Token de autenticação enviado com sucesso ao seu email
            </ToastTitle>
          </Toast>
        ),
      });
      reset();
      router.push("/auth/token");
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Email não cadastrado</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <VStack space="md" className="items-center md:items-start">
        <Heading className="text-xl text-center md:text-left md:text-2xl">
          Esqueceu a senha?
        </Heading>
        <Text className="text-sm font-normal text-center md:text-left">
          Não se preocupe! Insira o endereço de e-mail associado à sua conta e
          enviaremos um token de autenticação para redefinir sua senha.
        </Text>
      </VStack>
      <FormControl
        className="my-8"
        isInvalid={!!errors.email}
        isRequired={true}
      >
        <Controller
          defaultValue=""
          name="email"
          control={control}
          rules={{
            validate: async (value) => {
              try {
                await forgotPasswordSchema.parseAsync({
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
                className="text-sm"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} size="sm" />
          <FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <Button variant="solid" size="lg" onPress={handleSubmit(onSubmit)}>
        <ButtonText className="text-sm">Enviar token</ButtonText>
      </Button>
    </>
  );
};

const Main = () => {
  return (
    <>
      <Box className="md:hidden">
        <MobileHeader />
        <MobileScreenImage />
      </Box>
      <Box
        className="max-w-[508px] pt-0 pb-8 px-4 bg-background-0
            dark:bg-background-50 flex-1 md:pt-8 md:px-8"
      >
        <ForgotPasswordForm />
        <HStack
          space="xs"
          className="md:mt-40 mt-auto items-center justify-center"
        >
          <Text className="color-typography-500 text-sm dark:color-typography-400">
            Lembrou a senha?
          </Text>
          <Link href="/auth/signin">
            <LinkText className="text-sm">Entrar</LinkText>
          </Link>
        </HStack>
      </Box>
    </>
  );
};

export const ForgotPassword = () => {
  return (
    <AuthLayout>
      <VStack className="bg-primary-500 md:flex-row dark:bg-background-900 flex-1">
        <Box className="flex-1 hidden md:flex">
          <SideContainerWeb />
        </Box>
        <Box className="flex-1">
          <Main />
        </Box>
      </VStack>
    </AuthLayout>
  );
};
