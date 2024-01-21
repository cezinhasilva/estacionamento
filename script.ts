interface Veiculo{
    nome: string
    placa: string
    entrada: Date | string
}


(function(){
    const $ = (query:string): HTMLInputElement | null => document.querySelector(query);

    function patio(){

        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculo:Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }

        function adicionar(veiculo:Veiculo, salva?:boolean) {
            const row       = document.createElement("tr");
            row.innerHTML   = `
            
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;
            $("#patio")?.appendChild(row);

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);                
            })

            if(salva){
                salvar([...ler(), veiculo]);
            }            
        }

        function render(): void{
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));
            }
            
        }

        

        function remover(placa:string) { 
            const {entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = calTempo(new Date().getTime() - new Date(entrada).getTime());

            if(
                !confirm(`O veículo ${nome}, permaneceu por ${tempo}. Desejo encerrar?`)
            ) 
            return;
            
            salvar(ler().filter((veiculo) => veiculo.placa !== placa))
            render();


        }

        function calTempo(mil:number){

            const min = Math.floor(mil / 60000);
            const seg = Math.floor((mil % 60000) / 1000);

            return `${min}m e ${seg}s`;
        }

        return { ler,adicionar,salvar, remover, render}

    }
    
    patio().render();
    $("#cadastrar")?.addEventListener("click", () =>{
        const nome:any  = $("#nome")?.value;
        const placa:any = $("#placa")?.value;

        if(!nome || !placa){
           alert("Nome e Placa são obrigatorio");
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true);
    })

  
})();