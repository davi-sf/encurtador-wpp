document.getElementById('inputArquivo').addEventListener('change', lerArquivo);
document.getElementById('buscaNome').addEventListener('input', filtrarContatos);

let contatos = []; 
function lerArquivo(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    const leitor = new FileReader();
    leitor.onload = function(eventoLeitor) {
        const dados = new Uint8Array(eventoLeitor.target.result);
        const planilha = XLSX.read(dados, { type: 'array' });
        //aqui pega uma aba especifica da planilha em caso de haver mais de uma
        const nomeAbaEspecifica = 'Geral'; 
        if (planilha.SheetNames.includes(nomeAbaEspecifica)) {
            const aba = planilha.Sheets[nomeAbaEspecifica];
            contatos = XLSX.utils.sheet_to_json(aba); 
            mostrarContatos(contatos); 
        } else {
            alert("Aba não encontrada.");
        }
    };

    leitor.onerror = function() {
        alert("Erro ao ler o arquivo.");
    };

    leitor.readAsArrayBuffer(arquivo);
}

function formatarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length === 11 ? numeros : telefone;
}

function mostrarContatos(contatos) {
    const tbody = document.getElementById('tabelaContatos').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    contatos.forEach(contato => {
        const nome = contato.firstname || "Nome não disponível";
        const segundoNome = contato.lastname || "sobrenome não disponível";
        const telefoneOriginal = contato.Telefone || "Telefone não disponível";

        const telefoneFormatado = formatarTelefone(telefoneOriginal);

        if (nome && telefoneFormatado) {
            const linha = tbody.insertRow();
            linha.insertCell(0).textContent = nome;
            linha.insertCell(1).textContent = segundoNome;
            linha.insertCell(2).textContent = telefoneOriginal;

            const botao = document.createElement('button');
            botao.textContent = 'Enviar Mensagem';
            botao.onclick = () => enviarMensagem(telefoneFormatado);
            linha.insertCell(3).appendChild(botao);
        }
    });
}

function filtrarContatos() {
    const busca = document.getElementById('buscaNome').value.toLowerCase();
    const contatosFiltrados = contatos.filter(contato => {
        const nome = contato.firstname || "";
        return nome.toLowerCase().includes(busca);
    });
    mostrarContatos(contatosFiltrados);
}

function enviarMensagem(telefone) {
    const telefoneNumeros = telefone.replace(/\D/g, '');
    const telefoneInternacional = `55${telefoneNumeros}`;

    const mensagem = document.getElementById('mensagem').value;
    if (mensagem) {
        const link = `https://wa.me/${telefoneInternacional}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, '_blank');
    } else {
        alert("Digite uma mensagem antes de enviar.");
    }
}
