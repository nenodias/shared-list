import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleCrypto from "simple-crypto-js"

import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const cripto = new SimpleCrypto('segredinho');

const INSERT = 'insert';
const SELECT = 'select';

class App extends Component {
    
  constructor() {
      super();
      let state = {
        items:{},
        index:0,
        edit:'',
        mode:INSERT
      };
      try{
        const { hash } = window.location;
        if(hash){
          state = cripto.decryptObject(hash.slice(1));
        }
      }catch(err){
        console.error(err);
      }
      this.state = state;
      this.add = this.add.bind(this);
      this.renderItens = this.renderItens.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.remove = this.remove.bind(this);
      this.edit = this.edit.bind(this);
      this.select = this.select.bind(this);
      this.updateState = this.updateState.bind(this);
  }

  updateState(newState){
    this.setState(newState);
    window.location.hash = cripto.encryptObject(newState);
  }
  
  add() {
    if(this.state.mode === INSERT){
      let index = this.state.index;
      let item = this.state.edit;
      if(item){
        const newItems = {...this.state.items};
        newItems[index] = {
          value: item,
          owner: '',
          selected: false,
        };
        index++;
        const newState = {items: newItems, edit:'', index};
        this.updateState(newState);
      }
    } else if(this.state.mode === SELECT){
      let owner = this.state.edit;
      if(owner){
        const newItems = {...this.state.items};
        Object.keys(newItems).forEach( i => {
          if(newItems[i].selected){
            delete newItems[i].selected;
            newItems[i].owner =owner;
          }
        });
        const newState = {items: newItems, edit:'', mode: INSERT};
        this.updateState(newState);
      }
    }
  }

  select(index: number){
    const newItems = {...this.state.items};    
    const newState = {items: newItems, mode: SELECT};
    newItems[index].selected = true;
    this.updateState(newState);
  }

  remove(index: number){
    const newItems = {...this.state.items};
    delete newItems[index];
    const newState = {items: newItems};
    this.updateState(newState);
  }

  edit(index: number){
    const newItems = {...this.state.items};    
    const newState = {items: newItems, edit: newItems[index].value};
    delete newItems[index];
    this.updateState(newState);
  }

  renderItens(){
    const itens = Object.keys(this.state.items).map(i => {
      return {id: i, item: this.state.items[i]};
    });
    return itens.map(({id , item}) => 
        <div className="p-grid" key={id}>
            <div className="p-col-1">
              <Checkbox onChange={e => this.select(id)} checked={item.selected} />
                &nbsp;{item.value} &nbsp; ~<b>{item.owner}</b>
              <Button className="item p-button-danger p-button-rounded" icon="pi pi-times" onClick={() => this.remove(id)} />
              <Button className="item p-button-warning p-button-rounded" icon="pi pi-pencil" onClick={() => this.edit(id)} />
            </div>
        </div>);
  }

  handleKeyPress(event){
    if (event.charCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      this.add();
    }
  }
  
  render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Shared List</h2>
          </div>
          <div className="App-intro">
            <InputText value={this.state.edit} onChange={(e) => this.setState({edit: e.target.value})} onKeyPress={this.handleKeyPress} />
            <Button label={this.state.mode === INSERT ? "Adicionar" : "Responsável"} icon="pi pi-plus" onClick={this.add} />
              {this.renderItens()}
          </div>
          <div className="App-footer">
          Icons made by <a href="https://www.flaticon.com/authors/prosymbols" title="Prosymbols">Prosymbols</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
          </div>
        </div>
      );
  }
}

export default App;
