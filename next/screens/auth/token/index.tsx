import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
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
import AuthLayout from "../layout";
import { Text } from "@/components/ui/text";
import { resetPasswordRequest, validateUserToken } from "@/api/users";
import { HStack } from "@/components/ui/hstack";
import Link from "@unitools/link";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { LinkText } from "@/components/ui/link";
import { Box } from "@/components/ui/box";
import { useAuthContext } from "@/hooks/AuthProvider";

const ValidateTokenSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
});

type ValidateTokenSchemaType = z.infer<typeof ValidateTokenSchema>;

function Header() {
  return (
    <HStack
      space="md"
      className="px-3 py-4 items-center bg-violet-600
					dark:bg-background-0"
    >
      <Link href="..">
        <Icon
          as={ArrowLeftIcon}
          className="color-typography-50 dark:color-typography-950"
        />
      </Link>
      <Text className="color-typography-50 text-lg dark:color-typography-50">
        Token de autenticação
      </Text>
    </HStack>
  );
}

function SideContainerWeb() {
  return (
    <Center
      className="bg-violet-600
            dark:bg-background-0 flex-1"
    >
      <Image
        alt="gluestack-ui Pro"
        resizeMode="contain"
        className="w-[200px] h-80"
        source={require("../../../assets/auth/logo.png")}
      />
    </Center>
  );
}

function AccountLink() {
  return (
    <HStack space="xs" className="md:mt-40 mt-auto items-center justify-center">
      <Text className="color-typography-500 text-sm dark:color-typography-400">
        Já tem uma conta?
      </Text>
      <Link href="/auth/signin">
        <LinkText className="text-sm">Entrar</LinkText>
      </Link>
    </HStack>
  );
}

const TokenVerification = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidateTokenSchemaType>({
    resolver: zodResolver(ValidateTokenSchema),
  });
  const toast = useToast();
  const router = useRouter();
  const { email } = useAuthContext();

  const onSubmit = async (data: ValidateTokenSchemaType) => {
    const response = await validateUserToken(data.token);
    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Token válido</ToastTitle>
          </Toast>
        ),
      });
      reset();
      if (response.data && response.data.acao === "cadastro") {
        router.push("/auth/signup");
      } else if (response.data && response.data.acao === "recSenha") {
        router.push("/auth/create-password");
      }
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Token inválido</ToastTitle>
          </Toast>
        ),
      });
    }
  };

	function maskEmail(email: string): string {
		const [localPart, domain] = email.split("@");
		const maskedLocalPart = localPart.slice(0, 5) + "*".repeat(localPart.length - 5);
		return `${maskedLocalPart}@${domain}`;
	}

  function MainText() {
    return (
      <VStack space="md" className="items-start">
        <Heading className="text-xl text-center md:text-left md:text-2xl">
          Insira o token de acesso
        </Heading>
        <HStack space="xs" className="items-center">
          <Text className="text-sm color-typography-800 md:pb-8 dark:color-typography-400">
            Enviado para:{" "}
            <Text className="font-bold color-typography-800 dark:color-typography-400 text-sm">
               {maskEmail(email)}
            </Text>
          </Text>
        </HStack>
      </VStack>
    );
  }

  const ResendLink = ({ email }: { email: string }) => {
    const handleResend = async () => {
      const response = await resetPasswordRequest(email);

      if (response.success) {
        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>Token reenviado com sucesso</ToastTitle>
            </Toast>
          ),
        });
      } else {
        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Ocorreu um erro ao reenviar o token</ToastTitle>
            </Toast>
          ),
        });
      }
    };

    return (
      <HStack space="xs" className="md:mt-8 mt-auto">
        <Text className="color-typography-800 dark:color-typography-400 text-sm">
          Não recebeu o token?
        </Text>
        <Button
          className="items-start"
          variant="link"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={handleResend}
        >
          <ButtonText className="text-sm flex items-start">Reenviar</ButtonText>
        </Button>
      </HStack>
    );
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Box className="flex md:hidden">
        <Header />
      </Box>
      <Box className="flex-1 md:flex hidden">
        <SideContainerWeb />
      </Box>
      <Box
        className="max-w-[508px] flex-1 px-4 py-8 bg-background-0
            dark:bg-background-50 md:p-8"
      >
        <MainText />
        <VStack className="justify-between">
          <FormControl
            className="my-8 md:my-0"
            isInvalid={!!errors?.token}
            isRequired={true}
          >
            <Controller
              defaultValue=""
              name="token"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await ValidateTokenSchema.parseAsync({ token: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="Token"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.token?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <ResendLink email={email} />
          <Button
            size="lg"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText className="text-sm">Enviar</ButtonText>
          </Button>
        </VStack>
        <AccountLink />
      </Box>
    </>
  );
};

export const ValidateToken = () => {
  return (
    <AuthLayout>
      <TokenVerification />
    </AuthLayout>
  );
};
