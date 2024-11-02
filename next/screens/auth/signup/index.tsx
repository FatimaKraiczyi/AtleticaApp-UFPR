import { useState, useEffect } from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import Link from "@unitools/link";
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
import { AlertTriangle, ChevronDownIcon } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import useRouter from "@unitools/router";
import AuthLayout from "../layout";

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
import { getCursos } from "@/api/cursos";
import { type CursoProps } from "../../../../interfaces/cursos";
import { createUser } from "@/api/users";
import { type UserProps } from "../../../../interfaces/users";
import { createUserError } from "@/api/errors/usersErrors";

const signUpSchema = z.object({
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
  curso: z.string().min(1, "Curso é obrigatório"),
  telefone: z
    .string()
    .min(11, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de telefone inválido"),
  dataNascimento: z
    .string()
    .min(8, "Data de nascimento é obrigatória")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido"),
  rememberme: z.boolean().optional(),
});
type SignUpSchemaType = z.infer<typeof signUpSchema>;

const SignUpWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const onSubmit = async (data: SignUpSchemaType) => {
    if (data.password === data.confirmpassword) {
      const [day, month, year] = data.dataNascimento.split("/");
      const formattedDate = `${day}-${month}-${year}`;

      const user: UserProps = {
        senha: data.password,
        repSenha: data.confirmpassword,
        cursoId: data.curso,
        telefone: data.telefone.replace(/\D/g, ""),
        dataNasc: formattedDate,
      };

      const response = await createUser(user);

      if (response.success) {
        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} action="success">
              <ToastTitle>Usuário cadastrado com sucesso!</ToastTitle>
            </Toast>
          ),
        });
        router.push("/auth/signin");
        reset();
      } else {
        const { errorMessage } = createUserError(response);
        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} action="error">
              <ToastTitle>{errorMessage}</ToastTitle>
            </Toast>
          ),
        });
      }
    }
  };

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
  const router = useRouter();

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
            Cadastre-se
          </Heading>
          <Text>Cadastre-se e comece a usar o AtléticaApp</Text>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Senha</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await signUpSchema.parseAsync({
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
                    placeholder="Senha"
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
          </FormControl>
          <FormControl isInvalid={!!errors.confirmpassword}>
            <FormControlLabel>
              <FormControlLabelText>Confirmar senha</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="confirmpassword"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await signUpSchema.parseAsync({
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
                    placeholder="Confirmar Senha"
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
          </FormControl>

          <FormControl isInvalid={!!errors.curso}>
            <FormControlLabel>
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

          <FormControl isInvalid={!!errors.telefone}>
            <FormControlLabel>
              <FormControlLabelText>Telefone</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="telefone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="(xx) xxxxx-xxxx"
                    value={value}
                    keyboardType="phone-pad"
                    onChangeText={(text) => {
                      const formatted = text
                        .replace(/\D/g, "")
                        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
                      onChange(formatted);
                    }}
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.telefone?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={!!errors.dataNascimento}>
            <FormControlLabel>
              <FormControlLabelText>Data de Nascimento</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="dataNascimento"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="dd/mm/aaaa"
                    value={value}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const formatted = text
                        .replace(/\D/g, "")
                        .replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
                      onChange(formatted);
                    }}
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.dataNascimento?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
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
                aria-label="Remember me"
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  Eu aceito os Termos de Uso e a Política de Privacidade
                </CheckboxLabel>
              </Checkbox>
            )}
          />
        </VStack>

        <VStack className="w-full my-7" space="lg">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Cadastre-se</ButtonText>
          </Button>
        </VStack>
        <HStack className="self-center">
          <Text size="md">Já tem uma conta?</Text>
          <Link href="/auth/signin">
            <LinkText
              className="font-medium text-primary-700 ml-1 group-hover/link:text-primary-600 group-hover/pressed:text-primary-700"
              size="md"
            >
              Entrar
            </LinkText>
          </Link>
        </HStack>
      </VStack>
    </VStack>
  );
};

export const SignUp = () => {
  return (
    <AuthLayout>
      <SignUpWithLeftBackground />
    </AuthLayout>
  );
};
