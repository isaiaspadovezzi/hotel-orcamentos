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
// FUNÇÕES GERAIS
// ==========================================

function converterValor(valor) {

    if (!valor) {
        return 0;
    }

    let texto = valor
        .toString()
        .replace(/R\$/gi, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(texto) || 0;
}


function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


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


function calcularNoites(checkin, checkout) {

    if (!checkin || !checkout) {
        return 0;
    }

    const entrada = new Date(`${checkin}T12:00:00`);
    const saida = new Date(`${checkout}T12:00:00`);

    const diferenca = saida.getTime() - entrada.getTime();

    const noites = Math.round(
        diferenca / (1000 * 60 * 60 * 24)
    );

    return noites > 0 ? noites : 0;

}


function limparValorOCR(valor) {

    if (!valor) {
        return "";
    }

    let texto = valor
        .toString()
        .replace(/R\$/gi, "")
        .replace(/\s/g, "");

    if (texto.includes(",")) {
        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");
    }

    const numero = parseFloat(texto);

    if (isNaN(numero)) {
        return "";
    }

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


// ==========================================
// ELEMENTOS DO OCR
// ==========================================

const arquivoOrcamento =
    document.getElementById("arquivoOrcamento");

const imagemSelecionada =
    document.getElementById("imagemSelecionada");

const btnLerOrcamento =
    document.getElementById("btnLerOrcamento");

const statusOcr =
    document.getElementById("statusOcr");
// ==========================================
// ABRIR SELETOR DE ARQUIVO
// ==========================================

const areaUpload =
    document.getElementById("areaUpload");


if (areaUpload && arquivoOrcamento) {

    areaUpload.addEventListener(
        "click",
        function () {
            arquivoOrcamento.click();
        }
    );


    areaUpload.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                arquivoOrcamento.click();

            }

        }
    );

}


// ==========================================
// SELECIONAR PRINT
// ==========================================

// ==========================================
// OCR — IMPORTAR ORÇAMENTO
// ==========================================

const arquivoOrcamento =
    document.getElementById("arquivoOrcamento");

const imagemSelecionada =
    document.getElementById("imagemSelecionada");

const btnLerOrcamento =
    document.getElementById("btnLerOrcamento");

const statusOcr =
    document.getElementById("statusOcr");

const areaUpload =
    document.getElementById("areaUpload");


// ==========================================
// PROCESSAR IMAGEM
// ==========================================

function processarImagemOrcamento(arquivo) {

    if (!arquivo) {
        return;
    }


    if (!arquivo.type || !arquivo.type.startsWith("image/")) {

        if (statusOcr) {
            statusOcr.textContent =
                "❌ O conteúdo colado não é uma imagem.";
        }

        return;
    }


    // Coloca o arquivo no input
    try {

        const transferencia =
            new DataTransfer();

        transferencia.items.add(arquivo);

        arquivoOrcamento.files =
            transferencia.files;

    } catch (erro) {

        console.warn(
            "Não foi possível atualizar o input:",
            erro
        );

    }


    // Preview
    const leitor =
        new FileReader();


    leitor.onload =
        function (evento) {

            if (imagemSelecionada) {

                imagemSelecionada.innerHTML = `
                    <img
                        src="${evento.target.result}"
                        alt="Print do orçamento"
                        style="
                            max-width:100%;
                            height:auto;
                            display:block;
                            border-radius:12px;
                        "
                    >
                `;

                imagemSelecionada.style.display =
                    "block";

            }


            if (btnLerOrcamento) {

                btnLerOrcamento.disabled =
                    false;

            }


            if (statusOcr) {

                statusOcr.textContent =
                    "✅ Print carregado. Clique em “Ler orçamento” ou use a leitura automática.";

            }

        };


    leitor.onerror =
        function () {

            if (statusOcr) {

                statusOcr.textContent =
                    "❌ Não foi possível carregar o print.";

            }

        };


    leitor.readAsDataURL(arquivo);

}


// ==========================================
// CLICAR NA ÁREA DE UPLOAD
// ==========================================

if (areaUpload) {

    areaUpload.addEventListener(
        "click",
        function () {

            if (arquivoOrcamento) {
                arquivoOrcamento.click();
            }

        }
    );


    areaUpload.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                if (arquivoOrcamento) {
                    arquivoOrcamento.click();
                }

            }

        }
    );

}


// ==========================================
// SELECIONAR ARQUIVO
// ==========================================

if (arquivoOrcamento) {

    arquivoOrcamento.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files &&
                this.files[0];

            if (!arquivo) {
                return;
            }

            processarImagemOrcamento(
                arquivo
            );

        }
    );

}


// ==========================================
// CTRL + V
// ==========================================

document.addEventListener(
    "paste",
    function (evento) {

        const itens =
            evento.clipboardData &&
            evento.clipboardData.items;

        if (!itens) {
            return;
        }


        for (
            let i = 0;
            i < itens.length;
            i++
        ) {

            const item = itens[i];


            if (
                item.kind === "file" &&
                item.type.startsWith("image/")
            ) {

                const arquivo =
                    item.getAsFile();


                if (arquivo) {

                    evento.preventDefault();

                    processarImagemOrcamento(
                        arquivo
                    );

                    if (statusOcr) {

                        statusOcr.textContent =
                            "📋 Print colado com Ctrl + V. Clique em “Ler orçamento automaticamente”.";

                    }

                }

                return;
            }

        }

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
                document.createElement(
                    "script"
                );


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
// LER ORÇAMENTO
// ==========================================

if (btnLerOrcamento) {

    btnLerOrcamento.addEventListener(
        "click",
        async function () {

            if (
                !arquivoOrcamento ||
                !arquivoOrcamento.files ||
                !arquivoOrcamento.files[0]
            ) {

                alert(
                    "Cole ou selecione o print do orçamento primeiro."
                );

                return;
            }


            const arquivo =
                arquivoOrcamento.files[0];


            try {

                btnLerOrcamento.disabled =
                    true;


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Preparando leitura do orçamento...";

                }


                await carregarTesseract();


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Lendo o orçamento...";

                }


                const resultado =
                    await Tesseract.recognize(
                        arquivo,
                        "eng+por",
                        {

                            logger:
                                function (info) {

                                    if (
                                        !statusOcr
                                    ) {
                                        return;
                                    }


                                    if (
                                        info.status ===
                                        "recognizing text"
                                    ) {

                                        const progresso =
                                            Math.round(
                                                (
                                                    info.progress ||
                                                    0
                                                ) * 100
                                            );


                                        statusOcr.textContent =
                                            `⏳ Lendo o orçamento... ${progresso}%`;

                                    }

                                }

                        }
                    );


                const texto =
                    resultado &&
                    resultado.data
                        ? resultado.data.text
                        : "";


                console.log(
                    "===== TEXTO RECONHECIDO ====="
                );

                console.log(
                    texto
                );


                if (!texto.trim()) {

                    throw new Error(
                        "Nenhum texto foi encontrado."
                    );

                }


                aplicarResultadoOCR(
                    texto
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "✅ Orçamento lido. Confira os dados antes de gerar.";

                }


            } catch (erro) {

                console.error(
                    "Erro completo no OCR:",
                    erro
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "❌ Não foi possível ler o orçamento.";

                }


                alert(
                    "Não foi possível ler o orçamento. Tente novamente com um print mais nítido."
                );

            } finally {

                btnLerOrcamento.disabled =
                    false;

            }

        }
    );

}

// ==========================================
// CARREGAR TESSERACT
// ==========================================

function carregarTesseract() {

    return new Promise(
        (resolve, reject) => {

            if (
                typeof Tesseract !== "undefined"
            ) {

                resolve();
                return;

            }


            const script =
                document.createElement("script");


            script.src =
                "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";


            script.onload =
                function () {
                    resolve();
                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Não foi possível carregar o OCR."
                        )
                    );

                };


            document.head.appendChild(script);

        }
    );

}


// ==========================================
// NORMALIZAR TEXTO OCR
// ==========================================

function normalizarTextoOCR(texto) {

    if (!texto) {
        return "";
    }

    return texto
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}


// ==========================================
// ENCONTRAR DATAS
// ==========================================

function encontrarDatas(texto) {

    const datas = [];

    if (!texto) {
        return datas;
    }

    const padrao =
        /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;

    let resultado;

    while (
        (resultado = padrao.exec(texto)) !== null
    ) {

        const dia =
            resultado[1].padStart(2, "0");

        const mes =
            resultado[2].padStart(2, "0");

        let ano =
            resultado[3];

        if (ano.length === 2) {
            ano = `20${ano}`;
        }

        datas.push(
            `${ano}-${mes}-${dia}`
        );

    }

    return datas;

}


// ==========================================
// IDENTIFICAR DATAS
// ==========================================

function identificarDatasOCR(texto) {

    const resultado = {
        checkin: "",
        checkout: ""
    };

    const linhas =
        texto.split("\n");

    for (const linhaOriginal of linhas) {

        const linha =
            linhaOriginal.trim();

        if (!linha) {
            continue;
        }

        const normalizada =
            linha
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        const datas =
            encontrarDatas(linha);

        if (!datas.length) {
            continue;
        }


        if (
            !resultado.checkin &&
            (
                normalizada.includes("check-in") ||
                normalizada.includes("check in") ||
                normalizada.includes("entrada")
            )
        ) {

            resultado.checkin =
                datas[0];

        }


        if (
            !resultado.checkout &&
            (
                normalizada.includes("check-out") ||
                normalizada.includes("check out") ||
                normalizada.includes("saida")
            )
        ) {

            resultado.checkout =
                datas[0];

        }

    }


    // Caso não encontre pelo contexto,
    // usa as duas primeiras datas.

    const todasAsDatas =
        encontrarDatas(texto);

    if (
        !resultado.checkin &&
        todasAsDatas.length >= 1
    ) {

        resultado.checkin =
            todasAsDatas[0];

    }

    if (
        !resultado.checkout &&
        todasAsDatas.length >= 2
    ) {

        resultado.checkout =
            todasAsDatas[1];

    }


    return resultado;

}


// ==========================================
// IDENTIFICAR HÓSPEDES
// ==========================================

function identificarHospedesOCR(texto) {

    const resultado = {
        adultos: "",
        criancas: ""
    };

    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    let match =
        normalizado.match(
            /(\d+)\s*adultos?/i
        );


    if (!match) {

        match =
            normalizado.match(
                /adultos?\s*[:\-]?\s*(\d+)/i
            );

    }


    if (!match) {

        match =
            normalizado.match(
                /(\d+)\s*pax/i
            );

    }


    if (match) {
        resultado.adultos = match[1];
    }


    const matchCrianca =
        normalizado.match(
            /(\d+)\s*criancas?/i
        );


    if (matchCrianca) {
        resultado.criancas =
            matchCrianca[1];
    }


    return resultado;

}


// ==========================================
// IDENTIFICAR QUARTO
// ==========================================

function identificarQuartoOCR(texto) {

    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    if (
        normalizado.includes("conjugado")
    ) {
        return "S2C";
    }


    if (
        normalizado.includes("sofa") &&
        normalizado.includes("cama")
    ) {
        return "DSC";
    }


    if (
        normalizado.includes("superior") &&
        (
            normalizado.includes("casal") ||
            normalizado.includes("double")
        )
    ) {
        return "DBB";
    }


    if (
        normalizado.includes("superior") &&
        (
            normalizado.includes("solteiro") ||
            normalizado.includes("twin")
        )
    ) {
        return "TWB";
    }


    if (
        normalizado.includes("casal") ||
        normalizado.includes("double")
    ) {
        return "DBC";
    }


    if (
        normalizado.includes("solteiro") ||
        normalizado.includes("twin")
    ) {
        return "TWC";
    }


    return "";

}


// ==========================================
// IDENTIFICAR CAFÉ
// ==========================================

function identificarCafeOCR(texto) {

    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    if (
        normalizado.includes("sem cafe")
    ) {
        return false;
    }


    if (
        normalizado.includes("cafe da manha")
    ) {
        return true;
    }


    if (
        normalizado.includes("breakfast included")
    ) {
        return true;
    }


    if (
        normalizado.includes("breakfast") &&
        normalizado.includes("included")
    ) {
        return true;
    }


    return null;

}


// ==========================================
// IDENTIFICAR VALOR
// ==========================================

function identificarValorOCR(texto) {

    const linhas =
        texto.split("\n");


    const palavras = [
        "diaria",
        "diária",
        "noite",
        "noites",
        "acomodacao",
        "acomodação",
        "hospedagem",
        "total"
    ];


    for (const linha of linhas) {

        const normalizada =
            linha
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");


        const temContexto =
            palavras.some(
                palavra => {

                    const palavraNormalizada =
                        palavra
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");

                    return normalizada.includes(
                        palavraNormalizada
                    );

                }
            );


        if (!temContexto) {
            continue;
        }


        const valores =
            linha.match(
                /(?:R\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g
            );


        if (
            valores &&
            valores.length
        ) {

            return limparValorOCR(
                valores[valores.length - 1]
            );

        }

    }


    const valores =
        texto.match(
            /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g
        );


    if (
        valores &&
        valores.length
    ) {

        return limparValorOCR(
            valores[0]
        );

    }


    return "";

}


// ==========================================
// APLICAR RESULTADO DO OCR - OPERA
// ==========================================

function aplicarResultadoOCR(texto) {

    console.log("===== TEXTO OCR =====");
    console.log(texto);


    // ==========================================
    // NORMALIZAR TEXTO
    // ==========================================

    const textoLimpo =
        texto
            .replace(/\r/g, "")
            .replace(/[ \t]+/g, " ")
            .trim();


    // ==========================================
    // QUARTO
    // Exemplo:
    // 1 - DBB - Quarto Superior com 1 cama casal
    // ==========================================

    let codigoQuarto = "";
    let descricaoQuarto = "";


    const matchQuarto =
        textoLimpo.match(
            /\d+\s*-\s*([A-Z0-9]+)\s*-\s*(.+?)(?=\n|$)/i
        );


    if (matchQuarto) {

        codigoQuarto =
            matchQuarto[1]
                .trim()
                .toUpperCase();


        descricaoQuarto =
            matchQuarto[2]
                .trim();

    }


    // ==========================================
    // TARIFA
    // Exemplo:
    // 1RB1 - TARIFA FLEXÍVEL - ACOMODAÇÃO E CAFÉ DA MANHÃ
    // ==========================================

    let tarifa = "";


    const matchTarifa =
        textoLimpo.match(
            /[A-Z0-9]+\s*-\s*(TARIFA.+?)(?=\n|$)/i
        );


    if (matchTarifa) {

        tarifa =
            matchTarifa[1]
                .trim();

    }


    // ==========================================
    // DATAS DO OPERA
    //
    // Exemplo:
    // Sexta-Feira 08 Jan 2027 - Domingo 17 Jan 2027
    // ==========================================

    let checkin = "";
    let checkout = "";
    let noites = "";


    const matchDatas =
        textoLimpo.match(
            /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s*-\s*(?:[A-Za-zÀ-ÿ-]+\s+)?(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i
        );


    if (matchDatas) {

        checkin =
            converterDataOpera(
                matchDatas[1],
                matchDatas[2],
                matchDatas[3]
            );


        checkout =
            converterDataOpera(
                matchDatas[4],
                matchDatas[5],
                matchDatas[6]
            );

    }


    // ==========================================
    // NÚMERO DE NOITES
    // Exemplo:
    // (9 night(s))
    // ==========================================

    const matchNoites =
        textoLimpo.match(
            /\((\d+)\s*night/i
        );


    if (matchNoites) {

        noites =
            matchNoites[1];

    }


    // ==========================================
    // HÓSPEDES
    // Exemplo:
    // 2 Adult / 0 Child
    // ==========================================

    let adultos = "";
    let criancas = "";


    const matchHospedes =
        textoLimpo.match(
            /(\d+)\s*Adult\s*\/\s*(\d+)\s*Child/i
        );


    if (matchHospedes) {

        adultos =
            matchHospedes[1];


        criancas =
            matchHospedes[2];

    }


    // ==========================================
    // CAFÉ DA MANHÃ
    // Exemplo:
    // Breakfast
    // Included
    // ==========================================

    const cafeIncluido =
        /Breakfast[\s\S]{0,50}?Included/i.test(
            textoLimpo
        );


    // ==========================================
    // VALOR TOTAL
    //
    // Exemplo:
    // Total Room
    // 3285.45 BRL
    // ==========================================

    let valorTotal = "";


    const matchValor =
        textoLimpo.match(
            /Total Room[\s\S]{0,150}?([\d.,]+)\s*BRL/i
        );


    if (matchValor) {

        valorTotal =
            formatarValorOpera(
                matchValor[1]
            );

    }


    // ==========================================
    // PAGAMENTO
    // ==========================================

    let pagamento = "hotel";


    if (
        /To be paid at the hotel/i.test(
            textoLimpo
        )
    ) {

        pagamento = "hotel";

    }


    // ==========================================
    // PREENCHER CAMPOS
    // ==========================================

    const campoCheckin =
        document.getElementById("checkin");


    const campoCheckout =
        document.getElementById("checkout");


    const campoNoites =
        document.getElementById("noites");


    const campoAdultos =
        document.getElementById("adultos");


    const campoCriancas =
        document.getElementById("criancas");


    const campoTipoQuarto =
        document.getElementById("tipoQuarto");


    const campoDescricaoQuarto =
        document.getElementById("descricaoQuarto");


    const campoTarifa =
        document.getElementById("tarifa");


    const campoCafe =
        document.getElementById("cafe");


    const campoValorTotal =
        document.getElementById("valorTotal");


    const campoPagamento =
        document.getElementById("pagamento");


    // CHECK-IN

    if (
        campoCheckin &&
        checkin
    ) {

        campoCheckin.value =
            checkin;

    }


    // CHECK-OUT

    if (
        campoCheckout &&
        checkout
    ) {

        campoCheckout.value =
            checkout;

    }


    // NOITES

    if (
        campoNoites &&
        noites
    ) {

        campoNoites.value =
            noites;

    }


    // ADULTOS

    if (
        campoAdultos &&
        adultos !== ""
    ) {

        campoAdultos.value =
            adultos;

    }


    // CRIANÇAS

    if (
        campoCriancas &&
        criancas !== ""
    ) {

        campoCriancas.value =
            criancas;

    }


    // CÓDIGO DO QUARTO

    if (
        campoTipoQuarto &&
        codigoQuarto
    ) {

        campoTipoQuarto.value =
            codigoQuarto;

    }


    // DESCRIÇÃO DO QUARTO

    if (
        campoDescricaoQuarto &&
        descricaoQuarto
    ) {

        campoDescricaoQuarto.value =
            descricaoQuarto;

    }


    // TARIFA

    if (
        campoTarifa &&
        tarifa
    ) {

        campoTarifa.value =
            tarifa;

    }


    // CAFÉ DA MANHÃ

    if (campoCafe) {

        campoCafe.checked =
            cafeIncluido;

    }


    // VALOR TOTAL

    if (
        campoValorTotal &&
        valorTotal
    ) {

        campoValorTotal.value =
            valorTotal;

    }


    // PAGAMENTO

    if (campoPagamento) {

        campoPagamento.value =
            pagamento;

    }


    // ==========================================
    // ATUALIZAR CAMPOS
    // ==========================================

    [
        campoCheckin,
        campoCheckout,
        campoNoites,
        campoAdultos,
        campoCriancas,
        campoTipoQuarto,
        campoDescricaoQuarto,
        campoTarifa,
        campoCafe,
        campoValorTotal,
        campoPagamento

    ].forEach(
        campo => {

            if (!campo) {
                return;
            }


            campo.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );


            campo.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

        }
    );


    console.log(
        "===== DADOS EXTRAÍDOS DO OPERA ====="
    );


    console.log({

        codigoQuarto,
        descricaoQuarto,
        tarifa,
        checkin,
        checkout,
        noites,
        adultos,
        criancas,
        cafeIncluido,
        valorTotal,
        pagamento

    });

}


// ==========================================
// CONVERTER DATA DO OPERA
// ==========================================

function converterDataOpera(
    dia,
    mes,
    ano
) {

    const meses = {

        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12"

    };


    const numeroMes =
        meses[
            mes
                .substring(0, 3)
                .toLowerCase()
        ];


    if (!numeroMes) {
        return "";
    }


    return (
        `${ano}-${numeroMes}-${dia.padStart(2, "0")}`
    );

}


// ==========================================
// FORMATAR VALOR DO OPERA
// ==========================================

function formatarValorOpera(valor) {

    if (!valor) {
        return "";
    }


    const numero =
        parseFloat(
            valor.replace(
                /,/g,
                ""
            )
        );


    if (isNaN(numero)) {
        return "";
    }


    return numero.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}
// ==========================================
// BOTÃO LER PRINT
// ==========================================

if (btnLerOrcamento) {

    btnLerOrcamento.addEventListener(
        "click",
        async function () {

            if (
                !arquivoOrcamento ||
                !arquivoOrcamento.files ||
                !arquivoOrcamento.files[0]
            ) {

                alert(
                    "Selecione o print do orçamento primeiro."
                );

                return;
            }


            const arquivo =
                arquivoOrcamento.files[0];


            try {

                btnLerOrcamento.disabled =
                    true;


                if (statusOcr) {
                    statusOcr.textContent =
                        "⏳ Preparando leitura do print...";
                }


                await carregarTesseract();


                if (statusOcr) {
                    statusOcr.textContent =
                        "⏳ Lendo o print...";
                }


                const resultado =
                    await Tesseract.recognize(
                        arquivo,
                        "por+eng",
                        {

                            logger: info => {

                                if (
                                    !statusOcr
                                ) {
                                    return;
                                }


                                if (
                                    info.status ===
                                    "recognizing text"
                                ) {

                                    const progresso =
                                        Math.round(
                                            (
                                                info.progress || 0
                                            ) * 100
                                        );


                                    statusOcr.textContent =
                                        `⏳ Lendo o orçamento... ${progresso}%`;

                                }

                            }

                        }
                    );


                const texto =
                    resultado &&
                    resultado.data
                        ? resultado.data.text
                        : "";


                if (!texto.trim()) {

                    throw new Error(
                        "Nenhum texto foi identificado no print."
                    );

                }


                aplicarResultadoOCR(
                    texto
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "✅ Orçamento lido. Confira os campos antes de gerar.";

                }


            } catch (erro) {

                console.error(
                    "Erro completo no OCR:",
                    erro
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "❌ Não foi possível ler o print.";

                }


                alert(
                    "Não foi possível ler o print. Tente novamente com uma imagem mais nítida."
                );


            } finally {

                btnLerOrcamento.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// GERAR ORÇAMENTO
// ==========================================

// ==========================================
// GERAR ORÇAMENTO
// ==========================================

function gerarOrcamento() {

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const tipoQuarto =
        document.getElementById("tipoQuarto").value.trim();

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const tarifa =
        document.getElementById("tarifa").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const promocional =
        document.getElementById("promo").checked;

    const valorOriginal =
        document.getElementById("valorOriginal").value;

    const valorTotalCampo =
        document.getElementById("valorTotal").value;

    const pagamento =
        document.getElementById("pagamento").value;


    // ------------------------------------------
    // VALIDAÇÕES
    // ------------------------------------------

    if (!checkin || !checkout) {

        alert(
            "Informe o check-in e o check-out."
        );

        return;
    }


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    if (noites <= 0) {

        alert(
            "O check-out deve ser posterior ao check-in."
        );

        return;
    }


    // ------------------------------------------
    // DADOS DO QUARTO
    // ------------------------------------------

    const dadosQuarto =
        QUARTOS[tipoQuarto];


    const nomeQuarto =
        descricaoQuarto ||
        (
            dadosQuarto
                ? dadosQuarto.nome
                : "Acomodação não informada"
        );


    const fotoQuarto =
        dadosQuarto &&
        dadosQuarto.foto
            ? dadosQuarto.foto
            : "";


    const quantidadeQuartos =
        dadosQuarto &&
        dadosQuarto.quantidadeQuartos
            ? dadosQuarto.quantidadeQuartos
            : 1;


    // ------------------------------------------
    // VALORES
    // ------------------------------------------

    const valorOriginalNumero =
        converterValor(
            valorOriginal
        );


    const valorTotal =
        converterValor(
            valorTotalCampo
        );


    // ------------------------------------------
    // HÓSPEDES
    // ------------------------------------------

    let textoHospedes = "";

    if (adultos > 0) {

        textoHospedes =
            `${adultos} adulto${adultos !== 1 ? "s" : ""}`;

    }


    if (criancas > 0) {

        if (textoHospedes) {
            textoHospedes += " • ";
        }

        textoHospedes +=
            `${criancas} criança${criancas !== 1 ? "s" : ""}`;

    }


    if (!textoHospedes) {
        textoHospedes = "Não informado";
    }


    // ------------------------------------------
    // PAGAMENTO
    // ------------------------------------------

    const textoPagamento =
        pagamento === "antecipado"
            ? "Pagamento antecipado"
            : "Pagamento no hotel";


    // ------------------------------------------
    // PREVIEW
    // ------------------------------------------

    const preview =
        document.getElementById(
            "orcamentoPreview"
        );


    if (!preview) {
        return;
    }


    preview.innerHTML = `

        <div class="orcamento">

            <!-- CABEÇALHO -->

            <div class="orcamento-topo">

                <div class="logo-hotel">

                    <img
                        src="img/logo.png"
                        alt="ibis Styles Curitiba Centro Cívico"
                    >

                    <div class="nome-hotel">
                        Curitiba Centro Cívico
                    </div>

                </div>


                <div class="titulo-orcamento">

                    <h2>
                        ORÇAMENTO DE HOSPEDAGEM
                    </h2>

                </div>

            </div>


            <!-- CONTEÚDO -->

            <div class="orcamento-conteudo">


                <!-- ESTADIA -->

                <section class="estadia-box">

                    <div class="estadia-titulo">
                        ESTADIA
                    </div>


                    <div class="datas-hospedagem">

                        <div class="data-box">

                            <small>
                                CHECK-IN
                            </small>

                            <strong>
                                ${formatarDataCompleta(checkin)}
                            </strong>

                        </div>


                        <div class="seta-data">
                            →
                        </div>


                        <div class="data-box">

                            <small>
                                CHECK-OUT
                            </small>

                            <strong>
                                ${formatarDataCompleta(checkout)}
                            </strong>

                        </div>

                    </div>


                    <div class="estadia-noites">

                        <span>
                            ESTADIA
                        </span>

                        <strong>
                            ${noites}
                            ${noites === 1 ? "NOITE" : "NOITES"}
                        </strong>

                    </div>

                </section>


                <!-- ACOMODAÇÃO -->

                <section class="acomodacao-box">


                    ${
                        fotoQuarto
                            ? `
                                <div class="foto-quarto">

                                    <img
                                        src="${fotoQuarto}"
                                        alt="${nomeQuarto}"
                                    >

                                </div>
                            `
                            : ""
                    }


                    <div class="acomodacao-info">

                        <div class="label-verde">
                            ACOMODAÇÃO
                        </div>


                        <h3>
                            ${nomeQuarto}
                        </h3>


                        <div class="quartos-pill">

                            🛏️

                            ${quantidadeQuartos}

                            ${
                                quantidadeQuartos === 1
                                    ? "quarto"
                                    : "quartos"
                            }

                            ${
                                tipoQuarto === "S2C"
                                    ? "conjugados"
                                    : ""
                            }

                        </div>


                        <div class="linha-info"></div>


                        <div class="hospedes-info">

                            <span>
                                HÓSPEDES
                            </span>

                            <strong>
                                ${textoHospedes}
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- CAFÉ DA MANHÃ -->

                <section class="cafe-box">

                    <div class="cafe-icone">
                        ☕
                    </div>


                    <div>

                        <span>
                            CAFÉ DA MANHÃ
                        </span>

                        <strong>
                            ${cafe ? "Incluído" : "Não incluído"}
                        </strong>

                    </div>

                </section>


                <!-- TARIFA -->

                ${
                    tarifa
                        ? `
                            <div class="tarifa-info">

                                <span>
                                    TARIFA
                                </span>

                                <strong>
                                    ${tarifa}
                                    ${
                                        promocional
                                            ? " • PROMOCIONAL"
                                            : ""
                                    }
                                </strong>

                            </div>
                        `
                        : ""
                }


                <!-- TOTAL -->

                <section class="total-box">

                    <div>

                        <span>
                            TOTAL DA HOSPEDAGEM
                        </span>

                        <strong>
                            ${formatarMoeda(valorTotal)}
                        </strong>

                    </div>


                    <div class="pagamento-box">

                        ${textoPagamento}

                    </div>

                </section>


                <!-- RODAPÉ -->

                <div class="rodape-orcamento">

                    <p>
                        ibis Styles Curitiba Centro Cívico
                    </p>

                    <p>
                        Orçamento sujeito à disponibilidade
                    </p>

                </div>


            </div>

        </div>

    `;


    // ------------------------------------------
    // MOSTRAR PREVIEW
    // ------------------------------------------

    const previewArea =
        document.getElementById(
            "previewArea"
        );


    if (previewArea) {

        previewArea.style.display =
            "block";

    }

}
// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    const campos =
        document.querySelectorAll(
            "input, select"
        );


    campos.forEach(
        campo => {

            if (campo.type === "checkbox") {
                campo.checked = false;
                return;
            }


            if (campo.type === "number") {
                campo.value =
                    campo.id === "noites"
                        ? 1
                        : 0;
                return;
            }


            campo.value = "";

        }
    );


    const previewArea =
        document.getElementById("previewArea");


    if (previewArea) {
        previewArea.style.display =
            "none";
    }


    if (arquivoOrcamento) {
        arquivoOrcamento.value = "";
    }


    if (imagemSelecionada) {

        imagemSelecionada.innerHTML = "";

        imagemSelecionada.style.display =
            "none";

    }


    if (btnLerOrcamento) {
        btnLerOrcamento.disabled =
            true;
    }


    if (statusOcr) {
        statusOcr.textContent = "";
    }

}


// ==========================================
// COPIAR TEXTO
// ==========================================

function copiarOrcamento() {

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const tipoQuarto =
        document.getElementById("tipoQuarto").value;

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const tarifa =
        document.getElementById("tarifa").value.trim();

    const valorTotal =
        converterValor(
            document.getElementById("valorTotal").value
        );

    const pagamento =
        document.getElementById("pagamento").value;


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    const dadosQuarto =
        QUARTOS[tipoQuarto];


    const nomeQuarto =
        descricaoQuarto ||
        (
            dadosQuarto
                ? dadosQuarto.nome
                : ""
        );


    const texto = `

🏨 IBIS STYLES CURITIBA CENTRO CÍVICO

📅 Check-in:
${formatarDataCompleta(checkin)}

📅 Check-out:
${formatarDataCompleta(checkout)}

👥 Hóspedes:
${adultos} adulto${adultos !== 1 ? "s" : ""}
${criancas > 0 ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}` : ""}

🛏️ Acomodação:
${nomeQuarto}

☕ Café da manhã:
${cafe ? "Incluso" : "Não incluso"}

💳 Tarifa:
${tarifa || "Não informado"}

🌙 Noites:
${noites}

💵 Valor total:
${formatarMoeda(valorTotal)}

💳 Pagamento:
${
    pagamento === "antecipado"
        ? "Pagamento antecipado"
        : "A ser pago no hotel"
}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR

`;


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard.writeText(
            texto.trim()
        )
        .then(
            () => {
                alert(
                    "Orçamento copiado!"
                );
            }
        )
        .catch(
            () => {
                alert(
                    "Não foi possível copiar o orçamento."
                );
            }
        );

    }

}


// ==========================================
// COMPARTILHAR
// ==========================================

function compartilharOrcamento() {

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const tipoQuarto =
        document.getElementById("tipoQuarto").value;

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const valorTotal =
        converterValor(
            document.getElementById("valorTotal").value
        );


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    const dadosQuarto =
        QUARTOS[tipoQuarto];


    const nomeQuarto =
        descricaoQuarto ||
        (
            dadosQuarto
                ? dadosQuarto.nome
                : ""
        );


    const texto = `

🏨 *IBIS STYLES CURITIBA CENTRO CÍVICO*

📅 *Check-in:*
${formatarDataCompleta(checkin)}

📅 *Check-out:*
${formatarDataCompleta(checkout)}

👥 *Hóspedes:*
${adultos} adulto${adultos !== 1 ? "s" : ""}
${criancas > 0 ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}` : ""}

🛏️ *Acomodação:*
${nomeQuarto}

☕ *Café da manhã:*
${cafe ? "Incluso" : "Não incluso"}

🌙 *Noites:*
${noites}

💵 *Valor total:*
${formatarMoeda(valorTotal)}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR

`;


    const url =
        `https://wa.me/?text=${encodeURIComponent(texto.trim())}`;


    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// CARREGAR HTML2CANVAS
// ==========================================

function carregarHtml2Canvas() {

    return new Promise(
        (resolve, reject) => {

            if (window.html2canvas) {
                resolve();
                return;
            }


            const script =
                document.createElement("script");


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

        botao.disabled = true;

        botao.innerHTML =
            "⏳ Preparando imagem...";

    }


    let areaCaptura = null;


    try {

        await carregarHtml2Canvas();


        const copia =
            elemento.cloneNode(true);


        copia.style.width = "1100px";
copia.style.maxWidth = "1100px";
copia.style.minWidth = "1100px";

        copia.style.height =
            "auto";

        copia.style.margin =
            "0";

        copia.style.boxSizing =
            "border-box";

        copia.style.overflow =
            "hidden";

        copia.style.background =
            "#ffffff";


        const logo =
            copia.querySelector(
                ".logo-hotel img"
            );


        if (logo) {

            logo.style.width =
                "180px";

            logo.style.maxWidth =
                "180px";

            logo.style.height =
                "auto";

            logo.style.maxHeight =
                "120px";

            logo.style.objectFit =
                "contain";

            logo.style.display =
                "block";

        }


        const topo =
            copia.querySelector(
                ".orcamento-topo"
            );


        if (topo) {

            topo.style.width =
                "100%";

            topo.style.boxSizing =
                "border-box";

            topo.style.overflow =
                "hidden";

            topo.style.display =
                "flex";

            topo.style.alignItems =
                "center";

            topo.style.justifyContent =
                "space-between";

        }


        areaCaptura =
            document.createElement(
                "div"
            );


        areaCaptura.style.position =
            "fixed";

        areaCaptura.style.left =
            "-10000px";

        areaCaptura.style.top =
            "0";

        areaCaptura.style.width =
            "600px";

        areaCaptura.style.background =
            "#ffffff";


        areaCaptura.appendChild(
            copia
        );


        document.body.appendChild(
            areaCaptura
        );


        const imagens =
            copia.querySelectorAll(
                "img"
            );


        await Promise.all(
            Array.from(imagens).map(
                img => {

                    if (img.complete) {
                        return Promise.resolve();
                    }


                    return new Promise(
                        resolve => {

                            img.onload =
                                resolve;

                            img.onerror =
                                resolve;

                        }
                    );

                }
            )
        );


        const canvas =
            await html2canvas(
                copia,
                {
                    scale: 2,
                    backgroundColor:
                        "#ffffff",
                    useCORS: true,
                    allowTaint: false,
                    imageTimeout: 15000,
                    logging: false,
                    width: 1100,
                    windowWidth: 1100
                }
            );


        if (areaCaptura) {

            areaCaptura.remove();

            areaCaptura = null;

        }


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


        if (
            navigator.clipboard &&
            window.ClipboardItem
        ) {

            const item =
                new ClipboardItem({
                    "image/png": blob
                });


            await navigator.clipboard.write(
                [item]
            );


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


        if (areaCaptura) {
            areaCaptura.remove();
        }


        alert(
            "Não foi possível copiar a imagem do orçamento."
        );


        if (botao) {
            botao.innerHTML =
                textoOriginal;
        }

    }


    if (botao) {
        botao.disabled = false;
    }

}


// ==========================================
// BAIXAR IMAGEM
// ==========================================

function baixarImagemOrcamento(blob) {

    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


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


    URL.revokeObjectURL(url);

}


// ==========================================
// FINALIZAÇÃO
// ==========================================

console.log(
    "✅ Gerador de Orçamentos carregado corretamente."
);
