import { Box } from "@/components/ui/box";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import Link from "@unitools/link";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import useRouter from "@unitools/router";
import { sendEmailRequest } from "@/api/users";
import AuthLayout from "../layout";

const EmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .regex(/@ufpr\.br$/, "O email deve ser do domínio @ufpr.br"),
});
type EmailSchemaType = z.infer<typeof EmailSchema>;

const EmailForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
  });
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: EmailSchemaType) => {
    const response = await sendEmailRequest(data.email, "cadastro");

    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Sucesso</ToastTitle>
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
            <ToastTitle>Erro ao enviar código de verficação</ToastTitle>
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
      <VStack className="justify-between">
        <FormControl isInvalid={!!errors?.email} isRequired={true}>
          <Controller
            name="email"
            defaultValue=""
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await EmailSchema.parseAsync({ email: value });
                  return true;
                } catch (error: any) {
                  return error.message;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Email @ufpr.br"
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
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.email?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>

      <Button
        variant="solid"
        size="lg"
        action="primary"
        onPress={handleSubmit(onSubmit)}
        className="mt-5"
      >
        <ButtonText>CONTINUAR</ButtonText>
      </Button>
    </>
  );
};

function SideContainerWeb() {
  return (
    <Center
      className="bg-violet-600
            dark:bg-background-0 flex-1"
    >
      <Image
        alt="logo"
        resizeMode="contain"
        className="w-[200px] h-80"
        source={require("../../../assets/auth/logo.png")}
      />
    </Center>
  );
}

function MobileHeader() {
  return (
    <VStack
      space="md"
      className="px-3 mt-4 bg-violet-600
            dark:bg-background-0"
    >
      <HStack space="md" className="items-center">
        <Link href="..">
          <Icon
            size="md"
            as={ArrowLeftIcon}
            className="color-typography-50 dark:color-typography-950"
          />
        </Link>
        <Text className="text-lg color-typography-50 dark:color-typography-950">
          Nova conta
        </Text>
      </HStack>
      <VStack space="xs" className="ml-1 my-4">
        <Heading className="color-typography-50 dark:color-typography-950">
          Ola, seja bem-vindo!
        </Heading>
        <Text className="text-md font-normal color-primary-300 dark:color-typography-400">
          Preencha os seus dados para continuar
        </Text>
      </VStack>
    </VStack>
  );
}

const Main = () => {
  return (
    <>
      <Box className="md:hidden">
        <MobileHeader />
      </Box>
      <Box
        className="max-w-[508px] flex-1 px-4 py-8 bg-background-0
            dark:bg-background-50 md:pt-8 md:px-8"
      >
        <Heading className="mb-8 md:flex md:text-2xl hidden">
          Preencha os seus dados para continuar
        </Heading>
        <EmailForm />
        <HStack
          space="xs"
          className="md:mt-40 mt-auto items-center justify-center"
        >
          <Text className="color-typography-500 text-sm dark:color-typography-400">
            Já tem uma conta?
          </Text>
          <Link href="/auth/signin">
            <LinkText className="text-sm">Entrar</LinkText>
          </Link>
        </HStack>
      </Box>
    </>
  );
};

export const Email = () => {
  return (
    <AuthLayout>
      <Box className="flex-1 hidden md:flex ">
        <SideContainerWeb />
      </Box>
      <Box className="flex-1 ">
        <Main />
      </Box>
    </AuthLayout>
  );
};
