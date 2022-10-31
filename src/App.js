import "./App.css";
import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";



function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load todos on page load

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTodos(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // metodo de evento que para envia de formulario e deixa no fluxo da spa

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    // Envio para api
    await fetch(API + "/todos", {
      method: "POST", //metodo de envio
      body: JSON.stringify(todo), //vai transformar o objeto todo em string
      headers: {
        "Content-type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);


    setTitle("");
    setTime("");
  };

    const handleDelete = async (id) => {

      let mensagem;
      let retorno = window.confirm("Tem certeza que quer excluir essa tarefa?");
      if (retorno == true)
      {
        mensagem = await fetch(API + "/todos/" + id, {
          method: "DELETE", //metodo de delete
        });
  
        setTodos((prevState) => prevState.filter((todo) => todo.id !== id));

      }
      else
      {
        alert("Você cancelou a operação")
      }
      
    };
    const handleEdit = async (todo) => {
      todo.done = !todo.done;

      const data = await fetch(API + "/todos/" + todo.id, {
        method: "PUT", //metodo altera
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json",
        },
      });

      setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
      );
    };

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1> TO DO LIST</h1>
      </div>
      <div className="form-todo">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Terminar a tarefa da semana passada"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Quer terminar até?</label>
            
            <input
              type="date"
              name="time"
              placeholder=""
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => ( 
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Terminar até: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={() => (handleDelete(todo.id))}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;
