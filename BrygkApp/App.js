import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, Button, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para o ícone "+" flutuante

const App = () => {
  // Lista de produtos padrão da mercearia
  const produtos = [
    { id: 1, nome: 'Arroz', preco: 27.00, tipo: 'unidade' },
    { id: 2, nome: 'Feijão', preco: 9.00, tipo: 'unidade' },
    { id: 3, nome: 'Óleo', preco: 3.99, tipo: 'unidade' },
    { id: 4, nome: 'Macarrão', preco: 2.80, tipo: 'unidade' },
    { id: 5, nome: 'Açúcar', preco: 1.99, tipo: 'unidade' },
    { id: 6, nome: 'Café', preco: 6.50, tipo: 'unidade' },
    { id: 7, nome: 'Sal', preco: 0.99, tipo: 'unidade' },
    { id: 8, nome: 'Leite', preco: 8.00, tipo: 'unidade' },
    { id: 9, nome: 'Banana', preco: 3.50, tipo: 'peso' },
    { id: 10, nome: 'Carne', preco: 15.00, tipo: 'peso' },
  ];

  // Estado para o carrinho e para os novos produtos
  const [carrinho, setCarrinho] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  // Estados para o formulário de adicionar novo produto e editar o preço
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEditarPreco, setMostrarEditarPreco] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const [novoPreco, setNovoPreco] = useState('');
  
  // Estados para o novo produto personalizado
  const [novoProdutoNome, setNovoProdutoNome] = useState('');
  const [novoProdutoPreco, setNovoProdutoPreco] = useState('');
  const [novoProdutoQuantidade, setNovoProdutoQuantidade] = useState('');

  // Função para adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    const produtoExistente = carrinho.find((item) => item.id === produto.id);
    if (produtoExistente) {
      const novoCarrinho = carrinho.map((item) =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
      setCarrinho(novoCarrinho);
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  // Função para remover produto do carrinho
  const removerDoCarrinho = (id) => {
    const novoCarrinho = carrinho.filter((item) => item.id !== id);
    setCarrinho(novoCarrinho);
  };

  // Função para aumentar a quantidade de um produto
  const aumentarQuantidade = (id) => {
    const novoCarrinho = carrinho.map((item) =>
      item.id === id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );
    setCarrinho(novoCarrinho);
  };

  // Função para diminuir a quantidade de um produto
  const diminuirQuantidade = (id) => {
    const novoCarrinho = carrinho.map((item) =>
      item.id === id && item.quantidade > 1
        ? { ...item, quantidade: item.quantidade - 1 }
        : item
    );
    setCarrinho(novoCarrinho);
  };

  // Função para atualizar o preço de um produto
  const atualizarPrecoProduto = () => {
    if (!novoPreco) return;

    const novoCarrinho = carrinho.map((item) =>
      item.id === produtoParaEditar.id
        ? { ...item, preco: parseFloat(novoPreco) }
        : item
    );
    setCarrinho(novoCarrinho);
    setMostrarEditarPreco(false);
    setNovoPreco('');
  };

  // Função para calcular o total
  const calcularTotal = () => {
    return carrinho
      .reduce((total, produto) => {
        const precoTotal = produto.tipo === 'peso'
          ? produto.preco * produto.quantidade
          : produto.preco * produto.quantidade;

        return total + precoTotal;
      }, 0)
      .toFixed(2);
  };

  // Função para calcular o troco
  const calcularTroco = () => {
    const total = calcularTotal();
    const troco = parseFloat(valorPago) - parseFloat(total);
    return troco >= 0 ? troco.toFixed(2) : 'Valor insuficiente';
  };

  // Função para adicionar um novo produto personalizado
  const adicionarNovoProduto = () => {
    if (!novoProdutoNome || !novoProdutoPreco || !novoProdutoQuantidade) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const novoProduto = {
      id: carrinho.length + 1,
      nome: novoProdutoNome,
      preco: parseFloat(novoProdutoPreco),
      quantidade: parseFloat(novoProdutoQuantidade),
      tipo: 'unidade', // Como estamos criando um novo produto, vamos definir como 'unidade'.
    };

    adicionarAoCarrinho(novoProduto);

    // Resetando os valores do formulário
    setNovoProdutoNome('');
    setNovoProdutoPreco('');
    setNovoProdutoQuantidade('');
    setMostrarFormulario(false); // Fechar o formulário após adicionar o produto
  };

  useEffect(() => {
    calcularTotal();
  }, [carrinho]); // Atualiza o total sempre que o carrinho mudar

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Produtos da Mercearia</Text>
            <TextInput
              style={styles.input}
              placeholder="Pesquisar produto"
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </>
        }
        data={produtos}
        renderItem={({ item }) => (
          <View style={styles.produtoContainer}>
            <Text style={styles.produtoTexto}>
              {item.nome} - R$ {item.preco.toFixed(2)} {item.tipo === 'peso' ? '/kg' : ''}
            </Text>
            <Button title="Adicionar ao Carrinho" onPress={() => adicionarAoCarrinho(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Não há produtos correspondentes.</Text>}
      />

      {mostrarFormulario && (
        <View style={styles.formularioContainer}>
          <Text style={styles.titulo}>Adicionar Novo Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={novoProdutoNome}
            onChangeText={setNovoProdutoNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Preço do Produto"
            keyboardType="numeric"
            value={novoProdutoPreco}
            onChangeText={setNovoProdutoPreco}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade (kg ou unidades)"
            keyboardType="numeric"
            value={novoProdutoQuantidade}
            onChangeText={setNovoProdutoQuantidade}
          />
          <Button title="Adicionar Produto Personalizado" onPress={adicionarNovoProduto} />
        </View>
      )}

      <Text style={styles.titulo}>Carrinho</Text>
      {carrinho.length === 0 ? (
        <Text>O carrinho está vazio</Text>
      ) : (
        <FlatList
          data={carrinho}
          renderItem={({ item }) => (
            <View style={styles.itemCarrinhoContainer}>
              <Text style={styles.itemCarrinho}>
                {item.nome} - R$ {(item.preco * item.quantidade).toFixed(2)}
              </Text>

              <View style={styles.botaoContainer}>
                <Button title="-" onPress={() => diminuirQuantidade(item.id)} />
                <Text>{item.quantidade}</Text>
                <Button title="+" onPress={() => aumentarQuantidade(item.id)} />
                <Button title="Remover" onPress={() => removerDoCarrinho(item.id)} />
                
                {/* Botão para editar o preço */}
                <TouchableOpacity onPress={() => { setProdutoParaEditar(item); setMostrarEditarPreco(true); }}>
                  <Text>Editar Preço</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {mostrarEditarPreco && (
        <View style={styles.formularioContainer}>
          <Text style={styles.titulo}>Atualizar Preço</Text>
          <TextInput
            style={styles.input}
            placeholder="Novo Preço"
            keyboardType="numeric"
            value={novoPreco}
            onChangeText={setNovoPreco}
          />
          <Button title="Atualizar Preço" onPress={atualizarPrecoProduto} />
          <Button title="Fechar" onPress={() => setMostrarEditarPreco(false)} />
        </View>
      )}

      <View style={styles.valorTotalContainer}>
        <Text style={styles.titulo}>Total: R$ {calcularTotal()}</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor Pago"
          keyboardType="numeric"
          value={valorPago}
          onChangeText={setValorPago}
        />
        <Text style={styles.titulo}>Troco: R$ {calcularTroco()}</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => setMostrarFormulario(!mostrarFormulario)}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  titulo: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  produtoContainer: {
    marginVertical: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  produtoTexto: {
    fontSize: 18,
    marginBottom: 5,
  },
  itemCarrinhoContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemCarrinho: {
    fontSize: 16,
  },
  botaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
    paddingLeft: 10,
  },
  formularioContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 5,
  },
  valorTotalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
