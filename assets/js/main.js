// Inicialização dos dados
if (!localStorage.getItem('psicanalise_data')) {
    const dadosIniciais = {
        clientes: [
            {id: 1, nome: "Cliente Exemplo", email: "cliente@exemplo.com"}
        ],
        agendamentos: [
            {id: 1, clienteId: 1, data: "2023-11-20", horario: "14:00", status: "confirmado"}
        ],
        mensagens: []
    };
    localStorage.setItem('psicanalise_data', JSON.stringify(dadosIniciais));
}

// Função para obter dados do localStorage
function getData() {
    return JSON.parse(localStorage.getItem('psicanalise_data'));
}

// Função para salvar dados no localStorage
function saveData(data) {
    localStorage.setItem('psicanalise_data', JSON.stringify(data));
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${tipo} border-0`;
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

// Validação do formulário de agendamento
document.getElementById('agendamentoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value
    };

    // Validações básicas
    if (!formData.nome || !formData.email || !formData.telefone || !formData.data || !formData.horario) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'danger');
        return;
    }

    if (!validarEmail(formData.email)) {
        mostrarNotificacao('Por favor, insira um email válido.', 'danger');
        return;
    }

    // Verifica se o email já existe
    const data = getData();
    const clienteExistente = data.clientes.find(c => c.email === formData.email);
    
    let clienteId;
    if (!clienteExistente) {
        clienteId = data.clientes.length + 1;
        data.clientes.push({
            id: clienteId,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone
        });
    } else {
        clienteId = clienteExistente.id;
    }

    // Adiciona o agendamento
    const agendamentoId = data.agendamentos.length + 1;
    data.agendamentos.push({
        id: agendamentoId,
        clienteId: clienteId,
        data: formData.data,
        horario: formData.horario,
        status: "pendente"
    });

    saveData(data);
    mostrarNotificacao('Agendamento realizado com sucesso!');

    // Limpa o formulário e fecha o modal
    e.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('agendamentoModal'));
    modal.hide();
});

// Validação do formulário de contato
document.getElementById('contatoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nomeContato').value,
        email: document.getElementById('emailContato').value,
        mensagem: document.getElementById('mensagem').value
    };

    if (!formData.nome || !formData.email || !formData.mensagem) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'danger');
        return;
    }

    if (!validarEmail(formData.email)) {
        mostrarNotificacao('Por favor, insira um email válido.', 'danger');
        return;
    }

    const data = getData();
    const mensagemId = data.mensagens.length + 1;
    data.mensagens.push({
        id: mensagemId,
        nome: formData.nome,
        email: formData.email,
        mensagem: formData.mensagem,
        data: new Date().toISOString()
    });

    saveData(data);
    mostrarNotificacao('Mensagem enviada com sucesso!');
    e.target.reset();
});

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Dark Mode Toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.className = 'btn btn-outline-light me-3';
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.querySelector('.navbar')?.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', function() {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
});

// Verifica se o usuário já estava em modo escuro
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
}
