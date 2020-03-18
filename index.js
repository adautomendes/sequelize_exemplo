/**
 * Importação das bibiotecas
 */
const restify = require("restify"); // Restify => usado para expormos a aplicação WEB
const Salgado = require("./models/Salgado"); // Salgado => modelo do Sequelize que criamos

// Criando o servidor do Restify
const server = restify.createServer();

server.use(restify.plugins.bodyParser()); // Plugin usado para suportar requisições com body contendo jSon
server.use(restify.plugins.queryParser()); // Plugin usado para suportar requisições com query parameters

/**
 * Função que recebe nome e preço do salgado e insere no BD
 * Retorna todas as informações do Salgado criado
 *
 * POST http://localhost:3000/salgado
 */
async function inserirSalgado(req, res) {
    // Recebendo dados do body da requisição
    let nome = req.body.nome;
    let preco = req.body.preco;

    // Invocando o método de create do Salgado e passando o nome e o preço dentro de um objeto
    let salgado = await Salgado.create(
        {
            nome: nome,
            preco: preco
        }
    );

    // Aqui pegamos o id do Salgado criado e buscamos ele no BD para montar a resposta completa
    let createdSalgado = await Salgado.findByPk(salgado.id);

    // Devolvemos a resposta no formato jSon
    res.json(createdSalgado);
};

/**
 * Função que recebe nome e preço do salgado e atualiza no BD por id
 * Retorna todas as informações do Salgado atualizado
 * 
 * PATCH http://localhost:3000/salgado/<id>
 */
async function atualizarSalgado(req, res) {
    // O id vem no caminho (path) da requisição
    let id = req.params.id;
    // Recebendo dados do body da requisição
    let nome = req.body.nome;
    let preco = req.body.preco;

    // Invocando o método de create do Salgado e passando o nome e o preço dentro de um objeto
    await Salgado.update(
        { // Aqui passamos o nome e valor dos campos a serem atualizados
            nome: nome,
            preco: preco
        },
        { // Aqui definimos qual será o filtro (where) para esse update, neste caso, pelo id
            where: {
                id: id
            }
        }
    );

    // Aqui pegamos o id do Salgado atualizado e buscamos ele no BD para montar a resposta completa
    let updatedSalgado = await Salgado.findByPk(id);

    // Devolvemos a resposta no formato jSon
    res.json(updatedSalgado);
};

/**
 * Função que pode receber id ou nome do salgado e buscar no BD
 * Caso não seja passado nenhum parâmetro ou um parâmetro inválido, retornará todos os registros
 * Retorna um vetor de Salgados dependendo do filtro utilizando
 * 
 * GET http://localhost:3000/salgado
 * ou
 * GET http://localhost:3000/salgado?id=<id>
 * ou
 * GET http://localhost:3000/salgado?nome=<nome>
 */
async function buscarSalgado(req, res) {
    // Recebendo parâmetros por query => http://localhost:3000/salgado?parametro=valor
    let id = req.query.id;
    let nome = req.query.nome;

    if (id) { // Se o id estiver presente buscará por id (PK)
        let salgados = await Salgado.findByPk(id);
        res.json(salgados);
    } else if (nome) { // Se o nome estiver presente buscará por nome
        let salgados = await Salgado.findAll(
            { // O where segue a mesma lógica do update, sempre será usado como filtro
                where: {
                    nome
                }
            }
        );
        res.json(salgados);
    } else { // Caso nenhum parâmetro seja satisfeito, busca todos
        let salgados = await Salgado.findAll();
        res.json(salgados);
    }
};

/**
 * Função que exclui um Salgado baseado no seu id
 * 
 * DELETE http://localhost:3000/salgado/<id>
 */
async function excluirSalgado(req, res) {
    // O id vem no caminho (path) da requisição
    let id = req.params.id;

    // O método destroy retornará um número referente à quantidade de linhas deletadas
    // (como estamos deletando por id espera-se que ele retorne 0 - quando não achar registro com aquele id
    // ou 1 - quando achar e excluir)
    let nDeleted = await Salgado.destroy(
        { // O where segue a mesma lógica do update, sempre será usado como filtro
            where: {
                id
            }
        }
    );

    // Como o destroy devolve somente um número, montamos um objeto para devolves a resposta
    res.json(
        {
            linhas_excluidas: nDeleted
        }
    );
};

/**
 * Aqui temos a configuração das rotas
 */
server.post("/salgado", inserirSalgado);
server.patch("/salgado/:id", atualizarSalgado);
server.get("/salgado", buscarSalgado);
server.del("/salgado/:id", excluirSalgado);

/**
 * O método 'listen' coloca o servidor de pé
 * A função anônima passada para era é o que chamamos de 'callback' (uma função que será executada
 * assim que a função 'listen' terminar sua execução - de forma síncrona)
 */
server.listen(3000, function () {
    console.log("EB019 rodando...");
});