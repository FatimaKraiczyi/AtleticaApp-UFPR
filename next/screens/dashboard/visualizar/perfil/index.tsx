import { MobileFooter } from "@/components/sections/MobileFooter";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { useState } from "react";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { useAtletica } from "@/hooks/AtleticaContex";
import { Instagram, Twitter } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { ProdutosList } from "../../gerenciar/loja/produt-list";
import { Box } from "@/components/ui/box";

interface NavBarProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const NavBar = ({ tabs, activeTab, setActiveTab }: NavBarProps) => {
  return (
    <div className="relative border-b border-gray-300 bg-white">
      <div className="flex justify-around">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 text-sm ${
              activeTab === index
                ? "text-violet-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        className="absolute bottom-0 bg-violet-600 h-1 transition-all"
        style={{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${activeTab * 100}%)`,
        }}
      />
    </div>
  );
};

export const MainContent = () => {
  const { atleticaData } = useAtletica();
  const { nome, descricao, imagem, atividades } = atleticaData.atletica;
  const cursos = atleticaData.cursos;
  const atividadesArray = Array.isArray(atividades) ? atividades : [atividades];

  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Sobre", "Produtos", "Eventos", "Jogos", "Planos", "Membros"];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <VStack space="sm">
            <Text className="text-gray-600">{descricao}</Text>
            {atividadesArray.map((atividade, index) => (
              atividade && (
                <Text key={index} className="text-gray-700">
                  {atividade.nome}
                </Text>
              )
            ))}
          </VStack>
        );
      case 1:
        return (
          <VStack space="sm">
            <ProdutosList />;
          </VStack>
        );
      case 2:
        return (
          <Text className="text-gray-600">
            Esta atlética é reconhecida por suas atividades e eventos que
            promovem integração e diversão para os estudantes.
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <VStack className="px-6 py-6 space-y-6">
        {/* Cabeçalho com Foto e Detalhes */}
        <HStack className="items-center space-x-6">
          {/* Imagem do Perfil */}
          <Image
            source={imagem || require("@/assets/dashboard/image2.png")}
            className="w-24 h-24 rounded-full"
            alt="Atlética"
          />

          {/* Informações da Atlética */}
          <VStack space="sm">
            <Text className="text-2xl font-bold text-gray-800">{nome}</Text>
            <Text className="text-gray-600">{descricao}</Text>

            {/* Redes Sociais */}
            <HStack space="md" className="mt-2">
              <Instagram color="#6B7280" size={20} />
              <Twitter color="#6B7280" size={20} />
            </HStack>
          </VStack>
        </HStack>
      </VStack>
      {/* Navegação e Conteúdo */}
      <div className="flex flex-col">
        <NavBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <Box className="flex-1">{renderTabContent()}</Box>
    </>
  );
};

export const VisualizarAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Perfil"  isSidebarVisible={true}>
        <MainContent />
        <MobileFooter />
      </LayoutComponents>
    </SafeAreaView>
  );
};
