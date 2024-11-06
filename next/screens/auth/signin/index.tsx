import { useState } from "react";
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
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import useRouter from "@unitools/router";
import { userAuthentication } from "@/api/users";
import AuthLayout from "../layout";

const signInSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  rememberme: z.boolean().optional(),
});

type SignInSchemaType = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });
  const toast = useToast();
  const router = useRouter();
  const [validated, setValidated] = useState({
    emailValid: true,
    passwordValid: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignInSchemaType) => {
    const response = await userAuthentication(data.email, data.password);

    if (response.success) {
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userType", response.data.tipo);
      sessionStorage.setItem("atleticaId", response.data.atletica.toString());

      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Logado com sucesso!</ToastTitle>
          </Toast>
        ),
      });
      router.push("/dashboard");
      reset();
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const handleState = () => {
    setShowPassword((showState) => !showState);
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
                  await signInSchema.parseAsync({ email: value });
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
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.email?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          className="my-6"
          isInvalid={!!errors.password}
          isRequired={true}
        >
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showPassword ? "text" : "password"}
                  className="text-sm"
                />
                <InputSlot onPress={handleState} className="pr-3">
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.password?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>
      <Link href="/auth/forgot-password">
        <LinkText className="text-xs">Forgot password?</LinkText>
      </Link>
      <Controller
        name="rememberme"
        defaultValue={false}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            size="sm"
            value="Remember me"
            isChecked={value}
            onChange={onChange}
            className="my-5 self-start"
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>Lembrar-m</CheckboxLabel>
          </Checkbox>
        )}
      />
      <Button
        variant="solid"
        size="lg"
        action="primary"
        onPress={handleSubmit(onSubmit)}
        className="mt-5"
      >
        <ButtonText>SIGN IN</ButtonText>
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
        alt="gluestack-ui Pro"
        resizeMode="contain"
        className="w-80 h-80"
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
            as={ArrowLeftIcon}
            className="color-typography-50 dark:color-typography-950"
          />
        </Link>
        <Text className="text-lg color-typography-50 dark:color-typography-950">
          Sign In
        </Text>
      </HStack>
      <VStack space="xs" className="ml-1 my-4">
        <Heading className="color-typography-50 dark:color-typography-950">
          Welcome back
        </Heading>
        <Text className="text-md font-normal color-primary-300 dark:color-typography-400">
          Sign in to continue
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
        className="px-2 md:px-8  bg-background-0
            dark:bg-background-50 py-4 flex-1 justify-between"
      >
        <Heading className="mb-8 md:flex md:text-2xl hidden">
          Sign in to continue
        </Heading>
        <SignInForm />
        <HStack space="md" className="my-4 items-center justify-center">
          <Divider className="w-2/6 bg-background-200 dark:bg-background-700" />
          <Text className="font-medium color-typography-400 dark:color-typography-300">
            or
          </Text>
          <Divider className="w-2/6 bg-background-200 dark:bg-background-700" />
        </HStack>
        <HStack space="xs" className="mt-auto items-center justify-center">
          <Text className="color-typography-500 text-sm dark:color-typography-400">
            Don't have an account?
          </Text>
          <Link href="/auth/email">
            <LinkText className="text-sm">Sign up</LinkText>
          </Link>
        </HStack>
      </Box>
    </>
  );
};

export const SignIn = () => {
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
