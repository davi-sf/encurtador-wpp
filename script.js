document.getElementById('inputArquivo').addEventListener('change', lerArquivo);

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
        const aba = planilha.Sheets[planilha.SheetNames[0]];
        const contatos = XLSX.utils.sheet_to_json(aba);
       
        mostrarContatos(contatos);
    };

    leitor.onerror = function() {
        alert("Erro ao ler o arquivo.");
    };

    leitor.readAsArrayBuffer(arquivo);
}

function mostrarContatos(contatos) {
    const tbody = document.getElementById('tabelaContatos').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    contatos.forEach(contato => {
        const nome = contato.Name || "Nome não disponível";
        const telefone = contato.PhoneNumber || "Telefone não disponível";

        if (nome && telefone) {
            const linha = tbody.insertRow();
            linha.insertCell(0).textContent = nome;
            linha.insertCell(1).textContent = telefone;

            const botao = document.createElement('button');
            botao.textContent = 'Enviar Mensagem';
            botao.onclick = () => enviarMensagem(telefone);
            linha.insertCell(2).appendChild(botao);
        }
    });
}

function enviarMensagem(telefone) {
    const mensagem = document.getElementById('mensagem').value;
    if (mensagem) {
        const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, '_blank');
    } else {
        alert("Digite uma mensagem antes de enviar.");
    }
}
