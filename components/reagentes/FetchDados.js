
export const fetchDados = (setData, dbreagent, setFilteredData) => {
    dbreagent.transaction(tx => {
      tx.executeSql(
        'SELECT produto.nome, lote.quantidade_geral, lote.unidade_medida, lote.validade, lote.numero, lote.localizacao, lote.quantidade_frascos, lote.quantidade_unitario, lote.id FROM produto JOIN lote ON produto.lote_id = lote.id',
        [],
        (_, { rows }) => {
          setData(rows._array);
          setFilteredData(rows._array);
        },
        error => {
          console.log('Erro ao buscar dados:', error);
        }
      );
    });
  };
  