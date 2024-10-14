import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState, useEffect } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileFooter } from "../../components/MobileFooter";
import { ModalAtletica } from "./atletica-modal";
import { DeleteAtletica } from "./delete-atletica";
import { getAtletica } from "../../../../api/atleticas";
import { getMembros } from "../../../../api/membros";
import { useMembros } from "../../../hooks/MembrosContext";
import { LayoutComponents } from "../../components/LayoutComponents";
import { LoadingState } from "../../components/LoadingState";
import { NoItemsFound } from "../../components/NoItemsFound";
const MainContent = () => {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [atleticaToEdit, setAtleticaToEdit] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [atleticas, setAtleticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [atleticaIdToDelete, setAtleticaIdToDelete] = useState(null);
    const { setMembros } = useMembros();
    const userType = sessionStorage.getItem("userType");
    const handleCardPress = async (atleticaId) => {
        const response = await getMembros(atleticaId);
        if (response.success) {
            if (response.data) {
                setMembros(response.data);
                console.log("Dados dos membros encontrados:", response.data);
            }
            else {
                console.error("Dados dos membros não encontrados");
            }
        }
        router.push("/dashboard/membros");
    };
    const handleCadastrarAtleticaPress = () => {
        setIsModalVisible(true);
        setIsEditMode(false);
        setAtleticaToEdit(null);
    };
    const handleEditAtleticaPress = (atletica) => {
        setIsModalVisible(true);
        setIsEditMode(true);
        setAtleticaToEdit(atletica);
    };
    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleOpenDeleteModal = (id) => {
        setAtleticaIdToDelete(id);
        setIsDeleteModalVisible(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalVisible(false);
        setAtleticaIdToDelete(null);
    };
    const updateAtleticasList = async () => {
        try {
            const response = await getAtletica();
            if (response.success && response.data) {
                setAtleticas(response.data);
            }
            else {
                console.error("Erro ao buscar atléticas");
            }
        }
        catch (error) {
            console.error("Erro na requisição:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        updateAtleticasList();
    }, []);
    if (loading) {
        return <LoadingState />;
    }
    const renderNoAtleticas = () => (<NoItemsFound message="Nenhuma atlética encontrada."/>);
    const renderAtleticas = () => (<Grid _extra={{ className: "gap-5" }}>
			{atleticas.map((item, index) => (<GridItem _extra={{
                className: "col-span-12 sm:col-span-6 lg:col-span-4",
            }} key={index}>
					<VStack space="md" className="border border-border-300 rounded-lg p-4">
						<HStack space="xl" className="items-center justify-between">
							<HStack space="xl" className="items-center">
								<Avatar>
									<AvatarImage source={item.atletica.imagem ||
                require("@/shared/assets/dashboard/dashboard-layout/image2.png")}/>
								</Avatar>
								<VStack>
									<Text className="font-semibold text-typography-900 line-clamp-1">
										{item.atletica.nome}
									</Text>
									<Text className="line-clamp-1">{item.atletica.descricao}</Text>
									<Text className="line-clamp-1">
										Atividades: {item.atletica.atividades}
									</Text>
									{item.cursos && (<Text className="line-clamp-1">
											Cursos: {item.cursos.map(curso => curso.nome).join(", ")}
										</Text>)}
								</VStack>
							</HStack>
							{userType === "master" && (<HStack space="md">
									<Pressable onPress={() => handleEditAtleticaPress(item.atletica)}>
										<Icon as={EditIcon} className="text-typography-600"/>
									</Pressable>
									<Pressable onPress={() => item.atletica.id !== undefined && handleOpenDeleteModal(item.atletica.id)}>
										<Icon as={TrashIcon} className="text-typography-600"/>
									</Pressable>
								</HStack>)}
						</HStack>
						{userType === "master" && (<Button variant="outline" className="gap-3 relative" onPress={() => handleCardPress(String(item.atletica.id))}>
								<ButtonText>Gerenciar Membros</ButtonText>
							</Button>)}
					</VStack>
				</GridItem>))}
		</Grid>);
    return (<Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        <VStack space="lg" className="items-center">
          {userType === "master" && (<Button className="gap-3 relative" onPress={handleCadastrarAtleticaPress}>
              <ButtonText>Cadastrar Atlética</ButtonText>
            </Button>)}
        </VStack>
        {atleticas.length === 0 ? renderNoAtleticas() : (<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom: isWeb ? 0 : 100,
                flexGrow: 1,
            }} className="flex-1 mb-20 md:mb-2">
            {renderAtleticas()}
          </ScrollView>)}
      </VStack>
      <ModalAtletica showModal={isModalVisible} setShowModal={handleCloseModal} addAtletica={updateAtleticasList} editAtletica={updateAtleticasList} atleticaData={isEditMode && atleticaToEdit ? atleticaToEdit : undefined}/>

      <DeleteAtletica showModal={isDeleteModalVisible} setShowModal={handleCloseDeleteModal} atleticaId={atleticaIdToDelete} updateAtleticasList={updateAtleticasList}/>
    </Box>);
};
export const GerenciarAtleticas = () => {
    return (<SafeAreaView className="h-full w-full">
      <LayoutComponents title="Atléticas" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>);
};
