// Credenciais do admin
const ADMIN_CREDENTIALS = {
    email: 'admin@psicanalise.com',
    senha: 'admin123'
};

// Função para verificar login do admin
function verificarLoginAdmin(email, senha) {
    if (email === ADMIN_CREDENTIALS.email && senha === ADMIN_CREDENTIALS.senha) {
        // Salvar token de sessão
        localStorage.setItem('admin_token', 'true');
        
        // Redirecionar para o dashboard
        window.location.href = 'admin/dashboard.html';
    } else {
        mostrarErro('Credenciais inválidas');
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

    verificarLoginAdmin(email, senha);
});

// Função para inicializar o dashboard do admin
function inicializarDashboardAdmin() {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados
    const data = JSON.parse(localStorage.getItem('psicanalise_data'));
    
    // Atualizar estatísticas
    atualizarEstatisticas(data);
    
    // Carregar tabela de agendamentos
    carregarAgendamentos(data.agendamentos);
    
    // Carregar lista de clientes
    carregarClientes(data.clientes);
    
    // Carregar editor de conteúdo
    inicializarEditorConteudo();
    
    // Carregar botão de exportar dados
    inicializarExportacao();
}

// Função para atualizar estatísticas
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('dashboardAdmin')) {
        inicializarDashboardAdmin();
    }
});

// Função para atualizar estatísticas
function atualizarEstatisticas(data) {
    const estatisticas = {
        totalClientes: data.clientes.length,
        totalConsultas: data.agendamentos.length,
        consultasHoje: data.agendamentos.filter(a => new Date(a.data).toDateString() === new Date().toDateString()).length,
        consultasPendentes: data.agendamentos.filter(a => a.status === 'pendente').length
    };

    document.getElementById('totalClientes')?.textContent = estatisticas.totalClientes;
    document.getElementById('totalConsultas')?.textContent = estatisticas.totalConsultas;
    document.getElementById('consultasHoje')?.textContent = estatisticas.consultasHoje;
    document.getElementById('consultasPendentes')?.textContent = estatisticas.consultasPendentes;
}

// Função para carregar tabela de agendamentos
function carregarAgendamentos(agendamentos) {
    const tbody = document.getElementById('tabelaAgendamentos');
    if (!tbody) return;

    tbody.innerHTML = '';
    agendamentos.forEach(consulta => {
        const cliente = data.clientes.find(c => c.id === consulta.clienteId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente?.nome}</td>
            <td>${new Date(consulta.data).toLocaleDateString('pt-BR')}</td>
            <td>${consulta.horario}</td>
            <td><span class="badge bg-${getStatusColor(consulta.status)}">${consulta.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarConsulta(${consulta.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirConsulta(${consulta.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para carregar lista de clientes
function carregarClientes(clientes) {
    const tbody = document.getElementById('tabelaClientes');
    if (!tbody) return;

    tbody.innerHTML = '';
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarCliente(${cliente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para inicializar editor de conteúdo
function inicializarEditorConteudo() {
    const editor = document.getElementById('editorConteudo');
    if (!editor) return;

    // Carregar conteúdo atual
    const data = JSON.parse(localStorage.getItem('psicanalise_data'));
    const conteudo = data.conteudo || {
        sobre: '',
        servicos: '',
        beneficios: '',
        fluxo: ''
    };

    // Preencher campos do editor
    document.getElementById('sobre').value = conteudo.sobre;
    document.getElementById('servicos').value = conteudo.servicos;
    document.getElementById('beneficios').value = conteudo.beneficios;
    document.getElementById('fluxo').value = conteudo.fluxo;

    // Salvar conteúdo
    document.getElementById('salvarConteudo')?.addEventListener('click', function() {
        data.conteudo = {
            sobre: document.getElementById('sobre').value,
            servicos: document.getElementById('servicos').value,
            beneficios: document.getElementById('beneficios').value,
            fluxo: document.getElementById('fluxo').value
        };
        localStorage.setItem('psicanalise_data', JSON.stringify(data));
        mostrarSucesso('Conteúdo atualizado com sucesso!');
    });
}

// Função para inicializar exportação
function inicializarExportacao() {
    document.getElementById('exportarDados')?.addEventListener('click', function() {
        const data = JSON.parse(localStorage.getItem('psicanalise_data'));
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados_psicanalise.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Funções auxiliares
function getStatusColor(status) {
    const cores = {
        'pendente': 'warning',
        'confirmado': 'success',
        'cancelado': 'danger',
        'realizado': 'info'
    };
    return cores[status] || 'secondary';
}

function mostrarModal(id) {
    const modal = new bootstrap.Modal(document.getElementById(id));
    modal.show();
}
