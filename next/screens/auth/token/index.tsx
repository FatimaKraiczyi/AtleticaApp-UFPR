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
import { Input, InputField } from "@/components/ui/input";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import useRouter from "@unitools/router";
import AuthLayout from "../layout";

import { validateUserToken } from "@/api/users";

const ValidateTokenSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
});

type ValidateTokenSchemaType = z.infer<typeof ValidateTokenSchema>;

const ValidateTokenWithLeftBackground = () => {
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

  const onSubmit = async (data: ValidateTokenSchemaType) => {
    const response = await validateUserToken(data.token);
    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="success">
            <ToastTitle>Token válido</ToastTitle>
          </Toast>
        ),
      });
      reset();
      if (response.data && response.data.acao === 'cadastro') {
        router.push("/auth/signup");
      } else if (response.data && response.data.acao === "recSenha") {
        router.push("/auth/create-password");
      }
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="error">
            <ToastTitle>Token inválido</ToastTitle>
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
            Valide seu token
          </Heading>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors.token}>
            <FormControlLabel>
              <FormControlLabelText>Token</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="token"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await ValidateTokenSchema.parseAsync({
                      token: value,
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
                    placeholder="Token"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    enterKeyHint="done"
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
        </VStack>

        <VStack className="mt-7 w-full">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Enviar</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const ValidateToken = () => {
  return (
    <AuthLayout>
      <ValidateTokenWithLeftBackground />
    </AuthLayout>
  );
};
