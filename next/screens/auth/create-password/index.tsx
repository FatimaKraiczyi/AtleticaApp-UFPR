import { useState } from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import useRouter from "@unitools/router";
import { newPassword } from "@/api/users";
import AuthLayout from "../layout";

const createPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
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
    .min(8, "A senha deve ter no mínimo 8 caracteres")
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

const CreatePasswordWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePasswordSchemaType>({
    resolver: zodResolver(createPasswordSchema),
  });
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: CreatePasswordSchemaType) => {
    if (data.password !== data.confirmpassword) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="error">
            <ToastTitle>Senhas não correspondem</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    const response = await newPassword(data.password, data.confirmpassword);

    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="success">
            <ToastTitle>Senha criada com sucesso</ToastTitle>
          </Toast>
        ),
      });
      reset();
      router.push("/auth/signin");
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="error">
            <ToastTitle>Erro ao criar senha</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };
  const handleConfirmPwState = () => {
    setShowConfirmPassword((showState) => !showState);
  };
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Icon
            as={ArrowLeftIcon}
            className="md:hidden stroke-background-800"
            size="xl"
          />
        </Pressable>
        <VStack>
          <Heading className="md:text-center" size="3xl">
            Recuperação de Senha
          </Heading>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Nova senha</FormControlLabelText>
            </FormControlLabel>
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
                    className="text-sm"
                    placeholder="Nova senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    enterKeyHint="done"
                    type={showPassword ? "text" : "password"}
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
            <FormControlLabel></FormControlLabel>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmpassword}>
            <FormControlLabel>
              <FormControlLabelText>
                Confirme sua nova senha
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="confirmpassword"
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
                    placeholder="Repita a senha"
                    className="text-sm"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    enterKeyHint="done"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <InputSlot onPress={handleConfirmPwState} className="pr-3">
                    <InputIcon
                      as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                    />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.confirmpassword?.message}
              </FormControlErrorText>
            </FormControlError>
            <FormControlLabel></FormControlLabel>
          </FormControl>
        </VStack>

        <VStack className="mt-7 w-full">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Alterar sua senha</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const CreatePassword = () => {
  return (
    <AuthLayout>
      <CreatePasswordWithLeftBackground />
    </AuthLayout>
  );
};
