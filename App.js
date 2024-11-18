import React from 'react';
import { Button, Alert, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const generatePDF = async () => {
    // Dados do recibo
    const logoUrl = "https://www.wikimedia.org/static/images/wmf-logo-2x.png"
    const items = [
      { descricao: 'Produto A', quantidade: 2, preco: 25.0 },
      { descricao: 'Produto B', quantidade: 1, preco: 15.5 },
    ];
    const total = items.reduce((sum, item) => sum + item.quantidade * item.preco, 0);

    // Template HTML para o recibo
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo img { max-width: 100px; }
            .header { text-align: center; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .table th { background-color: #f4f4f4; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="${logoUrl}" alt="Logo" />
          </div>
          <div class="header">
            <h1>Recibo de Venda</h1>
            <p>Data: ${new Date().toLocaleDateString()}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) =>
                    `<tr>
                      <td>${item.descricao}</td>
                      <td>${item.quantidade}</td>
                      <td>R$ ${item.preco.toFixed(2)}</td>
                      <td>R$ ${(item.quantidade * item.preco).toFixed(2)}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
          <div class="total">
            Valor Final: R$ ${total.toFixed(2)}
          </div>
        </body>
      </html>
    `;

    try {
      // Gera o PDF
      const { uri } = await Print.printToFileAsync({ html });

      Alert.alert('Sucesso', `PDF gerado em: ${uri}`);

      // Compartilhar o PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Erro', 'Compartilhamento não disponível no dispositivo.');
      }
    } catch (err) {
      Alert.alert('Erro', `Falha ao gerar recibo: ${err.message}`);
    }
  };

  return (
    <View style={{flex:1, marginTop:250}}>  
      <Button title="Gerar Recibo" onPress={generatePDF} />;
    </View>
  )
};

