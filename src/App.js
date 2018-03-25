import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './Table/Table';

class App extends Component {
    state = {
        tempos: {
            t_ultima_chegada:         {name: 'tempo desde a última chegada (minutos) ',         value: 0},
            t_chegada_relogio:        {name: 'Tempo de Chegada no Relógio',        value: 0},
            t_servico:                {name: 'Tempo de Serviço (minutos)',                value: 0},
            t_inicio_servico_relogio: {name: 'Tempo de início do Serviço no Relógio', value: 0},
            t_cliente_fila:           {name: 'Tempo do Cliente na Fila (minutos)',           value: 0},
            t_final_servico_relogio:  {name: 'Tempo Final do Serviço no Relógio',  value: 0},
            t_cliente_no_sistema:     {name: 'Tempo do cliente no Sistema (minutos)',     value: 0},
            t_livre_operador:         {name: 'Tempo Livre do Operador (minutos)',         value: 0}
        },
        tmp_alt_chegada: [],
        tmp_alt_servico: [],
        total_time: 0,
        html_table_tbody: ''
    };

    saveTimeHandler = (type) => {
        if (type === 'chegada') {
            let arr = this.state.tmp_alt_chegada;
            arr.push(this.refs.lastStart.value);
            this.refs.lastStart.value = "";

            this.setState({
                tmp_alt_chegada: arr
            });
            this.refs.textAreaAddedValues.value = arr;

        } else if (type === 'servico') {
            let arr = this.state.tmp_alt_servico;
            arr.push(this.refs.service.value);
            this.refs.service.value = "";

            this.setState({
                tmp_alt_servico: arr
            });
            this.refs.addedValuesService.value = arr;

        } else if (type === 'total_time') {
            let value = this.refs.total_time.value; 
            this.setState({
                total_time: value
            });

            this.refs.total_time.value = "";
            this.refs.addedValuesTotalTime.value = value;
        }
    }

    
    constructTable = () => {

        let htmlContent = (
            Object.keys(this.state.tempos).map((item, index) => (
                <th key={index}> {this.state.tempos[item].name} </th>
            ))
        );
    }



    render() {
        let th = null;
        th = (
            Object.keys(this.state.tempos).map((item, index) => (
                <th key={index}> {this.state.tempos[item].name} </th>
            ))
        )        

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Simulação</h1>
                </header>
                <div>
                    <div>
                        <label htmlFor="lastStart">Tempo desde a última chegada</label>
                        <input type="text" ref="lastStart" name="lastStart"/>
                        <button onClick={ () => this.saveTimeHandler('chegada')} >add</button>
                        <br/>
                        <br/>
                        <textarea name="addedValues" cols="20" rows="4" ref="textAreaAddedValues" ></textarea>
                    </div>
                    <div>
                        <label htmlFor="service">Tempo de serviço</label>
                        <input type="text" ref="service" name="service"/>
                        <button onClick={ () => this.saveTimeHandler('servico') } >add</button>
                        <br/>
                        <br/>
                        <textarea name="addedValues" cols="20" rows="4" ref="addedValuesService" ></textarea>
                    </div>
                    <div>
                        <label htmlFor="total_time">Tempo total da simulação</label>
                        <input type="text" ref="total_time" name="total_time"/>
                        <button onClick={ () => this.saveTimeHandler('total_time') } >add</button>
                        <br/>
                        <br/>
                        <textarea name="addedValues" cols="10" rows="1" ref="addedValuesTotalTime" ></textarea>
                    </div>
                </div>
                <button onClick={this.constructTable} >Simular</button>
                <table >
                    <thead>
                        <tr>
                            <th>Cliente</th>
                        </tr>
                        {th}
                    </thead>
                    <tbody>
                        <tr ref="line">
                            <Table tmp_alt={this.state.tmp_alt_chegada.length} />
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;

