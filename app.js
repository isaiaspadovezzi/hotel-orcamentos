// ==========================================
// GERADOR DE ORÇAMENTOS
// ==========================================


// ==========================================
// CONFIGURAÇÃO DOS QUARTOS
// ==========================================

const QUARTOS = {

    TWC: {
        nome: "Quarto com 02 camas de solteiro",
        foto: "img/quartos/solteiro.jpg",
        quantidadeQuartos: 1
    },

    TWB: {
        nome: "Quarto Superior com 02 camas de solteiro",
        foto: "img/quartos/solteiro.jpg",
        quantidadeQuartos: 1
    },

    DBC: {
        nome: "Quarto com 01 cama de casal",
        foto: "img/quartos/casal.jpg",
        quantidadeQuartos: 1
    },

    DBB: {
        nome: "Quarto Superior com 01 cama de casal",
        foto: "img/quartos/casal.jpg",
        quantidadeQuartos: 1
    },

    DSC: {
        nome: "Quarto com 01 cama de casal + 01 sofá-cama",
        foto: "img/quartos/sofa-cama.jpg",
        quantidadeQuartos: 1
    },

    S2C: {
        nome: "Apartamento Standard Conjugado — 02 quartos, 01 cama de casal + 02 camas de solteiro",
        foto: "img/quartos/conjugado.jpg",
        quantidadeQuartos: 2
    }

};


// ==========================================
// CONVERTER VALOR PARA NÚMERO
// ==========================================

function converterValor(valor) {

    if (!valor) {
        return 0;
    }

    valor = valor
        .toString()
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(valor) || 0;
}


// ==========================================
// FORMATAR VALOR EM REAIS
// ==========================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// FORMATAR DATA + DIA DA SEMANA
// ==========================================

function formatarDataCompleta(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    const dataObj = new Date(
        `${partes[0]}-${partes[1]}-${partes[2]}T12:00:00`
    );

    const diasSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ];

    const diaSemana = diasSemana[dataObj.getDay()];

    return `${formatarData(data)} — ${diaSemana}`;
}


// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparHTML(texto) {

    if (!texto) {
        return "";
    }

    return texto
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// OBTER DADOS DO QUARTO
// ==========================================

function obterDadosQuarto(tipoQuarto, descricaoOriginal) {

    const codigo = (tipoQuarto || "")
        .trim()
        .toUpperCase();

    if (QUARTOS[codigo]) {

        return {
            codigo: codigo,
            nome: QUARTOS[codigo].nome,
            foto: QUARTOS[codigo].foto,
            quantidadeQuartos: QUARTOS[codigo].quantidadeQuartos
        };

    }

    return {
        codigo: codigo,
        nome: descricaoOriginal || "Quarto",
        foto: "",
        quantidadeQuartos: 1
    };
}


// ==========================================
// GERAR TEXTO DOS HÓSPEDES
// ==========================================

function gerarTextoHospedes(adultos, criancas) {

    let texto = "";

    if (adultos > 0) {

        texto +=
            adultos +
            (adultos === 1 ? " adulto" : " adultos");
    }

    if (criancas > 0) {

        if (texto !== "") {
            texto += " + ";
        }

        texto +=
            criancas +
            (criancas === 1 ? " criança" : " crianças");
    }

    if (texto === "") {
        texto = "Não informado";
    }

    return texto;
}


// ==========================================
// GERAR ORÇAMENTO
// ==========================================

function gerarOrcamento() {

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const noites =
        parseInt(document.getElementById("noites").value) || 0;

    const adultos =
        parseInt(document.getElementById("adultos").value) || 0;

    const criancas =
        parseInt(document.getElementById("criancas").value) || 0;

    const tipoQuarto =
        document.getElementById("tipoQuarto").value
            .trim()
            .toUpperCase();

    const descricaoOriginal =
        document.getElementById("descricaoQuarto").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const promo =
        document.getElementById("promo").checked;

    const valorOriginal =
        converterValor(
            document.getElementById("valorOriginal").value
        );

    const valorTotal =
        converterValor(
            document.getElementById("valorTotal").value
        );

    const pagamento =
        document.getElementById("pagamento").value;


    // --------------------------------------
    // DADOS DO QUARTO
    // --------------------------------------

    const quarto =
        obterDadosQuarto(
            tipoQuarto,
            descricaoOriginal
        );


    // --------------------------------------
    // VALIDAÇÃO
    // --------------------------------------

    if (!checkin || !checkout) {

        alert(
            "Informe as datas de check-in e check-out."
        );

        return;
    }

    if (!quarto.nome) {

        alert(
            "Informe o tipo ou a descrição do quarto."
        );

        return;
    }

    if (valorTotal <= 0) {

        alert(
            "Informe o valor total da hospedagem."
        );

        return;
    }


    // --------------------------------------
    // HÓSPEDES
    // --------------------------------------

    const textoHospedes =
        gerarTextoHospedes(
            adultos,
            criancas
        );


    // --------------------------------------
    // CAFÉ DA MANHÃ
    // --------------------------------------

    let blocoCafe = "";

    if (cafe) {

        blocoCafe = `
            <div class="info">
                <span>☕</span>

                <div>
                    <small>CAFÉ DA MANHÃ</small>
                    <strong>Incluído</strong>
                </div>
            </div>
        `;

    } else {

        blocoCafe = `
            <div class="info info-cafe-nao-incluido">
                <span>☕</span>

                <div>
                    <small>CAFÉ DA MANHÃ</small>
                    <strong>Não incluído</strong>
                </div>
            </div>

            <div class="aviso-cafe">
                Café da manhã não incluso na tarifa.
                Disponível para contratação à parte por
                <strong>R$ 53,00 por pessoa, por dia.</strong>
            </div>
        `;
    }


    // --------------------------------------
    // PAGAMENTO
    // --------------------------------------

    let textoPagamento = "";

    if (pagamento === "hotel") {

        textoPagamento =
            "Pagamento no hotel";

    } else {

        textoPagamento =
            "Pagamento antecipado";
    }


    // --------------------------------------
    // VALOR PROMOCIONAL
    // --------------------------------------

    let blocoValor = "";

    if (
        promo &&
        valorOriginal > 0 &&
        valorOriginal > valorTotal
    ) {

        blocoValor = `
            <div class="valor-original">
                ${formatarMoeda(valorOriginal)}
            </div>

            <div class="valor-total">
                ${formatarMoeda(valorTotal)}
            </div>
        `;

    } else {

        blocoValor = `
            <div class="valor-total">
                ${formatarMoeda(valorTotal)}
            </div>
        `;
    }


    // --------------------------------------
    // QUANTIDADE DE QUARTOS
    // --------------------------------------

    let textoQuantidadeQuartos = "";

    if (quarto.quantidadeQuartos > 1) {

        textoQuantidadeQuartos = `
            <div class="quantidade-quartos">
                🛏️ ${quarto.quantidadeQuartos} quartos conjugados
            </div>
        `;

    } else {

        textoQuantidadeQuartos = `
            <div class="quantidade-quartos">
                🛏️ 1 quarto
            </div>
        `;
    }


    // --------------------------------------
    // FOTO DO QUARTO
    // --------------------------------------

    let blocoFoto = "";

    if (quarto.foto) {

        blocoFoto = `
            <div class="foto-quarto">
                <img
                    src="${quarto.foto}"
                    alt="${escaparHTML(quarto.nome)}"
                >
            </div>
        `;
    }


    // --------------------------------------
    // PREVIEW
    // --------------------------------------

    const preview =
        document.getElementById(
            "orcamentoPreview"
        );


    preview.innerHTML = `

        <div class="orcamento">

            <!-- CABEÇALHO -->

            <div class="orcamento-topo">

                <div class="logo-hotel">

                    <img
                        src="img/logo.png"
                        alt="ibis Styles"
                    >

                    <div class="hotel">
                        Curitiba Centro Cívico
                    </div>

                </div>

                <div class="titulo-arte">
                    ORÇAMENTO DE HOSPEDAGEM
                </div>

            </div>


            <!-- CORPO -->

            <div class="orcamento-corpo">


                <!-- ESTADIA -->

                <div class="bloco-estadia">

                    <div class="titulo-secao">
                        ESTADIA
                    </div>

                    <div class="datas">

                        <div class="data-box">

                            <span>CHECK-IN</span>

                            <strong>
                                ${formatarDataCompleta(checkin)}
                            </strong>

                        </div>


                        <div class="seta">
                            →
                        </div>


                        <div class="data-box">

                            <span>CHECK-OUT</span>

                            <strong>
                                ${formatarDataCompleta(checkout)}
                            </strong>

                        </div>

                    </div>


                    <div class="noites">

                        <span>ESTADIA</span>

                        <strong>
                            ${noites}
                            ${noites === 1 ? "NOITE" : "NOITES"}
                        </strong>

                    </div>

                </div>


                <!-- QUARTO + HÓSPEDES -->

                <div class="bloco-quarto">

                    ${blocoFoto}

                    <div class="dados-quarto">

                        <span class="rotulo">
                            ACOMODAÇÃO
                        </span>

                        <strong class="tipo">
                            ${escaparHTML(quarto.nome)}
                        </strong>

                        ${textoQuantidadeQuartos}

                        <div class="hospedes">

                            <span class="rotulo">
                                HÓSPEDES
                            </span>

                            <strong>
                                ${escaparHTML(textoHospedes)}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- CAFÉ -->

                <div class="informacoes">

                    ${blocoCafe}

                </div>


                <!-- VALOR -->

                <div class="valor-area">

                    <div>

                        <small>
                            TOTAL DA HOSPEDAGEM
                        </small>

                        ${blocoValor}

                    </div>


                    <div class="pagamento">

                        ${textoPagamento}

                    </div>

                </div>


            </div>


            <!-- RODAPÉ -->

            <div class="orcamento-rodape">

                <div>
                    ibis Styles Curitiba Centro Cívico
                </div>

                <div>
                    Orçamento sujeito à disponibilidade
                </div>

            </div>


        </div>

    `;


    // --------------------------------------
    // MOSTRAR PREVIEW
    // --------------------------------------

    document.getElementById(
        "previewArea"
    ).style.display = "block";


    // --------------------------------------
    // ROLAR ATÉ A PRÉVIA
    // --------------------------------------

    document.getElementById(
        "previewArea"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document.getElementById("checkin").value = "";

    document.getElementById("checkout").value = "";

    document.getElementById("noites").value = "1";

    document.getElementById("adultos").value = "1";

    document.getElementById("criancas").value = "0";

    document.getElementById("tipoQuarto").value = "";

    document.getElementById("descricaoQuarto").value = "";

    const tarifa =
        document.getElementById("tarifa");

    if (tarifa) {
        tarifa.value = "";
    }

    document.getElementById("cafe").checked = false;

    document.getElementById("promo").checked = false;

    document.getElementById("valorOriginal").value = "";

    document.getElementById("valorTotal").value = "";

    document.getElementById("pagamento").value = "hotel";


    document.getElementById(
        "previewArea"
    ).style.display = "none";


    document.getElementById(
        "orcamentoPreview"
    ).innerHTML = "";

}


// ==========================================
// LEITURA AUTOMÁTICA DO PRINT - OCR
// ==========================================

const arquivoOrcamento =
    document.getElementById("arquivoOrcamento");

const imagemSelecionada =
    document.getElementById("imagemSelecionada");

const btnLerOrcamento =
    document.getElementById("btnLerOrcamento");

const statusOcr =
    document.getElementById("statusOcr");


// ------------------------------------------
// QUANDO O USUÁRIO ESCOLHE O PRINT
// ------------------------------------------

arquivoOrcamento.addEventListener(
    "change",
    function () {

        const arquivo =
            this.files[0];

        if (!arquivo) {
            return;
        }

        const url =
            URL.createObjectURL(arquivo);

        imagemSelecionada.innerHTML = `
            <img
                src="${url}"
                alt="Print do orçamento"
            >
        `;

        imagemSelecionada.style.display =
            "block";

        btnLerOrcamento.disabled =
            false;

        statusOcr.innerHTML =
            "Print carregado. Clique em <strong>Ler orçamento automaticamente</strong>.";

        statusOcr.className =
            "status-ocr";

    }
);


// ==========================================
// CARREGAR TESSERACT
// ==========================================

function carregarTesseract() {

    return new Promise(
        (resolve, reject) => {

            if (window.Tesseract) {

                resolve();
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

            script.onload =
                resolve;

            script.onerror =
                reject;

            document.head.appendChild(
                script
            );

        }
    );
}


// ==========================================
// LER PRINT
// ==========================================

btnLerOrcamento.addEventListener(
    "click",
    async function () {

        const arquivo =
            arquivoOrcamento.files[0];

        if (!arquivo) {
            return;
        }

        btnLerOrcamento.disabled =
            true;

        statusOcr.className =
            "status-ocr";

        statusOcr.innerHTML =
            "🔍 Lendo o orçamento...";


        try {

            await carregarTesseract();


            const resultado =
                await Tesseract.recognize(
                    arquivo,
                    "por+eng",
                    {

                        logger:
                            function (info) {

                                if (
                                    info.status ===
                                    "recognizing text"
                                ) {

                                    const porcentagem =
                                        Math.round(
                                            info.progress *
                                            100
                                        );

                                    statusOcr.innerHTML =
                                        `🔍 Lendo orçamento... ${porcentagem}%`;

                                }

                            }

                    }
                );


            const texto =
                resultado.data.text;


            console.log(
                "TEXTO RECONHECIDO:"
            );

            console.log(texto);


            statusOcr.className =
                "status-ocr sucesso";

            statusOcr.innerHTML =
                "✅ Print lido. Agora vamos preencher os campos.";


            preencherCamposComOCR(
                texto
            );


        } catch (erro) {

            console.error(erro);

            statusOcr.className =
                "status-ocr erro";

            statusOcr.innerHTML =
                "❌ Não foi possível ler o print.";

        }


        btnLerOrcamento.disabled =
            false;

    }
);


// ==========================================
// INTERPRETAR TEXTO DO OCR
// ==========================================

function preencherCamposComOCR(texto) {

    console.log(
        "Iniciando interpretação do orçamento..."
    );


    // --------------------------------------
    // LIMPAR TEXTO
    // --------------------------------------

    const textoOriginal =
        texto;

    const linhas =
        texto
            .split("\n")
            .map(linha =>
                linha.trim()
            )
            .filter(linha =>
                linha.length > 0
            );


    // --------------------------------------
    // TIPO + DESCRIÇÃO DO QUARTO
    // --------------------------------------

    let tipoQuarto = "";

    let descricaoQuarto = "";


    for (
        let linha of linhas
    ) {

        const encontrado =
            linha.match(
                /^\s*\d+\s*-\s*([A-Z0-9]+)\s*-\s*(.+)$/i
            );


        if (encontrado) {

            tipoQuarto =
                encontrado[1]
                    .trim()
                    .toUpperCase();

            descricaoQuarto =
                encontrado[2]
                    .trim();

            break;
        }

    }


    // --------------------------------------
    // TARIFA
    // --------------------------------------

    let tarifa = "";


    if (tipoQuarto) {

        const indiceTipo =
            linhas.findIndex(
                linha =>
                    linha
                        .toUpperCase()
                        .includes(
                            tipoQuarto
                        )
            );


        if (
            indiceTipo >= 0
        ) {

            for (
                let i = indiceTipo + 1;
                i < Math.min(
                    linhas.length,
                    indiceTipo + 4
                );
                i++
            ) {

                const linha =
                    linhas[i];


                if (
                    !linha ||
                    /details per night/i.test(linha) ||
                    /price breakdown/i.test(linha) ||
                    /total/i.test(linha) ||
                    /brl/i.test(linha) ||
                    /\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/.test(linha)
                ) {

                    continue;
                }


                tarifa =
                    linha;

                break;
            }

        }

    }


    // --------------------------------------
    // DATAS
    // --------------------------------------

const meses = {

    jan: "01",
    janeiro: "01",

    fev: "02",
    feb: "02",
    fevereiro: "02",

    mar: "03",
    março: "03",
    marco: "03",

    abr: "04",
    apr: "04",
    abril: "04",

    mai: "05",
    may: "05",
    maio: "05",

    jun: "06",
    junho: "06",

    jul: "07",
    julho: "07",

    ago: "08",
    aug: "08",
    agosto: "08",

    set: "09",
    sep: "09",
    setembro: "09",

    out: "10",
    oct: "10",
    outubro: "10",

    nov: "11",
    novembro: "11",

    dez: "12",
    dec: "12",
    dezembro: "12"
};

    const regexData =
        /(\d{1,2})\s+([A-Za-zçÇãõÃÕ]+)\s+(\d{4})/gi;


    const datasEncontradas = [];


    let resultadoData;


    while (
        (
            resultadoData =
                regexData.exec(
                    textoOriginal
                )
        ) !== null
    ) {

        const dia =
            resultadoData[1]
                .padStart(
                    2,
                    "0"
                );


        const mesTexto =
            resultadoData[2]
                .toLowerCase();


        const ano =
            resultadoData[3];


        const mes =
            meses[mesTexto];


        if (mes) {

            datasEncontradas.push(
                `${ano}-${mes}-${dia}`
            );

        }

    }


    if (
        datasEncontradas.length >= 2
    ) {

        document.getElementById(
            "checkin"
        ).value =
            datasEncontradas[0];


        document.getElementById(
            "checkout"
        ).value =
            datasEncontradas[1];

    }


    // --------------------------------------
    // NÚMERO DE NOITES
    // --------------------------------------

    let noites = 0;


    const encontrouNoites =
        textoOriginal.match(
            /\((\d+)\s*(?:night|nights|noite|noites)/i
        );


    if (encontrouNoites) {

        noites =
            parseInt(
                encontrouNoites[1]
            );

    }


    if (noites > 0) {

        document.getElementById(
            "noites"
        ).value =
            noites;

    }


    // --------------------------------------
    // ADULTOS E CRIANÇAS
    // --------------------------------------

    let adultos = 0;

    let criancas = 0;


    const encontrouHospedes =
        textoOriginal.match(
            /(\d+)\s*Adults?\s*\/\s*(\d+)\s*Child(?:ren)?/i
        );


    if (encontrouHospedes) {

        adultos =
            parseInt(
                encontrouHospedes[1]
            );

        criancas =
            parseInt(
                encontrouHospedes[2]
            );

    }


    document.getElementById(
        "adultos"
    ).value =
        adultos;


    document.getElementById(
        "criancas"
    ).value =
        criancas;


    // --------------------------------------
    // CAFÉ DA MANHÃ
    // --------------------------------------

    const temCafe =
        /breakfast/i.test(
            textoOriginal
        ) &&
        /included/i.test(
            textoOriginal
        );


    document.getElementById(
        "cafe"
    ).checked =
        temCafe;


    // --------------------------------------
    // TARIFA PROMOCIONAL
    // --------------------------------------

    const temPromo =
        /promo/i.test(
            textoOriginal
        ) ||
        /m[eê]s do cliente/i.test(
            textoOriginal
        );


    document.getElementById(
        "promo"
    ).checked =
        temPromo;


    // --------------------------------------
    // VALORES EM BRL
    // --------------------------------------

    const valoresBRL = [];


    const regexBRL =
        /([\d.,]+)\s*BRL/gi;


    let resultadoValor;


    while (
        (
            resultadoValor =
                regexBRL.exec(
                    textoOriginal
                )
        ) !== null
    ) {

        let valorTexto =
            resultadoValor[1];


        if (
            valorTexto.includes(".") &&
            !valorTexto.includes(",")
        ) {

            valorTexto =
                valorTexto;

        } else {

            valorTexto =
                valorTexto
                    .replace(/\./g, "")
                    .replace(",", ".");

        }


        const valor =
            parseFloat(
                valorTexto
            );


        if (
            !isNaN(valor)
        ) {

            valoresBRL.push(
                valor
            );

        }

    }


    // --------------------------------------
    // VALOR TOTAL
    // --------------------------------------

    if (
        valoresBRL.length > 0
    ) {

        const valorTotal =
            valoresBRL[0];


        document.getElementById(
            "valorTotal"
        ).value =
            formatarMoeda(
                valorTotal
            );

    }


    // --------------------------------------
    // VALOR ORIGINAL
    // --------------------------------------

    if (
        valoresBRL.length > 1
    ) {

        const valorTotal =
            valoresBRL[0];


        const valoresMaiores =
            valoresBRL.filter(
                valor =>
                    valor > valorTotal
            );


        if (
            valoresMaiores.length > 0
        ) {

            const valorOriginal =
                Math.max(
                    ...valoresMaiores
                );


            document.getElementById(
                "valorOriginal"
            ).value =
                formatarMoeda(
                    valorOriginal
                );

        }

    }


    // --------------------------------------
    // PAGAMENTO
    // --------------------------------------

    if (
        /to be paid at the hotel/i.test(
            textoOriginal
        ) ||
        /paid at the hotel/i.test(
            textoOriginal
        )
    ) {

        document.getElementById(
            "pagamento"
        ).value =
            "hotel";

    }


    // --------------------------------------
    // PREENCHER CAMPOS
    // --------------------------------------

    document.getElementById(
        "tipoQuarto"
    ).value =
        tipoQuarto;


    document.getElementById(
        "descricaoQuarto"
    ).value =
        descricaoQuarto;


    const campoTarifa =
        document.getElementById(
            "tarifa"
        );

    if (campoTarifa) {

        campoTarifa.value =
            tarifa;

    }


    // --------------------------------------
    // MOSTRAR RESULTADO
    // --------------------------------------

    statusOcr.className =
        "status-ocr sucesso";


    statusOcr.innerHTML =
        "✅ Dados identificados! Confira os campos abaixo antes de gerar o orçamento.";


    // --------------------------------------
    // DESTACAR CAMPOS
    // --------------------------------------

    const campos =
        document.querySelectorAll(
            "#checkin, #checkout, #noites, #adultos, #criancas, #tipoQuarto, #descricaoQuarto, #valorTotal"
        );


    campos.forEach(
        campo => {

            campo.style.borderColor =
                "var(--verde)";

            campo.style.boxShadow =
                "0 0 0 3px rgba(99, 193, 50, 0.12)";

        }
    );


    console.log(
        "Tipo:",
        tipoQuarto
    );

    console.log(
        "Descrição:",
        descricaoQuarto
    );

    console.log(
        "Tarifa:",
        tarifa
    );

    console.log(
        "Datas:",
        datasEncontradas
    );

    console.log(
        "Noites:",
        noites
    );

    console.log(
        "Adultos:",
        adultos
    );

    console.log(
        "Crianças:",
        criancas
    );

    console.log(
        "Valores:",
        valoresBRL
    );

}


// ==========================================
// COPIAR ORÇAMENTO
// ==========================================

function copiarOrcamento() {

    const checkin =
        document.getElementById(
            "checkin"
        ).value;

    const checkout =
        document.getElementById(
            "checkout"
        ).value;

    const noites =
        document.getElementById(
            "noites"
        ).value;

    const adultos =
        document.getElementById(
            "adultos"
        ).value;

    const criancas =
        document.getElementById(
            "criancas"
        ).value;

    const tipoQuarto =
        document.getElementById(
            "tipoQuarto"
        ).value
            .trim()
            .toUpperCase();

    const descricaoOriginal =
        document.getElementById(
            "descricaoQuarto"
        ).value;

    const cafe =
        document.getElementById(
            "cafe"
        ).checked;

    const valorTotal =
        document.getElementById(
            "valorTotal"
        ).value;

    const pagamento =
        document.getElementById(
            "pagamento"
        ).value;


    const quarto =
        obterDadosQuarto(
            tipoQuarto,
            descricaoOriginal
        );


    let hospedes =
        `${adultos} ${adultos == 1 ? "adulto" : "adultos"}`;


    if (criancas > 0) {

        hospedes +=
            ` + ${criancas} ${criancas == 1 ? "criança" : "crianças"}`;

    }


    let texto =
        `IBIS STYLES CURITIBA CENTRO CÍVICO

ORÇAMENTO DE HOSPEDAGEM

📅 Check-in: ${formatarDataCompleta(checkin)}
📅 Check-out: ${formatarDataCompleta(checkout)}
🌙 Estadia: ${noites} ${noites == 1 ? "noite" : "noites"}

🏨 ${quarto.nome}

🛏️ ${quarto.quantidadeQuartos} ${quarto.quantidadeQuartos == 1 ? "quarto" : "quartos"}

👥 Hóspedes: ${hospedes}

☕ Café da manhã: ${cafe ? "Incluído" : "Não incluído — disponível à parte por R$ 53,00 por pessoa, por dia."}

💰 Valor total: ${valorTotal}

${pagamento === "hotel"
    ? "💳 Pagamento no hotel"
    : "💳 Pagamento antecipado"}`;


    texto =
        texto.trim();


    navigator.clipboard.writeText(
        texto
    )
        .then(() => {

            alert(
                "✅ Orçamento copiado! Agora é só colar no WhatsApp."
            );

        })
        .catch(() => {

            alert(
                "Não foi possível copiar automaticamente."
            );

        });

}


// ==========================================
// COMPARTILHAR ORÇAMENTO
// ==========================================

async function compartilharOrcamento() {

    const checkin =
        document.getElementById(
            "checkin"
        ).value;

    const checkout =
        document.getElementById(
            "checkout"
        ).value;

    const noites =
        document.getElementById(
            "noites"
        ).value;

    const adultos =
        document.getElementById(
            "adultos"
        ).value;

    const criancas =
        document.getElementById(
            "criancas"
        ).value;

    const tipoQuarto =
        document.getElementById(
            "tipoQuarto"
        ).value
            .trim()
            .toUpperCase();

    const descricaoOriginal =
        document.getElementById(
            "descricaoQuarto"
        ).value;

    const cafe =
        document.getElementById(
            "cafe"
        ).checked;

    const valorTotal =
        document.getElementById(
            "valorTotal"
        ).value;


    const pagamento =
        document.getElementById(
            "pagamento"
        ).value;


    const quarto =
        obterDadosQuarto(
            tipoQuarto,
            descricaoOriginal
        );


    let hospedes =
        `${adultos} ${adultos == 1 ? "adulto" : "adultos"}`;


    if (criancas > 0) {

        hospedes +=
            ` + ${criancas} ${criancas == 1 ? "criança" : "crianças"}`;

    }


    const texto =
        `IBIS STYLES CURITIBA CENTRO CÍVICO

ORÇAMENTO DE HOSPEDAGEM

📅 ${formatarDataCompleta(checkin)} → ${formatarDataCompleta(checkout)}
🌙 ${noites} ${noites == 1 ? "noite" : "noites"}

🏨 ${quarto.nome}

🛏️ ${quarto.quantidadeQuartos} ${quarto.quantidadeQuartos == 1 ? "quarto" : "quartos"}

👥 ${hospedes}

☕ Café da manhã: ${
        cafe
            ? "Incluído"
            : "Não incluído — disponível à parte por R$ 53,00 por pessoa, por dia."
    }

💰 TOTAL: ${valorTotal}

${
    pagamento === "hotel"
        ? "💳 Pagamento no hotel."
        : "💳 Pagamento antecipado."
}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Orçamento de hospedagem",

                text:
                    texto

            });

        } catch (erro) {

            console.log(
                "Compartilhamento cancelado."
            );

        }

    } else {

        await navigator.clipboard.writeText(
            texto
        );

        alert(
            "Seu navegador não possui compartilhamento direto. O orçamento foi copiado para a área de transferência."
        );

    }

}


// ==========================================
// COPIAR IMAGEM DO ORÇAMENTO
// ==========================================

async function copiarImagemOrcamento() {

    const elemento =
        document.querySelector(
            "#orcamentoPreview .orcamento"
        );


    if (!elemento) {

        alert(
            "Primeiro gere o orçamento."
        );

        return;
    }


    const botao =
        document.querySelector(
            '.acoes-compartilhar button[onclick="copiarImagemOrcamento()"]'
        );


    const textoOriginal =
        botao
            ? botao.innerHTML
            : "";


    if (botao) {

        botao.disabled =
            true;

        botao.innerHTML =
            "⏳ Preparando imagem...";

    }


    try {

        // --------------------------------------
        // CARREGAR HTML2CANVAS
        // --------------------------------------

        await carregarHtml2Canvas();


        // --------------------------------------
        // TRANSFORMAR A ARTE EM IMAGEM
        // --------------------------------------

        const canvas =
            await html2canvas(
                elemento,
                {

                    scale: 2,

                    backgroundColor:
                        "#ffffff",

                    useCORS:
                        true,

                    logging:
                        false

                }
            );


        // --------------------------------------
        // TRANSFORMAR CANVAS EM PNG
        // --------------------------------------

        const blob =
            await new Promise(
                resolve => {

                    canvas.toBlob(
                        resolve,
                        "image/png"
                    );

                }
            );


        if (!blob) {

            throw new Error(
                "Não foi possível criar a imagem."
            );

        }


        // --------------------------------------
        // COPIAR IMAGEM
        // --------------------------------------

        if (
            navigator.clipboard &&
            window.ClipboardItem
        ) {

            const item =
                new ClipboardItem({
                    "image/png":
                        blob
                });


            await navigator.clipboard.write([
                item
            ]);


            if (botao) {

                botao.innerHTML =
                    "✅ Imagem copiada!";

            }


            setTimeout(
                () => {

                    if (botao) {

                        botao.innerHTML =
                            textoOriginal;

                    }

                },
                2500
            );


        } else {

            // ----------------------------------
            // NAVEGADOR SEM SUPORTE
            // ----------------------------------

            baixarImagemOrcamento(
                blob
            );


            alert(
                "Seu navegador não permite copiar imagens diretamente. A imagem foi salva no computador."
            );


            if (botao) {

                botao.innerHTML =
                    textoOriginal;

            }

        }


    } catch (erro) {

        console.error(
            "Erro ao copiar imagem:",
            erro
        );


        alert(
            "Não foi possível copiar a imagem do orçamento."
        );


        if (botao) {

            botao.innerHTML =
                textoOriginal;

        }

    }


    if (botao) {

        botao.disabled =
            false;

    }

}


// ==========================================
// CARREGAR HTML2CANVAS
// ==========================================

function carregarHtml2Canvas() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.html2canvas
            ) {

                resolve();

                return;
            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";


            script.onload =
                resolve;

            script.onerror =
                reject;


            document.head.appendChild(
                script
            );

        }
    );

}


// ==========================================
// SALVAR IMAGEM COMO ALTERNATIVA
// ==========================================

function baixarImagemOrcamento(blob) {

    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "orcamento-ibis-styles.png";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}
