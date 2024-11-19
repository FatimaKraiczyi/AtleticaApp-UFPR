import { MobileFooter } from "@/components/sections/MobileFooter";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import useCustomRouter from "@/hooks/useCustomRouter";
import useRouter from "@unitools/router";
import { AtleticaResponse } from "@/interfaces/atleticas";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { useAtletica } from "@/hooks/AtleticaContex";

export const MainContent = () => {
  const { atleticaData } = useAtletica();
	
  const { nome, descricao, imagem, atividades } = atleticaData.atletica;

	const cursos = atleticaData.cursos

  const atividadesArray = Array.isArray(atividades) ? atividades : [atividades];

  return (
    <SafeAreaView className="h-full w-full bg-gray-50">
      <LayoutComponents title={`${nome}`} isSidebarVisible={true}>
        <VStack space="lg" className="px-4 py-6">
          <VStack space="md" className="items-center">
            <Image
              source={{ uri: imagem || "https://via.placeholder.com/150" }}
              className="w-40 h-40 rounded-full border-4 border-violet-600"
              alt="Atlética"
            />
            <Text className="text-2xl font-semibold">{nome}</Text>
            <Text className="text-gray-600 text-center">{descricao}</Text>
          </VStack>

          {/* Atividades */}
          <VStack space="sm" className="mt-6">
            <Text className="text-xl font-semibold">Atividades:</Text>
            {atividadesArray.map((atividade, index) => (
              <Text key={index} className="text-gray-700">
                {atividade}
              </Text>
            ))}
          </VStack>

          {/* Cursos Associados */}
          <VStack space="sm" className="mt-6">
            <Text className="text-xl font-semibold">Cursos Associados:</Text>
            
              {cursos.map((curso) => (
                <Text key={curso.id} className="text-gray-700">
                  {curso.nome} - {curso.departamento}
                </Text>
              ))
            
					}
          </VStack>
        </VStack>
      </LayoutComponents>
    </SafeAreaView>
  );
};

export const VisualizarAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <MainContent />
      <MobileFooter />
    </SafeAreaView>
  );
};