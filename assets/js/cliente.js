// Função para verificar login
function verificarLogin(email, senha) {
    const data = JSON.parse(localStorage.getItem('psicanalise_data'));
    const cliente = data.clientes.find(c => c.email === email);
    
    // Senha fixa para demonstração
    const senhaCorreta = '123456';
    
    if (cliente && senha === senhaCorreta) {
        // Salvar token de sessão
        localStorage.setItem('cliente_token', email);
        
        // Redirecionar para o dashboard
        window.location.href = 'cliente/dashboard.html';
    } else {
        mostrarErro('E-mail ou senha inválidos');
    }
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    document.body.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();
}

// Função para mostrar sucesso
function mostrarSucesso(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    document.body.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();
}

// Event listener para o formulário de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;

    // Se lembrar de mim estiver marcado, salvar no localStorage
    if (lembrar) {
        localStorage.setItem('cliente_email', email);
    }

    verificarLogin(email, senha);
});

// Preencher email salvo se existir
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está na página de login
    if (document.getElementById('loginForm')) {
        const emailSalvo = localStorage.getItem('cliente_email');
        if (emailSalvo) {
            document.getElementById('email').value = emailSalvo;
            document.getElementById('lembrar').checked = true;
        }
    }

    // Verificar se está na página do dashboard
    if (document.getElementById('calendario')) {
        inicializarDashboard();
    }
});

// Função para inicializar o dashboard
function inicializarDashboard() {
    // Verificar autenticação
    const token = localStorage.getItem('cliente_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados do cliente
    const data = JSON.parse(localStorage.getItem('psicanalise_data'));
    const cliente = data.clientes.find(c => c.email === token);
    const agendamentos = data.agendamentos.filter(a => a.clienteId === cliente.id);

    // Carregar calendário
    carregarCalendario(agendamentos);
    
    // Carregar histórico
    carregarHistorico(agendamentos);

    // Event listener para agendamento
    document.getElementById('agendamentoForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        agendarConsulta(cliente.id);
    });
}

// Função para carregar calendário
function carregarCalendario(agendamentos) {
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '<h6>Em breve: calendário interativo</h6>';
}

// Função para carregar histórico
function carregarHistorico(agendamentos) {
    const tbody = document.getElementById('historicoConsultas');
    tbody.innerHTML = '';

    agendamentos.forEach(consulta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(consulta.data).toLocaleDateString('pt-BR')}</td>
            <td>${consulta.horario}</td>
            <td><span class="badge bg-${getStatusColor(consulta.status)}">${consulta.status}</span></td>
            <td>
                ${consulta.status === 'pendente' ? `
                    <button class="btn btn-sm btn-danger" onclick="cancelarConsulta(${consulta.id})">
                        Cancelar
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para agendar consulta
function agendarConsulta(clienteId) {
    const data = JSON.parse(localStorage.getItem('psicanalise_data'));
    const novaConsulta = {
        id: data.agendamentos.length + 1,
        clienteId: clienteId,
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value,
        status: 'pendente'
    };

    data.agendamentos.push(novaConsulta);
    localStorage.setItem('psicanalise_data', JSON.stringify(data));

    mostrarSucesso('Consulta agendada com sucesso!');
    carregarHistorico(data.agendamentos.filter(a => a.clienteId === clienteId));
}

// Função para cancelar consulta
function cancelarConsulta(id) {
    const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modal.show();

    document.getElementById('confirmarCancelamento').onclick = function() {
        const data = JSON.parse(localStorage.getItem('psicanalise_data'));
        const index = data.agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
            data.agendamentos.splice(index, 1);
            localStorage.setItem('psicanalise_data', JSON.stringify(data));
            
            mostrarSucesso('Consulta cancelada com sucesso!');
            carregarHistorico(data.agendamentos.filter(a => a.clienteId === clienteId));
        }
        modal.hide();
    };
}

// Função para obter cor do status
function getStatusColor(status) {
    const cores = {
        'pendente': 'warning',
        'confirmado': 'success',
        'cancelado': 'danger',
        'realizado': 'info'
    };
    return cores[status] || 'secondary';
}
