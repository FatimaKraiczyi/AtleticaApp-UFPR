import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const CadastrarAtletica = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [success, setSuccess] = useState(null);

    const handleCadastrar = async () => {
        try {
            const response = await axios.post('http://localhost:3000/master/cadastrarAtletica', {
                nome,
                descricao
            });
            console.log('Resposta do servidor:', response.data);
            setSuccess(true);
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setSuccess(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
            />
            <Pressable style={styles.button} onPress={handleCadastrar}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
            {success !== null && (
                <Text style={success ? styles.successMessage : styles.errorMessage}>
                    {success ? 'Cadastrado com sucesso!' : 'Erro ao cadastrar'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    successMessage: {
        color: 'green',
        marginTop: 10,
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
        fontSize: 16,
    },
});

export default CadastrarAtletica;
