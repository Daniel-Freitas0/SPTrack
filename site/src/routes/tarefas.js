var express = require("express");
var router = express.Router();

var tarefaController = require('../controllers/tarefaController');

router.post('/insertTarefa', function (request, response) {
    tarefaController.insertTarefa(request, response);
});

router.post('/getLastTarefa', function (request, response) {
    tarefaController.getLastTarefa(request, response);
});

router.post('/setTarefaXequipamentos', function (request, response) {
    tarefaController.setTarefaXequipamentos(request, response);
});

router.post('/getTarefas', function (request, response) {
    tarefaController.getTarefas(request, response);
});

router.post('/getTarefa', function (request, response) {
    tarefaController.getTarefa(request, response);
});

router.post('/getMedidasTarefa', function (request, response) {
    tarefaController.getMedidasTarefa(request, response);
});

router.post('/deleteTarefa', function (request, response) {
    tarefaController.deleteTarefa(request, response);
});

router.post('/getTarefaXequipamento', function (request, response) {
    tarefaController.getTarefaXequipamento(request, response);
});


module.exports = router;