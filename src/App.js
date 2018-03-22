import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        tempos: {
            t_ultima_chegada:         {name: 'tempo desde a última chegada (minutos) ',         value: 0},
            t_chegada_relogio:        {name: 'Tempo de Chegada no Relógio',        value: 0},
            t_servico:                {name: 'Tempo de Serviço (minutos)',                value: 0},
            t_inicio_servico_relogio: {name: 'Tempo de ìnício do Serviço no Relógio', value: 0},
            t_cliente_fila:           {name: 'Tempo do Cliente na Fila (minutos)',           value: 0},
            t_final_servico_relogio:  {name: 'Tempo Final do Serviço no Relógio',  value: 0},
            t_cliente_no_sistema:     {name: 'Tempo do cliente no Sistema (minutos)',     value: 0},
            t_livre_operador:         {name: 'Tempo Livre do Operador (minutos)',         value: 0}
        }        
    };

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
                <table>
                    <thead>
                        <tr>
                            {th}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                teste
                            </td>
                            <td>
                                teste
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
