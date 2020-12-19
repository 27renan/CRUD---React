import axios from 'axios'
import React, {Component} from 'react'
import Main from '../templates/Main'

const headerProps = {
      icon: "users",
      title: "Usuarios",
      subtitle: 'Cadastro de usuarios: Incluir, Listar, Alterar e Excluir!'
}

// URL do backend, para aplicação poder se comunicar com o backend
const baseUrl = 'http://localhost:3001/users'

/* Estado Inicial para quando o usuario clicar em cancela
poder voltar ao estado inicial*/
const initialState = {
  user: {name: '', email:''},
  list: []
}

export default class UserCrud extends Component {

  state ={...initialState}

  /*
    Nessa função eu fação uma consulta para renderizar os usuarios.
   */
  componentWillMount(){
    axios(baseUrl).then(resp => { // faço uma requisição get
      this.setState({ list: resp.data })
    })
  }

  // Função para limpar o formulario
  clear(){
    this.setState({user: initialState.user})
  }

  save(){
     const user = this.state.user // estou pegando a referencia de um objeto.
     const method = user.id ? 'put' : 'post' // put para update e post para add.
     /*
      Se o id existir é uma opração de put e a url é baseUrl/user.id
      caso contrario é um opraçao de add e a url é baseUrl.
     */
      const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
      /*
        Como o axios é um API baseada em promisse, eu preciso chamar
        o then. resp.data é o usuario obtido atraves o webservice (o
          usuario obito no backend).
      */
      axios[method](url, user).then(resp => {
        const list = this.getUpdatedList(resp.data)
        /*
          Alterando o estado com o setState, e atualizando o list
          com a resp.data
        */
        this.setState({user: initialState.user, list})
    })
  }

  getUpdatedList(user, add = true){
    /*
      Verifico se existe algum id repetido, caso contrario
      eu coloco o usuario na primeiro posição e retorno a lista.
     */
    const list = this.state.list.filter(u => u.id !== user.id)
    if (add) list.unshift(user)
    return list
  }

  updatedField(event){ // aqui estou realmente atualizando os campos
    /**
     Estou clonando um objeto para altera-lo e somente depois atualizar
     o state.
     */
    const user = {...this.state.user}
    /* Como estou usando string por isso a notação de [ ],
    caso fosse um objeto seria user.name

    Faço a atualização através do name do meu input, é o name do
    input que vai me dizer qual input atualizar (nome ou email)
    */
    user[event.target.name] = event.target.value
    this.setState({user})
  }

  renderForm(){
    return (
      <div className="form">
        <div className="rows">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" className="form-control"
                  name="name"
                  value = {this.state.user.name}
                  onChange={e => this.updatedField(e)}
                  placeholder="Digite o nome ..." />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-control"
                name="email"
                value={this.state.user.email}
                onChange={e => this.updatedField(e)}
                placeholder="Digite o seu email ..." />
            </div>
          </div>
        </div>

      <hr/>
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={e => this.save(e)}>
              Salvar
            </button>
            <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  load(user){
    this.setState({ user })
  }

  remove(user){
    axios.delete(`${baseUrl}/${user.id}`).then(resp => {
      const list = this.getUpdatedList(user, false)
      this.setState ({list})
    })
  }

  renderTable(){
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows(){
    return this.state.list.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <button className="btn btn-warning" onClick={e => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button className="btn btn-danger ml-2" onClick={e => this.remove(user)}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  render(){
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    )
  }
}