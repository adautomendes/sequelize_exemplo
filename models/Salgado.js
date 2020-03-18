/**
 * Bibliotecas importadas
 */
const { Sequelize } = require("sequelize"); //Sequelize (com S) é uma classe dentro da biblioteca sequelize (com s), por isso a importação vem entre { }
const conexao = require("../database/Conexao"); //Aqui importamos o módulo de conexão que criamos, para fazer o modelo comunicar com o BD

/**
 * Aqui definimos o modelo (tabela) do BD.
 * 'salgado' => é o nome do modelo que dará origem à tabela
 */
const Salgado = conexao.define('salgado',
    { //Neste segundo parâmetro definimos os campos do modelo (devem coincidir com as colunas da tabela - exceto id)
        nome: Sequelize.TEXT, // Campo nome é do tipo TEXT
        preco: Sequelize.DOUBLE, // Campo preco é do tipo DOUBLE
        data_inclusao: Sequelize.DATE // Campo data_inclusao é do tipo DATETIME (no Sequelize usamos somente DATE)
    },
    { //Aqui definimos algumas propriedades do modelo
        timestamps: false, // Esta flag serva para omitirmos os campos 'createdAt' e 'updatedAt'
        tableName: 'salgado' // Aqui repetimos o nome da tabela (por padrão o Sequelize pega o nome do modelo no plural 'salgados' e para evitar isto usamos este campo 'tableName')
    }
);

/**
 * Exportando módulo para ser usado externamente.
 * Aqui exportamos o modelo do sequelize.
 */
module.exports = Salgado;