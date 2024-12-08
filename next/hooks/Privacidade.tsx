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

export const PoliticaDePrivacidade = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <Button variant="link" onPress={handleOpenModal}>
        <LinkText className="text-xs">Politica De Privacidade</LinkText>
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
              Politica De Privacidade
            </Heading>
          </Center>
          <ModalBody className="p-6 max-h-[80vh] overflow-y-auto text-gray-700">
            <Text className="text-sm leading-relaxed text-justify">
              <Text className="text-lg font-semibold mb-2">
                1. Coleta de Dados
              </Text>
							<br />
              Coletamos apenas os dados essenciais para seu cadastro na
              plataforma:
              <ul className="list-disc ml-5">
                <li> - Nome;</li>
                <li>- Curso (Graduação);</li>
                <li>- Telefone;</li>
                <li>- E-mail;</li>
                <li>- Senha;</li>
                <li> - Data de nascimento.</li>
              </ul>
              Nenhum outro dado é recolhido ou monitorado.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                2. Uso de Dados
              </Text>
              <br />
              Os dados fornecidos são utilizados exclusivamente para:
              <ul className="mr-5">
                <li className="mr-5">Identificação no sistema;</li>
                <li>Comunicação direta sobre nossos serviços.</li>
              </ul>
              <br />
              <Text className="text-lg font-semibold mb-2">
                3. Armazenamento de Dados
              </Text>
              <br />
              Os dados fornecidos são armazenados de forma segura. As senhas são
              criptografadas e não podem ser acessadas por terceiros ou pela
              administração da plataforma.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                4. Compartilhamento de Dados
              </Text>
              <br />
              Os dados fornecidos não são compartilhados com terceiros sob
              nenhuma circunstância, exceto se exigido por lei.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                5. Direitos do Usuário
              </Text>
              <br />
              Você tem o direito de:
              <ul className="mr-5">
                <li className="mr-5">Solicitar a exclusão dos seus dados;</li>
                <li>Atualizar suas informações de cadastro.</li>
              </ul>
              <br />
              <Text className="text-lg font-semibold mb-2">6. Segurança</Text>
              <br />
              Adotamos medidas técnicas para proteger os dados cadastrados.
              Contudo, nenhuma plataforma é completamente segura contra ameaças
              cibernéticas. Em caso de vulnerabilidades identificadas, tomaremos
              as ações cabíveis para mitigar riscos.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">
                7. Alterações na Política de Privacidade
              </Text>
              <br />
              Reservamo-nos o direito de alterar esta Política de Privacidade a
              qualquer momento. Informaremos sobre mudanças relevantes antes de
              sua aplicação.
              <br />
              <br />
              <Text className="text-lg font-semibold mb-2">8. Contato</Text>
              <br />
              Em caso de dúvidas ou solicitações sobre esta Política, entre em
              contato pelo e-mail <LinkText>atleticaapp@gmail.com</LinkText>.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
