import { MobileFooter } from "@/components/sections/MobileFooter";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import useCustomRouter from "@/hooks/useCustomRouter";
import useRouter from "@unitools/router";
import { AtleticaResponse } from "@/interfaces/atleticas";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { useAtletica } from "@/hooks/AtleticaContex";
import { Instagram, Twitter, Github, Linkedin } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

interface NavBarProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const NavBar = ({ tabs, activeTab, setActiveTab }: NavBarProps) => {
  return (
    <div className="relative border-b border-gray-300">
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
      {/* Indicador */}
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

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Atividades", "Cursos", "Sobre"];

  // Renderiza o conteúdo de acordo com a aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <VStack space="sm">
            {atividadesArray.map((atividade, index) => (
              <Text key={index} className="text-gray-700">
                {atividade}
              </Text>
            ))}
          </VStack>
        );
      case 1:
        return (
          <VStack space="sm">
            {cursos.map((curso) => (
              <Text key={curso.id} className="text-gray-700">
                {curso.nome} - {curso.departamento}
              </Text>
            ))}
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
    <SafeAreaView className="h-full w-full bg-gray-50">
      <LayoutComponents title={`${nome}`} isSidebarVisible={true}>
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
                <Github color="#6B7280" size={20} />
                <Linkedin color="#6B7280" size={20} />
              </HStack>
            </VStack>
          </HStack>

          {/* Cursos */}
          <VStack className="space-y-2">
            <Text className="text-lg font-semibold text-gray-800">Cursos</Text>
            {cursos.map((curso) => (
              <Text key={curso.id} className="text-gray-600">
                {curso.nome} - {curso.departamento}
              </Text>
            ))}
          </VStack>
        </VStack>

        {/* Navegação e Conteúdo */}
        <NavBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-4">{renderTabContent()}</div>
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
