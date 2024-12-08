import { useEffect, useState } from "react";
import useCustomRouter from "@/hooks/useCustomRouter"; 
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

const MainContent = () => {
  const router = useCustomRouter();
  const { session_id } = router.query;
  interface PaymentStatus {
    completed: boolean;
  }

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/payment-status?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Pagamento bem-sucedido, session_id:", session_id);
          console.log("Status do pagamento:", data);
          setPaymentStatus(data);
        })
        .catch((error) => {
          console.error("Erro ao verificar o status do pagamento:", error);
        });
    }
  }, [session_id]);

  return (
        <Box className="flex-1 justify-center items-center">
          <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
            <Text className="text-2xl font-bold text-center">
              Pagamento realizado com sucesso!
            </Text>
            <Text className="text-lg text-center">
              Obrigado por sua compra. Seu pagamento foi processado com sucesso.
            </Text>
            {paymentStatus && (
              <Text className="text-lg text-center">
                Status do pagamento: {paymentStatus.completed ? "Completo" : "Pendente"}
              </Text>
            )}
          </VStack>
        </Box>
  );
};

export const Success = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Pagamento realizado" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
 