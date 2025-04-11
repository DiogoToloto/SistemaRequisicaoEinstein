import React, { useState, useEffect } from "react";
import { BellIcon, TrashIcon, CheckIcon } from "lucide-react";

const setores = [
  "CME 5",
  "Preparo 5",
  "Expurgo 5",
  "CME i4",
  "Preparo i4",
  "Expurgo i4",
];

export default function App() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    drt: "",
    plantao: "",
    itens: "",
    setor: "",
  });
  const [setorAtivo, setSetorAtivo] = useState("");
  const [pagina, setPagina] = useState("formulario");
  const [confirmaExcluir, setConfirmaExcluir] = useState(null);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("requisicoes");
    if (dadosSalvos) {
      setRequisicoes(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const novaRequisicao = {
      ...form,
      id: Date.now(),
      dataHora: new Date().toLocaleString(),
      finalizado: false,
    };

    const novasRequisicoes = [...requisicoes, novaRequisicao];
    setRequisicoes(novasRequisicoes);
    localStorage.setItem("requisicoes", JSON.stringify(novasRequisicoes));

    setForm({ nome: "", drt: "", plantao: "", itens: "", setor: "" });
    setPagina("almoxarife");
  };

  const deletarRequisicao = (id) => {
    const atualizadas = requisicoes.filter((req) => req.id !== id);
    setRequisicoes(atualizadas);
    localStorage.setItem("requisicoes", JSON.stringify(atualizadas));
    setConfirmaExcluir(null);
  };

  const marcarFinalizado = (id) => {
    const atualizadas = requisicoes.map((req) =>
      req.id === id ? { ...req, finalizado: true } : req
    );
    setRequisicoes(atualizadas);
    localStorage.setItem("requisicoes", JSON.stringify(atualizadas));
  };

  const requisicoesPorSetor = (setor) =>
    requisicoes.filter((req) => req.setor === setor);

  const novasRequisicoes = (setor) =>
    requisicoesPorSetor(setor).some((req) => !req.finalizado);

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Sistema de Requisição de Materiais</h1>

      <div className="mb-4 d-flex gap-2">
        <button
          onClick={() => setPagina("formulario")}
          className="btn btn-primary"
        >
          Nova Requisição
        </button>
        <button
          onClick={() => setPagina("almoxarife")}
          className="btn btn-success"
        >
          Ver Almoxarife
        </button>
      </div>

      {pagina === "formulario" && (
        <>
          <form onSubmit={handleSubmit} className="row g-3 mb-5">
            <div className="col-md-6">
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                placeholder="DRT"
                value={form.drt}
                onChange={(e) => setForm({ ...form, drt: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <select
                value={form.plantao}
                onChange={(e) => setForm({ ...form, plantao: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Selecione o Plantão</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                value={form.setor}
                onChange={(e) => setForm({ ...form, setor: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Selecione o Setor</option>
                {setores.map((setor) => (
                  <option key={setor} value={setor}>
                    {setor}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <textarea
                placeholder="Itens solicitados"
                value={form.itens}
                onChange={(e) => setForm({ ...form, itens: e.target.value })}
                className="form-control"
                rows="4"
                required
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Enviar Requisição
              </button>
            </div>
          </form>

          <div className="d-flex flex-wrap gap-2">
            {setores.map((setor) => (
              <button
                key={setor}
                onClick={() => setSetorAtivo(setor)}
                className="btn btn-outline-secondary position-relative"
              >
                {setor}
                {novasRequisicoes(setor) && (
                  <BellIcon className="position-absolute top-0 end-0 text-danger" />
                )}
              </button>
            ))}
          </div>

          {setorAtivo && (
            <div className="mt-4">
              <h2 className="h5 mb-3">Requisições de {setorAtivo}</h2>
              {requisicoesPorSetor(setorAtivo).length === 0 ? (
                <p className="text-muted">Nenhuma requisição neste setor.</p>
              ) : (
                <ul className="list-group">
                  {requisicoesPorSetor(setorAtivo).map((req) => (
                    <li key={req.id} className="list-group-item">
                      <p>
                        <strong>Nome:</strong> {req.nome}
                      </p>
                      <p>
                        <strong>DRT:</strong> {req.drt}
                      </p>
                      <p>
                        <strong>Plantão:</strong> {req.plantao}
                      </p>
                      <p>
                        <strong>Itens:</strong>{" "}
                        <pre className="bg-light p-2 rounded">{req.itens}</pre>
                      </p>
                      <p>
                        <strong>Data/Hora:</strong> {req.dataHora}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {pagina === "almoxarife" && (
        <div>
          <h2 className="h5 mb-4">Requisições Recebidas</h2>
          {setores.map((setor) => (
            <div key={setor} className="mb-5 pt-3 border-top">
              <h3 className="h6 mb-3 text-primary fw-bold">Setor: {setor}</h3>
              {requisicoesPorSetor(setor).length === 0 ? (
                <p className="text-muted">Nenhuma requisição neste setor.</p>
              ) : (
                <div className="overflow-auto" style={{ whiteSpace: "nowrap" }}>
                  {requisicoesPorSetor(setor).map((req) => (
                    <div
                      key={req.id}
                      className="card d-inline-block me-3 p-3"
                      style={{
                        minWidth: "300px",
                        maxWidth: "300px",
                        verticalAlign: "top",
                      }}
                    >
                      <p>
                        <strong>Nome:</strong> {req.nome}
                      </p>
                      <p>
                        <strong>DRT:</strong> {req.drt}
                      </p>
                      <p>
                        <strong>Plantão:</strong> {req.plantao}
                      </p>
                      <p>
                        <strong>Setor:</strong> {req.setor}
                      </p>
                      <p>
                        <strong>Itens:</strong>{" "}
                        <pre className="bg-light p-2 rounded">{req.itens}</pre>
                      </p>
                      <p>
                        <strong>Data/Hora:</strong> {req.dataHora}
                      </p>
                      <div className="d-flex gap-2 mt-2">
                        {!req.finalizado && (
                          <button
                            onClick={() => marcarFinalizado(req.id)}
                            className="btn btn-success btn-sm d-flex align-items-center"
                          >
                            <CheckIcon size={16} className="me-1" /> Finalizar
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmaExcluir(req.id)}
                          className="btn btn-danger btn-sm d-flex align-items-center"
                        >
                          <TrashIcon size={16} className="me-1" /> Deletar
                        </button>
                      </div>
                      {confirmaExcluir === req.id && (
                        <div className="alert alert-warning mt-3">
                          <p>Tem certeza que deseja excluir esta requisição?</p>
                          <div className="d-flex gap-2 mt-2">
                            <button
                              onClick={() => deletarRequisicao(req.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Sim, Excluir
                            </button>
                            <button
                              onClick={() => setConfirmaExcluir(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
