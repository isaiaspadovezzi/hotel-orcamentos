// ==========================================
// GERADOR DE ORÇAMENTOS
// ==========================================


// ------------------------------------------
// CONVERTER VALOR PARA NÚMERO
// ------------------------------------------

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


// ------------------------------------------
// FORMATAR VALOR EM REAIS
// ------------------------------------------

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ------------------------------------------
// FORMATAR DATA
// ------------------------------------------

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


// ------------------------------------------
// GERAR ORÇAMENTO
// ------------------------------------------

function gerarOrcamento() {

    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    const noites =
        parseInt(document.getElementById("noites").value) || 0;

    const adultos =
        parseInt(document.getElementById("adultos").value) || 0;

    const criancas =
        parseInt(document.getElementById("criancas").value) || 0;

    const tipoQuarto =
        document.getElementById("tipoQuarto").value.trim();

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const tarifa =
        document.getElementById("tarifa").value.trim();

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
    // VALIDAÇÃO
    // --------------------------------------

    if (!checkin || !checkout) {

        alert("Informe as datas de check-in e check-out.");

        return;
    }

    if (!descricaoQuarto) {

        alert("Informe a descrição do quarto.");

        return;
    }

    if (valorTotal <= 0) {

        alert("Informe o valor total da hospedagem.");

        return;
    }


    // --------------------------------------
    // TEXTO DOS HÓSPEDES
    // --------------------------------------

    let textoHospedes = "";

    if (adultos > 0) {

        textoHospedes +=
            adultos +
            (adultos === 1 ? " adulto" : " adultos");
    }

    if (criancas > 0) {

        if (textoHospedes !== "") {
            textoHospedes += " + ";
        }

        textoHospedes +=
            criancas +
            (criancas === 1 ? " criança" : " crianças");
    }

    if (textoHospedes === "") {
        textoHospedes = "Não informado";
    }


    // --------------------------------------
    // CAFÉ DA MANHÃ
    // --------------------------------------

    let textoCafe = cafe
        ? "Café da manhã incluído"
        : "Café da manhã não incluído";


    // --------------------------------------
    // PAGAMENTO
    // --------------------------------------

    let textoPagamento = "";

    if (pagamento === "hotel") {

        textoPagamento = "Pagamento no hotel";

    } else {

        textoPagamento = "Pagamento antecipado";
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
    // PREVIEW
    // --------------------------------------

    const preview = document.getElementById(
        "orcamentoPreview"
    );


    preview.innerHTML = `

        <div class="orcamento">

            <div class="orcamento-topo">

                <div>

                    <div class="marca">
                        IBIS STYLES
                    </div>

                    <div class="hotel">
                        Curitiba Centro Cívico
                    </div>

                </div>

                <div class="titulo-arte">
                    ORÇAMENTO DE HOSPEDAGEM
                </div>

            </div>


            <div class="orcamento-corpo">


                <div class="datas">

                    <div class="data-box">

                        <span>CHECK-IN</span>

                        <strong>
                            ${formatarData(checkin)}
                        </strong>

                    </div>


                    <div class="seta">
                        →
                    </div>


                    <div class="data-box">

                        <span>CHECK-OUT</span>

                        <strong>
                            ${formatarData(checkout)}
                        </strong>

                    </div>


                    <div class="noites">

                        <span>ESTADIA</span>

                        <strong>
                            ${noites}
                            ${noites === 1 ? "NOITE" : "NOITES"}
                        </strong>

                    </div>

                </div>


                <div class="linha">


                    <div class="quarto">

                        <span class="rotulo">
                            QUARTO
                        </span>

                        <strong class="tipo">
                            ${tipoQuarto || "—"}
                        </strong>

                        <div class="descricao">
                            ${descricaoQuarto}
                        </div>

                    </div>


                    <div class="hospedes">

                        <span class="rotulo">
                            HÓSPEDES
                        </span>

                        <strong>
                            ${textoHospedes}
                        </strong>

                    </div>

                </div>


                <div class="informacoes">

                    <div class="info">

                        <span>☕</span>

                        <div>
                            <small>CAFÉ DA MANHÃ</small>
                            <strong>${cafe ? "Incluído" : "Não incluído"}</strong>
                        </div>

                    </div>


                    <div class="info">

                        <span>▣</span>

                        <div>
                            <small>TARIFA</small>
                            <strong>
                                ${tarifa || "Não informado"}
                            </strong>
                        </div>

                    </div>

                </div>


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

    document.getElementById("previewArea").style.display =
        "block";


    // --------------------------------------
    // ROLAR ATÉ A PRÉVIA
    // --------------------------------------

    document.getElementById("previewArea")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ------------------------------------------
// LIMPAR FORMULÁRIO
// ------------------------------------------

function limparFormulario() {

    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";

    document.getElementById("noites").value = "1";

    document.getElementById("adultos").value = "1";
    document.getElementById("criancas").value = "0";

    document.getElementById("tipoQuarto").value = "";
    document.getElementById("descricaoQuarto").value = "";

    document.getElementById("tarifa").value = "";

    document.getElementById("cafe").checked = false;
    document.getElementById("promo").checked = false;

    document.getElementById("valorOriginal").value = "";
    document.getElementById("valorTotal").value = "";

    document.getElementById("pagamento").value = "hotel";


    document.getElementById("previewArea").style.display =
        "none";

    document.getElementById("orcamentoPreview").innerHTML =
        "";
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

arquivoOrcamento.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const url = URL.createObjectURL(arquivo);

    imagemSelecionada.innerHTML = `
        <img src="${url}" alt="Print do orçamento">
    `;

    imagemSelecionada.style.display = "block";

    btnLerOrcamento.disabled = false;

    statusOcr.innerHTML =
        "Print carregado. Clique em <strong>Ler orçamento automaticamente</strong>.";

    statusOcr.className = "status-ocr";
});


// ------------------------------------------
// CARREGAR TESSERACT
// ------------------------------------------

function carregarTesseract() {

    return new Promise((resolve, reject) => {

        if (window.Tesseract) {
            resolve();
            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

        script.onload = resolve;

        script.onerror = reject;

        document.head.appendChild(script);
    });
}


// ------------------------------------------
// LER PRINT
// ------------------------------------------

btnLerOrcamento.addEventListener("click", async function () {

    const arquivo = arquivoOrcamento.files[0];

    if (!arquivo) {
        return;
    }

    btnLerOrcamento.disabled = true;

    statusOcr.className = "status-ocr";

    statusOcr.innerHTML =
        "🔍 Lendo o orçamento...";


    try {

        await carregarTesseract();


        const resultado =
            await Tesseract.recognize(
                arquivo,
                "por+eng",
                {
                    logger: function (info) {

                        if (info.status === "recognizing text") {

                            const porcentagem =
                                Math.round(
                                    info.progress * 100
                                );

                            statusOcr.innerHTML =
                                `🔍 Lendo orçamento... ${porcentagem}%`;
                        }
                    }
                }
            );


        const texto =
            resultado.data.text;


        console.log("TEXTO RECONHECIDO:");
        console.log(texto);


        statusOcr.className =
            "status-ocr sucesso";

        statusOcr.innerHTML =
            "✅ Print lido. Agora vamos preencher os campos.";


        preencherCamposComOCR(texto);


    } catch (erro) {

        console.error(erro);

        statusOcr.className =
            "status-ocr erro";

        statusOcr.innerHTML =
            "❌ Não foi possível ler o print.";

    }


    btnLerOrcamento.disabled = false;

});
// ==========================================
// INTERPRETAR TEXTO DO OCR
// ==========================================

function preencherCamposComOCR(texto) {

    console.log("Iniciando interpretação do orçamento...");

    // --------------------------------------
    // LIMPAR TEXTO
    // --------------------------------------

    const textoOriginal = texto;

    const linhas = texto
        .split("\n")
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0);


    // --------------------------------------
    // TIPO + DESCRIÇÃO DO QUARTO
    // --------------------------------------

    let tipoQuarto = "";
    let descricaoQuarto = "";

    for (let linha of linhas) {

        const encontrado = linha.match(
            /^\s*\d+\s*-\s*([A-Z0-9]+)\s*-\s*(.+)$/i
        );

        if (encontrado) {

            tipoQuarto = encontrado[1].trim().toUpperCase();

            descricaoQuarto = encontrado[2].trim();

            break;
        }
    }


    // --------------------------------------
    // TARIFA
    // --------------------------------------

    let tarifa = "";

    if (tipoQuarto) {

        const indiceTipo = linhas.findIndex(linha =>
            linha.toUpperCase().includes(tipoQuarto)
        );

        if (indiceTipo >= 0 && linhas[indiceTipo + 1]) {

            const proximaLinha =
                linhas[indiceTipo + 1];

            if (
                !proximaLinha.match(
                    /\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/
                )
            ) {

                tarifa = proximaLinha;
            }
        }
    }


    // --------------------------------------
    // DATAS
    // --------------------------------------

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
        dec: "12",

        janeiro: "01",
        fevereiro: "02",
        março: "03",
        marco: "03",
        abril: "04",
        maio: "05",
        junho: "06",
        julho: "07",
        agosto: "08",
        setembro: "09",
        outubro: "10",
        novembro: "11",
        dezembro: "12"
    };


    const regexData =
        /(\d{1,2})\s+([A-Za-zçÇãõÃÕ]+)\s+(\d{4})/gi;

    const datasEncontradas = [];

    let resultadoData;

    while (
        (resultadoData = regexData.exec(textoOriginal)) !== null
    ) {

        const dia =
            resultadoData[1].padStart(2, "0");

        const mesTexto =
            resultadoData[2].toLowerCase();

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


    if (datasEncontradas.length >= 2) {

        document.getElementById("checkin").value =
            datasEncontradas[0];

        document.getElementById("checkout").value =
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
            parseInt(encontrouNoites[1]);
    }


    if (noites > 0) {

        document.getElementById("noites").value =
            noites;
    }


    // --------------------------------------
    // ADULTOS E CRIANÇAS
    // --------------------------------------

    let adultos = 0;
    let criancas = 0;

    const encontrouHospedes =
        textoOriginal.match(
            /(\d+)\s*Adult\s*\/\s*(\d+)\s*Child/i
        );

    if (encontrouHospedes) {

        adultos =
            parseInt(encontrouHospedes[1]);

        criancas =
            parseInt(encontrouHospedes[2]);
    }


    // Também aceita "Adults"
    if (!encontrouHospedes) {

        const alternativa =
            textoOriginal.match(
                /(\d+)\s*Adults?\s*\/\s*(\d+)\s*Child(?:ren)?/i
            );

        if (alternativa) {

            adultos =
                parseInt(alternativa[1]);

            criancas =
                parseInt(alternativa[2]);
        }
    }


    document.getElementById("adultos").value =
        adultos;

    document.getElementById("criancas").value =
        criancas;


    // --------------------------------------
    // CAFÉ DA MANHÃ
    // --------------------------------------

    const temCafe =
        /breakfast/i.test(textoOriginal) &&
        /included/i.test(textoOriginal);


    document.getElementById("cafe").checked =
        temCafe;


    // --------------------------------------
    // TARIFA PROMOCIONAL
    // --------------------------------------

    const temPromo =
        /promo/i.test(textoOriginal) ||
        /m[eê]s do cliente/i.test(textoOriginal);


    document.getElementById("promo").checked =
        temPromo;


    // --------------------------------------
    // VALORES EM BRL
    // --------------------------------------

    const valoresBRL = [];

    const regexBRL =
        /([\d.,]+)\s*BRL/gi;

    let resultadoValor;

    while (
        (resultadoValor = regexBRL.exec(textoOriginal)) !== null
    ) {

        let valorTexto =
            resultadoValor[1]
                .replace(/\./g, "")
                .replace(",", ".");

        /*
         * Se o OCR encontrou 1453.20,
         * a conversão acima transformaria em 145320.
         *
         * Por isso verificamos o formato.
         */

        if (
            resultadoValor[1].includes(".") &&
            !resultadoValor[1].includes(",")
        ) {

            valorTexto =
                resultadoValor[1];
        }

        const valor =
            parseFloat(valorTexto);

        if (!isNaN(valor)) {

            valoresBRL.push(valor);
        }
    }


    // --------------------------------------
    // VALOR TOTAL
    // --------------------------------------

    if (valoresBRL.length > 0) {

        const valorTotal =
            valoresBRL[0];

        document.getElementById("valorTotal").value =
            formatarMoeda(valorTotal);
    }


    // --------------------------------------
    // VALOR ORIGINAL
    // --------------------------------------

    if (valoresBRL.length > 1) {

        const valorTotal =
            valoresBRL[0];

        const valoresMaiores =
            valoresBRL.filter(valor =>
                valor > valorTotal
            );

        if (valoresMaiores.length > 0) {

            const valorOriginal =
                Math.max(...valoresMaiores);

            document.getElementById("valorOriginal").value =
                formatarMoeda(valorOriginal);
        }
    }


    // --------------------------------------
    // PAGAMENTO
    // --------------------------------------

    if (
        /to be paid at the hotel/i.test(textoOriginal) ||
        /paid at the hotel/i.test(textoOriginal)
    ) {

        document.getElementById("pagamento").value =
            "hotel";
    }


    // --------------------------------------
    // PREENCHER CAMPOS
    // --------------------------------------

    document.getElementById("tipoQuarto").value =
        tipoQuarto;

    document.getElementById("descricaoQuarto").value =
        descricaoQuarto;

    document.getElementById("tarifa").value =
        tarifa;


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
            "#checkin, #checkout, #noites, #adultos, #criancas, #tipoQuarto, #descricaoQuarto, #tarifa, #valorTotal"
        );

    campos.forEach(campo => {

        campo.style.borderColor =
            "var(--verde)";

        campo.style.boxShadow =
            "0 0 0 3px rgba(99, 193, 50, 0.12)";

    });


    console.log("Tipo:", tipoQuarto);
    console.log("Descrição:", descricaoQuarto);
    console.log("Tarifa:", tarifa);
    console.log("Datas:", datasEncontradas);
    console.log("Noites:", noites);
    console.log("Adultos:", adultos);
    console.log("Crianças:", criancas);
    console.log("Valores:", valoresBRL);
}
