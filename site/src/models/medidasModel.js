var database = require("../database/config");

// Gráfico 1
function getHistoricoDisponibilidade(idInstituicao, dias){
    return database.executar(`SELECT valor, DATE_FORMAT(dataRegistro, '%d/%m') AS dataRegistro 
    FROM disponibilidade JOIN instituicao ON fkInstituicao = ${idInstituicao}
    WHERE dataRegistro >= DATE(NOW() - INTERVAL ${dias+1} DAY) ORDER BY dataRegistro DESC LIMIT ${dias};`);
}

// Gráfico 2
function getDisponibilidade(fkInstituicao) {
    return database.executar(`SELECT COUNT(fkEquipamento) AS qtdManutencao FROM manutencao JOIN equipamento ON fkEquipamento = idEquipamento
    JOIN instituicao ON fkInstituicao = idInstituicao WHERE situacao = 'Aberto' AND idInstituicao = ${fkInstituicao};`);
}

function getComponentes(fkEquipamento) {
    return database.executar(`SELECT DISTINCT tipo FROM medida JOIN componente ON componente.idComponente = medida.fkComponente AND componente.fkEquipamento = ${fkEquipamento};`);
}

function getMedidasInstituicao(idInstituicao){
    // Task: transformar numa view
    return database.executar(`SELECT ROUND(cpu.valor, 2) AS valorCPU, ROUND(ram.valor, 2) AS valorRAM, dk.valor AS valorDK  FROM 
    (SELECT valor, medida.dataRegistro AS dtCPU FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao 
        ON idInstituicao = fkInstituicao WHERE componente.tipo = "Processador" AND idInstituicao = ${idInstituicao} AND dtCPU >= DATE(NOW() - INTERVAL 1 DAY)) AS cpu,
    (SELECT valor, medida.dataRegistro AS dtRAM FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao
        ON idInstituicao = fkInstituicao WHERE componente.tipo = "Memória RAM" AND idInstituicao = ${idInstituicao} AND dtRAM >= DATE(NOW() - INTERVAL 1 DAY)) AS ram,
    (SELECT valor, medida.dataRegistro AS dtDK FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao 
        ON idInstituicao = fkInstituicao WHERE componente.tipo = "Disco Rígido" AND idInstituicao = ${idInstituicao} AND dtDK >= DATE(NOW() - INTERVAL 1 DAY)) AS dk;`);
}

// SELECT ROUND(cpu.valor, 2) AS valorCPU, ROUND(ram.valor, 2) AS valorRAM, dk.valor AS valorDK  FROM 
//     (SELECT valor, medida.dataRegistro AS dtCPU FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao 
//         ON idInstituicao = fkInstituicao WHERE componente.tipo = "Processador" AND idInstituicao = 1000 AND medida.dataRegistro >= DATE(NOW() - INTERVAL 30 DAY)) AS cpu,
//     (SELECT valor, medida.dataRegistro AS dtRAM FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao
//         ON idInstituicao = fkInstituicao WHERE componente.tipo = "Memória RAM" AND idInstituicao = 1000 AND medida.dataRegistro >= DATE(NOW() - INTERVAL 30 DAY)) AS ram,
//     (SELECT valor, medida.dataRegistro AS dtDK FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento ON fkEquipamento = idEquipamento JOIN instituicao 
//         ON idInstituicao = fkInstituicao WHERE componente.tipo = "Disco Rígido" AND idInstituicao = 1000 AND medida.dataRegistro >= DATE(NOW() - INTERVAL 30 DAY)) AS dk;

function getMaquinasMonitoradas(idInstituicao){
    return database.executar(`SELECT COUNT(idEquipamento) AS qtd FROM equipamento JOIN instituicao ON fkInstituicao = idInstituicao WHERE idInstituicao = ${idInstituicao};`);
}

function getMaquinasInstituicao(idInstituicao){
    return database.executar(`SELECT idEquipamento, modelo, numeroPatrimonio, sala.nome AS sala
    FROM equipamento JOIN  instituicao ON fkInstituicao = idInstituicao JOIN locacao ON fkEquipamento = 
    idEquipamento JOIN sala ON fkSala = idSala WHERE idInstituicao = ${idInstituicao};`);
}

function getMaquinasManutencao(idInstituicao){
    return database.executar(`SELECT idEquipamento, modelo, numeroPatrimonio FROM equipamento JOIN manutencao ON idEquipamento = fkEquipamento WHERE fkInstituicao = ${idInstituicao};`);
}

function setDadosG4(idEquipamento){
    return database.executar(`SELECT * FROM vw_medidasEquipamento WHERE idEquipamento = ${idEquipamento} ORDER BY dataRegistro DESC LIMIT 90;`);
}

function getMediasEquipamentos(idInstituicao){
    // Task: Transformar numa view
    return database.executar(`SELECT idEquipamento, modelo, numeroPatrimonio, sala.nome AS sala
    FROM equipamento JOIN  instituicao ON fkInstituicao = idInstituicao JOIN locacao ON fkEquipamento = 
    idEquipamento JOIN sala ON fkSala = idSala WHERE idInstituicao = ${idInstituicao};`);
}


// SELECT ROUND(cpu.valor, 2) AS mediaCPU, ROUND(ram.valor, 2) AS mediaRAM, ROUND(dk.valor, 2) AS mediaDK FROM 

// (SELECT valor FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento 
// ON fkEquipamento = idEquipamento JOIN instituicao ON idInstituicao = fkInstituicao WHERE componente.tipo = "Processador" AND idInstituicao = 1000) AS cpu,

// (SELECT valor FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento 
// ON fkEquipamento = idEquipamento JOIN instituicao ON idInstituicao = fkInstituicao WHERE componente.tipo = "Memória RAM" AND idInstituicao = 1000) AS ram,

// (SELECT valor FROM medida JOIN componente ON idComponente = fkComponente JOIN equipamento 
// ON fkEquipamento = idEquipamento JOIN instituicao ON idInstituicao = fkInstituicao WHERE componente.tipo = "Disco Rígido" AND idInstituicao = 1000) AS dk;



module.exports = {
    getComponentes,
    getHistoricoDisponibilidade,
    getMedidasInstituicao,
    getMaquinasMonitoradas,
    getDisponibilidade,
    getMaquinasInstituicao,
    getMediasEquipamentos,
    getMaquinasManutencao
}