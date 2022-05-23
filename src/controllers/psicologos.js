const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Psicologos } = require("../models/index.js");
const secret = require("../configs/secret");

const psicologosController = {
  listar: async (req, res) => {
    const listaDePsicologos = await Psicologos.findAll();

    return res.status(200).json(listaDePsicologos);
  },
  listarID: async (req, res) => {
    const { id } = req.params;

    const Psicologo = await Psicologos.findByPk(id, {
      include: [{ all: true }],
    });

    if (!Psicologo) {
      return res
        .status(404)
        .json(
          `O psicólogo de id ${id} não foi encontrado em nossos registros. Confira o ID e tente novamente`
        );
    }

    return res.status(200).json(Psicologo);
  },

  cadastrar: async (req, res) => {
    const { nome, email, apresentacao, senha } = req.body;

    const novaSenha = bcrypt.hashSync(senha, 10);

    const novoPsicologo = await Psicologos.create({
      nome,
      email,
      apresentacao,
      senha: novaSenha,
    });

    res.status(201).json(novoPsicologo);
  },
  atualizar: async (req, res) => {
    const { id } = req.params;
    const { nome, email, apresentacao, senha } = req.body;
    let psicologos = await Psicologos.findByPk(id);

    if (!psicologos) {
      return res
        .status(404)
        .json(
          `O psicologo ${id} não foi encontrado em nosso registro. Confira o ID e tente novamente.`
        );
    }

    if (senha) {
      const novaSenha = bcrypt.hashSync(senha, 10);

      await Psicologos.update(
        { nome, email, apresentacao, senha: novaSenha },
        { where: { id } }
      );
    } else {
      await Psicologos.update({ nome, email, apresentacao }, { where: { id } });
    }

    const pacienteAtualizado = await Psicologos.findByPk(id);
    res.status(200).json(pacienteAtualizado);
  },
  deletar: async (req, res) => {
    const { id } = req.params;

    const psicologo = await Psicologos.findByPk(id);

    if (!psicologo) {
      res
        .status(404)
        .json(
          `O psicologo ${id} não foi encontrado em nosso registro. Confira o ID e tente novamente.`
        );
    }

    await Psicologos.destroy({
      where: { id },
    });

    res.status(204).send("");
  },

  login: async (req, res) => {
    const { email, senha } = req.body;

    const psicologo = await Psicologos.findOne({
      where: {
        email,
      },
    });

    if (!psicologo || !bcrypt.compareSync(senha, psicologo.senha)) {
      return res.status(401).json("email ou senha inválido");
    }
  }
};

module.exports = psicologosController;
