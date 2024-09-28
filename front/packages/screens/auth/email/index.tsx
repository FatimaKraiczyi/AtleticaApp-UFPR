import React from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { Button, ButtonText } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import useRouter from "@unitools/router";
import { AuthLayout } from "../layout";
import { sendEmailRequest } from "../../../../api/users";

const EmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .regex(/@ufpr\.br$/, "O email deve ser do domínio @ufpr.br"),
  name: z.string().min(1, "Nome é obrigatório"),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "Você deve aceitar os Termos de Uso e Política de Privacidade",
    }),
  }),
});
type EmailSchemaType = z.infer<typeof EmailSchema>;

const EmailWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      terms: true,
    },
  });
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: EmailSchemaType) => {
    const response = await sendEmailRequest(data.email, data.name);
    
    if (response.success) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="accent" action="success">
            <ToastTitle>Success</ToastTitle>
          </Toast>
        ),
      });
      reset();
      router.push("/auth/token");
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="error" action="failed">
            <ToastTitle>Erro ao enviar e-mail</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
        <VStack>
          <Heading className="md:text-center" size="3xl">
            Sign up
          </Heading>
          <Text>Sign up and start using gluestack</Text>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors.name}>
            <FormControlLabel>
              <FormControlLabelText>Nome completo</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="Nome completo"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>{errors?.name?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="Email"
                    type="text"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="md" as={AlertTriangle} />
              <FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isInvalid={!!errors.terms}>
            <Controller
              name="terms"
              control={control}
              defaultValue={true}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  size="sm"
                  value="terms"
                  aria-label="terms"
                  isChecked={value}
                  onChange={onChange}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    Eu aceito os Termos de Uso e Política de Privacidade
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>{errors?.terms?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </VStack>

        <VStack className="w-full my-7" space="lg">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Enviar</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const Email = () => {
  return (
    <AuthLayout>
      <EmailWithLeftBackground />
    </AuthLayout>
  );
};
