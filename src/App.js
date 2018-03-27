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
        html_table_tbody: [],
        t_m_espera_fila: 0,
        p_cliente_esperar_na_fila: 0,
        p_operador_livre: 0,
        t_m_servico: 0,
        t_m_despendido_do_sistema: 0
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

        let total_tempo_servico = 0;
        let total_tempo_cliente_na_fila = 0;
        let total_tempo_cliente_no_sistema = 0;
        let total_tempo_livre_operador = 0;

        while (true) {
            let sort_value_chegada = parseInt(this.state.tmp_alt_chegada[Math.floor(Math.random() * rdm_chegada)]);
            let sort_value_servico = parseInt(this.state.tmp_alt_servico[Math.floor(Math.random() * rdm_servico)]); 
            count_limit += sort_value_chegada;

            if (count_limit > parseInt(this.state.total_time)) {
                break;
            }

            total_tempo_servico += sort_value_servico;

            let tempoInicioServicoRelogio;
            let tempoClienteNaFila;
            let tempoLivreOperador;

            if (content_body_array.length >= 1) {
                tempoInicioServicoRelogio = 0;

                // tempoClienteNaFila
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

            total_tempo_cliente_na_fila += tempoClienteNaFila;
            total_tempo_cliente_no_sistema += (sort_value_servico + tempoClienteNaFila);
            total_tempo_livre_operador += tempoLivreOperador;



            // array com os valores de cada linha da tablea
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

        let tempos_change = this.state.tempos;


        tempos_change.t_servico.value =            total_tempo_servico;
        tempos_change.t_cliente_fila.value =       total_tempo_cliente_na_fila;
        tempos_change.t_cliente_no_sistema.value = total_tempo_cliente_no_sistema;
        tempos_change.t_livre_operador.value =     total_tempo_livre_operador;

        this.setState({
            tempos: tempos_change,
            html_table_tbody: content_body_array,
            t_m_espera_fila: (total_tempo_cliente_na_fila/count_line),
            p_cliente_esperar_na_fila: (total_tempo_cliente_na_fila/count_line),
            p_operador_livre: total_tempo_livre_operador/(content_body_array[content_body_array.length - 1].tempo_final_servico_relogio),
            t_m_servico: (total_tempo_cliente_na_fila/count_line),
            t_m_despendido_do_sistema: (total_tempo_cliente_no_sistema/count_line)
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


        let total_times = (
            <tr> 
                <td>
                    
                </td>
                <td>
                    
                </td>
                <td>
                    
                </td>
                <td>
                    <strong>{this.state.tempos.t_servico.value}</strong>
                </td>
                <td>
                   
                </td>
                <td>
                    <strong>{this.state.tempos.t_cliente_fila.value}</strong>
                </td>
                <td>
                    
                </td>
                <td>
                    <strong>{this.state.tempos.t_cliente_no_sistema.value}</strong>
                </td>
                <td>
                    <strong>{this.state.tempos.t_livre_operador.value}</strong>
                </td>
            </tr>
        );

        return (
            <div className="App container-fluid">
                <header className="App-header">
                    <h1 className="App-title">Simulação</h1>
                </header>

                <div className="row">
                    <div className="col">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Tempo desde a última chegada" name="lastStart" ref="lastStart" aria-label="Tempo desde a última chegada" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={ () => this.saveTimeHandler('chegada')} >Add</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Tempo de serviço" ref="service" name="service" aria-label="Tempo de serviço" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={ () => this.saveTimeHandler('servico') } >Add</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Tempo total da simulação" ref="total_time" name="total_time" aria-label="Tempo total da simulação" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={ () => this.saveTimeHandler('total_time') } >Add</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div class="input-group">
                            <textarea name="addedValues" ref="textAreaAddedValues" class="form-control" aria-label="With textarea"></textarea>
                        </div>
                    </div>
                    <div className="col">
                        <div class="input-group">
                            <textarea name="addedValues" ref="addedValuesService" class="form-control" aria-label="With textarea"></textarea>
                        </div>
                    </div>
                    <div className="col">
                        <div class="input-group">
                            <textarea name="addedValues" ref="addedValuesTotalTime" class="form-control" aria-label="With textarea"></textarea>
                        </div>
                    </div>
                </div>

                <div className="row button-simulate">
                    <div className="col">
                        <div class="input-group">   
                            <button onClick={this.constructTable} type="button" class="btn btn-dark btn-lg">Simular</button>
                        </div>
                    </div>
                </div>

                

                <table >
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            {th}
                        </tr>
                    </thead>
                    <tbody>
                        {tr}
                        {total_times}
                    </tbody>
                </table>

                <div>
                    <li>
                        Tempo Médio de Espera na Fila: {this.state.t_m_espera_fila}
                    </li>
                    <li>		
                        Probabilidade de um cliente esperar na fila: {this.state.p_cliente_esperar_na_fila}	
                    </li>
                    <li>		
                        Probabilidade do Operador Livre: {this.state.p_operador_livre}
                    </li>
                    <li>
                        Tempo Médio de Serviço: {this.state.t_m_servico}
                    </li>
                    <li>
                        Tempo Médio Despendido no Sistema: {this.state.t_m_despendido_do_sistema}
                    </li>
                </div>
            </div>
        );
    }
}

export default App;

