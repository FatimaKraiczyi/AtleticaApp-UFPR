import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "@unitools/link";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
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
  ChevronDownIcon,
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
import useRouter from "@unitools/router";
import { createUser } from "@/api/users";
import AuthLayout from "../layout";
import { UserProps } from "@/interfaces/users";
import { getCursos } from "@/api/cursos";
import { createUserError } from "@/api/errors/usersErrors";
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
import { CursoProps } from "@/interfaces/atleticas";
import { TermosDeUso } from "@/hooks/TermosUso";
import { PoliticaDePrivacidade } from "@/hooks/Privacidade";

const signUpSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().optional(),
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

const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberme") === "true";
    setValue("rememberme", rememberMe);
  }, [setValue]);

  const onSubmit = async (data: SignUpSchemaType) => {
    if (data.password === data.confirmpassword) {
      const [day, month, year] = data.dataNascimento.split("/");
      const formattedDate = `${month}-${day}-${year}`;

      const user: UserProps = {
        nome: `${data.nome} ${data.sobrenome || ""}`.trim(),
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
      localStorage.setItem("rememberme", data.rememberme ? "true" : "false");
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

  return (
    <>
      <FormControl
        className="my-2  md:my-2"
        isInvalid={!!errors.nome}
        isRequired={true}
      >
        <Controller
          name="nome"
          defaultValue=""
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Nome"
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
          <FormControlErrorText>{errors?.nome?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl className="my-2  md:my-2" isInvalid={!!errors.sobrenome}>
        <Controller
          name="sobrenome"
          defaultValue=" "
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Sobrenome"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={handleKeyPress}
                className="text-sm"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon size="sm" as={AlertTriangle} />
          <FormControlErrorText>
            {errors?.sobrenome?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl
        className="my-2  md:my-2"
        isRequired={true}
        isInvalid={!!errors.password}
      >
        <Controller
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
      <FormControl
        className="my-2  md:my-2"
        isRequired={true}
        isInvalid={!!errors.confirmpassword}
      >
        <Controller
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
                <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
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
      <FormControl
        className="my-2  md:my-2"
        isRequired={true}
        isInvalid={!!errors.curso}
      >
        <Controller
          name="curso"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select selectedValue={value} onValueChange={onChange}>
              <SelectTrigger variant="outline">
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
          <FormControlErrorText>{errors?.curso?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl
        className="my-2  md:my-2"
        isRequired={true}
        isInvalid={!!errors.telefone}
      >
        <Controller
          name="telefone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input>
              <InputField
                className="text-sm"
                placeholder="Telefone"
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
      <FormControl
        className="my-2  md:my-2"
        isRequired={true}
        isInvalid={!!errors.dataNascimento}
      >
        <Controller
          name="dataNascimento"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input>
              <InputField
                className="text-sm"
                placeholder="Data de Nascimento"
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
          >
            <CheckboxIndicator className="mr-2">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className="text-sm">
              Eu aceito os <TermosDeUso /> e <PoliticaDePrivacidade />
            </CheckboxLabel>
          </Checkbox>
        )}
      />
      <VStack className="w-full" space="lg">
        <Button
          variant="solid"
          action="primary"
          size="lg"
					className="mt-4"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText>FINALIZAR</ButtonText>
        </Button>
      </VStack>
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
          CRIAR CONTA
        </Text>
      </HStack>
      <VStack space="xs" className="ml-1 my-2">
        <Heading className="color-typography-50 dark:color-typography-950">
          Bem-vindo
        </Heading>
        <Text className="text-md font-normal color-primary-300 dark:color-typography-400">
          Finalize o cadastro para continuar
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
          Finalize o cadastro para continuar
        </Heading>
        <SignUpForm />
      </Box>
    </>
  );
};

export const SignUp = () => {
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
