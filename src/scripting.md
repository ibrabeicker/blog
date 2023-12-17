---
outline: deep
---

# Turbine Sua Aplicação Com Scripts

O termo script tem vários significados nos universos de tecnologia mas este artigo trata do conceito de pequenos pedaços de código que são interpretados pela aplicação. Vamos explorar as vantagens que os scripts trazem como o alto poder expressão e a possibilidade de alterar significativamente comportamentos do nosso sistema a tempo de execução.

## Motivação

Imagine o seguinte cenário: você trabalha desenvolvendo uma solução que precisa simular preços de um seguro, alguém te passa as regras e cálculos a serem feitos e o resultado depende de informações tais como idade do cliente, ocupação, local de moradia, etc. Você codifica essas regras, os QAs testam e a entrega é feita em algum momento no futuro. Mas logo a situação muda: começam a surgir demandas constantes e urgentes para que a regra seja alterada por necessidades do mercado, adequações de requisitos errados, a dona do sistema deseja uma campanha direcionada que dá descontos a certo público. Alguém vai ter que dizer que essas alterações demoram X dias começando com a implementação, passando pelos testes até a entrega. No fim ninguém fica feliz. Os devs e QAs sofrem pressão, talvez precisem fazer hora extra pra garantir entrega, os gestores ficam com cronogramas bagunçados e o negócio fica prejudicado por demorar a conseguir fazer alterações pequenas rapidamente. O que pode ser feito pra amenizar tais problemas e melhorar a satisfação de todos os envolvidos?

## Solução

Uma solução elegante seria configurar tais regras através de scripts, pedaços de códigos que trazem todas as facilidades de uma linguagem de programação e que podem ser elaborados pelos desenvolvedores ou usuários de negócio (dependendo da complexidade e capacidade técnica desses) e entregues em questão de minutos e sem necessidade de deploy. Sendo o script apenas um pedaço de texto, a interface para sua adição é muito mais simples do que uma tela altamente parametrizável com vários componentes. Um exemplo para o caso de uso acima poderia ser o seguinte:

```groovy
def valor = 0
if (IDADE > 70) {
    valor = 500
} else if (IDADE > 40) {
    valor = 300
} else {
    valor = 210
}

if (TEM_CONTRATO) {
    valor = valor * 0.95 // Desconto 5%
}
return valor
```

Esse script diz o seguinte: para pessoas acima de 70 anos o valor do seguro será de 500, entre 40 e 70 será de 300 e abaixo de 40 será 210. Se a pessoa já for cliente receberá um desconto de 5%. Cada requisição de simulação de um seguro passará por algum serviço que carrega esse script, que pode estar salvo em um arquivo ou banco de dados, executará o que está programado ali e utilizará o resultado no restante do fluxo.

Os benefícios de trabalhar dessa forma já começam a ficar aparentes: dá pra elaborar e acrescentar qualquer tipo de operação; adições, multiplicações, condicionais vem todos de graça ao usar o poder de uma linguagem de programação, você e seu sistema só estarão limitados às informações acessíveis ao script.

Podemos ainda dar poder aos scripts de chamar outras partes do nosso sistema e assim ter uma representação simplificada do comportamento desejado, abstraindo e escondendo as complexidades de cada operação:

```groovy
def cliente = lerCliente()
def validado = validaDados(cliente)

if (!validado) {
    enviarEmailRejeicao(cliente.email)
} else {
    def valorContrato = calculaValor(cliente.idade, cliente.tem_contrato)
    mostrarContrato(valorContrato)
    enviarEmailConfirmacao(cliente.email, valorContrato)
}
```

No exemplo acima todas as funções estão implementadas de maneira tradicional no nosso sistema e é permitido ao script chamar um conjunto de métodos para que a ordem das chamadas seja configurada de maneira mais fácil.

## Em compensação

É claro que substituir implementações no código por scripts não seria uma solução mágica, ganhamos muito em questão de flexibilidade e agilidade para entregar valor mas perdemos alguns aspectos do desenvolvimento tradicional que são desejáveis: a autoria das mudanças que seriam registradas no Git, os testes unitários, a validação feita pelos QAs e pelos clientes.

Para compensar a falta do Git acho no mínimo necessário registrar por quem e quando foi feita uma mudança. Manter um histórico de tudo que foi alterado também pode ser importante caso surjam suspeitas que um script antigo estava incorreto.

Para compensar a falta do processo de QA, é de grande valor disponibilizar uma forma para testar o script para erros de sintaxe (se o código executa) e a possibilidade de testá-lo com alguns valores de entrada para verificar a corretude (se o que ele faz está correto). Se quiser ir além é possível separar os papéis para que uma pessoa elabore e outra verifique e aprove cada mudança.

Caso quem for elaborar os scripts não tiver um perfil muito técnico (não-programadores por exemplo) é bastante útil disponibilizar algumas “colinhas” com exemplos de código mais usados: como fazer um if, como é feita uma comparação de igualdade, como declarar valores, etc.

## Implementação

As combinações de tecnologia da aplicação e da linguagem dos scripts são inúmeras. Você pode usar script Python dentro de aplicações Java, JavaScript dentro de Python, Lua dentro de C. Algumas combinações trazem até mais sinergia, como por exemplo Python e JavaScript por serem linguagens interpretadas podem ser usadas dentro de si mesmas, Groovy por operar em cima da JVM combina muito bem com aplicações Java e por isso no próximo post vou ensinar como integrar Groovy com Java e explorar a fundo as possibilidades que isso traz.

## Resumindo

### Vantagens

- Resposta a mudanças em minutos
- Expressões matemáticas, booleanas, condicionais, ramificações disponíveis com zero esforço
- Acesso a funcionalidades já implementadas no sistema
- Altamente expressivo com pouco código
- Facilmente entendível
- Descreve comportamentos em alto nível

### Desvantagens

- Usuários menos técnicos podem ter dificuldades
- Implementar registro de autoria, teste e execução
- Muito mais flexibilidade e liberdade para fazer certo e errado também
- Menos garantias a nível de qualidade