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
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { PlanoAssinatura } from "@/interfaces/planos";
import { novaAssinatura } from "@/api/assinatura";
import useRouter from "@unitools/router";

interface ViewPlanoProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  planosData?: any;
}

export const ViewPlano = ({
  showModal,
  setShowModal,
  planosData,
}: ViewPlanoProps) => {
  const [expandedPlanos, setExpandedPlanos] = useState<Set<number>>(new Set());
  const router = useRouter();

  const toggleExpand = (id: number) => {
    setExpandedPlanos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePurchase = async () => {
    if (!planosData) return;

    const response = await novaAssinatura(planosData.id);

    if (response.success) {
      router.push("/dashboard/visualizar/assinatura");
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      {planosData && (
        <ModalContent>
          <Box className={"w-full h-[110px] "}>
            <Image
                source={require("@/assets/dashboard/headermodal.png")}
              size="full"
              alt="Banner Image"
            />
          </Box>
          <ModalHeader className="absolute w-full flex justify-end">
            <ModalCloseButton onPress={() => setShowModal(false)}>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400"
              />
            </ModalCloseButton>
          </ModalHeader>

          <Center className="w-full absolute top-10">
            <Heading size="2xl" className="text-typography-900">
              {planosData.nome}
            </Heading>
          </Center>
          <ModalBody className="max-h-[80vh] overflow-y-auto">
            <Text className="font-semibold text-2xl text-typography-600">
              {planosData.atleticaNome}
            </Text>
            <Text className="mt-4 font-semibold text-2xl text-typography-900 text-green-600">
              R$ {planosData.valor.toFixed(2)}
            </Text>
            <Text className="text-sm">Duração: {planosData.duracao} dias</Text>

            <VStack className="mt-4">
              <Button
                variant="link"
                className="text-gray-500 text-sm"
                onPress={() => toggleExpand(planosData.id)}
              >
                <span>Veja os benefícios</span>
                {expandedPlanos.has(planosData.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {expandedPlanos.has(planosData.id) && (
                      <VStack space="md" className="items-center">
                        <Text className="text-gray-700 text-sm">
                          ✔️ {planosData.desconto} % de desconto na loja
                        </Text>
                        {planosData.beneficios &&
                          planosData.beneficios.map((beneficio: any, index: any) => (
                            <Text key={index} className="text-center text-gray-700 text-sm">
                              ✔️ {beneficio}
                            </Text>
                          ))}
                      </VStack>
                    )}

              <HStack className="items-center justify-between mt-4">
                <Button onPress={handlePurchase} className="flex-1 ml-2">
                  <ButtonText>Assinar</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
