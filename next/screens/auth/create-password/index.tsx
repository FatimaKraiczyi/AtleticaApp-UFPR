import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import useRouter from "@unitools/router";
import { newPassword } from "@/api/users";
import AuthLayout from "../layout";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import { z } from "zod";
import Link from "@unitools/link";

const createPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Deve conter pelo menos uma letra maiúscula"
    )
    .regex(
      new RegExp(".*[a-z].*"),
      "Deve conter pelo menos uma letra minúscula"
    )
    .regex(new RegExp(".*\\d.*"), "Deve conter pelo menos um número")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "Deve conter pelo menos um caractere especial"
    ),
  confirmpassword: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Deve conter pelo menos uma letra maiúscula"
    )
    .regex(
      new RegExp(".*[a-z].*"),
      "Deve conter pelo menos uma letra minúscula"
    )
    .regex(new RegExp(".*\\d.*"), "Deve conter pelo menos um número")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "Deve conter pelo menos um caractere especial"
    ),
});

type CreatePasswordSchemaType = z.infer<typeof createPasswordSchema>;

const CreatePasswordForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreatePasswordSchemaType>({
    resolver: zodResolver(createPasswordSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleConfirmPasswordState = () => {
    setShowConfirmPassword((showConfirmPassword) => {
      return !showConfirmPassword;
    });
  };

  const onSubmit = async (data: CreatePasswordSchemaType) => {
    const response = await newPassword(data.password, data.confirmpassword);

    if (response.success) {
      reset();
      router.push("/auth/signin");
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

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
          Criar senha
        </Text>
      </HStack>
    );
  }

  function ScreenText() {
    return (
      <>
        <Heading className="mb-4 md:flex md:text-2xl ">
          Criar nova senha
        </Heading>
        <Text className="text-sm ">
          Sua nova senha deve ser diferente das senhas usadas anteriormente e
          deve ter pelo menos 6 caracteres.
        </Text>
      </>
    );
  }

  function WebSideContainer() {
    return (
      <Center
        className="bg-violet-600
							dark:bg-background-0 flex-1"
      >
        <Image
          alt="Esqueceu a senha"
          resizeMode="contain"
          className="w-[200px] h-80"
          source={require("@/assets/auth/logo.png")}
        />
      </Center>
    );
  }

  return (
    <>
      <Box className="md:hidden flex">
        <Header />
      </Box>
      <Box className="flex-1 md:flex hidden">
        <WebSideContainer />
      </Box>

      <Box
        className="max-w-[508px] flex-1 px-4 py-8 bg-background-0
            dark:bg-background-50  md:pt-8 md:px-8"
      >
        <ScreenText />
        <FormControl
          className="my-2  md:my-2"
          isInvalid={!!errors.password}
          isRequired={true}
        >
          <Controller
            defaultValue=""
            name="password"
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await createPasswordSchema.parseAsync({
                    password: value,
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
                  placeholder="Senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showPassword ? "text" : "password"}
                  className="text-sm"
                />
                <InputSlot onPress={handleState} className="mr-2">
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
        <FormControl
          className="my-2  md:my-2"
          isInvalid={!!errors.confirmpassword}
          isRequired={true}
        >
          <Controller
            defaultValue=""
            name="confirmpassword"
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await createPasswordSchema.parseAsync({
                    confirmpassword: value,
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
                  placeholder="Confirmar Senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showConfirmPassword ? "text" : "password"}
                  className="text-sm"
                />
                <InputSlot
                  onPress={handleConfirmPasswordState}
                  className="mr-2"
                >
                  <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />

          <FormControlError>
            <FormControlErrorIcon size="md" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.confirmpassword?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <HStack className="md:mt-40 mt-auto w-full" space="lg">
          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={handleSubmit(onSubmit)}
            className="w-full md:w-full"
          >
            <ButtonText className="text-sm">ALTERAR SENHA</ButtonText>
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export const CreatePassword = () => {
  return (
    <AuthLayout>
      <CreatePasswordForm />
    </AuthLayout>
  );
};
