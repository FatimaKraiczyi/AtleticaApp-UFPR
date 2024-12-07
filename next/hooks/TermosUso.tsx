import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { LinkText } from "@/components/ui/link";

export const TermosDeUso = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <Button variant="link" onPress={handleOpenModal}>
        <LinkText className="text-xs">Termos de Uso</LinkText>
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <Box className={"w-full h-[110px] "}>
            <Image
              source={require("@/assets/profile-screens/profile/image2.png")}
              size="full"
              alt="Banner Image"
            />
          </Box>
          <ModalHeader className="absolute w-full flex justify-end">
            <ModalCloseButton onPress={() => setIsModalOpen(false)}>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400"
              />
            </ModalCloseButton>
          </ModalHeader>

          <Center className="w-full absolute top-10">
            <Heading size="2xl" className="text-typography-900">
              Termos de Uso
            </Heading>
          </Center>

          <ModalBody className="p-6 max-h-[80vh] overflow-y-auto text-gray-700">
            <Text className="text-sm leading-relaxed text-justify">
              <Text className="text-lg font-semibold mb-2">
                1. Aceitação dos Termos
              </Text>
              <br />
              Ao utilizar nossa plataforma, você concorda com os termos e
              condições aqui descritos. Este Termo regula o uso do sistema, que
              exige informações básicas para o cadastro.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">2. Cadastro</Text>
              <br />
              Para acessar nossos serviços, é necessário fornecer os seguintes
              dados:
              <ul className="list-disc ml-5">
                <li> - Nome;</li>
                <li>- Curso (Graduação);</li>
                <li>- Telefone;</li>
                <li>- E-mail;</li>
                <li>- Senha;</li>
                <li> - Data de nascimento.</li>
              </ul>
              Você é responsável por fornecer informações verdadeiras e manter a
              confidencialidade da sua senha.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                3. Finalidade do Uso
              </Text>
              <br />
              Os dados fornecidos são utilizados apenas para:
              <ul className="mr-5">
                <li className="mr-5">
                  Identificação do usuário na plataforma;
                </li>
                <li>Comunicação relacionada aos serviços oferecidos.</li>
              </ul>
              <br />
              <Text className="text-lg font-semibold mb-2">
                4. Uso Indevido
              </Text>
              <br />
              Qualquer uso indevido da plataforma, incluindo, mas não se
              limitando a fraudes ou atividades ilícitas, resultará no bloqueio
              do acesso.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                5. Alterações nos Termos
              </Text>
              <br />
              Reservamo-nos o direito de alterar este Termo a qualquer momento.
              Avisaremos sobre alterações significativas antes de sua
              implementação.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">6. Contato</Text>
              <br />
              Para dúvidas ou solicitações, entre em contato através do e-mail
              de suporte: <LinkText>atleticaapp@gmail.com</LinkText> .
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
