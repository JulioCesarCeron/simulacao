import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        total_time: '',
        html_table_tbody: []
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

        let rdm_chegada = this.state.tmp_alt_chegada.length;
        let rdm_servico = this.state.tmp_alt_servico.length;
        let count_limit = 0;
        let count_line = 1
        let content_body_array = [];
        while (count_limit <= parseInt(this.state.total_time)) {
            let sort_value_chegada = parseInt(this.state.tmp_alt_chegada[Math.floor(Math.random() * rdm_chegada)]);
            let sort_value_servico = parseInt(this.state.tmp_alt_servico[Math.floor(Math.random() * rdm_servico)]); 
            count_limit += sort_value_chegada;

            let tempoInicioServicoRelogio;
            let tempoClienteNaFila;
            let tempoLivreOperador;
            if (content_body_array.length >= 1) {
                tempoInicioServicoRelogio = 0;


                let last_tempo_final_servico_relogio = content_body_array[content_body_array.length - 1].tempo_final_servico_relogio;
                if (last_tempo_final_servico_relogio >= count_limit) {
                    tempoClienteNaFila = last_tempo_final_servico_relogio - count_limit;
                } else {
                    tempoClienteNaFila = 0
                }

                tempoInicioServicoRelogio = count_limit + tempoClienteNaFila;

                // tempoLivreOperador
                if(count_limit < last_tempo_final_servico_relogio) {
                    tempoLivreOperador = last_tempo_final_servico_relogio - count_limit;
                } else {
                    tempoLivreOperador = 0;
                }
            } else {
                tempoInicioServicoRelogio = sort_value_chegada;
                tempoClienteNaFila = 0;
                tempoLivreOperador = sort_value_chegada;
            }

            content_body_array.push({
                line: count_line++,
                tempo_ultima_chegada: sort_value_chegada,
                tempo_de_chegada_no_relogio: count_limit,
                tempo_de_servico: sort_value_servico,
                tempo_inicio_servico_relogio: tempoInicioServicoRelogio,
                tempo_cliente_na_fila: tempoClienteNaFila,
                tempo_final_servico_relogio: (sort_value_servico + tempoInicioServicoRelogio),
                tempo_cliente_no_sistema: (sort_value_servico + tempoClienteNaFila),
                tempo_livre_operador: tempoLivreOperador

            });
        }

        this.setState({
            html_table_tbody: content_body_array
        });

    }



    render() {
        let th = null;
        th = (
            Object.keys(this.state.tempos).map((item, index) => (
                <th key={index}> {this.state.tempos[item].name} </th>
            ))
        )        

        let tr = (
            this.state.html_table_tbody.map((item, index) => (
                <tr key={index}> 
                    <td>
                        {item.line}
                    </td>
                    <td>
                        {item.tempo_ultima_chegada}
                    </td>
                    <td>
                        {item.tempo_de_chegada_no_relogio}
                    </td>
                    <td>
                        {item.tempo_de_servico}
                    </td>
                    <td>
                        {item.tempo_inicio_servico_relogio}
                    </td>
                    <td>
                        {item.tempo_cliente_na_fila}
                    </td>
                    <td>
                        {item.tempo_final_servico_relogio}
                    </td>
                    <td>
                        {item.tempo_cliente_no_sistema}
                    </td>
                    <td>
                        {item.tempo_livre_operador}
                    </td>
                </tr>
            ))
        );

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
                            {th}
                        </tr>
                    </thead>
                    <tbody>
                        {tr}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;

